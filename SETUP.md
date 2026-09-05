# F1 Hub v1.11.4 — update / install

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep `index.html`, `app.js`, `styles.css`, `manifest.json`, `service-worker.js`, the icons and `.nojekyll` at the repository root.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL once with `?v=1114` on the end. In **More**, the footer should say **F1 Hub v1.11.4**.

## Changed in v1.11.4
- Live Timing has been removed from F1 Hub completely.
- A session that is currently running is shown only as `LIVE` in the schedule; it no longer opens a timing screen.
- No current-session timing relay, SignalR connection, embedded timing page, retry loop or external live-timing fallback is used.
- Once a session finishes, its normal Results and Telemetry pages work as before.
- The v1.11.1 lap-delta normalisation and telemetry fallbacks are retained.
