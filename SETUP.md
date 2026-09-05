# F1 Hub v1.11.1 — update / install

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep `index.html`, `app.js`, `styles.css`, `manifest.json`, `service-worker.js`, the icons and `.nojekyll` at the repository root.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL once with `?v=1111` on the end. In **More**, the footer should say **F1 Hub v1.11.1**.

## Fixed in v1.11.1

- Lap Delta now uses the selected drivers’ official lap durations to normalise the telemetry trace. It starts at 0.000 s and finishes at the exact Driver A minus Driver B lap-time difference, so the sign always agrees with which selected lap was faster.
- Live Timing still refuses saved/demo timing as live, but now re-checks the validated relay every 8 seconds instead of every 15 seconds.
- Live Timing requires the relay to prove: connected upstream, live session, not stale, recent upstream update, correct session, and (when available) the correct meeting.
- Telemetry now uses a proper two-source chain for every season including 2026: OpenF1 historical telemetry first, then Formula 1's official `CarData.z` / `Position.z` timing archive.
- The official archive parser now accepts both array/object update containers and searches a longer section of the stream for its UTC timebase.
- If Formula 1's static archive is blocked by the browser/network, F1 Hub can fall back to a free AllOrigins read-through for the same public static text files.
- Archive session-path discovery can also fall back to the validated live relay's F1 archive index when the Formula 1 yearly index itself is blocked.
- No stale Formula-Timing / F1 Live Data HTML table is scraped into F1 Hub as live timing. Those remain external/dashboard fallbacks only.

## Important
F1 Hub remains a static GitHub Pages app with no paid API key and no self-hosted backend. Free public sources can still be temporarily unavailable. The app now fails closed rather than showing an old timing table as LIVE.
