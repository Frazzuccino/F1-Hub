# F1 Hub v1.11.6 — update / install

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep `index.html`, `app.js`, `styles.css`, `manifest.json`, `service-worker.js`, the icons and `.nojekyll` at the repository root.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL once with `?v=1116` on the end. In **More**, the footer should say **F1 Hub v1.11.6**.

## Changed in v1.11.6
- News now reads each publisher RSS feed directly first rather than relying on rss2json as the primary source.
- If browser CORS blocks a publisher feed, F1 Hub retries the same feed through a free CORS read-through; rss2json is now only the final fallback.
- Reopening/resuming the Android app automatically checks for fresh news when the previous check is more than a few minutes old.
- News refreshes automatically about every 10 minutes while F1 Hub is open.
- The top refresh button and pull-to-refresh still force an immediate fresh-news check.
- The v1.11.5 driver-photo fallback improvements, v1.11.1 telemetry/lap-delta fix, and removal of Live Timing are retained.
