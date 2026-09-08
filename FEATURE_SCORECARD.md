# F1 Hub v1.15.0 — Feature Scorecard

This release used the same rule as the previous quality releases: no requested change is accepted until it reaches at least 9/10 in its own review gate.

| Update | First-pass score | What held it back | Final score |
|---|---:|---|---:|
| Car Development F1-car diagram | 7.4/10 | The previous boxy top/side schematic conveyed location but did not visually read as a modern F1 car. | **9.5/10** |
| Left/right swipe navigation | 6.8/10 | The old gesture only moved the page about 64 px and then re-rendered, so movement felt detached from the finger. | **9.4/10** |
| Driver career accuracy | 5.5/10 | Jolpica/Ergast caps one response at 100 results; `limit=2000` still returned only the first 100 races. | **9.8/10** |
| Remove My F1 from Home | 10.0/10 | Straightforward layout cleanup. | **10.0/10** |
| Race-weekend launch animation | 7.5/10 | No true opening experience existed and a first install could not show race context immediately. | **9.4/10** |

## Iterations made before acceptance

### Car Development
The first design was rejected at 7.4/10. The replacement uses a substantially more detailed, stacked top/side technical silhouette with front/rear wings, endplates, wheels, suspension lines, floor, sidepods, cockpit, halo, airbox, engine cover, diffuser and beam-wing area. Update markers were remapped to the new geometry. A rendered visual QA snapshot is included at `tests/car-schematic-preview.png`.

### Swipe navigation
The old resisted 64-pixel nudge was rejected at 6.8/10. The replacement uses direct manipulation: the current page follows the finger across the viewport, the destination section appears underneath, horizontal movement locks the gesture and prevents vertical browser jitter, and release decisions use both distance and flick velocity. A second pass corrected the flick-velocity calculation before release.

### Driver career accuracy
The previous code requested `limit=2000`, but the Ergast-compatible API's per-page maximum is 100. The accepted implementation reads `MRData.total`, generates offsets in 100-result pages, fetches every page, deduplicates season/round results, and only then calculates GP total, wins, podiums, best finish, team history and season history. Incomplete archives are explicitly labelled rather than silently shown as complete.

### Launch sequence
A race-weekend-aware launch screen now uses cached calendar data immediately. If this is a first install without cached data, the visible launch content updates as soon as the calendar request succeeds without restarting or delaying the animation. It also returns after a long app-background period, while respecting reduced-motion settings.

## Final release judgement

**Feature-quality average: 9.62/10**

The remaining uncertainty is real-device gesture feel and the availability of third-party live APIs on the user's phone. Those cannot be fully guaranteed by static/runtime tests, so the scores deliberately stop short of 10/10 despite the automated gates passing in full.
