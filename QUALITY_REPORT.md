# F1 Hub v1.13.0 — Quality Report

## Overall app rating
**9.4/10**

This is intentionally lower than the automated test score. F1 Hub still depends on free third-party/public data services whose availability, CORS policy and publication delay are outside the app's control. The app now validates and labels those data paths rather than assuming every response is correct.

## Automated release gate
**81 / 81 checks passed — 10.00/10**

Category results:
- Data: 9/9
- Reliability: 13/13
- Features: 30/30
- Test infrastructure: 1/1
- PWA: 5/5
- UX: 8/8
- Accessibility: 6/6
- Performance: 9/9

Additional gates:
- Home cleanup: 10/10
- My F1 personalisation: 10/10
- Car Development 2.0: 10/10
- Motion & animation: 10/10
- Runtime smoke test: PASS
- JavaScript syntax: PASS

## Important v1.13 regression coverage
The tests explicitly check:
- DNF/DNS rows cannot sort ahead of classified finishers.
- Published standings are validated before assignment.
- Post-race reconstruction remains generic rather than race-specific.
- Data Health is no longer rendered on Home.
- My F1 theming, highlights, news filtering and team-mate context exist.
- Car Development component mapping works for real FIA-style terms including Front Wing, Floor Furniture, Coke/Engine Cover, Exhaust Tailpipe Bracket and combined Floor Edge + Diffuser rows.
- Unknown car parts remain unmapped instead of being assigned false precision.
- Teams declaring zero updates are retained.
- Top/side update diagrams and marker navigation are wired into the FIA update cards.
- Route animations do not replay on every background render.
- Reduced-motion, touch targets and keyboard/focus support are retained.
- PWA cache/update infrastructure includes the new Car Development core.

## Known limitation
The release can validate parsers, mapping, rendering logic and application runtime offline, but it cannot guarantee that every external FIA/news/weather/standings endpoint will be reachable from every phone at every moment. The FIA documents themselves remain the source of truth; the car diagram is deliberately labelled as a broad component-location schematic, not an exact representation of team-specific CAD/aerodynamic geometry.
