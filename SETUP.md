# F1 Hub v1.11.10 — update / install

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep `index.html`, `app.js`, `styles.css`, `manifest.json`, `service-worker.js`, the icons and `.nojekyll` at the repository root.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL once with `?v=11110` on the end. In **More**, the footer should say **F1 Hub v1.11.10**.

## Changed in v1.11.10
- Fixed post-race OpenF1 classifications where drivers with a null position (DNF/DNS/DSQ) were sorting ahead of P1.
- Session Recap now chooses the winner and podium only from valid classified positions.
- DNF/DNS/DSQ entries remain visible but are placed after classified finishers.
- Championship standings now perform a no-cache post-race refresh and cross-check a separately published current standings table during the first 36 hours after a race.
- If championship APIs are still one round behind, F1 Hub can apply the completed weekend points locally; an exact bundled Round 13 snapshot prevents the 2026 Italian GP standings from remaining stale if all upstream fallbacks are blocked.
- Standings refresh when the app resumes after a completed race, as well as from the normal refresh button.
- All v1.11.7 news improvements, driver-photo fixes and telemetry/lap-delta fixes are retained.
