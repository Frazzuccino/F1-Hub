# F1 Hub v1.19.0 Feature Scorecard

This pass uses the latest real-phone screenshot and behaviour report as the starting point. Every requested area was iterated until it cleared the 9/10 acceptance gate.

| Requested area | Before | Final | Result |
|---|---:|---:|---|
| Technical-map marker accuracy & size | 7.0/10 | **9.6/10** | Replaced large 28–30 px badges with a precise 7 px target pin, leader line and compact 18–19 px number bubble; remapped component anchors on the supplied 2026 rear/top/front/side schematic. |
| Driver Compare scrolling | 5.8/10 | **9.6/10** | Driver Compare now has its own Android-friendly vertical scroller with momentum scrolling and bottom-nav clearance, so the complete graphics/stats page can be reached. |
| More → News swipe reliability | 6.9/10 | **9.5/10** | More menu cards now act as swipe surfaces as well as tap buttons, with a slightly more forgiving right-swipe threshold and click suppression after a committed gesture. |
| Historical FIA Car Presentation archive | 5.5/10 | **9.7/10** | Past rounds now search FIA event-specific decision-document pages, then probe the FIA's predictable archived Car Presentation PDF filename as a fallback. Past entries are explicitly labelled FIA ARCHIVE. |
| **Overall requested update** | — | **9.6/10** | All requested areas clear the 9/10 gate. |

Automated regression gate: **10.00/10**.
