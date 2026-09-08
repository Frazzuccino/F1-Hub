# F1 Hub v1.17.0 — Feature Scorecard

This release used the same acceptance rule as the previous quality releases: every requested change had to reach **at least 9/10** before it was kept in the build.

| Requested update | Starting score | Main problem found | Final score |
|---|---:|---|---:|
| Car Development technical drawing | 7.6/10 | The v1.16 top/side line drawing was cleaner, but still looked like a stylised silhouette rather than the three-quarter technical F1 illustration used as the reference. | **9.4/10** |
| Next-race calendar interaction | 7.8/10 | The top NEXT card was informative but did not take the user to the same round in the season timeline. | **9.6/10** |
| Season-by-season driver history | 7.5/10 | Race/team history was present, but the championship finishing position for each season was missing. | **9.5/10** |
| Driver Compare vertical scrolling | 6.5/10 | The long comparison dashboard did not explicitly reserve the touch gesture for vertical panning on the target mobile layout. | **9.3/10** |
| Repeat left/right section swiping | 6.8/10 | A completed swipe left a visual cleanup timer alive; a second gesture could begin and then be reset by that previous transition. | **9.5/10** |

## Changes made to reach the acceptance threshold

### Technical drawing
The old stacked top/side schematic was removed. The update map now uses one large **three-quarter technical view** with multi-element front and rear wings, exposed wheels, suspension, nose, floor, sidepod, cockpit/halo, airbox, engine cover, diffuser and beam-wing geometry. Every component zone now has a dedicated three-quarter marker coordinate.

A raster preview was generated from the release SVG during QA so the geometry was judged visually rather than only by checking SVG source strings.

### Race Calendar
The NEXT summary at the top is now a real control. Tapping it:
1. expands the matching round in the main calendar,
2. smoothly scrolls that round into view,
3. briefly highlights the selected card,
4. reveals the weekend sessions and an **OPEN RACE HUB** action.

This keeps the user on the calendar first rather than immediately navigating away.

### Driver history
After the full race archive loads, F1 Hub also requests the driver's final Jolpica **driver standings** entry for each season. Historic years display `P1`, `P2`, etc. as the championship finish; the active season is labelled **CURRENT** so it is not falsely presented as a final result.

The career archive itself is also now fetched in rate-limit-friendly batches of at most two 100-result pages at once.

### Driver Compare scrolling
The comparison dashboard now has a dedicated vertical-pan touch context (`touch-action: pan-y`) across the comparison wrapper, charts and metric cards. Interactive selects/buttons retain normal tap behaviour.

### Swipe navigation
The swipe transition was reworked around a short-lived snapshot of the outgoing section. The destination route is changed immediately at touch release, and the old page snapshot completes the visual exit independently. A new touch cancels the remaining visual animation and starts the next gesture immediately.

A dedicated regression test performs **two left swipes back-to-back without running any transition timeout**. It must move `Home → Races → Standings`; the test passes in this release.

## Final feature judgement

**Requested-update average: 9.46/10**

The remaining uncertainty is primarily tactile: actual gesture feel depends on Android/Chrome and the phone's refresh/touch sampling, so the physical-device test remains the final subjective check even though the repeated-swipe state bug is covered by an automated simulation.
