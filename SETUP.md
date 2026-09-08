# F1 Hub v1.16.0 — update / install

## Update GitHub Pages

Replace the files in your existing F1 Hub repository with everything in this folder, keeping the files at the repository root.

Open the deployed app once with:

`?v=1150`

In **More**, the footer should show **F1 Hub v1.16.0**.

## Main changes in v1.16.0

- Replaced the previous abstract Car Development drawing with a much more detailed top/side 2026-style F1 car schematic.
- Remapped technical update markers to the new car geometry.
- Rebuilt left/right page swiping so the page follows the finger directly, supports flick velocity, and reveals the destination section underneath.
- Removed My F1 from the Home screen. My F1 remains at the bottom of More and can still control the app theme and Car Development preference.
- Fixed driver career stats by paging through every Jolpica result instead of silently stopping at 100.
- Career panels now explicitly report full Grand Prix totals and warn if an archive page fails to load.
- Added a race-weekend-aware opening animation showing the live/next round and next session.
- The launch animation can also appear after returning to the app following a long background period.

## Testing

Run `RUN-TESTS.bat` on Windows with Node installed, or run:

`node tests/test-quality.js`

and:

`node tests/runtime-smoke.js`

The release target is 100% automated checks and a minimum 9/10 score for every requested feature group.
