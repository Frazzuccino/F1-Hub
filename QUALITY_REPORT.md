# F1 Hub v1.15.0 — Quality Report

## Release result

**Overall product rating: 9.6/10**

**Automated release gate: 113/113 passed — 10.00/10**

### Automated categories

| Category | Passed |
|---|---:|
| Data | 12/12 |
| Reliability | 17/17 |
| Features | 41/41 |
| PWA | 5/5 |
| UX | 19/19 |
| Accessibility | 7/7 |
| Performance | 11/11 |
| Test framework | 1/1 |

Runtime/browser-like smoke test: **PASS**

JavaScript syntax checks: **PASS**

Car Development visual snapshot render: **PASS**

## Important regressions covered

- DNF/DNS/DSQ rows cannot outrank classified finishers.
- A result must contain a real unique P1 before a winner is shown.
- Post-race standings validation/reconstruction remains enabled.
- FIA Car Presentation documents support both table and flattened-text extraction.
- Driver careers paginate beyond Jolpica's 100-result response cap.
- A 393-race synthetic career fixture produces 393 GPs, 106 wins and 207 podiums without truncation.
- Mid-season constructor changes remain represented in career history.
- Car update markers map against the new detailed top/side car geometry.
- Swipe navigation uses direct movement plus distance/velocity commit logic.
- My F1 is not rendered on Home.
- Launch animation uses next/live race-weekend context and honours reduced motion.
- News, weather, standings, update checking, PWA caching and existing v1.14 features remain under regression coverage.

## Visual QA

The new car silhouette was rendered independently from the app SVG generator and inspected at `tests/car-schematic-preview.png`. It now visibly reads as an open-wheel Formula 1 car in both top and side views rather than the previous rectangular schematic.

## Browser limitation

A Chromium end-to-end screenshot run was attempted in the build environment, but headless Chromium did not complete navigation within the execution window. It is therefore **not counted** as a passed browser test. The browser-like runtime suite is counted and passed.

## Why the product score is 9.6 rather than 10

F1 Hub still depends on public services such as Jolpica, OpenF1, FIA pages, news feeds and weather data. The app validates, caches and exposes failures more safely, but it cannot guarantee those providers' uptime or freshness. Real-device swipe feel is also ultimately best verified on the target Android phone.
