# F1 Hub v1.6.0 — update / install

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep these files at the repository root: `index.html`, `app.js`, `styles.css`, `manifest.json`, `service-worker.js`, `icon.svg`, `icon-192.png`, `icon-512.png`, `.nojekyll`.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL with `?v=160` on the end. In More, the footer should say **F1 Hub v1.6.0**. If it still shows an older version, clear the site data for the GitHub Pages site in Chrome and reopen it.

## New in v1.6.0
- **Car Development** section in More with race-by-race FIA Car Presentation Submissions.
- **UPDATES** tab inside each race weekend.
- Car updates are grouped by team/component where the FIA table can be parsed, with NEW / MODIFIED / CIRCUIT / COOLING badges derived from the declared reason/description.
- **Post-session Telemetry** button on completed session classifications and race results.
- Driver-v-driver lap comparison with selectable laps.
- Speed, throttle, brake, gear and RPM traces over normalised lap distance.
- Sector comparison and lap-delta trace.
- **Circuit-coloured speed maps** generated from OpenF1 location + car telemetry data for each selected driver.
- Existing spoiler mode, tyre strategy, session recaps, history, records, circuit history, multi-source news, pull-to-refresh and transitions remain included.

## Telemetry note
OpenF1 historical telemetry is available free from 2023 onwards after session data has been published. The location feed is approximate, so the speed-coloured circuit map is a visualisation of speed around the lap, not a precise racing-line map.

## Install
When Chrome exposes the native PWA install prompt, the red **↓ APP** button appears in F1 Hub. Tap it and choose **Install**. Once installed, the button disappears and F1 Hub opens standalone without the browser address bar.

If Chrome has not exposed the prompt, use Chrome menu → **Install and create shortcut** → **Install**. Do not choose Create shortcut.
