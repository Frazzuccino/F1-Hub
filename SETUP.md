# F1 Hub v1.10.1 — update / install

Replace the files in your existing GitHub Pages repository with the files in this folder, then commit the changes.

Open your F1 Hub URL once with `?v=1101` on the end. In **More**, the footer should say **F1 Hub v1.10.1**.

## New in v1.10.1

- Live timing now uses an automatic free-source fallback chain.
- First it tries the existing community JSON relay.
- If that fails, it tries a Formula-Timing snapshot.
- If that fails, it tries an F1 Live Data snapshot.
- The latest valid timing table stays on screen as `STALE` while F1 Hub retries.
- Direct buttons to F1 Live Data, Formula-Timing and official F1 timing remain available as final fallbacks.
- Post-session telemetry continues to use the official Formula 1 archive introduced in v1.10.0.

Because F1 Hub is a static GitHub Pages app, third-party sites may change their markup, CORS policy or availability. The live fallback chain is designed to fail gracefully rather than leave a blank page.
