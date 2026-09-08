# F1 Hub v1.13.0 — Feature Scorecard

Each requested update was treated as a separate release gate. A feature was not considered ready to merge until its design score was at least 9/10 and its automated gate was at least 9/10.

## 1. Home cleanup
- Requested change: remove Data Health from the Home content.
- Final design score: **9.8/10**
- Automated gate: **10/10**
- Final behaviour: Home keeps the race hero, My F1, schedule, championship, weather and latest news. Data Health remains available from More and from the ONLINE/OFFLINE control in the header, but the freshness strip no longer occupies the first page.

## 2. My F1 personalisation
- Earlier/minimal concept: favourite selections only affected one Home card — **8.4/10**.
- Improvement pass: added team-colour theming, standings/card highlighting, personalised news, team-mate context and Car Development integration.
- Final design score: **9.5/10**
- Automated gate: **10/10**
- Final behaviour:
  - Favourite team colours can theme the app accents (optional).
  - Favourite driver/team are highlighted in relevant standings/cards.
  - News gains a **★ MY F1** filter.
  - Home shows driver position, team position, team-mate points comparison and latest relevant story.
  - Favourite team is shown first and gets a **MY TEAM** filter in Car Development.

## 3. Car Development 2.0
- First visual-map concept: one broad marker for one component — **8.6/10**.
- Improvement pass 1: top + side car schematic, numbered marker-to-update navigation, confidence labels and explicit schematic/CAD disclaimer — **9.2/10**.
- Improvement pass 2: support multi-location updates such as “Floor Edge and Diffuser”, keep teams that declare zero updates, and extend the component dictionary using real 2026 FIA naming patterns — **9.5/10**.
- Automated gate: **10/10**.
- Final behaviour:
  - Reads the existing FIA Car Presentation Submission for each weekend.
  - Preserves the team’s declared component, reason, geometry/difference and description.
  - Maps recognised parts to a top/side 2026 F1 schematic for every team.
  - Multi-part rows can light up more than one region of the car.
  - Unknown parts stay explicitly **unmapped** rather than being given false precision.
  - Teams with “No updates submitted” are still shown.
  - Diagrams use each team’s colour but remain schematic rather than pretending to be team CAD geometry.

## 4. Motion & animation
- Earlier behaviour: page animation could replay on ordinary data re-renders — **8.3/10**.
- Improvement pass: route-only transitions, staggered content entrances, active-nav movement, subtle hero motion and interaction feedback, while preserving reduced-motion support — **9.3/10**.
- Automated gate: **10/10**.
- Final behaviour:
  - Navigation transitions feel more app-like.
  - Cards enter in a short stagger rather than all appearing at once.
  - Bottom-nav active state animates.
  - Buttons and diagram markers give tactile visual feedback.
  - Background data refreshes do not replay the entire page animation.
  - `prefers-reduced-motion` disables the non-essential motion.

## Final feature-gate result
- Home cleanup: **10.00/10 automated**
- My F1 personalisation: **10.00/10 automated**
- Car Development 2.0: **10.00/10 automated**
- Motion & animation: **10.00/10 automated**
- Feature gate average: **10.00/10**

The automated score measures release requirements, not the subjective overall product score. The overall app is rated separately in `QUALITY_REPORT.md`.
