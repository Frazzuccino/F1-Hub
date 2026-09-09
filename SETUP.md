# F1 Hub v1.19.0 — update / install

## Update GitHub Pages

Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder, keeping the files at the repository root.

For this upgrade, open the deployed app once with:

`?v=1190`

In **More**, the footer should show **F1 Hub v1.19.0**.

## Main changes in v1.19.0

- Refined the Car Development technical overlay: tiny component pin + leader line + compact number bubble instead of large circles covering the supplied 2026 reference drawing.
- Recalibrated component marker locations against the supplied rear/top/front/side 2026 schematic.
- Driver Compare now uses a dedicated momentum vertical scroller on Android/PWA so every comparison graphic and stat can be reached.
- More menu cards can now start a horizontal swipe, fixing the difficult More → News gesture while preserving normal taps and vertical scrolling.
- Historical Car Presentation Submissions now search FIA event archives and archived FIA PDF paths rather than relying only on the current-weekend documents landing page.
- Past Car Development rounds are labelled **FIA ARCHIVE ›**.

## Testing

On Windows with Node installed, run `RUN-TESTS.bat`, or manually run:

- `node tests/test-quality.js`
- `node tests/test-feature-gates.js`
- `node tests/v118-fixes-smoke.js`
- `node tests/v119-fixes-smoke.js`
- `node tests/runtime-smoke.js`
- `node tests/swipe-repeat-smoke.js`

The release acceptance target is 100% automated checks and at least 9/10 for every requested feature group.
