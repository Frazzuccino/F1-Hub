# F1 Hub v1.16.0 — Feature Scorecard

This release used the same acceptance rule as before: each requested change needed to reach **at least 9/10** in its own review gate before it was accepted into the build.

| Update | First-pass score | What held it back | Final score |
|---|---:|---|---:|
| Car Updates schematic fidelity | 7.8/10 | The previous top/side silhouette was cleaner than the old boxy draft, but still did not read enough like a real modern F1 car. | **9.3/10** |
| Launch intro timing + transition smoothness | 7.2/10 | The intro disappeared too quickly and the hand-off into the home screen felt abrupt. | **9.4/10** |
| Left/right swipe reliability | 7.0/10 | Fast flicks could end before the target route had been resolved, so some swipes appeared to do nothing. | **9.2/10** |
| Driver Compare refresh | 6.9/10 | The old compare view was too text-heavy and lacked richer graphics. | **9.4/10** |
| Past Grand Prix race weather | 8.1/10 | Historic weekends still behaved too much like a forecast screen instead of showing the weather at race time. | **9.8/10** |

## What changed before acceptance

### Car Updates schematic
The schematic was redrawn again using a more technical line-art style so it visually lands closer to the provided reference image. The top and side views now use slimmer nose/body proportions, clearer wheels, suspension, halo, airbox and rear-wing structure, with subtler blueprint-style grid lines behind them. The mapping markers remain interactive.

### Launch intro
The intro display time was extended so the summary can actually be read. The transition now has a smoother two-stage hand-off: the intro fades/slides away while the main app shell reveals underneath with its own motion, rather than simply disappearing.

### Swipe navigation
The gesture logic now tolerates quick flicks better. On touch end, the destination is re-evaluated even if the user moved quickly enough that only minimal `touchmove` events fired. The distance and velocity thresholds were also made more permissive while keeping interactive controls excluded.

### Driver Compare
The compare page was rebuilt into a richer dashboard with:
- driver hero cards,
- head-to-head summary tiles,
- a radar-style season profile graphic,
- refreshed metric bars,
- and the existing points-evolution chart.

### Past-race weather
Completed race weekends now collapse to the **Race** session for the weather card, and use Open-Meteo's archive endpoint so the card shows recorded conditions at race time instead of a generic session chooser/forecast treatment.

## Final release judgement

**Feature-quality average: 9.42/10**

That average is deliberately below 10/10 because gesture feel and motion polish are still best judged on the real target Android phone, even though the build passed the automated release gates.
