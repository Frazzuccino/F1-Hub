# F1 Hub v1.14.0 — Navigation, Calendar & Data Presentation release

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep the files at the repository root, including `index.html`, `app.js`, `quality-core.js`, `car-development-core.js`, `styles.css`, `manifest.json`, `version.json`, `service-worker.js`, icons, screenshots and `.nojekyll`.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL once with `?v=1140` on the end. In **More**, the footer should say **F1 Hub v1.14.0**.

After that, the in-app update checker should normally handle later releases.

## What changed in v1.14.0
- Fixed **Car Development** for FIA PDFs that arrive as flattened readable text rather than Markdown tables. The parser now supports both formats and never silently drops a detected team when an update table cannot be split.
- Removed favourite-driver/team stars and special styling from **Championship Standings**.
- Removed the **My F1** filter from News.
- Added horizontal **swipe navigation** across Home → Races → Standings → News → More, with direct finger-follow feedback and protection against conflicts with pull-to-refresh and interactive controls.
- Reorganised **More** by usefulness, removed Teams from the More menu, and placed **My F1** in the final Personalise group.
- Expanded **Driver profiles** with full F1 career history: starts, wins, podiums, best finish, team tenures and season-by-season teams/results, including mid-season team changes.
- **Race Weather** now lets you switch between upcoming weekend sessions rather than showing only the race forecast.
- Rebuilt **Race Calendar** as an animated season timeline with progress, next-round context, month grouping, circuit silhouettes and a selection transition into each Race Hub.
- Retains My F1 theming, Car Development favourite-team priority, accessibility/reduced-motion behaviour and all previous v1.13 quality/reliability fixes.

## Run the included tests
With Node.js installed, from this folder run:

```text
node tests/test-quality.js
node tests/test-feature-gates.js
node tests/runtime-smoke.js
```

Or on Windows run `RUN-TESTS.bat`.

See `QUALITY_REPORT.md` and `FEATURE_SCORECARD.md` for the release scores and test coverage.
