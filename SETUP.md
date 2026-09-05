# F1 Hub v1.8.0 — update / install

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep `index.html`, `app.js`, `styles.css`, `manifest.json`, `service-worker.js`, the icons and `.nojekyll` at the repository root.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL with `?v=180` on the end. In **More**, the footer should say **F1 Hub v1.8.0**.

## New in v1.8.0
- Car Development now shows only race weekends that have started; future rounds are hidden.
- The Car Updates tab has been removed from individual race hubs. Car Development remains under More.
- Telemetry now includes one combined circuit time-gain map. Red sections mean Driver A is gaining time; blue sections mean Driver B is gaining time.
- The previous pair of speed-coloured circuit maps has been replaced by this driver-v-driver comparison map.
- Race Weather now includes condition, feels-like temperature, rain chance, wind/gusts, precipitation amount and a five-hour strip centred on race start, with direct radar access.

## Telemetry note
The time-gain map compares local changes in cumulative lap delta around the circuit. It is intended to show where each selected lap gains or loses time; OpenF1 position data remains approximate.
