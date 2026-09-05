# F1 Hub v1.7.0 — update / install

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep `index.html`, `app.js`, `styles.css`, `manifest.json`, `service-worker.js`, the icons and `.nojekyll` at the repository root.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL with `?v=170` on the end. In **More**, the footer should say **F1 Hub v1.7.0**. If it still shows an older version, clear the site data for the GitHub Pages site in Chrome and reopen it.

## New in v1.7.0
- Mobile race-weekend header reformatted so Race Weekend / Round / Spoiler Mode do not collide.
- Spoiler Mode has a manual ON/OFF switch during the active weekend. Every new weekend defaults to ON and it still ends automatically the day after the race.
- Telemetry calls are throttled below the OpenF1 free-tier request rate, retry 429 responses, use padded lap windows, and fall back to a driver-session fetch if a lap-range lookup is empty.
- Telemetry charts can still display if location data is missing; only the speed-map panel is omitted for that lap.
- Rain radar now uses an interactive RainViewer + OpenStreetMap map.
- The actual circuit outline is loaded from georeferenced WGS84 GeoJSON and stays in the correct real-world position/orientation as the radar is panned or zoomed.
- Radar includes previous / play / next controls for the available recent frames, with Windy retained as an external fallback.

## Telemetry note
OpenF1 historical telemetry is free from 2023 onwards. OpenF1 treats data as live from 30 minutes before a session until 30 minutes after it ends, so free telemetry can remain unavailable during that window.

## Install
When Chrome exposes the native PWA install prompt, the red **↓ APP** button appears in F1 Hub. Tap it and choose **Install**. Once installed, the button disappears and F1 Hub opens standalone without the browser address bar.
