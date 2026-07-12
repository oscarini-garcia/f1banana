# Banana Leclerc Challenge 2026

## Project Overview
Family F1 prediction game for 4 players (Mariona, Amaya, Ana, Oscar). Static web app for GitHub Pages. All text in Spanish with humorous tone.

## Tech Stack
- Vanilla HTML/CSS/JS (no frameworks)
- JSONBin.io for shared state (single bin, local-first with merge sync)
- GitHub Pages hosting
- Dark theme with F1/banana yellow accents (#FFD700)

## File Structure
```
f1banana/
├── index.html              ← Landing page / player select
├── predicciones.html       ← Prediction form (Top 5 drivers, Top 3 constructors, Evento, Órdago)
├── clasificacion.html      ← Leaderboard & score breakdown
├── admin.html              ← Admin panel (PIN: 2026)
├── css/style.css           ← F1-themed dark styling
├── js/
│   ├── config.js           ← Players, drivers, teams, scoring rules, race calendar
│   ├── storage.js          ← Local-first storage + JSONBin merge sync (dev mode: localStorage only)
│   ├── predicciones.js     ← Prediction form logic & driver/team pickers
│   ├── clasificacion.js    ← Scoring engine & leaderboard rendering
│   └── admin.js            ← Admin panel: results entry, bonuses, penalties
└── CLAUDE.md
```

## Key Architecture Decisions
- **DEV_MODE** (`config.js`): When `true`, uses `localStorage` only (no sync). Set to `false` for production.
- **Local-first storage** (`storage.js`): state always lives in `localStorage` (`blc_data`) and is read/written instantly; JSONBin is a sync target. A sync cycle (pull → merge → push) reconciles local and remote — never a blind PUT, so a network failure can never wipe the bin. Merge is per-subtree with timestamps (`state.stamps`): each `players.{id}`, `avatars.{id}`, `statuses.{id}` and each `global` section carries its own stamp; newest wins (tie → remote). Sync triggers: page load, after each save, `online`, `visibilitychange`, and every 60s while visible. A fixed badge (top-right) shows sync status; `blc:state-updated` fires when a sync brings changes so pages can re-render.
- **Player session**: cookie `blc_player` holds current player ID (set on index.html via 4-digit code). A personal link `index.html?player=<id>` claims the device without a code — links are listed in the admin panel for sharing.
- **Privacy**: Each player only sees their own predictions. Other players' predictions revealed after phase deadline.
- **Scoring engine**: Lives in `clasificacion.js`. Calculates per-phase driver/constructor accuracy, consolation points, evento, órdago, bonuses, and penalties.

## Scoring Rules Summary
- Phase 1 driver points: 20, 16, 12, 8, 4 (decreasing in later phases)
- Phase 1 constructor points: 20, 16, 12 (decreasing in later phases)
- Consolation: 1 pt if driver/constructor in correct Top N but wrong position
- Evento: 10 pts if correct (max 1 per phase)
- Órdago: 25/15/5/0 pts (family vote at end of season)
- Collective bonus: +14 all if Alonso wins, +10 all if Sainz wins
- Gasly chef: doubles everyone's phase subtotal (once per phase, `bonuses.gasly_chef_phases` array)
- Individual penalties: per-player funny rules in config.js (Oscar has a second -10 type, `{type: 'critica'}`)
- Phase results (real Top 5/Top 3) are entered in the admin panel — manually or imported from the Jolpica F1 API at the phase's closing round

## Development
1. Open `index.html` in browser (file:// works, dev mode uses localStorage)
2. Select a player → go to predicciones → fill in predictions → save
3. Go to admin (PIN: 2026) → enter results → save
4. Check clasificacion for scores

## JSONBin.io Setup (Production)
1. Create account at jsonbin.io
2. Create 5 bins (1 per player + 1 global)
3. Update `CONFIG.BINS` in `config.js` with bin IDs
4. Update `CONFIG.JSONBIN_API_KEY` with your API key
5. Set `CONFIG.DEV_MODE = false`

## Conventions
- All UI text in Spanish
- Humorous tone throughout
- Player emojis: Mariona 🍌, Amaya 🏎️, Ana 👩‍👧, Oscar 🏁
- Color scheme: dark bg (#1a1a2e), yellow accent (#FFD700), F1 team colors from config
- Mobile-first (family uses phones)
