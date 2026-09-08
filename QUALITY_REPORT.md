# F1 Hub v1.14.0 — Quality Report

## Release rating

**Subjective product rating: 9.5/10**

The automated release gate is intentionally stricter and binary for known regressions; all checks pass. The product rating remains below 10 because the app still depends on third-party public data sources whose availability, latency and document formatting are outside the app's control.

## Automated quality gate

```text
F1 HUB QUALITY TESTS: 98/98 passed

data           10/10
reliability    16/16
features       37/37
tests           1/1
pwa             5/5
ux             14/14
accessibility   6/6
performance     9/9

TEST SCORE: 10.00/10
```

## Runtime smoke test

**PASS**

The app script is executed inside the release's browser-like runtime harness. The smoke test covers:
- DNF ordering;
- parent route behaviour;
- FIA table-format parsing;
- flattened FIA parsing with all 11 current-team sections represented;
- explicit no-update handling;
- Car Development schematic generation;
- neutral standings despite favourites;
- My F1 theming;
- driver career aggregation including a mid-season team change;
- left/right swipe-route calculation;
- upcoming weather-session selection;
- rendered Race Calendar, More hierarchy, Standings, News and Weather markup.

During this final render-level pass, the test uncovered a missing `sessionRows()` renderer introduced during the refactor. That was restored before release and a permanent regression test was added.

## Car Development validation

The flat-document fixture follows the structure of the current FIA Car Presentation Submission rather than a synthetic Markdown table only. It verifies that:
- McLaren, Mercedes, Red Bull Racing, Ferrari, Williams, Racing Bulls, Aston Martin, Haas, Alpine and Cadillac retain update rows;
- Audi remains visible as the explicit no-update team;
- no detected team is silently discarded;
- parse failures are surfaced as **CHECK DOC** rather than mislabelled as zero updates.

## Additional release checks

- `app.js` syntax: PASS
- `car-development-core.js` syntax: PASS
- `manifest.json`: PASS
- `version.json`: PASS
- Service-worker release version/assets: PASS via regression suite
- Reduced-motion/accessibility gates: PASS
- App JS size gate (<230 KB): PASS

## Environment limitation

A separate full headless-Chromium navigation test was attempted, but this execution environment blocks Chromium page navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`, including `data:` and local-file pages. It is therefore not counted as a successful browser E2E test. The release instead uses the passing runtime/render smoke suite above plus the static/regression gates. A real Android/PWA smoke test after GitHub Pages deployment remains the final device-specific verification.
