# F1 Hub v1.12.0 — Quality Report

## Final release rating
**9.2 / 10**

The automated release gate scores **10.0 / 10** (**53/53 checks passed**) on the included regression rubric. The overall product rating is intentionally lower because F1 Hub still depends on free public upstream services whose availability and publication delay cannot be controlled by the app, and this container could not provide a reliable full Chromium end-to-end run.

## Category rating
| Area | Score | What changed |
|---|---:|---|
| Visual design | 9.2 | Existing F1-style visual system retained; added compact freshness, health, favourites, insights and trends without changing the core look. |
| Race-weekend usefulness | 9.4 | Race at a Glance, session calendar reminders, championship context and share actions. |
| Feature depth | 9.5 | Favourites, Data Health, trends, richer H2H and post-race analytics added to the existing feature set. |
| Navigation/usability | 9.1 | New features live under More; Home gets only concise personalised/freshness cards. |
| Data accuracy/freshness | 9.2 | Central result/standings validation, source/freshness visibility and generic post-race reconstruction. |
| Performance | 9.0 | Cache-first shell, background refresh, lazy Leaflet and below-fold content visibility. |
| PWA/native feel | 9.2 | Update banner, shortcuts, install screenshots, native sharing where supported and calendar export. |
| Accessibility | 9.1 | Pinch zoom restored, keyboard support, focus states, larger targets and reduced-motion support. |
| Maintainability/testing | 9.1 | Pure quality module plus repeatable regression and runtime-smoke tests. |

## Automated release gate
Run:

```text
node tests/test-quality.js
node tests/runtime-smoke.js
```

Release gate verifies, among other things:
- DNF/DNS/DSQ ordering and result validation.
- unique/ordered standings and generic provisional post-race reconstruction.
- no hard-coded championship-round snapshot.
- freshness/data-health/favourites/calendar reminders.
- Race at a Glance metrics.
- championship trends, constructor contribution and race/qualifying H2H.
- native share fallback.
- PWA versioning, shortcuts, screenshots and update banner.
- accessibility requirements and no disabled pinch zoom.
- lazy map dependency, cache-first app shell and below-fold rendering optimisation.
- full `app.js` runtime evaluation with DOM/browser stubs.

## Iteration performed before release
The initial generic post-race reconstruction would have overwritten a newer published standings table whenever its points differed from the arithmetic reconstruction. That was tightened before release: the reconstructed table is used only when the published table is demonstrably one round behind. This preserves later steward/penalty corrections from an already-current upstream source.

The constructor contribution graph was also corrected so each bar inherits its constructor colour rather than the default text colour.

## Known limitations
- News, standings, weather, photos and historical data depend on third-party/public endpoints; no browser-only app can guarantee those services will always be reachable or instantaneously updated.
- Calendar reminders rely on the phone's calendar app after the `.ics` file is imported.
- Web Share availability depends on the browser/PWA environment; clipboard fallback is used otherwise.
- Live timing remains intentionally removed.
- A true device/browser end-to-end session with live upstream APIs should still be verified after deployment. Automated unit/regression and runtime JavaScript smoke tests are included and pass locally.
