# F1 Hub v1.13.0 — Personalisation & Car Development release

## Update GitHub Pages
1. Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder.
2. Keep the files at the repository root, including `index.html`, `app.js`, `quality-core.js`, `car-development-core.js`, `styles.css`, `manifest.json`, `version.json`, `service-worker.js`, icons, screenshots and `.nojekyll`.
3. Commit the change and wait for GitHub Pages to redeploy.

## Force the latest version once
Open your F1 Hub URL once with `?v=1130` on the end. In **More**, the footer should say **F1 Hub v1.13.0**.

After that, the existing in-app update checker should normally handle later releases.

## What changed in v1.13.0
- Removed the Data Health freshness strip from Home. Data Health remains under More and through the header ONLINE/OFFLINE control.
- Expanded **My F1** so favourites affect the app rather than only one card:
  - optional favourite-team colour theme;
  - favourite highlighting in standings, drivers and teams;
  - personalised **★ MY F1** news filter;
  - team-mate points comparison and constructor context on Home;
  - favourite-team priority/filter in Car Development.
- Rebuilt **Car Development** around the official FIA Car Presentation Submission:
  - team-coloured top + side F1 car schematic;
  - numbered locations linked to each update row;
  - broad component mapping for wings, floor, diffuser, suspension/corners, sidepods, cooling/bodywork, exhaust/rear body and more;
  - multi-location mapping for combined updates such as Floor Edge + Diffuser;
  - confidence labels and explicit unmapped state when a part cannot be located reliably;
  - teams with zero declared updates remain visible;
  - clear warning that diagrams are schematic, not team CAD geometry.
- Improved motion:
  - route-only transitions;
  - staggered card entrance;
  - animated active bottom-nav indicator;
  - subtle hero movement and interaction feedback;
  - background refreshes no longer replay full-page animations;
  - reduced-motion preference remains respected.
- Added `car-development-core.js` and expanded regression tests.

## Run the included tests
With Node.js installed, from this folder run:

```text
node tests/test-quality.js
node tests/test-feature-gates.js
node tests/runtime-smoke.js
```

Or on Windows run `RUN-TESTS.bat`.

See `QUALITY_REPORT.md` and `FEATURE_SCORECARD.md` for the release scores and limitations.
