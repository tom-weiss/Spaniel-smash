# Spaniel Smash

## Obstacle Behavior

`obstacleId` is catalog metadata only. Runtime mechanics are keyed by `entity.type` (and `behaviorState` for timed/pulsed behaviors).
`v1.1.22` keeps the level-staggered obstacle sets and latest sprite updates, refreshes splash-screen character icons, and further polishes rendering: crash sprites now follow the current slimmer character style and the invulnerability force field is now centered to the current player sprite footprint.

| Picture | Obstacle Type | Frequency Category | Movement | Player Collision | Jump Interaction | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| ![tree](docs/images/obstacles/tree.svg) | `tree` | `standard`, `rare`, `super-rare`, `mythic` | Moves vertically down slope. No lane switching. | Loses 1 life and triggers crash freeze (`650ms`) unless jump-clear applies. | Can clear only if jump is active and `jumpRule` is `low` or `high`. | Uses narrower tree collision bounds. Rendered as a pointed, layered conifer silhouette. |
| ![rock](docs/images/obstacles/rock.svg) | `rock` | `standard`, `rare`, `super-rare`, `mythic` | Moves vertically down slope. No lane switching. | Loses 1 life and triggers crash freeze unless jump-clear applies. | Can be cleared while jump is active. | Uses tighter collision bounds than its sprite extents. |
| ![skier](docs/images/obstacles/skier.svg) | `skier` | `standard` (`level 2+`), `rare` (`level 3+`), `mythic` | Moving obstacle with random lane-change attempts + cooldown. | Loses 1 life and triggers crash freeze unless jump-clear applies. | Can clear if jump is active and `jumpRule` is `low` or `high`. | Standard moving hazard behavior. |
| ![naked skier](docs/images/obstacles/naked-skier.svg) | `naked-skier` | `super-rare` (`level 4+`) | Moving obstacle with random lane-change attempts + cooldown. | Loses 1 life and triggers crash freeze unless jump-clear applies. | Can clear if jump is active and `jumpRule` is `low` or `high`. | Very rare variant unlocked on higher levels. |
| ![spaniel](docs/images/obstacles/spaniel.svg) | `spaniel` | `standard`, `rare`, `mythic` | Moving obstacle with random lane-change attempts + cooldown. | Gives `+100`, smash effects, and spawns `bloodstain` (no life loss). | N/A for score collision path. | Smashed count advances the current level toward the Andy boss trigger (`10-15` spaniels per level). Spaniel bodies are non-lethal for obstacle-vs-obstacle mover crash checks. Tail wag is visual-only. |
| ![black spaniel](docs/images/obstacles/black-spaniel.svg) | `black-spaniel` | `rare` (`level 2+`) | Moving obstacle with random lane-change attempts + cooldown. | Gives `+200`, smash effects, and spawns `bloodstain` (no life loss). | N/A for score collision path. | Rare double-point spaniel variant; still counts toward boss spaniel goals. |
| ![slalom poles](docs/images/obstacles/slalom-poles.svg) | `slalom-poles` | `standard` (all levels) | Static obstacle (no lane switching). | Loses 1 life and triggers crash freeze unless jump-clear applies. | Can clear while jump is active (`jumpRule: low`). | Common lane hazard to increase baseline obstacle variety. |
| ![ice crevasse](docs/images/obstacles/ice-crevasse.svg) | `ice-crevasse` | `rare` (`level 2+`) | Static wide hazard spanning multiple lanes. | Loses 1 life and triggers crash freeze unless jump-clear applies. | Intended jump obstacle (`jumpRule: high`) and should be jumped over. | Wider-than-lane obstacle used as a rare jump check. |
| ![andy](docs/images/obstacles/andy.svg) | `andy` | `boss encounter` | Flies in from top, hovers for ~`20s`, tracks lanes while airborne, then exits toward the bottom if not defeated. | Direct contact removes a life (unless invulnerable). Jumping into Andy defeats the boss and grants `+1800`. | Boss-defeat requires jump collision at overlap timing. | Rendered as a black witch on a broomstick; gameplay behavior is unchanged. Flying Andy does not convert from obstacle-vs-obstacle collisions and throws `poo-bag` projectiles during hover. Music switches to a more intense boss motif while Andy is active. |
| ![poo bag](docs/images/obstacles/poo-bag.svg) | `poo-bag` | `event-driven` | Spawned by Andy and falls down the slope lane. | On hit: brown splat effect + life loss (unless invulnerable). | Not jump-clear specific. | Spawn cadence is controlled by Andy boss throw cooldown. |
| ![bloodstain](docs/images/obstacles/bloodstain.svg) | `bloodstain` | `event-driven` | Drifts vertically down slope. | No life loss; ignored by collision damage checks. | N/A | Spawned from spaniel smash/collision remains and is inert for obstacle-vs-obstacle mover crash transforms. |
| ![puddle patch](docs/images/obstacles/puddle-patch.svg) | `puddle-patch` | `rare` (`level 2+`) | Static patch obstacle (no lane switching). | Applies slowdown effect for `900ms`; no life loss from patch contact. | No slowdown is applied while jumping over it. | Patch persists after contact; repeated grounded patch hits stack slow intensity/duration (with caps). Non-lethal for mover crash transforms. |
| ![ice patch](docs/images/obstacles/ice-patch.svg) | `ice-patch` | `standard` (`level 2+`) | Static patch obstacle (no lane switching). | Applies speed-boost effect for `1400ms`; no life loss from patch contact. | No speed boost is applied while jumping over it. | Patch persists after contact; repeated grounded patch hits stack boost intensity/duration (with caps). Non-lethal for mover crash transforms. |
| ![drone package drop](docs/images/obstacles/drone-package-drop.svg) | `drone-package-drop` | `rare` (`level 3+`) | Starts in telegraph phase, then transitions to falling crate. | Telegraph phase is harmless. Falling phase behaves as damaging obstacle. | Can be jump-cleared in falling phase via low jump rule. | Telegraph duration: `650ms`. Telegraph phase is non-lethal for mover crash transforms; falling crate is lethal. |
| ![helicopter downdraft](docs/images/obstacles/helicopter-downdraft.svg) | `helicopter-downdraft` | `super-rare` (`level 3+`) | Moving obstacle with random lane-change attempts + push pulses. | Wind push itself does not remove lives; direct body collision still does. | Uses `jumpRule: none` by default. | Pushes player laterally every `180ms` while overlap band is active. |

## Level & Survival Flow

- Level 1 uses a slower base spawn cadence and biases standard spawns toward `spaniel`, so non-spaniel hazards are less frequent at the start.
- Obstacle pools are staggered by level: simpler hazards dominate level 1, with `black-spaniel`/`ice-crevasse` starting at level 2 and `naked-skier` joining at level 4.
- Obstacle spawn cadence tightens every level (with a lower cap), so total obstacle pressure increases as the run progresses.
- Baseline downhill speed also scales up each level, before puddle/ice modifiers are applied.
- Andy boss appears once the level spaniel target is reached (`10-15` range; first level target starts at `12`).
- If Andy is defeated by jump-smash or leaves the screen, the level always advances; on level-up, lives reset to `3`.
- Boss exit completion is evaluated on post-move position each frame so edge-of-screen exits cannot miss level transition.
- Andy throws `poo-bag` projectiles faster on later levels via level-scaled throw cooldowns.
- Level-up now includes a pulse + sparkle celebration animation behind the banner.
- After level-up, spawn pacing speeds up briefly for a faster transition.
- Player invulnerability windows:
  - `2.6s` on level-up transitions (levels after level 1),
  - `2.2s` after each non-lethal crash respawn.
- Crash freeze now consumes none of the respawn invulnerability timer, and the force field appears once player movement resumes.
- While invulnerable, the player is surrounded by a flashing green force field.

## Controls

- Touch controls suppress long-press and gesture defaults to reduce accidental viewport zoom on mobile Safari while holding movement/jump buttons.

Tier cadence reference: baseline spawn starts at about `540ms` on level 1, tightens by roughly `32ms` per level down to about `240ms`, and uses a faster post-level transition burst (down to about `210ms` floor). `rare` remains about every `10-20s`, `super-rare` about every `60-600s`, and `mythic` about every `30-90s` after mythic unlock.
