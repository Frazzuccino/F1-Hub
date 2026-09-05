# F1 Hub v1.2 — Android install

This version uses the same install structure as the Engineering Toolbox.

## Update your existing GitHub Pages site

1. Open the GitHub repository currently hosting F1 Hub.
2. Delete the old `manifest.webmanifest` and `sw.js` files if they are still there.
3. Upload/replace all files from this v1.2 folder, including:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `manifest.json`
   - `service-worker.js`
   - `.nojekyll`
   - the complete `icons` folder
4. Commit the changes.
5. Wait for GitHub Pages to finish deploying.

## Install on Android

For the closest match to how Engineering Toolbox was installed, open the F1 Hub GitHub Pages address in the same Android browser you used for Engineering Toolbox.

1. Open the F1 Hub site.
2. Refresh once after the v1.2 deployment.
3. Open the browser menu.
4. Choose **Install app**, or **Add to Home screen → Install** (wording varies by browser).
5. Accept the Android installation prompt.
6. Launch **F1 Hub** from the new icon in your app drawer/home screen.

When launched from that icon it runs with `display: standalone`, so the normal browser address bar and controls are removed.

If Android still only offers a basic shortcut, clear the old F1 Hub site data/cache once, reopen the site, and retry the install after confirming v1.2 is displayed at the bottom of More.
