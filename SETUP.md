# F1 Hub v1.11.2 — update / install

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep `index.html`, `app.js`, `styles.css`, `manifest.json`, `service-worker.js`, the icons and `.nojekyll` at the repository root.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL once with `?v=1112` on the end. In **More**, the footer should say **F1 Hub v1.11.2**.

## New in v1.11.2

- Live Timing now tries Formula 1's official SignalR Core timing stream **directly from the phone/browser first**. This avoids relying entirely on a cloud relay, which can be blocked by F1's live-timing WAF while a normal residential/mobile connection still works.
- The direct client negotiates the F1 SignalR connection, performs the SignalR JSON handshake, subscribes to `TimingData`, `DriverList`, `TimingAppData`, `SessionInfo`, `WeatherData`, `LapCount` and related timing topics, then deep-merges F1's delta updates in the browser.
- The in-app table is only shown when the direct stream identifies the correct session and meeting. Previous-session snapshots are rejected.
- If the direct browser connection is blocked, F1 Hub still tries the existing validated public relay every 10 seconds.
- The broken embedded F1 Live Data iframe has been removed.
- F1 BOXBOX is now the first external fallback button, followed by F1pedia, Formula 1 Dashboard and the official F1 timing page. F1 BOXBOX is **not scraped**; it is only opened as a fallback.
- When direct timing works, the screen also shows session status/remaining time plus track and weather data from the same F1 stream.
- The v1.11.1 lap-delta normalisation fix is retained.

## Important
The direct F1 stream is unofficial/undocumented and Formula 1 can change or restrict it at any time. F1 Hub therefore keeps multiple fallbacks and still fails closed rather than presenting stale data as LIVE.
