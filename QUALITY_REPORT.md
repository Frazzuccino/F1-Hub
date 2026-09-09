# F1 Hub v1.18.0 Quality Report

## User-requested fixes

### 1. Technical car diagram

The previous three-quarter drawing was rejected because it did not resemble the supplied 2026 F1 technical schematic closely enough.

v1.18.0 now uses a cleaned, cropped and dark-rendered version based directly on the **user-supplied 2026 rear/top/front/side reference schematic**. The unrelated red annotations from the reference were removed programmatically and F1 Hub overlays its own numbered FIA-update markers.

Marker zones are mapped to appropriate views (for example rear wing/diffuser on rear view, cockpit/cooling/top-body areas on top view, floor/sidepod/front/rear corner on side/front views). The app still states that these are approximate component locations rather than team CAD geometry.

### 2. Driver Compare

The old result could look like little more than two large driver photos.

The new hierarchy is:

1. At a Glance duel bars
2. Qualifying/race H2H summary
3. Radar comparison + detailed metric bars
4. Driver cards with six visible stat chips each
5. Points-evolution chart

This makes the actual comparison visible before the photos.

### 3. News swipe responsiveness

Three changes target the News-specific slowdown:

- horizontal swipes may begin on article links/cards;
- mobile initially renders 18 stories rather than the entire cached feed, with **Show More** available;
- when swiping away from News, the app uses a lightweight transition snapshot instead of cloning the full article DOM.

The existing immediate repeat-swipe regression test remains enabled.

### 4. NEXT race calendar shortcut

The top NEXT card now scrolls to and briefly highlights the matching normal calendar entry. The focused entry is visually identical in content to the other main-calendar entries and no longer inserts FP1, weekend sessions or an **OPEN RACE HUB** section.

Tapping the normal calendar entry itself still opens that race in the usual way.

### 5. News relevance

News is now checked against explicit F1 topics/drivers/teams/circuits and obvious non-F1 sport terms. A regression fixture verifies that a **US Open wheelchair doubles** headline is rejected while an F1 Ferrari/Monza story is retained.

## Test results

- `node --check app.js` → **PASS**
- `node tests/test-quality.js` → **122/122 PASS (10.00/10)**
- `node tests/test-feature-gates.js` → **PASS (10.00/10 average)**
- `node tests/runtime-smoke.js` → **PASS**
- `node tests/swipe-repeat-smoke.js` → **PASS**
- `node tests/v118-fixes-smoke.js` → **PASS**
- Technical schematic raster/marker inspection → **PASS**
- ZIP integrity → required before handoff

## Release score

Requested-update score: **9.6/10**  
Automated regression score: **10.00/10**
