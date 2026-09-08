# F1 Hub v1.17.0 — update / install

## Update GitHub Pages

Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder, keeping the files at the repository root.

For this upgrade, open the deployed app once with:

`?v=1170`

In **More**, the footer should show **F1 Hub v1.17.0**.

## Main changes in v1.17.0

- Replaced the previous Car Development top/side silhouette with a visibly different three-quarter technical F1 drawing.
- Added dedicated three-quarter marker coordinates for FIA update locations.
- The NEXT card on Race Calendar now scrolls to, expands and highlights the corresponding round in the main calendar.
- Driver season history now includes championship position for each year, using Jolpica driver standings.
- Driver career archive requests are rate-limit friendly as well as fully paginated.
- Driver Compare explicitly supports vertical touch scrolling on long comparison pages.
- Reworked swipe transitions so a second swipe can start immediately after the first; stale transition cleanup no longer cancels the next gesture.

## Testing

On Windows with Node installed, run:

`RUN-TESTS.bat`

or manually run:

- `node tests/test-quality.js`
- `node tests/test-feature-gates.js`
- `node tests/runtime-smoke.js`
- `node tests/swipe-repeat-smoke.js`

The release acceptance target is 100% automated checks and at least 9/10 for every requested feature group.
