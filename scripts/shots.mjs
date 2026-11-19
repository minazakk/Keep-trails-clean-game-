/**
 * Captures screenshots of every major screen so the UI can be reviewed.
 * Output: shots/*.png
 *
 * Run with: npm run shots
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const CHROME_CANDIDATES = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  join(process.env.LOCALAPPDATA ?? "", "Google", "Chrome", "Application", "chrome.exe"),
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];

const DEBUG_PORT = 9344;
const APP_URL = "http://127.0.0.1:4173/";
const PROFILE = join(tmpdir(), `trail-guardians-shots-${Date.now()}`);
const OUT = resolve("shots");
const STORAGE_KEY = "trail-guardians:progress:v1";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function createClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve: ok, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else ok(message.result);
      return;
    }
    listeners.forEach((listener) => listener(message));
  });
  return {
    ready: new Promise((ok, reject) => {
      ws.addEventListener("open", () => ok(), { once: true });
      ws.addEventListener("error", () => reject(new Error("ws error")), { once: true });
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
  };
}

async function waitForEndpoint(url, timeoutMs = 20000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      /* retry */
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}`);
}

const FULL_PROFILE = {
  version: 1,
  missions: {
    1: { status: "completed", started: true, gameplayPoints: 80, quizPoints: 30, quizBest: 3, litterCollected: 8, decisions: 0, completedAt: 1 },
    2: { status: "completed", started: true, gameplayPoints: 80, quizPoints: 30, quizBest: 3, litterCollected: 0, decisions: 8, completedAt: 1 },
    3: { status: "completed", started: true, gameplayPoints: 60, quizPoints: 30, quizBest: 3, litterCollected: 0, decisions: 4, completedAt: 1 },
    4: { status: "completed", started: true, gameplayPoints: 45, quizPoints: 30, quizBest: 3, litterCollected: 0, decisions: 3, completedAt: 1 },
    5: { status: "completed", started: true, gameplayPoints: 90, quizPoints: 30, quizBest: 3, litterCollected: 0, decisions: 6, completedAt: 1 },
  },
  lessonsCompleted: 5,
  badges: [
    "trail-cleaner",
    "waste-sorting-hero",
    "wildlife-protector",
    "wildlife-feeding-awareness",
    "safety-champion",
    "trail-guardian",
  ],
  settings: { sound: false, reduceMotion: false },
  startedAt: 1,
};

async function main() {
  const chromePath = CHROME_CANDIDATES.find((candidate) => candidate && existsSync(candidate));
  if (!chromePath) throw new Error("No browser found");
  mkdirSync(PROFILE, { recursive: true });
  mkdirSync(OUT, { recursive: true });

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
      "--hide-scrollbars",
      "--disable-gpu",
      "--window-size=1280,900",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  try {
    await waitForEndpoint(APP_URL);
    await waitForEndpoint(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
    const targets = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json();
    const page = targets.find((target) => target.type === "page");
    const client = createClient(page.webSocketDebuggerUrl);
    await client.ready;
    await client.send("Page.enable");
    await client.send("Runtime.enable");

    const evaluate = async (expression) => {
      const response = await client.send("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.text ?? "eval error");
      return response.result.value;
    };
    const waitFor = async (expression, timeoutMs = 8000) => {
      const started = Date.now();
      while (Date.now() - started < timeoutMs) {
        try {
          if (await evaluate(expression)) return true;
        } catch {
          /* retry */
        }
        await sleep(140);
      }
      return false;
    };
    const clickText = (text) =>
      evaluate(`(() => {
        const node = [...document.querySelectorAll('button')].find((n) =>
          n.textContent.toLowerCase().includes(${JSON.stringify(text.toLowerCase())}),
        );
        if (!node) return false; node.click(); return true;
      })()`);
    const clickAria = (label) =>
      evaluate(`(() => {
        const node = [...document.querySelectorAll('button')].find((n) => n.getAttribute('aria-label') === ${JSON.stringify(label)});
        if (!node) return false; node.click(); return true;
      })()`);

    async function setViewport(width, height, mobile = false) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: mobile ? 2 : 1,
        mobile,
      });
    }

    async function shot(name) {
      await sleep(500);
      const { data } = await client.send("Page.captureScreenshot", { format: "png" });
      writeFileSync(join(OUT, `${name}.png`), Buffer.from(data, "base64"));
      console.log(`saved shots/${name}.png`);
    }

    async function goto(url = APP_URL) {
      await client.send("Page.navigate", { url });
      await waitFor("document.readyState === 'complete'");
      await sleep(600);
    }

    /* ---------------- desktop shots ---------------- */
    await setViewport(1280, 900);
    await goto();
    await shot("01-menu");

    await clickText("play");
    await waitFor("document.body.innerText.includes('Choose your mission')");
    await shot("02-mission-board");

    await evaluate("document.querySelector('.mission-card').click()");
    await waitFor("document.body.innerText.includes('Start mission')");
    await shot("03-mission-intro");

    await clickText("start mission");
    await waitFor("document.querySelectorAll('.litter').length === 8");
    await evaluate(`(() => { const b = [...document.querySelectorAll('button')].find((n) => n.textContent.includes('Show hint')); if (b) b.click(); })()`);
    await shot("04-clean-trail");

    await evaluate("document.querySelector('.litter:not([disabled])').click()");
    await sleep(500);
    await shot("05-clean-trail-collecting");

    // Finish the mission to reach the celebration screen.
    for (let i = 0; i < 7; i += 1) {
      await evaluate(`(() => { const n = document.querySelector('.litter:not([disabled])'); if (n) n.click(); })()`);
      await sleep(120);
    }
    await waitFor("document.body.innerText.includes('MISSION COMPLETE!')", 9000);
    await shot("06-mission-complete");

    await clickText("take the quiz");
    await waitFor("document.body.innerText.includes('Question 1 of 3')");
    await evaluate("document.querySelectorAll('.option')[2].click()");
    await sleep(400);
    await shot("07-quiz");

    await evaluate("document.querySelectorAll('.option')[0].click()").catch(() => {});
    await clickText("next question");
    await waitFor("document.body.innerText.includes('Question 2 of 3')");
    await evaluate("document.querySelectorAll('.option')[2].click()"); // wrong on purpose
    await sleep(400);
    await shot("08-quiz-wrong");

    // Seed a finished profile to capture the reward screens.
    await goto();
    await evaluate(`localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(FULL_PROFILE))})`);
    await goto();

    await clickText("my progress");
    await waitFor("document.body.innerText.includes('Progress dashboard')");
    await shot("09-dashboard");

    await goto();
    await clickText("play");
    await waitFor("document.body.innerText.includes('Choose your mission')");
    await shot("10-board-all-complete");

    // Seed a finished profile so every mission and the reward screens are reachable.
    await goto();
    await evaluate(
      `localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, ${JSON.stringify(JSON.stringify(FULL_PROFILE))})`,
    );
    await goto();
    await clickText("play");
    await waitFor("document.body.innerText.includes('Choose your mission')");
    await shot("10-board-all-complete");

    await goto();
    await clickText("my progress");
    await waitFor("document.body.innerText.includes('Progress dashboard')");
    await shot("09-dashboard");

    async function openMission(number) {
      await goto();
      await clickText("play");
      await waitFor("document.body.innerText.includes('Choose your mission')");
      await evaluate(`document.querySelectorAll('.mission-card')[${number - 1}].click()`);
      await waitFor("document.body.innerText.includes('Start mission')");
      await clickText("start mission");
      await sleep(400);
    }

    await openMission(2);
    await waitFor("document.querySelectorAll('.bin').length === 4");
    await evaluate("document.querySelectorAll('.waste-item')[0].click()");
    await sleep(300);
    await shot("12-sorting");

    await openMission(3);
    await waitFor("document.querySelectorAll('.option').length >= 2");
    await shot("13-wildlife");

    await openMission(4);
    await waitFor("document.querySelectorAll('.option').length >= 2");
    await shot("14-dont-feed");

    await openMission(5);
    await waitFor("document.querySelectorAll('.option').length >= 2");
    await shot("11-hike-safe");

    // Finish mission 5 to reach the result screen, then the final reward screen.
    const safe = [0, 0, 0, 0, 0, 0];
    for (let scenario = 0; scenario < 6; scenario += 1) {
      const count = await evaluate("document.querySelectorAll('.option').length");
      const unsafeIndex = count - 1 === safe[scenario] ? 0 : count - 1;
      await evaluate(`document.querySelectorAll('.option')[${unsafeIndex}].click()`);
      await sleep(200);
      await evaluate(`document.querySelectorAll('.option')[${safe[scenario]}].click()`);
      await sleep(250);
      await clickText(scenario === 5 ? "finish mission" : "next situation");
      await sleep(250);
    }
    await waitFor("document.body.innerText.includes('MISSION COMPLETE!')", 8000);
    await shot("21-mission-five-complete");

    await clickText("take the quiz");
    await waitFor("document.body.innerText.includes('Question 1 of 3')");
    const quizAnswers = [1, 0, 1];
    for (let i = 0; i < 3; i += 1) {
      await waitFor("document.querySelectorAll('.option').length === 4");
      await evaluate(`document.querySelectorAll('.option')[${quizAnswers[i]}].click()`);
      await sleep(250);
      await clickText(i === 2 ? "see my result" : "next question");
      await sleep(250);
    }
    await waitFor("document.body.innerText.includes('LEVEL COMPLETE!')", 7000);
    await shot("22-level-complete");

    await clickText("see your final reward");
    await waitFor("document.body.innerText.includes('YOU ARE A TRAIL GUARDIAN!')", 7000);
    await shot("23-final-screen");

    await evaluate("window.scrollTo(0, 700)");
    await shot("24-final-screen-scrolled");

    /* ---------------- mobile shots ---------------- */
    await setViewport(390, 844, true);
    await goto();
    await shot("16-mobile-menu");
    await clickText("play");
    await waitFor("document.body.innerText.includes('Choose your mission')");
    await shot("17-mobile-board");
    await evaluate("document.querySelectorAll('.mission-card')[0].click()");
    await waitFor("document.body.innerText.includes('Start mission')");
    await clickText("start mission");
    await waitFor("document.querySelectorAll('.litter').length === 8");
    await shot("18-mobile-mission");

    await goto();
    await clickText("my progress");
    await waitFor("document.body.innerText.includes('Progress dashboard')");
    await shot("19-mobile-dashboard");

    // Landscape phone
    await setViewport(844, 390, true);
    await goto();
    await shot("20-landscape-menu");
  } finally {
    try {
      chrome.kill();
    } catch {
      /* ignore */
    }
    try {
      preview.kill();
    } catch {
      /* ignore */
    }
    try {
      rmSync(PROFILE, { recursive: true, force: true });
    } catch {
      /* ignore */
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
