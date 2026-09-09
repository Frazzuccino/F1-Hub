# F1 Hub v1.18.0 — update / install

## Update GitHub Pages

Replace the files in your existing F1 Hub GitHub Pages repository with everything in this folder, keeping the files at the repository root.

For this upgrade, open the deployed app once with:

`?v=1180`

In **More**, the footer should show **F1 Hub v1.18.0**.

## Main changes in v1.18.0

- Replaced the inaccurate hand-drawn Car Development car with a cleaned dark technical rendering based directly on the supplied 2026 multi-view F1 schematic; FIA update markers sit on the proper rear/top/front/side views.
- Redesigned Driver Compare so graphics and H2H information appear before the driver photo cards, with an At a Glance duel, H2H summary, radar chart, metric bars, stat chips and points evolution.
- Improved News-tab swipe responsiveness by allowing gestures to begin on article cards, rendering a smaller mobile news batch, and using a lightweight transition snapshot instead of cloning the full feed.
- The top NEXT race shortcut now scrolls to/highlights the normal calendar card only. It no longer injects FP1/session details or an OPEN RACE HUB panel into that card.
- Added stricter Formula 1 relevance filtering to stop unrelated Google News/RSS results such as tennis US Open stories entering the feed.

## Testing

On Windows with Node installed, run `RUN-TESTS.bat`, or manually run:

- `node tests/test-quality.js`
- `node tests/test-feature-gates.js`
- `node tests/runtime-smoke.js`
- `node tests/swipe-repeat-smoke.js`
- `node tests/v118-fixes-smoke.js`

The release acceptance target is 100% automated checks and at least 9/10 for every requested feature group.
