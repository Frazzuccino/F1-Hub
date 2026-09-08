# F1 Hub v1.12.0 — quality release

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep the files at the repository root, including `index.html`, `app.js`, `quality-core.js`, `styles.css`, `manifest.json`, `version.json`, `service-worker.js`, the icons, screenshots and `.nojekyll`.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL once with `?v=1120` on the end. In **More**, the footer should say **F1 Hub v1.12.0**.

After this release you should not normally need a version query again. F1 Hub now checks `version.json` and shows an in-app update banner when a newer deployment is available.

## What changed in v1.12.0
- Added a central data-quality layer for results, standings, freshness and race insights.
- Replaced the Italian-GP-specific standings snapshot with generic post-race reconstruction from the previous published standings plus the completed race/sprint classification when an upstream standings table is genuinely one round behind.
- Added validation so null-position DNF/DNS/DSQ entries cannot sort above classified finishers and invalid race classifications cannot silently supply a fake winner.
- Added **Data Health** with source, freshness and status for schedule, standings, news and driver photos.
- Added visible freshness indicators to Home and Standings.
- Added **My F1** favourites for a preferred driver and team.
- Added **Championship Trends**, points progression, constructor driver-contribution cards and richer driver-v-driver comparisons with race/qualifying H2H.
- Added a **Race at a Glance** post-race summary with podium, fastest lap, movers, retirements, pit-stop count and championship context.
- Added share actions for race results and telemetry/driver comparisons where the device supports Web Share.
- Added **Add Weekend to Calendar** with every session and a 30-minute reminder. These reminders are session-only and do not reveal results.
- Improved PWA startup with a cache-first app shell while data refreshes in the background.
- Lazy-loads Leaflet only when the rain-radar view is opened.
- Added PWA shortcuts and install screenshots.
- Added an in-app update banner so stale installed versions can be refreshed without remembering cache-busting URLs.
- Removed mobile zoom blocking, improved keyboard/focus support, increased touch-target sizing and honours reduced-motion preferences.
- Added automated regression and runtime smoke tests under `tests/`.
- Retains the previous news, driver-photo, telemetry/lap-delta, result-ordering and post-race refresh fixes.

## Run the included tests
With Node.js installed, from this folder run:

```text
node tests/test-quality.js
node tests/runtime-smoke.js
```

See `QUALITY_REPORT.md` for the release score, checks and known limitations.
