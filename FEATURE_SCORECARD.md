# F1 Hub v1.14.0 — Feature Scorecard

The user-requested changes were assessed independently. A feature was not accepted for release below 9/10.

| Update | Initial review / gate | Final subjective score | Automated gate |
|---|---:|---:|---:|
| Car Development parsing & mapping | Existing v1.13 behaviour failed on flattened FIA text | 9.7/10 | 10.00/10 |
| Favourite cleanup (Standings + News) | 9.2/10 | 9.8/10 | 10.00/10 |
| Swipe navigation | 8.7/10 prototype | 9.5/10 | 10.00/10 |
| More hierarchy | 9.1/10 | 9.6/10 | 10.00/10 |
| Driver career history | 9.0/10 | 9.4/10 | 10.00/10 |
| Session-selectable weather | 9.1/10 | 9.5/10 | 10.00/10 |
| Race Calendar redesign | 8.0/10 first gate | 9.6/10 | 10.00/10 |

## Iterations made before acceptance

### Car Development
The v1.13 parser expected table-like rows. The current FIA Car Presentation Submission can be extracted as flattened text, which caused update-bearing teams to disappear while an explicit “No updates submitted” team remained visible. v1.14 adds a second parser for the flattened structure, retains the table parser, explicitly keeps parse-warning teams, and adds aliases for current component terminology such as Forward Floor Board Stay.

A regression fixture modelled on the current Italian GP submission checks all 11 teams: ten update-bearing teams plus Audi with an explicit zero-update declaration.

### Swipe navigation
The first design was scored below 9 because a global horizontal gesture could conflict with vertical pull-to-refresh and controls such as weather tabs. The final implementation uses axis discrimination, edge resistance, excludes links/buttons/forms/maps/car schematics/session tabs, gives direct finger-follow visual feedback, and uses directional route transitions after release.

### Race Calendar
The first feature gate scored 8/10. The final version adds a continuous season rail through month/card gaps, a clearer season-progress header, circuit silhouettes, next-round emphasis, status states, spoiler-safe completed-race copy, sibling dimming and an animated selected-card transition before entering the Race Hub.

## Final feature-gate result

```text
Car Development parsing & mapping  10/10
Favourite cleanup                  10/10
Swipe navigation                   10/10
More hierarchy                     10/10
Driver career history              10/10
Session weather                    10/10
Race Calendar redesign             10/10

FEATURE GATE AVERAGE: 10.00/10
```
