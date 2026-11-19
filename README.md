# Trail Guardians

A five-mission environmental awareness game: clean trails, sort waste, protect wildlife, and hike safely — then prove what you learned in a short quiz after every mission.

React 18 + TypeScript + Vite. No backend, no images to download (all art is inline SVG), progress is saved in the browser.

## Run it

Requirements: **Node.js 18 or newer** and npm.

```bash
npm install     # first time only
npm run dev     # start the dev server
```

Open the URL it prints (usually <http://localhost:5173>) and press **PLAY**.

## Build for production

```bash
npm run build   # type-checks and builds the site into dist/
npm run preview # serves the built dist/ folder locally
```

Upload everything inside `dist/` to any static host (GitHub Pages, Netlify, Vercel, a school server, …). The game works offline once loaded.

## Quality checks

```bash
npm run typecheck  # TypeScript, no emit
npm test           # 12 unit tests for scoring/unlock/badge rules
npm run smoke      # builds, then plays the whole game in headless Chrome (101 checks)
npm run shots      # builds, then saves screenshots of every screen into shots/
```

`npm run smoke` needs Google Chrome or Microsoft Edge installed; it starts a throwaway profile, plays all five missions and quizzes, reloads to test saved progress, checks a 390 px phone layout and finishes with `101/101 checks passed`.

## How to play

1. **PLAY** opens the mission board. Missions unlock one after another.
2. Each mission has a challenge part and a three-question quiz.
   - Quiz pass mark: **2 of 3**. Failing never locks you out — you can retry as often as you like.
3. Scoring:
   | Mission | Points |
   | --- | --- |
   | 1. Clean the Trail | 10 per piece of litter (8 items = 80) |
   | 2. Sort the Waste | 10 per item sorted correctly on the first try |
   | 3. Wildlife Guardian | 15 × 4 responsible choices = 60 |
   | 4. Don't Feed Animals | 15 × 3 responsible choices = 45 |
   | 5. Hike Safe | 15 × 6 responsible choices = 90 |
   | Quiz | 10 per correct answer (30 per mission) |
4. Maximum score: **505 points** and **6 badges**. Replays never add points twice — your best result is kept.
5. Progress is stored in this browser (`localStorage`) and survives reloads. **Restart game** on the final screen clears it.

## Project layout

```
src/
  art/          inline SVG scenery, items and characters
  components/   shared UI (buttons, badges, top bar, modal, confetti)
  game/         content, scoring rules, persistence, state, sound, tests
  missions/     the five interactive missions
  screens/      menu, mission board, intro, quiz, results, dashboard, final
  styles/       global.css — the whole design system
scripts/
  smoke.mjs     end-to-end play-through in headless Chrome
  shots.mjs     screenshot capture for visual review
```

## Accessibility

Keyboard and screen-reader friendly (real buttons, progress bars, live feedback), 44 px+ touch targets, responsive from 390 px phones to desktop, and honours `prefers-reduced-motion` (also switchable in Settings).
