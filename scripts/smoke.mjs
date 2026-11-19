/**
 * Headless browser smoke test for Trail Guardians.
 *
 * Boots the production build with `vite preview`, drives Chrome over the
 * DevTools protocol and plays the whole game end to end:
 *
 *   menu -> mission board -> all five missions -> five quizzes -> final screen
 *
 * It also checks persistence across reload, mission unlocking, scoring rules
 * and horizontal overflow at a phone-sized viewport.
 *
 * Run with: npm run smoke
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  join(process.env.LOCALAPPDATA ?? "", "Google", "Chrome", "Application", "chrome.exe"),
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const DEBUG_PORT = 9333;
const APP_URL = "http://127.0.0.1:4173/";
const PROFILE = join(tmpdir(), `trail-guardians-smoke-${Date.now()}`);

/** Correct option index for every quiz question (see src/game/content.ts). */
const QUIZ_ANSWERS = {
  1: [2, 0, 1],
  2: [1, 0, 1],
  3: [3, 1, 2],
  4: [0, 1, 2],
  5: [1, 0, 1],
};

/** Index of the responsible choice in every decision scenario. */
const SAFE_INDEX = {
  3: [0, 0, 0, 0],
  4: [2, 2, 1],
  5: [0, 0, 0, 0, 0, 0],
};

/** Number of decision scenarios in missions 3, 4 and 5. */
const SCENARIOS = { 3: 4, 4: 3, 5: 6 };

/** Expected points for a perfect run, including one deliberately retried sort. */
const EXPECTED_POINTS = 495;

const results = [];
let failures = 0;

function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function createClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 0;
  const pending = new Map();
  const listeners = [];

  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
      return;
    }
    listeners.forEach((listener) => listener(message));
  });

  return {
    ready: new Promise((resolve, reject) => {
      ws.addEventListener("open", () => resolve(), { once: true });
      ws.addEventListener("error", () => reject(new Error("WebSocket error")), { once: true });
    }),
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = ++nextId;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
    on(listener) {
      listeners.push(listener);
    },
    close() {
      ws.close();
    },
  };
}

async function waitForEndpoint(url, timeoutMs = 20000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function main() {
  const chromePath = CHROME_CANDIDATES.find((candidate) => candidate && existsSync(candidate));
  if (!chromePath) throw new Error("No Chrome/Edge installation found");
  mkdirSync(PROFILE, { recursive: true });

  console.log(`Using browser: ${chromePath}`);
  const preview = spawn("npx", ["vite", "preview", "--port", "4173", "--strictPort"], {
    shell: true,
    stdio: "ignore",
  });
  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${PROFILE}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      "--hide-scrollbars",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  const cleanup = () => {
    for (const process of [chrome, preview]) {
      try {
        process.kill();
      } catch {
        /* ignore */
      }
    }
    try {
      rmSync(PROFILE, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  };

  try {
    await waitForEndpoint(APP_URL);
    await waitForEndpoint(`http://127.0.0.1:${DEBUG_PORT}/json/list`);

    const targets = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json();
    const page = targets.find((target) => target.type === "page");
    if (!page) throw new Error("No page target found");

    const client = createClient(page.webSocketDebuggerUrl);
    await client.ready;

    const errors = [];
    client.on((message) => {
      if (message.method === "Runtime.exceptionThrown") {
        errors.push(message.params.exceptionDetails?.text ?? "exception");
      }
      if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
        errors.push(
          message.params.args
            .map((arg) => arg.value ?? arg.description ?? "")
            .join(" ")
            .slice(0, 300),
        );
      }
      if (message.method === "Log.entryAdded" && message.params.entry?.level === "error") {
        errors.push(message.params.entry.text.slice(0, 300));
      }
    });

    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Log.enable");

    const evaluate = async (expression) => {
      const response = await client.send("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
      return response.result.value;
    };

    const waitFor = async (expression, timeoutMs = 8000) => {
      const started = Date.now();
      while (Date.now() - started < timeoutMs) {
        try {
          if (await evaluate(expression)) return true;
        } catch {
          /* keep polling */
        }
        await sleep(140);
      }
      return false;
    };

    const bodyText = () => evaluate("document.body.innerText");

    const clickText = (text) =>
      evaluate(`(() => {
        const node = [...document.querySelectorAll('button')].find((n) =>
          n.textContent.toLowerCase().includes(${JSON.stringify(text.toLowerCase())}),
        );
        if (!node) return false;
        node.click();
        return true;
      })()`);

    const clickAria = (label) =>
      evaluate(`(() => {
        const node = [...document.querySelectorAll('button')].find(
          (n) => n.getAttribute('aria-label') === ${JSON.stringify(label)},
        );
        if (!node) return false;
        node.click();
        return true;
      })()`);

    const savedProgress = () =>
      evaluate("JSON.parse(localStorage.getItem('trail-guardians:progress:v1') ?? 'null')");

    async function gotoBoard() {
      if (await evaluate("document.body.innerText.includes('Choose your mission')")) return true;
      if (await clickAria("Leave mission and return to mission board")) {
        /* left a mission */
      } else if (await clickAria("Back to mission board")) {
        /* intro screen */
      } else if (await clickText("back to mission board")) {
        /* celebration / result screen */
      } else if (await clickText("quit quiz")) {
        /* quiz */
      } else if (await clickAria("Back to main menu")) {
        await clickText("play");
      }
      return waitFor("document.body.innerText.includes('Choose your mission')", 6000);
    }

    async function openMissionIntro(number) {
      const onBoard = await gotoBoard();
      if (!onBoard) {
        check(`mission ${number}: mission board reachable`, false);
        return false;
      }
      await evaluate(`document.querySelectorAll('.mission-card')[${number - 1}].click()`);
      return waitFor("document.body.innerText.includes('Start mission')", 6000);
    }

    /** Plays one decision-based mission: an unsafe choice first, then the safe one. */
    async function playDecisionMission(number) {
      const total = SCENARIOS[number];
      const safe = SAFE_INDEX[number];
      for (let scenario = 0; scenario < total; scenario += 1) {
        await waitFor("document.querySelectorAll('.option').length >= 2");
        const optionCount = await evaluate("document.querySelectorAll('.option').length");
        const safeIndex = safe[scenario];
        const unsafeIndex = optionCount - 1 === safeIndex ? 0 : optionCount - 1;

        await evaluate(`document.querySelectorAll('.option')[${unsafeIndex}].click()`);
        const explained = await waitFor("!!document.querySelector('.scenario .feedback--bad')", 4000);
        check(`mission ${number} scenario ${scenario + 1}: unsafe choice is explained`, explained);

        await evaluate(`document.querySelectorAll('.option')[${safeIndex}].click()`);
        const rewarded = await waitFor("!!document.querySelector('.scenario .feedback--good')", 4000);
        check(`mission ${number} scenario ${scenario + 1}: responsible choice is rewarded`, rewarded);

        const last = scenario === total - 1;
        await clickText(last ? "finish mission" : "next situation");
        await sleep(240);
      }
      const finished = await waitFor("document.body.innerText.includes('MISSION COMPLETE!')", 7000);
      check(`mission ${number} completes`, finished);
      return finished;
    }

    async function passQuiz(number) {
      const answers = QUIZ_ANSWERS[number];
      if (!answers) throw new Error(`No answers configured for mission ${number}`);
      await clickText("take the quiz");
      const onQuiz = await waitFor("document.body.innerText.includes('Question 1 of 3')", 6000);
      check(`mission ${number}: quiz opens after the mission`, onQuiz);
      if (!onQuiz) return false;

      for (let i = 0; i < answers.length; i += 1) {
        await waitFor("document.querySelectorAll('.option').length === 4");
        await evaluate(`document.querySelectorAll('.option')[${answers[i]}].click()`);
        const feedback = await waitFor(
          "!!document.querySelector('.feedback--good, .feedback--bad')",
          4000,
        );
        check(`mission ${number}: question ${i + 1} gives instant feedback`, feedback);
        await clickText(i === answers.length - 1 ? "see my result" : "next question");
        await sleep(200);
      }

      const passed = await waitFor("document.body.innerText.includes('LEVEL COMPLETE!')", 7000);
      check(`mission ${number}: quiz passed`, passed);
      return passed;
    }

    /* ------------------------------ menu ------------------------------ */
    await client.send("Page.navigate", { url: APP_URL });
    if (!(await waitFor("document.readyState === 'complete'"))) throw new Error("Page did not load");
    await sleep(700);

    let text = await bodyText();
    check("menu shows the title", text.includes("TRAIL GUARDIANS"));
    check("menu shows the tagline", text.includes("Clean Trails. Safe Wildlife. Better Tomorrow."));
    check("menu shows the motto", text.toUpperCase().includes("YOUR VISIT. YOUR RESPONSIBILITY."));
    check("menu has a PLAY button", (await clickText("play")) === true);

    /* -------------------------- mission board -------------------------- */
    if (!(await waitFor("document.body.innerText.includes('Choose your mission')"))) {
      check("PLAY opens mission board", false, "mission board never appeared");
      throw new Error("Cannot continue without the mission board");
    }
    const cards = await evaluate("document.querySelectorAll('.mission-card').length");
    check("mission board lists five missions", cards === 5, `found ${cards}`);
    check(
      "missions 2-5 start locked",
      (await evaluate("[...document.querySelectorAll('.mission-card')].slice(1).every((c) => c.disabled)")) ===
        true,
    );

    /* ---------------------------- mission 1 ---------------------------- */
    await evaluate("document.querySelector('.mission-card').click()");
    check("mission 1 intro opens", await waitFor("document.body.innerText.includes('Start mission')"));
    await clickText("start mission");
    check(
      "clean-the-trail scene renders 8 litter items",
      await waitFor("document.querySelectorAll('.litter').length === 8"),
    );
    check("counter starts at 0/8", (await bodyText()).includes("0/8 collected"));

    for (let i = 0; i < 8; i += 1) {
      await evaluate(
        "(() => { const node = document.querySelector('.litter:not([disabled])'); if (!node) return false; node.click(); return true; })()",
      );
      await sleep(90);
    }
    check(
      "collecting all litter completes the mission",
      await waitFor("document.body.innerText.includes('MISSION COMPLETE!')", 9000),
    );
    check("litter points are recorded", (await savedProgress())?.missions?.[1]?.gameplayPoints === 80);

    await passQuiz(1);
    let progress = await savedProgress();
    check("mission 1 quiz score is saved", progress?.missions?.[1]?.quizBest === 3);
    check("mission 2 unlocks after passing", progress?.missions?.[2]?.status !== "locked");
    check("trail-cleaner badge is awarded", (progress?.badges ?? []).includes("trail-cleaner"));
    check(
      "NEXT LEVEL opens mission 2 intro",
      (await clickText("next level")) &&
        (await waitFor("document.body.innerText.includes('Mission 2 of 5')", 6000)),
    );

    /* ---------------------------- mission 2 ---------------------------- */
    await clickText("start mission");
    const sorting = await waitFor("document.querySelectorAll('.bin').length === 4", 6000);
    check("waste-sorting mission renders four bins", sorting);
    if (sorting) {
      await evaluate("document.querySelectorAll('.waste-item')[0].click()");
      await sleep(150);
      await evaluate("document.querySelectorAll('.bin')[2].click()"); // organic — wrong for a bottle
      check(
        "wrong bin is rejected with feedback",
        await waitFor("!!document.querySelector('.feedback--bad')", 4000),
      );
      await evaluate("document.querySelectorAll('.bin')[0].click()"); // recyclables — correct
      check(
        "correct bin is accepted",
        await waitFor("!!document.querySelector('.feedback--good')", 4000),
      );
      check(
        "sorted item is marked as done",
        (await evaluate("document.querySelectorAll('.waste-item.is-done').length")) === 1,
      );
      await sleep(400);
      progress = await savedProgress();
      check(
        "a retried item earns no points but still counts",
        progress?.missions?.[2]?.gameplayPoints === 0 && progress?.missions?.[2]?.decisions === 1,
        JSON.stringify(progress?.missions?.[2] ?? null),
      );

      await evaluate("document.querySelectorAll('.waste-item')[1].click()");
      await sleep(120);
      await evaluate("document.querySelectorAll('.bin')[1].click()"); // newspaper → paper
      await sleep(450);
      progress = await savedProgress();
      check(
        "first-try sorting earns 10 points",
        progress?.missions?.[2]?.gameplayPoints === 10 && progress?.missions?.[2]?.decisions === 2,
        JSON.stringify(progress?.missions?.[2] ?? null),
      );
    }

    // Finish the remaining six items to complete mission 2.
    const binsForItem = [0, 1, 2, 3, 0, 1, 2, 3]; // matches WASTE_ITEMS order
    for (let i = 2; i < 8; i += 1) {
      await evaluate(
        `(() => { const item = document.querySelectorAll('.waste-item')[${i}]; if (item) item.click(); })()`,
      );
      await sleep(120);
      await evaluate(`document.querySelectorAll('.bin')[${binsForItem[i]}].click()`);
      await sleep(160);
    }
    check(
      "sorting every item completes mission 2",
      await waitFor("document.body.innerText.includes('MISSION COMPLETE!')", 9000),
    );
    await passQuiz(2);

    /* --------------------- missions 3, 4 and 5 --------------------- */
    for (const number of [3, 4, 5]) {
      const intro = await openMissionIntro(number);
      check(`mission ${number}: intro opens`, intro);
      if (!intro) continue;
      await clickText("start mission");
      await sleep(300);
      await playDecisionMission(number);
      await passQuiz(number);
      if (number < 5) {
        check(
          `mission ${number}: NEXT LEVEL opens mission ${number + 1}`,
          (await clickText("next level")) &&
            (await waitFor(`document.body.innerText.includes('Mission ${number + 1} of 5')`, 6000)),
        );
      }
    }

    /* --------------------------- final screen --------------------------- */
    const goToFinal = await clickText("see your final reward");
    check(
      "final reward button appears after mission 5",
      goToFinal && (await waitFor("document.body.innerText.includes('YOU ARE A TRAIL GUARDIAN!')", 7000)),
    );

    progress = await savedProgress();
    check("all five missions are completed", progress?.lessonsCompleted === 5);
    check("all six badges are earned", (progress?.badges ?? []).length === 6);
    check("final badge is awarded", (progress?.badges ?? []).includes("trail-guardian"));
    check(
      "total points add up",
      progress !== null && totalOf(progress) === EXPECTED_POINTS,
      `total ${progress ? totalOf(progress) : "n/a"} (expected ${EXPECTED_POINTS})`,
    );

    text = await bodyText();
    check("final screen shows the tagline", text.includes("Clean trails. Respect wildlife. Hike safely."));
    check("final screen offers sharing", (await clickText("share your achievement")) === true);
    await sleep(400);
    check(
      "share falls back to a copyable message",
      (await bodyText()).includes("Copy this message") || (await bodyText()).includes("TRAIL GUARDIAN"),
    );

    check(
      "REVIEW WHAT YOU LEARNED opens the lesson list",
      (await clickText("review what you learned")) &&
        (await waitFor("document.body.innerText.includes('Wildlife Guardian')", 5000)),
    );
    await clickText("close");
    await sleep(200);

    /* ----------------------------- dashboard ---------------------------- */
    check(
      "dashboard opens from the final screen",
      (await clickText("progress dashboard")) &&
        (await waitFor("document.body.innerText.includes('Progress dashboard')", 6000)),
    );
    text = await bodyText();
    const dashboardPoints = await evaluate(
      "document.querySelector('.dash-card__value')?.textContent ?? ''",
    );
    check(
      "dashboard shows total points",
      dashboardPoints === String(EXPECTED_POINTS),
      `${dashboardPoints} points`,
    );
    check("dashboard shows all badges", text.includes("Trail Guardian"));
    check(
      "dashboard reports 100% progress",
      (await evaluate("document.querySelector('.circle-progress__value').textContent")) === "100%",
    );

    /* ---------------------------- persistence --------------------------- */
    await client.send("Page.navigate", { url: APP_URL });
    await waitFor("document.readyState === 'complete'");
    await sleep(700);
    text = await bodyText();
    check("progress survives a page reload", text.includes("Welcome back"));
    check(
      "replayed missions stay completed after reload",
      (await evaluate(
        "(() => { const n = [...document.querySelectorAll('button')].find((b) => b.textContent.toLowerCase().includes('my progress')); if (n) n.click(); return true; })()",
      )) && (await waitFor("document.body.innerText.includes('Progress dashboard')", 6000)),
    );

    /* --------------------------- phone viewport -------------------------- */
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await client.send("Page.navigate", { url: APP_URL });
    await waitFor("document.readyState === 'complete'");
    await sleep(700);

    const overflow = async () =>
      evaluate(
        "document.documentElement.scrollWidth - document.documentElement.clientWidth",
      );
    check("no horizontal scroll on the menu (390px)", (await overflow()) <= 1, `${await overflow()}px`);

    await clickText("play");
    await waitFor("document.body.innerText.includes('Choose your mission')");
    await sleep(400);
    check("no horizontal scroll on the mission board (390px)", (await overflow()) <= 1, `${await overflow()}px`);

    await evaluate("document.querySelector('.mission-card').click()");
    await waitFor("document.body.innerText.includes('Start mission')");
    await clickText("start mission");
    await waitFor("document.querySelectorAll('.litter').length === 8");
    await sleep(300);
    check("no horizontal scroll in a mission scene (390px)", (await overflow()) <= 1, `${await overflow()}px`);

    const smallTargets = await evaluate(`(() => {
      const nodes = [...document.querySelectorAll('button:not([disabled])')];
      return nodes.filter((n) => {
        const r = n.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.height < 40 || r.width < 40);
      }).length;
    })()`);
    check("touch targets stay usable on mobile", smallTargets === 0, `${smallTargets} small buttons`);

    const realErrors = errors.filter((message) => !/favicon/i.test(message));
    check("no console errors", realErrors.length === 0, realErrors.slice(0, 3).join(" | "));
  } finally {
    cleanup();
  }

  console.log(`\n${results.length - failures}/${results.length} checks passed`);
  process.exit(failures > 0 ? 1 : 0);
}

/** Sum of all recorded points in a saved progress object. */
function totalOf(progress) {
  return Object.values(progress.missions).reduce(
    (sum, mission) => sum + (mission.gameplayPoints ?? 0) + (mission.quizPoints ?? 0),
    0,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
