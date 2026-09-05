# F1 Hub v1.4 — update / install

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep these files at the repository root: `index.html`, `app.js`, `styles.css`, `manifest.json`, `service-worker.js`, `icon.svg`, `icon-192.png`, `icon-512.png`, `.nojekyll`.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL with `?v=130` on the end. In More, the footer should say **F1 Hub v1.4**. If it still shows an older version, clear the site data for the GitHub Pages site in Chrome and reopen it.

## Install
When F1 Hub is open in Chrome, use the red **↓ APP** button in the top bar (or the Install button in More). Once installed, the install button is hidden and F1 Hub opens standalone without the Chrome address bar.

If Chrome has not yet exposed its one-tap install prompt, the app will show the fallback instruction: Chrome menu → Install and create shortcut → **Install**. Do not choose Create shortcut.


### Install button behaviour
The in-app **INSTALL** button is only shown when Chrome has supplied a real native PWA install prompt. It disappears once installation succeeds / when F1 Hub is opened standalone. If Chrome has not supplied the prompt yet, refresh the deployed page once after the new service worker is active.
