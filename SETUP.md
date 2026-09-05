# F1 Hub — setup

F1 Hub is now a lightweight web/PWA app rather than a native Android project.

## Quick PC test

1. Extract the ZIP.
2. Double-click `START-F1-HUB.bat`.
3. Your browser should open `http://localhost:8765`.
4. Leave the small command window open while using the app.

If Python is not installed, the batch file opens `index.html` directly. Most pages should still work, but PWA installation and the offline service worker require the app to be served over HTTP/HTTPS.

## Best setup for your Samsung phone — free GitHub Pages

This gives F1 Hub a normal HTTPS address and allows Chrome/Samsung Internet to add/install it on the home screen.

1. Sign in to GitHub and create a new **public** repository called `f1hub`.
2. Open the repository and choose **Add file → Upload files**.
3. Upload the **contents** of this `F1Hub-Web` folder (not the outer folder itself):
   - `index.html`
   - `app.js`
   - `styles.css`
   - `manifest.webmanifest`
   - `sw.js`
   - the `icons` folder
4. Commit the files.
5. In the repository go to **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select `main` and `/ (root)`, then **Save**.
8. GitHub will provide an address similar to `https://YOURNAME.github.io/f1hub/`.
9. Open that address on your Samsung phone.
10. In Chrome: menu **⋮ → Add to Home screen / Install app**. In Samsung Internet: menu → **Add page to → Home screen**.

After that F1 Hub launches in its own app-like window and keeps cached data from the last successful refresh.

## Updating the app later

Replace the changed files in the GitHub repository. GitHub Pages redeploys automatically. The service worker is versioned in `sw.js`; if a major update seems stuck, close/reopen the app or clear the site's cached data once.

## Current free data sources

- Jolpica F1: calendar, session times, standings, results and qualifying.
- OpenF1 free historical/post-session endpoints: race control, driver headshots and team radio where available.
- BBC Sport Formula 1 RSS via rss2json: news headlines.
- Open-Meteo: race-weekend forecast.
- FIA documents: steward documents/decisions, with a direct official-source fallback.
- RacingNews365 + timepenalty: penalty-point/reprimand refresh, with a bundled fallback if browser access is blocked.
- Community circuit SVGs from MasterPlay007/F1-Track-Layouts-SVG and F1DB.

## Native-widget change

The native Android home-screen widget from the previous design is not possible in this web/PWA version. The app itself can be installed as a home-screen icon and still provides the next-session countdown on its home page.


## v1.1 app-mode install

On Android Chrome, F1 Hub now shows its own **Install F1 Hub** prompt when the PWA is eligible. Use that prompt, then launch F1 Hub from the new home-screen/app-drawer icon. In installed mode the Chrome address bar and browser menu are removed.

If you previously installed/created a shortcut for v1.0, remove that shortcut, reload the GitHub Pages site once, then install v1.1 again so Android picks up the updated manifest.

The Rain Radar button now opens an in-app Windy radar centred on the selected circuit. Driver photos use OpenF1 first and automatically fall back to Wikipedia/Wikimedia thumbnails when a current driver is missing or an F1 media image fails.
