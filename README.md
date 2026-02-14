# Spaniel Smash

## Obstacle Behavior

`obstacleId` is catalog metadata only. Runtime mechanics are keyed by `entity.type` (and `behaviorState` for timed/pulsed behaviors).

| Picture | Obstacle Type | Frequency Category | Movement | Player Collision | Jump Interaction | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ![tree](docs/images/obstacles/tree.svg) | `tree` | `standard`, `rare`, `super-rare`, `mythic` | Moves vertically down slope. No lane switching. | Loses 1 life and triggers crash freeze (`650ms`) unless jump-clear applies. | Can clear only if jump is active and `jumpRule` is `low` or `high`. | Uses narrower tree collision bounds. |
| ![rock](docs/images/obstacles/rock.svg) | `rock` | `standard`, `rare`, `super-rare`, `mythic` | Moves vertically down slope. No lane switching. | Loses 1 life and triggers crash freeze unless jump-clear applies. | Can be cleared while jump is active. | Uses tighter collision bounds than its sprite extents. |
| ![skier](docs/images/obstacles/skier.svg) | `skier` | `standard`, `rare`, `mythic` | Moving obstacle with random lane-change attempts + cooldown. | Loses 1 life and triggers crash freeze unless jump-clear applies. | Can clear if jump is active and `jumpRule` is `low` or `high`. | Standard moving hazard behavior. |
| ![spaniel](docs/images/obstacles/spaniel.svg) | `spaniel` | `standard`, `rare`, `mythic` | Moving obstacle with random lane-change attempts + cooldown. | Gives `+100`, smash effects, and spawns `bloodstain` (no life loss). | N/A for score collision path. | Every 10 smashed spaniels increases speed level and toggles witch attack flow. |
| ![andy](docs/images/obstacles/andy.svg) | `andy` | `standard`, `rare`, `super-rare`, `mythic` | Moving obstacle with lane pursuit toward player. | Loses 1 life and triggers crash freeze. Also clears active witch attack on hit. | Can clear if jump is active and `jumpRule` is `low` or `high`. | Uses pursuit lane logic instead of random switching. |
| ![bloodstain](docs/images/obstacles/bloodstain.svg) | `bloodstain` | `event-driven` | Drifts vertically down slope. | No life loss; ignored by collision damage checks. | N/A | Spawned from spaniel smash/collision remains. |
| ![puddle patch](docs/images/obstacles/puddle-patch.svg) | `puddle-patch` | `rare` | Static patch obstacle (no lane switching). | Applies slowdown effect for `900ms`; no life loss from patch contact. | Not jump-clear relevant. | Patch persists after contact; slows world scroll speed and increases lane-switch/jump cooldown while active. |
| ![ice patch](docs/images/obstacles/ice-patch.svg) | `ice-patch` | `standard` | Static patch obstacle (no lane switching). | Applies speed-boost effect for `1400ms`; no life loss from patch contact. | Not jump-clear relevant. | Patch persists after contact; speeds up world scroll and reduces lane-switch/jump cooldown while active. |
| ![drone package drop](docs/images/obstacles/drone-package-drop.svg) | `drone-package-drop` | `rare` | Starts in telegraph phase, then transitions to falling crate. | Telegraph phase is harmless. Falling phase behaves as damaging obstacle. | Can be jump-cleared in falling phase via low jump rule. | Telegraph duration: `650ms`. |
| ![helicopter downdraft](docs/images/obstacles/helicopter-downdraft.svg) | `helicopter-downdraft` | `super-rare` | Moving obstacle with random lane-change attempts + push pulses. | Wind push itself does not remove lives; direct body collision still does. | Uses `jumpRule: none` by default. | Pushes player laterally every `180ms` while overlap band is active. |

Tier cadence reference: `standard` fallback every spawn cycle (`450ms`), `rare` about every `10-20s`, `super-rare` about every `60-600s`, and `mythic` about every `30-90s` after mythic unlock.
