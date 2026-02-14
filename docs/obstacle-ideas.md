# Obstacle Brainstorm

Design goals:
- Mix static blockers and moving threats so moment-to-moment decisions stay fresh.
- Keep readability high: every obstacle should have a clear silhouette and short telegraph.
- Tie rarity to emotional spikes: common pressure, rare surprises, super-rare memorable set pieces.

## 1) Standard (usually on screen)

### Static
- **Cracked Sidewalk Slab**: Slightly raised tile that acts as a low hop check.
- **Trash Bag Cluster**: Wide, low obstacle that tempts longer jumps and punishes late timing.
- **Construction Cone Pair**: Two cones with a narrow safe lane between for precision movement.
- **Puddle Patch**: Slows player briefly on contact, making nearby hazards harder.
- **Mail Crate Stack**: Mid-height block forcing a jump or route around if lanes exist.

### Moving
- **Rolling Skateboard**: Crosses one lane quickly from side to side.
- **Jogger Crossing**: Predictable path with a short warning whistle animation.
- **Bouncing Ball**: Rhythmic vertical bounce; can be passed under at the right beat.
- **Delivery Cart Drift**: Moves slowly but occupies a wide area for lane pressure.
- **Squirrel Zigzag**: Fast erratic dash with light homing toward the player lane.

## 2) Rare (seen every 10-20 seconds)

### Static
- **Fence Segment**: Taller obstacle requiring a full-height jump.
- **Open Manhole**: Circular pit with tiny rim margin for near misses.
- **Wet Paint Zone**: Slippery strip that reduces turn control for 1-2 seconds.
- **Fallen Signboard**: Angled surface that can launch a higher jump if hit correctly.
- **Glass Debris Field**: Damage-over-time zone that encourages rerouting.

### Moving
- **Street Sweeper Pass**: Large vehicle entering from edge, occupying multiple lanes.
- **Drone Package Drop**: Target marker appears, then crate lands after a delay.
- **Leashed Dog Lunge**: Extends into path then retracts, creating timing windows.
- **Scooter Rider**: Fast diagonal mover that cuts off obvious safe routes.
- **Crow Flock Sweep**: Air hazard wave that forces duck/low profile movement.

## 3) Super Rare (seen every 1-10 minutes)

### Static
- **Collapsed Scaffolding**: Multi-part structure creating a short obstacle gauntlet.
- **Roadwork Trench**: Long gap requiring chained jumps or a temporary bridge pickup.
- **Power-Line Arc Zone**: Pulsing electrified area with on/off rhythm.
- **Blocked Intersection**: Massive barricade that opens one hidden safe lane.
- **Statue Base Rubble**: Irregular shape that creates unique parkour-like lines.

### Moving
- **Runaway Parade Float**: Slow giant mover with rotating protrusions.
- **Garbage Truck Reverse Event**: Wide backing movement with beep telegraph and lane squeeze.
- **Helicopter Downdraft**: Moving wind zone that pushes player laterally.
- **Mini Boss Bulldog**: Chasing obstacle with phased behavior (charge, feint, rest).
- **Train Crossing Burst**: High-speed lateral pass that briefly splits arena zones.

## 4) Mythic/Event Obstacles (optional fourth category for milestone moments)

> Use for score milestones, daily challenge mode, or seasonal events.

### Static
- **Mirror Maze Gate**: Distorts lane indicators for a short duration.
- **Frozen Street Tile Set**: Chain of low-friction tiles requiring momentum control.
- **Ancient Bell Tower Debris**: Falling pattern puzzle that repeats every few seconds.

### Moving
- **Meteor Shard Rain**: Randomized impact circles with escalating cadence.
- **Shadow Doppelganger**: Mimics player movement with delayed offset, blocking expected paths.
- **Festival Dragon Sweep**: Serpentine moving wall with predictable wave pockets.

## Spawn & tuning suggestions
- Keep **2-3 standard obstacles** visible at most times.
- Add a **rare roll** every 8-12 seconds, with cooldown to keep average around 10-20 seconds.
- Add a **super-rare roll** every 30 seconds with low success probability and anti-clumping.
- For mythic/event, trigger by explicit state (score threshold, timer, challenge mode).
- Avoid stacking two movement-heavy hazards without a recovery beat.
