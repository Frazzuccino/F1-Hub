# F1 Hub v1.19.0 Quality Report

## 1. Technical schematic marker refinement

The underlying car remains the cleaned multi-view 2026 reference schematic supplied by the user. The problem in v1.18.0 was the overlay: the numbered circles were too large and obscured the technical drawing, making their relationship to the actual component ambiguous.

v1.19.0 separates the marker into three visual elements:

- a small coloured **target pin** placed on the actual mapped component;
- a short leader line;
- a compact offset numbered bubble.

The main component anchors were also recalibrated against the supplied reference image for front wing, nose, front corner, floor fences, sidepod, floor, cooling/engine cover, cockpit, rear corner, rear body, diffuser, beam wing and rear wing.

A raster QA preview was generated to inspect the marker placement at full image resolution.

## 2. Driver Compare scrolling

The previous page relied on document scrolling. On some Android PWA gesture combinations this could leave the long comparison output effectively trapped.

v1.19.0 gives Driver Compare an explicit inner scroll viewport while that route is active:

- `overflow-y:auto`;
- `-webkit-overflow-scrolling:touch`;
- `touch-action:pan-y`;
- extra bottom padding above the fixed navigation bar;
- the outer document is temporarily prevented from competing for the gesture.

The compare route still keeps its existing H2H graphics, radar, metrics, detailed driver cards and points-evolution chart.

## 3. More → News swipe reliability

The root cause was identified from the real UI structure: almost the entire More page is made from `<button class="menu-card">` elements, and interactive buttons were deliberately excluded from swipe starts. Therefore a swipe beginning over most of the visible More page could never start.

v1.19.0 allows horizontal gestures to begin on More menu cards while retaining normal taps. Vertical movement is still handed back to normal page scrolling. A short post-swipe click-suppression window prevents a completed swipe from accidentally opening the menu item under the finger.

The More → News gesture also uses a modestly lower distance/flick threshold than the generic route transition.

## 4. Historical FIA Car Presentation submissions

The old implementation only searched the FIA's main Formula 1 documents landing page. That page is dominated by the current event, so older rounds could appear to have no Car Presentation Submission even though FIA retains them.

v1.19.0 now uses a three-stage lookup:

1. current FIA F1 documents page;
2. the race's FIA **event-specific decision-document archive**;
3. the FIA's predictable archived `YYYY_<grand_prix>_-_car_presentation_submissions.pdf` path as a fallback.

Aliases are included for FIA/event naming differences such as Chinese Grand Prix / Grand Prix of China and Barcelona-Catalunya / Spanish Grand Prix.

Past rounds in Car Development are now explicitly labelled **FIA ARCHIVE ›** so the historical route is discoverable.

## Test results

- `node --check app.js` → **PASS**
- `node tests/test-quality.js` → **122/122 PASS (10.00/10)**
- `node tests/test-feature-gates.js` → **PASS (10.00/10 average)**
- `node tests/v118-fixes-smoke.js` → **PASS**
- `node tests/v119-fixes-smoke.js` → **PASS**
- `node tests/runtime-smoke.js` → **PASS**
- `node tests/swipe-repeat-smoke.js` → **PASS**
- Technical marker raster inspection → **PASS**
- JSON / manifest / service-worker version checks → **PASS**
- ZIP integrity → required before handoff

## Release score

Requested-update score: **9.6/10**  
Automated regression score: **10.00/10**
