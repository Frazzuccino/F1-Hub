# F1 Hub v1.17.0 — Quality Report

## Release result

**Overall product rating: 9.7/10**

**Automated quality gate: 122/122 passed — 10.00/10**

| Category | Passed |
|---|---:|
| Data | 14/14 |
| Reliability | 18/18 |
| Features | 43/43 |
| PWA | 5/5 |
| UX | 23/23 |
| Accessibility | 7/7 |
| Performance | 11/11 |
| Test framework | 1/1 |

Additional release checks:

- Feature acceptance gates: **all groups 10.00/10**
- Browser-like runtime/render smoke test: **PASS**
- Immediate repeat-swipe simulation: **PASS**
- JavaScript syntax checks: **PASS**
- Three-quarter car SVG raster render: **PASS**
- Manifest/version consistency: **PASS**
- ZIP integrity: checked before delivery

## Regressions specifically covered

- Car Development uses the new `car-schematic-v3` three-quarter drawing rather than the previous stacked top/side schematic.
- FIA zones include dedicated perspective coordinates for front wing, nose, suspension/corners, floor, sidepod, cockpit, cooling, diffuser and rear wing areas.
- The top NEXT calendar card can focus and expand its corresponding round in the main season timeline.
- Expanded calendar cards expose weekend sessions and a Race Hub action.
- Season-by-season driver rows can accept championship positions from the official season standings endpoint.
- Career totals remain unchanged when championship-position metadata is attached.
- Long driver careers remain paginated beyond the 100-record API cap and now use rate-limit-friendly batches.
- Driver Compare explicitly allows vertical mobile panning.
- A second section swipe works immediately after the first without waiting for the previous transition timer.
- Existing results ordering, standings validation, historical weather, news handling, PWA cache/update behaviour and accessibility checks remain in the regression suite.

## Why the product rating is not 10/10

F1 Hub still relies on public third-party data services. Network availability, delayed source publication and provider-side schema changes are outside the app's control. Also, while the repeat-swipe state machine is now simulated in tests, the final judgement of gesture feel still belongs on the real Android device.
