export type EntityType =
  | "tree"
  | "rock"
  | "skier"
  | "spaniel"
  | "andy"
  | "poo-bag"
  | "bloodstain"
  | "puddle-patch"
  | "ice-patch"
  | "drone-package-drop"
  | "helicopter-downdraft";
type ObstacleTier = "standard" | "rare" | "super-rare" | "mythic";
type JumpRule = "none" | "low" | "high";
type DroneDropPhase = "telegraph" | "falling";
type AndyBossPhase = "entering" | "hovering" | "exiting";
type BehaviorState =
  | { kind: "droneDrop"; phase: DroneDropPhase; phaseMs: number }
  | { kind: "downdraft"; pushDirection: 1 | -1; pushCooldownMs: number }
  | { kind: "andyBoss"; phase: AndyBossPhase; phaseMs: number; throwCooldownMs: number };

interface ObstacleTemplate {
  type: EntityType;
  obstacleId: string;
  jumpRule: JumpRule;
  widthScale: number;
  height: number;
  speed: number;
  moving: boolean;
}

const STANDARD_OBSTACLES: ObstacleTemplate[] = [
  { type: "tree", obstacleId: "cracked-sidewalk-slab", jumpRule: "low", widthScale: 0.5, height: 24, speed: 2.2, moving: false },
  { type: "rock", obstacleId: "trash-bag-cluster", jumpRule: "low", widthScale: 0.55, height: 22, speed: 2.2, moving: false },
  { type: "tree", obstacleId: "construction-cone-pair", jumpRule: "low", widthScale: 0.52, height: 24, speed: 2.2, moving: false },
  { type: "ice-patch", obstacleId: "ice-patch", jumpRule: "none", widthScale: 0.58, height: 20, speed: 2.2, moving: false },
  { type: "tree", obstacleId: "mail-crate-stack", jumpRule: "high", widthScale: 0.58, height: 32, speed: 2.2, moving: false },
  { type: "skier", obstacleId: "rolling-skateboard", jumpRule: "low", widthScale: 0.56, height: 28, speed: 1.6, moving: true },
  { type: "skier", obstacleId: "jogger-crossing", jumpRule: "none", widthScale: 0.56, height: 30, speed: 1.4, moving: true },
  { type: "spaniel", obstacleId: "bouncing-ball", jumpRule: "low", widthScale: 0.45, height: 18, speed: 1.7, moving: true },
  { type: "spaniel", obstacleId: "squirrel-zigzag", jumpRule: "none", widthScale: 0.5, height: 22, speed: 1.8, moving: true }
];

const RARE_OBSTACLES: ObstacleTemplate[] = [
  { type: "tree", obstacleId: "fence-segment", jumpRule: "high", widthScale: 0.62, height: 36, speed: 2.3, moving: false },
  { type: "rock", obstacleId: "open-manhole", jumpRule: "high", widthScale: 0.6, height: 28, speed: 2.3, moving: false },
  { type: "puddle-patch", obstacleId: "puddle-patch", jumpRule: "none", widthScale: 0.52, height: 20, speed: 2.2, moving: false },
  { type: "skier", obstacleId: "fallen-signboard", jumpRule: "high", widthScale: 0.62, height: 30, speed: 1.5, moving: true },
  { type: "rock", obstacleId: "glass-debris-field", jumpRule: "low", widthScale: 0.58, height: 22, speed: 2.3, moving: false },
  { type: "drone-package-drop", obstacleId: "drone-package-drop", jumpRule: "low", widthScale: 0.54, height: 24, speed: 2.1, moving: false },
  { type: "spaniel", obstacleId: "leashed-dog-lunge", jumpRule: "none", widthScale: 0.52, height: 22, speed: 1.7, moving: true },
  { type: "skier", obstacleId: "scooter-rider", jumpRule: "none", widthScale: 0.58, height: 32, speed: 2.0, moving: true }
];

const SUPER_RARE_OBSTACLES: ObstacleTemplate[] = [
  { type: "tree", obstacleId: "collapsed-scaffolding", jumpRule: "high", widthScale: 0.75, height: 40, speed: 2.5, moving: false },
  { type: "rock", obstacleId: "roadwork-trench", jumpRule: "high", widthScale: 0.76, height: 40, speed: 2.45, moving: false },
  { type: "tree", obstacleId: "blocked-intersection", jumpRule: "none", widthScale: 0.8, height: 38, speed: 2.3, moving: false },
  { type: "rock", obstacleId: "statue-base-rubble", jumpRule: "high", widthScale: 0.72, height: 34, speed: 2.4, moving: false },
  { type: "helicopter-downdraft", obstacleId: "helicopter-downdraft", jumpRule: "none", widthScale: 0.66, height: 32, speed: 1.8, moving: true }
];

const MYTHIC_OBSTACLES: ObstacleTemplate[] = [
  { type: "skier", obstacleId: "mirror-maze-gate", jumpRule: "none", widthScale: 0.66, height: 32, speed: 1.7, moving: true },
  { type: "spaniel", obstacleId: "frozen-street-tile-set", jumpRule: "low", widthScale: 0.6, height: 20, speed: 1.6, moving: true },
  { type: "tree", obstacleId: "ancient-bell-tower-debris", jumpRule: "high", widthScale: 0.7, height: 36, speed: 2.4, moving: false },
  { type: "rock", obstacleId: "meteor-shard-rain", jumpRule: "high", widthScale: 0.66, height: 30, speed: 2.4, moving: false }
];

export interface Entity {
  id?: number;
  type: EntityType;
  obstacleId?: string;
  obstacleTier?: ObstacleTier;
  jumpRule?: JumpRule;
  behaviorState?: BehaviorState;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  lane?: number;
  laneSwitchCooldownMs?: number;
  direction?: 1 | -1;
  crashAnimationMs?: number;
}

export interface SmashEffect {
  kind: "spaniel-smash" | "obstacle-crash" | "coin-pop" | "poo-splat";
  x: number;
  y: number;
  ttlMs: number;
  maxTtlMs: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump?: boolean;
}

export interface ActiveEffectsSnapshot {
  puddleSlowMs: number;
  wetPaintSlipMs: number;
}

export interface GameSnapshot {
  lives: number;
  score: number;
  speedLevel: number;
  spanielsSmashed: number;
  levelSpanielsSmashed: number;
  nextBossSpanielGoal: number;
  isGameOver: boolean;
  playerX: number;
  playerY: number;
  playerJumpOffset: number;
  isPlayerImmortal: boolean;
  isCrashActive: boolean;
  isBossActive: boolean;
  levelUpBannerMs: number;
  sideObstacleOffsetY: number;
  activeEffects: ActiveEffectsSnapshot;
  entities: ReadonlyArray<Entity>;
  effects: ReadonlyArray<SmashEffect>;
}

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SideDecorationPlacement {
  kind: "tree" | "rock";
  x: number;
  y: number;
  bounds: Bounds;
}

export class SpanielSmashGame {
  private width: number;
  private height: number;
  private laneCount: number;
  private laneWidth: number;
  private playerLane: number;
  private lives = 3;
  private score = 0;
  private speedLevel = 1;
  private spanielsSmashed = 0;
  private levelSpanielsSmashed = 0;
  private gameOver = false;
  private andyBossActive = false;
  private entities: Entity[] = [];
  private effects: SmashEffect[] = [];
  private rng: () => number;
  private spawnClock = 0;
  private rareSpawnClock = 0;
  private superRareSpawnClock = 0;
  private mythicSpawnClock = 0;
  private nextRareSpawnMs = 12000;
  private nextSuperRareSpawnMs = 180000;
  private nextMythicSpawnMs = 45000;
  private laneSwitchCooldownMs = 0;
  private jumpCooldownMs = 0;
  private jumpTimerMs = 0;
  private crashFreezeMs = 0;
  private sideObstacleOffsetY = 0;
  private mythicUnlocked = false;
  private puddleSlowMs = 0;
  private wetPaintSlipMs = 0;
  private playerImmortalMs = 0;
  private levelUpBannerMs = 0;
  private levelTransitionBoostMs = 0;
  private nextBossSpanielGoal = 12;
  private nextEntityId = 1;
  private touchingSurfaceEntityIds = new Set<number>();

  private static readonly staticObstacleSpeed = 2.2;
  private static readonly movingEntityBaseSpeed = 1.2;
  private static readonly jumpDurationMs = 520;
  private static readonly puddleSlowDurationMs = 900;
  private static readonly icePatchBoostDurationMs = 1400;
  private static readonly droneTelegraphDurationMs = 650;
  private static readonly downdraftPushIntervalMs = 180;
  private static readonly andyBossEnterY = 58;
  private static readonly andyBossHoverDurationMs = 20000;
  private static readonly andyBossEnterSpeed = 2.05;
  private static readonly andyBossExitSpeed = 1.95;
  private static readonly andyBossLaneMoveMs = 240;
  private static readonly andyBossThrowMinMs = 820;
  private static readonly andyBossThrowMaxMs = 1500;
  private static readonly andyBossBonusScore = 1800;
  private static readonly levelStartImmortalMs = 2600;
  private static readonly respawnImmortalMs = 2200;
  private static readonly levelUpBannerDurationMs = 1400;
  private static readonly levelTransitionBoostDurationMs = 3800;
  private static readonly levelTransitionSpawnIntervalMs = 300;
  private static readonly baseSpawnIntervalMs = 450;
  private static readonly levelTransitionScrollMultiplier = 1.2;
  private static readonly pooBagSpeed = 2.8;
  private static readonly pooBagWidthScale = 0.34;
  private static readonly pooBagHeight = 16;
  private static readonly maxPuddleStackMs = 5400;
  private static readonly maxIceStackMs = 5600;
  private static readonly maxEffectStacks = 4;
  private static readonly defaultLaneSwitchCooldownMs = 140;
  private static readonly defaultJumpCooldownMs = 560;
  private static readonly puddleLaneSwitchCooldownMs = 280;
  private static readonly puddleJumpCooldownMs = 920;
  private static readonly iceLaneSwitchCooldownMs = 80;
  private static readonly iceJumpCooldownMs = 360;
  private static readonly puddleScrollSpeedMultiplier = 0.72;
  private static readonly iceScrollSpeedMultiplier = 1.35;

  constructor(width: number, height: number, rng: () => number = Math.random, laneCount = 20) {
    this.width = width;
    this.height = height;
    this.laneCount = laneCount;
    this.laneWidth = width / laneCount;
    this.rng = rng;
    this.playerLane = this.startingLane();
    this.nextRareSpawnMs = this.rollRareSpawnMs();
    this.nextSuperRareSpawnMs = this.rollSuperRareSpawnMs();
    this.nextMythicSpawnMs = this.rollMythicSpawnMs();
    this.playerImmortalMs = SpanielSmashGame.levelStartImmortalMs;
  }

  public step(deltaMs: number, input: InputState): void {
    if (this.gameOver) {
      return;
    }

    this.tickEffects(deltaMs);
    this.tickRuntimeTimers(deltaMs);

    if (this.crashFreezeMs > 0) {
      this.crashFreezeMs = Math.max(0, this.crashFreezeMs - deltaMs);
      return;
    }

    this.handleInput(input, deltaMs);
    this.spawnClock += deltaMs;
    const spawnIntervalMs = this.currentSpawnIntervalMs();
    while (this.spawnClock >= spawnIntervalMs) {
      this.spawnClock -= spawnIntervalMs;
      this.spawnEntity();
    }

    const speedMultiplier = (1 + (this.speedLevel - 1) * 0.2) * this.currentScrollSpeedMultiplier();
    this.sideObstacleOffsetY += SpanielSmashGame.staticObstacleSpeed * speedMultiplier * (deltaMs / 16.67);
    for (const entity of this.entities) {
      this.tickEntityBehaviorState(entity, deltaMs);
      this.maybeMoveEntityLane(entity, deltaMs);
      entity.y += entity.speed * (entity.direction ?? 1) * speedMultiplier * (deltaMs / 16.67);
      entity.x = this.laneX(this.entityLane(entity));
      entity.crashAnimationMs = Math.max(0, (entity.crashAnimationMs ?? 0) - deltaMs);
    }

    this.applyDowndraftPushes();
    this.resolveEntityCollisions();
    this.resolveCollisions();
    this.maybeStartBossEncounter();
    this.handleBossExitState();
    this.entities = this.entities.filter((entity) => entity.y < this.height + 40 && entity.y + entity.height > -40);
  }

  private handleInput(input: InputState, deltaMs: number): void {
    this.laneSwitchCooldownMs = Math.max(0, this.laneSwitchCooldownMs - deltaMs);
    this.jumpCooldownMs = Math.max(0, this.jumpCooldownMs - deltaMs);
    this.jumpTimerMs = Math.max(0, this.jumpTimerMs - deltaMs);
    const controls = this.currentControlProfile();

    if (input.jump && this.jumpCooldownMs === 0) {
      this.jumpTimerMs = SpanielSmashGame.jumpDurationMs;
      this.jumpCooldownMs = controls.jumpCooldownMs;
    }

    if (this.laneSwitchCooldownMs > 0) {
      return;
    }

    const laneSwitchCooldown = controls.laneSwitchCooldownMs;
    if (input.left && !input.right) {
      this.playerLane = Math.max(this.minPlayableLane(), this.playerLane - 1);
      this.laneSwitchCooldownMs = laneSwitchCooldown;
    }
    if (input.right && !input.left) {
      this.playerLane = Math.min(this.maxPlayableLane(), this.playerLane + 1);
      this.laneSwitchCooldownMs = laneSwitchCooldown;
    }
  }

  private currentControlProfile(): { laneSwitchCooldownMs: number; jumpCooldownMs: number } {
    const puddleStacks = this.effectStacks(this.puddleSlowMs, SpanielSmashGame.puddleSlowDurationMs);
    const iceStacks = this.effectStacks(this.wetPaintSlipMs, SpanielSmashGame.icePatchBoostDurationMs);
    const laneCooldown = SpanielSmashGame.defaultLaneSwitchCooldownMs
      + puddleStacks * (SpanielSmashGame.puddleLaneSwitchCooldownMs - SpanielSmashGame.defaultLaneSwitchCooldownMs)
      - iceStacks * (SpanielSmashGame.defaultLaneSwitchCooldownMs - SpanielSmashGame.iceLaneSwitchCooldownMs);
    const jumpCooldown = SpanielSmashGame.defaultJumpCooldownMs
      + puddleStacks * (SpanielSmashGame.puddleJumpCooldownMs - SpanielSmashGame.defaultJumpCooldownMs)
      - iceStacks * (SpanielSmashGame.defaultJumpCooldownMs - SpanielSmashGame.iceJumpCooldownMs);
    return {
      laneSwitchCooldownMs: Math.max(40, Math.min(520, Math.round(laneCooldown))),
      jumpCooldownMs: Math.max(180, Math.min(1600, Math.round(jumpCooldown)))
    };
  }

  private currentScrollSpeedMultiplier(): number {
    const puddleStacks = this.effectStacks(this.puddleSlowMs, SpanielSmashGame.puddleSlowDurationMs);
    const iceStacks = this.effectStacks(this.wetPaintSlipMs, SpanielSmashGame.icePatchBoostDurationMs);
    const levelTransition = this.levelTransitionBoostMs > 0 ? SpanielSmashGame.levelTransitionScrollMultiplier : 1;
    const effectSpeed = Math.pow(SpanielSmashGame.puddleScrollSpeedMultiplier, puddleStacks)
      * Math.pow(SpanielSmashGame.iceScrollSpeedMultiplier, iceStacks);
    return Math.max(0.35, Math.min(2.5, levelTransition * effectSpeed));
  }

  private currentSpawnIntervalMs(): number {
    if (this.levelTransitionBoostMs > 0) {
      return SpanielSmashGame.levelTransitionSpawnIntervalMs;
    }
    return SpanielSmashGame.baseSpawnIntervalMs;
  }

  private effectStacks(ms: number, durationMs: number): number {
    if (ms <= 0) {
      return 0;
    }
    return Math.min(SpanielSmashGame.maxEffectStacks, Math.ceil(ms / durationMs));
  }

  private spawnEntity(): void {
    const spawnLane = this.pickSpawnLane();
    const spawnX = this.laneX(spawnLane);
    const movingDirection = this.rng() < 0.5 ? 1 : -1;
    const movingSpawnY = movingDirection === 1 ? -26 : this.height + 26;
    const cadenceTickMs = this.currentSpawnIntervalMs();

    this.rareSpawnClock += cadenceTickMs;
    this.superRareSpawnClock += cadenceTickMs;
    this.mythicSpawnClock += cadenceTickMs;

    if (this.mythicUnlocked && this.mythicSpawnClock >= this.nextMythicSpawnMs) {
      this.mythicSpawnClock = 0;
      this.nextMythicSpawnMs = this.rollMythicSpawnMs();
      this.spawnTieredObstacle("mythic", spawnLane, spawnX, movingDirection, movingSpawnY);
      return;
    }

    if (this.superRareSpawnClock >= this.nextSuperRareSpawnMs) {
      this.superRareSpawnClock = 0;
      this.nextSuperRareSpawnMs = this.rollSuperRareSpawnMs();
      this.spawnTieredObstacle("super-rare", spawnLane, spawnX, movingDirection, movingSpawnY);
      return;
    }

    if (this.rareSpawnClock >= this.nextRareSpawnMs) {
      this.rareSpawnClock = 0;
      this.nextRareSpawnMs = this.rollRareSpawnMs();
      this.spawnTieredObstacle("rare", spawnLane, spawnX, movingDirection, movingSpawnY);
      return;
    }

    this.spawnTieredObstacle("standard", spawnLane, spawnX, movingDirection, movingSpawnY);
  }

  private spawnTieredObstacle(tier: ObstacleTier, spawnLane: number, spawnX: number, movingDirection: 1 | -1, movingSpawnY: number): void {
    const templates = tier === "standard" ? STANDARD_OBSTACLES : tier === "rare" ? RARE_OBSTACLES : tier === "super-rare" ? SUPER_RARE_OBSTACLES : MYTHIC_OBSTACLES;
    const template = templates[Math.floor(this.rng() * templates.length)] ?? templates[0];
    this.entities.push(this.makeEntityFromTemplate(template, tier, spawnLane, spawnX, movingDirection, movingSpawnY));
  }

  private makeEntityFromTemplate(template: ObstacleTemplate, tier: ObstacleTier, spawnLane: number, spawnX: number, movingDirection: 1 | -1, movingSpawnY: number): Entity {
    const behaviorState = this.createBehaviorState(template.type, movingDirection);
    const isLanePatch = template.type === "puddle-patch" || template.type === "ice-patch";
    const isDroneTelegraph = behaviorState?.kind === "droneDrop" && behaviorState.phase === "telegraph";
    const isMoving = template.moving && !isLanePatch && !isDroneTelegraph;
    const speedVariance = isMoving ? this.rng() * 0.35 : 0;
    return {
      id: this.nextEntityId++,
      type: template.type,
      obstacleId: template.obstacleId,
      obstacleTier: tier,
      jumpRule: template.jumpRule,
      behaviorState,
      x: spawnX,
      y: isDroneTelegraph ? this.playerY() + 8 : isMoving ? movingSpawnY : -24,
      width: this.laneWidth * template.widthScale,
      height: template.height,
      speed: isDroneTelegraph ? 0 : template.speed + speedVariance,
      lane: spawnLane,
      laneSwitchCooldownMs: 0,
      direction: isMoving ? movingDirection : 1,
      crashAnimationMs: 0
    };
  }

  private createBehaviorState(type: EntityType, movingDirection: 1 | -1): BehaviorState | undefined {
    if (type === "drone-package-drop") {
      return { kind: "droneDrop", phase: "telegraph", phaseMs: SpanielSmashGame.droneTelegraphDurationMs };
    }
    if (type === "helicopter-downdraft") {
      return { kind: "downdraft", pushDirection: movingDirection, pushCooldownMs: 0 };
    }
    return undefined;
  }

  private spawnAndyBoss(): void {
    const spawnLane = this.minPlayableLane() + Math.floor(this.rng() * (this.maxPlayableLane() - this.minPlayableLane() + 1));
    this.entities.push({
      id: this.nextEntityId++,
      type: "andy",
      obstacleId: "andy-boss",
      obstacleTier: "super-rare",
      jumpRule: "high",
      behaviorState: {
        kind: "andyBoss",
        phase: "entering",
        phaseMs: 0,
        throwCooldownMs: this.rollAndyThrowCooldownMs()
      },
      x: this.laneX(spawnLane),
      y: -52,
      width: this.laneWidth * 0.8,
      height: 34,
      speed: SpanielSmashGame.movingEntityBaseSpeed,
      lane: spawnLane,
      laneSwitchCooldownMs: 0,
      direction: 1,
      crashAnimationMs: 0
    });
    this.andyBossActive = true;
  }

  private maybeStartBossEncounter(): void {
    if (this.andyBossActive) {
      return;
    }
    if (this.levelSpanielsSmashed < this.nextBossSpanielGoal) {
      return;
    }
    this.spawnAndyBoss();
  }

  private handleBossExitState(): void {
    if (this.andyBossActive) {
      return;
    }
    if (this.entities.some((entity) => entity.type === "poo-bag" || (entity.type === "andy" && entity.behaviorState?.kind === "andyBoss"))) {
      this.entities = this.entities.filter((entity) => entity.type !== "poo-bag" && !(entity.type === "andy" && entity.behaviorState?.kind === "andyBoss"));
    }
  }

  private completeBossEncounter(defeated: boolean): void {
    if (!this.andyBossActive) {
      return;
    }
    this.andyBossActive = false;
    if (defeated) {
      this.score += SpanielSmashGame.andyBossBonusScore;
    }
    this.speedLevel += 1;
    this.levelSpanielsSmashed = 0;
    this.nextBossSpanielGoal = 10 + ((this.speedLevel - 1) % 6);
    this.levelUpBannerMs = SpanielSmashGame.levelUpBannerDurationMs;
    this.levelTransitionBoostMs = SpanielSmashGame.levelTransitionBoostDurationMs;
    this.playerImmortalMs = Math.max(this.playerImmortalMs, SpanielSmashGame.levelStartImmortalMs);
    this.spawnClock = Math.min(this.spawnClock, this.currentSpawnIntervalMs() - 1);
  }

  private spawnAndyPooBag(andy: Entity): void {
    const lane = this.playerLane;
    this.entities.push({
      id: this.nextEntityId++,
      type: "poo-bag",
      obstacleId: "andy-poo-bag",
      jumpRule: "none",
      x: this.laneX(lane),
      y: andy.y + andy.height - 2,
      width: this.laneWidth * SpanielSmashGame.pooBagWidthScale,
      height: SpanielSmashGame.pooBagHeight,
      speed: SpanielSmashGame.pooBagSpeed,
      lane,
      laneSwitchCooldownMs: 0,
      direction: 1,
      crashAnimationMs: 0
    });
  }

  private rollRareSpawnMs(): number { return 10000 + Math.floor(this.rng() * 10001); }
  private rollSuperRareSpawnMs(): number { return 60000 + Math.floor(this.rng() * 540001); }
  private rollMythicSpawnMs(): number { return 30000 + Math.floor(this.rng() * 60001); }
  private rollAndyThrowCooldownMs(): number {
    const span = SpanielSmashGame.andyBossThrowMaxMs - SpanielSmashGame.andyBossThrowMinMs;
    return SpanielSmashGame.andyBossThrowMinMs + Math.floor(this.rng() * (span + 1));
  }

  private tickRuntimeTimers(deltaMs: number): void {
    this.puddleSlowMs = Math.max(0, this.puddleSlowMs - deltaMs);
    this.wetPaintSlipMs = Math.max(0, this.wetPaintSlipMs - deltaMs);
    this.playerImmortalMs = Math.max(0, this.playerImmortalMs - deltaMs);
    this.levelUpBannerMs = Math.max(0, this.levelUpBannerMs - deltaMs);
    this.levelTransitionBoostMs = Math.max(0, this.levelTransitionBoostMs - deltaMs);
  }

  private tickEntityBehaviorState(entity: Entity, deltaMs: number): void {
    const behavior = entity.behaviorState;
    if (!behavior) {
      return;
    }

    if (behavior.kind === "droneDrop" && behavior.phase === "telegraph") {
      behavior.phaseMs = Math.max(0, behavior.phaseMs - deltaMs);
      if (behavior.phaseMs === 0) {
        behavior.phase = "falling";
        entity.y = -24;
        entity.speed = Math.max(entity.speed, SpanielSmashGame.staticObstacleSpeed + 0.3);
        entity.direction = 1;
      }
      return;
    }

    if (behavior.kind === "downdraft") {
      behavior.pushCooldownMs = Math.max(0, behavior.pushCooldownMs - deltaMs);
      return;
    }

    if (behavior.kind === "andyBoss") {
      const travelUnit = deltaMs / 16.67;
      behavior.throwCooldownMs = Math.max(0, behavior.throwCooldownMs - deltaMs);

      if (behavior.phase === "entering") {
        entity.speed = 0;
        entity.y += SpanielSmashGame.andyBossEnterSpeed * travelUnit;
        if (entity.y >= SpanielSmashGame.andyBossEnterY) {
          entity.y = SpanielSmashGame.andyBossEnterY;
          behavior.phase = "hovering";
          behavior.phaseMs = SpanielSmashGame.andyBossHoverDurationMs;
          behavior.throwCooldownMs = this.rollAndyThrowCooldownMs();
        }
        return;
      }

      if (behavior.phase === "hovering") {
        entity.speed = 0;
        behavior.phaseMs = Math.max(0, behavior.phaseMs - deltaMs);
        if (behavior.throwCooldownMs === 0) {
          this.spawnAndyPooBag(entity);
          behavior.throwCooldownMs = this.rollAndyThrowCooldownMs();
        }
        if (behavior.phaseMs === 0) {
          behavior.phase = "exiting";
          entity.speed = SpanielSmashGame.andyBossExitSpeed;
          entity.direction = 1;
        }
        return;
      }

      entity.speed = SpanielSmashGame.andyBossExitSpeed;
      entity.direction = 1;
      if (entity.y > this.height + 42) {
        this.completeBossEncounter(false);
      }
    }
  }

  private applyDowndraftPushes(): void {
    const playerTop = this.playerY() - this.playerJumpOffset();
    const playerBottom = playerTop + 34;
    for (const entity of this.entities) {
      const behavior = entity.behaviorState;
      if (!behavior || behavior.kind !== "downdraft") {
        continue;
      }
      if (behavior.pushCooldownMs > 0) {
        continue;
      }

      const overlapsBand = entity.y < playerBottom && entity.y + entity.height > playerTop;
      if (!overlapsBand) {
        continue;
      }

      const targetLane = this.playerLane + behavior.pushDirection;
      const clampedLane = Math.max(this.minPlayableLane(), Math.min(this.maxPlayableLane(), targetLane));
      if (clampedLane !== this.playerLane) {
        this.playerLane = clampedLane;
      }
      this.laneSwitchCooldownMs = Math.max(this.laneSwitchCooldownMs, 80);
      behavior.pushCooldownMs = SpanielSmashGame.downdraftPushIntervalMs;
    }
  }

  private canClearByJump(entity: Entity): boolean {
    if (this.jumpTimerMs <= 0) {
      return false;
    }
    if (entity.type === "rock") {
      return true;
    }
    return entity.jumpRule === "low" || entity.jumpRule === "high";
  }

  private resolveCollisions(): void {
    const player = this.playerCollisionBounds();
    const survivors: Entity[] = [];
    const nextTouchingSurfaceEntityIds = new Set<number>();

    for (const entity of this.entities) {
      if (entity.type === "bloodstain") {
        survivors.push(entity);
        continue;
      }

      if (!intersects(player, this.entityCollisionBounds(entity))) {
        survivors.push(entity);
        continue;
      }

      if (entity.type === "puddle-patch") {
        const id = entity.id ?? -1;
        if (id >= 0) {
          nextTouchingSurfaceEntityIds.add(id);
        }
        if (id < 0 || !this.touchingSurfaceEntityIds.has(id)) {
          this.puddleSlowMs = Math.min(
            SpanielSmashGame.maxPuddleStackMs,
            this.puddleSlowMs + SpanielSmashGame.puddleSlowDurationMs
          );
        }
        survivors.push(entity);
        continue;
      }

      if (entity.type === "ice-patch") {
        const id = entity.id ?? -1;
        if (id >= 0) {
          nextTouchingSurfaceEntityIds.add(id);
        }
        if (id < 0 || !this.touchingSurfaceEntityIds.has(id)) {
          this.wetPaintSlipMs = Math.min(
            SpanielSmashGame.maxIceStackMs,
            this.wetPaintSlipMs + SpanielSmashGame.icePatchBoostDurationMs
          );
        }
        survivors.push(entity);
        continue;
      }

      if (entity.type === "drone-package-drop" && entity.behaviorState?.kind === "droneDrop" && entity.behaviorState.phase === "telegraph") {
        survivors.push(entity);
        continue;
      }

      if (entity.type === "spaniel") {
        this.spawnSmashEffect(entity.x, entity.y, "spaniel-smash");
        this.spawnSmashEffect(entity.x, entity.y, "coin-pop");
        this.spawnBloodstain(entity);
        this.score += 100;
        this.spanielsSmashed += 1;
        this.levelSpanielsSmashed += 1;
        this.mythicUnlocked = this.mythicUnlocked || this.spanielsSmashed >= 25;
        continue;
      }

      if (entity.type === "andy" && entity.behaviorState?.kind === "andyBoss" && this.canClearByJump(entity)) {
        this.spawnSmashEffect(entity.x, entity.y, "spaniel-smash");
        this.spawnSmashEffect(entity.x, entity.y, "coin-pop");
        this.completeBossEncounter(true);
        continue;
      }

      if (entity.type === "poo-bag") {
        this.spawnSmashEffect(entity.x, entity.y, "poo-splat");
        this.damagePlayer();
        continue;
      }

      if (this.canClearByJump(entity)) {
        survivors.push(entity);
        continue;
      }

      if (this.playerImmortalMs > 0) {
        survivors.push(entity);
        continue;
      }

      this.damagePlayer();
      if (entity.type === "andy") {
        survivors.push(entity);
      }
    }

    this.touchingSurfaceEntityIds = nextTouchingSurfaceEntityIds;
    this.entities = survivors;
  }

  private damagePlayer(): void {
    if (this.playerImmortalMs > 0) {
      return;
    }
    this.lives -= 1;
    this.crashFreezeMs = 650;
    if (this.lives <= 0) {
      this.gameOver = true;
      return;
    }
    this.playerImmortalMs = SpanielSmashGame.respawnImmortalMs;
  }

  private playerCollisionBounds(): Bounds {
    const x = this.playerX();
    const y = this.playerY() - this.playerJumpOffset();
    const width = this.laneWidth * 0.56;
    const height = 34;
    return {
      x: x + width * 0.08,
      y: y + 2,
      width: width * 0.84,
      height: height - 4
    };
  }

  private entityCollisionBounds(entity: Entity): Bounds {
    const bounds = { x: entity.x, y: entity.y, width: entity.width, height: entity.height };
    if (entity.type === "rock" || entity.type === "drone-package-drop") {
      return {
        x: bounds.x + bounds.width * 0.12,
        y: bounds.y + bounds.height * 0.18,
        width: bounds.width * 0.76,
        height: bounds.height * 0.58
      };
    }

    if (entity.type === "poo-bag") {
      return {
        x: bounds.x + bounds.width * 0.18,
        y: bounds.y + bounds.height * 0.18,
        width: bounds.width * 0.64,
        height: bounds.height * 0.64
      };
    }

    if (entity.type === "tree") {
      return {
        x: bounds.x + bounds.width * 0.06,
        y: bounds.y + bounds.height * 0.1,
        width: bounds.width * 0.88,
        height: bounds.height * 0.86
      };
    }

    return bounds;
  }

  private resolveEntityCollisions(): void { /* unchanged below */
    const indicesToTransform = new Set<number>();
    for (let i = 0; i < this.entities.length; i += 1) {
      for (let j = i + 1; j < this.entities.length; j += 1) {
        const first = this.entities[i];
        const second = this.entities[j];
        if (first.type === "andy" || second.type === "andy" || first.type === "poo-bag" || second.type === "poo-bag" || first.type === "bloodstain" || second.type === "bloodstain") {
          continue;
        }
        if (!intersects(first, second)) {
          continue;
        }

        if (this.isMovingObstacle(first)) {
          indicesToTransform.add(i);
        }
        if (this.isMovingObstacle(second)) {
          indicesToTransform.add(j);
        }
      }
    }

    for (const index of indicesToTransform) {
      const entity = this.entities[index];
      this.spawnSmashEffect(entity.x, entity.y, entity.type === "spaniel" ? "spaniel-smash" : "obstacle-crash");
      this.entities[index] = {
        ...entity,
        id: this.nextEntityId++,
        type: "bloodstain",
        obstacleId: undefined,
        obstacleTier: undefined,
        jumpRule: undefined,
        behaviorState: undefined,
        y: entity.y + entity.height + 4,
        width: this.laneWidth * 0.55,
        height: 18,
        speed: SpanielSmashGame.staticObstacleSpeed,
        direction: 1,
        laneSwitchCooldownMs: 0,
        crashAnimationMs: 0
      };
    }
  }

  private isMovingObstacle(entity: Entity): boolean {
    return entity.type === "skier" || entity.type === "spaniel" || entity.type === "helicopter-downdraft";
  }
  private spawnSmashEffect(x: number, y: number, kind: SmashEffect["kind"]): void { this.effects.push({ kind, x, y, ttlMs: 300, maxTtlMs: 300 }); }

  private spawnBloodstain(entity: Entity): void {
    this.entities.push({ id: this.nextEntityId++, type: "bloodstain", x: this.laneX(this.entityLane(entity)), y: entity.y + entity.height + 4, width: this.laneWidth * 0.55, height: 18, speed: SpanielSmashGame.staticObstacleSpeed, lane: this.entityLane(entity), laneSwitchCooldownMs: 0, direction: 1, crashAnimationMs: 0 });
  }

  private tickEffects(deltaMs: number): void {
    this.effects = this.effects.map((effect) => {
      const ttlMs = Math.max(0, effect.ttlMs - deltaMs);
      if (effect.kind !== "coin-pop") {
        return { ...effect, ttlMs };
      }
      const travelUnit = deltaMs / 16.67;
      return { ...effect, ttlMs, x: effect.x + 3 * travelUnit, y: effect.y - 0.8 * travelUnit };
    }).filter((effect) => effect.ttlMs > 0);
  }

  public forceSpawn(entity: Entity): void {
    if (!entity.behaviorState) {
      entity.behaviorState = this.createBehaviorState(entity.type, entity.direction ?? 1);
    }
    entity.id ??= this.nextEntityId++;
    entity.lane = this.entityLane(entity);
    entity.x = this.laneX(entity.lane);
    entity.laneSwitchCooldownMs ??= 0;
    entity.direction ??= 1;
    entity.crashAnimationMs ??= 0;
    this.entities.push(entity);
  }

  public restart(): void {
    this.playerLane = this.startingLane();
    this.lives = 3;
    this.score = 0;
    this.speedLevel = 1;
    this.spanielsSmashed = 0;
    this.levelSpanielsSmashed = 0;
    this.gameOver = false;
    this.andyBossActive = false;
    this.entities = [];
    this.effects = [];
    this.spawnClock = 0;
    this.rareSpawnClock = 0;
    this.superRareSpawnClock = 0;
    this.mythicSpawnClock = 0;
    this.nextRareSpawnMs = this.rollRareSpawnMs();
    this.nextSuperRareSpawnMs = this.rollSuperRareSpawnMs();
    this.nextMythicSpawnMs = this.rollMythicSpawnMs();
    this.laneSwitchCooldownMs = 0;
    this.jumpCooldownMs = 0;
    this.jumpTimerMs = 0;
    this.crashFreezeMs = 0;
    this.sideObstacleOffsetY = 0;
    this.mythicUnlocked = false;
    this.puddleSlowMs = 0;
    this.wetPaintSlipMs = 0;
    this.playerImmortalMs = SpanielSmashGame.levelStartImmortalMs;
    this.levelUpBannerMs = 0;
    this.levelTransitionBoostMs = 0;
    this.nextBossSpanielGoal = 12;
    this.nextEntityId = 1;
    this.touchingSurfaceEntityIds = new Set<number>();
  }

  public snapshot(): GameSnapshot {
    return {
      lives: this.lives,
      score: this.score,
      speedLevel: this.speedLevel,
      spanielsSmashed: this.spanielsSmashed,
      levelSpanielsSmashed: this.levelSpanielsSmashed,
      nextBossSpanielGoal: this.nextBossSpanielGoal,
      isGameOver: this.gameOver,
      playerX: this.playerX(),
      playerY: this.playerY(),
      playerJumpOffset: this.playerJumpOffset(),
      isPlayerImmortal: this.playerImmortalMs > 0,
      isCrashActive: this.crashFreezeMs > 0,
      isBossActive: this.andyBossActive,
      levelUpBannerMs: this.levelUpBannerMs,
      sideObstacleOffsetY: this.sideObstacleOffsetY,
      activeEffects: {
        puddleSlowMs: this.puddleSlowMs,
        wetPaintSlipMs: this.wetPaintSlipMs
      },
      entities: this.entities.map((entity) => ({ ...entity, behaviorState: entity.behaviorState ? { ...entity.behaviorState } : undefined })),
      effects: this.effects.map((effect) => ({ ...effect }))
    };
  }

  private playerJumpOffset(): number {
    if (this.jumpTimerMs <= 0) {
      return 0;
    }
    const progress = 1 - this.jumpTimerMs / SpanielSmashGame.jumpDurationMs;
    return Math.sin(Math.PI * progress) * 26;
  }

  private playerX(): number { return this.laneX(this.playerLane); }
  private playerY(): number { return this.height - Math.floor(this.height / 3) - 34; }
  private startingLane(): number { return Math.floor(this.laneCount / 2); }
  private minPlayableLane(): number { return Math.min(2, Math.floor((this.laneCount - 1) / 2)); }
  private maxPlayableLane(): number { return Math.max(this.minPlayableLane(), this.laneCount - 1 - this.minPlayableLane()); }
  private laneX(lane: number): number { return lane * this.laneWidth + this.laneWidth * 0.22; }
  private entityLane(entity: Entity): number {
    if (typeof entity.lane === "number") return Math.max(0, Math.min(this.laneCount - 1, entity.lane));
    const lane = Math.round((entity.x - this.laneWidth * 0.22) / this.laneWidth);
    return Math.max(0, Math.min(this.laneCount - 1, lane));
  }

  private maybeMoveEntityLane(entity: Entity, deltaMs: number): void {
    if (entity.type !== "skier" && entity.type !== "spaniel" && entity.type !== "andy" && entity.type !== "helicopter-downdraft") return;
    const currentLane = this.entityLane(entity);
    const cooldown = Math.max(0, (entity.laneSwitchCooldownMs ?? 0) - deltaMs);
    entity.laneSwitchCooldownMs = cooldown;
    if (cooldown > 0) {
      entity.lane = currentLane;
      return;
    }

    let targetLane = currentLane;
    if (entity.type === "andy" && entity.behaviorState?.kind === "andyBoss") {
      if (entity.behaviorState.phase === "hovering" || entity.behaviorState.phase === "exiting") {
        if (currentLane < this.playerLane) targetLane = currentLane + 1;
        else if (currentLane > this.playerLane) targetLane = currentLane - 1;
      }
      entity.lane = Math.max(this.minPlayableLane(), Math.min(this.maxPlayableLane(), targetLane));
      entity.laneSwitchCooldownMs = SpanielSmashGame.andyBossLaneMoveMs;
      return;
    }

    if (entity.type === "andy") {
      if (currentLane < this.playerLane) targetLane = currentLane + 1;
      else if (currentLane > this.playerLane) targetLane = currentLane - 1;
    } else if (this.rng() < 0.3) {
      targetLane = currentLane + (this.rng() < 0.5 ? -1 : 1);
    }

    if (targetLane < this.minPlayableLane() || targetLane > this.maxPlayableLane()) {
      entity.lane = currentLane;
      entity.laneSwitchCooldownMs = 110;
      return;
    }

    entity.lane = targetLane !== currentLane && this.isLaneClearForEntity(entity, targetLane) ? targetLane : currentLane;
    entity.laneSwitchCooldownMs = 110;
  }

  private isLaneClearForEntity(entity: Entity, lane: number): boolean {
    for (const other of this.entities) {
      if (other === entity) continue;
      if (this.entityLane(other) !== lane) continue;
      if (Math.abs(other.y - entity.y) < Math.max(other.height, entity.height) + 4) return false;
    }
    return true;
  }

  private pickSpawnLane(): number {
    const preferred = this.minPlayableLane() + Math.floor(this.rng() * (this.maxPlayableLane() - this.minPlayableLane() + 1));
    if (this.isSpawnLaneClear(preferred)) return preferred;

    for (let offset = 1; offset < this.laneCount; offset += 1) {
      const left = preferred - offset;
      const right = preferred + offset;
      if (left >= this.minPlayableLane() && this.isSpawnLaneClear(left)) return left;
      if (right <= this.maxPlayableLane() && this.isSpawnLaneClear(right)) return right;
    }
    return preferred;
  }

  private isSpawnLaneClear(lane: number): boolean { return !this.entities.some((entity) => this.entityLane(entity) === lane && entity.y < 40); }
}

function intersects(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

export class PixelRenderer {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public render(snapshot: GameSnapshot): void {
    this.ctx.fillStyle = "#f3fbff";
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "#f3fbff";
    this.ctx.fillRect(20, 0, this.width - 40, this.height);
    this.drawSlopeEdges(snapshot.sideObstacleOffsetY);
    const isJumping = !snapshot.isCrashActive && snapshot.playerJumpOffset > 0;
    if (isJumping) {
      drawJumpShadow(this.ctx, snapshot.playerX, snapshot.playerY, snapshot.playerJumpOffset);
    }

    for (const entity of snapshot.entities) {
      if (entity.type === "puddle-patch") {
        drawPuddlePatch(this.ctx, entity.x, entity.y);
      } else if (entity.type === "ice-patch") {
        drawIcePatch(this.ctx, entity.x, entity.y);
      } else if (entity.type === "drone-package-drop") {
        if (entity.behaviorState?.kind === "droneDrop" && entity.behaviorState.phase === "telegraph") {
          drawDroneTelegraph(this.ctx, entity.x, entity.y);
        } else {
          drawDroneCrate(this.ctx, entity.x, entity.y);
        }
      } else if (entity.type === "helicopter-downdraft") {
        if (entity.behaviorState?.kind === "downdraft") {
          drawDowndraftZone(this.ctx, entity.x, entity.y, entity.behaviorState.pushDirection);
        } else {
          drawDowndraftZone(this.ctx, entity.x, entity.y, 1);
        }
      } else if (entity.type === "poo-bag") {
        drawPooBag(this.ctx, entity.x, entity.y);
      } else if (entity.type === "tree") drawTree(this.ctx, entity.x, entity.y);
      else if (entity.type === "rock") {
        if ((entity.crashAnimationMs ?? 0) > 0) drawCrashPulse(this.ctx, entity.x, entity.y, entity.crashAnimationMs ?? 0, "#ffa500");
        drawRock(this.ctx, entity.x, entity.y);
      } else if (entity.type === "skier") drawSkier(this.ctx, entity.x, entity.y, "#3a86ff", "#ff6b6b");
      else if (entity.type === "spaniel") drawSpaniel(this.ctx, entity.x, entity.y);
      else if (entity.type === "bloodstain") drawBloodstain(this.ctx, entity.x, entity.y);
      else drawAndy(this.ctx, entity.x, entity.y);
    }

    if (snapshot.isCrashActive) {
      drawCrashedSkier(this.ctx, snapshot.playerX, snapshot.playerY, "#2e3fbc", "#ffd166");
    } else {
      drawSkier(this.ctx, snapshot.playerX, snapshot.playerY - snapshot.playerJumpOffset, "#2e3fbc", "#ffd166", snapshot.playerJumpOffset);
    }

    for (const effect of snapshot.effects) drawSmashEffect(this.ctx, effect);

    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.font = "16px monospace";
    if (snapshot.isCrashActive && !snapshot.isGameOver) {
      this.ctx.fillStyle = "rgba(12, 18, 31, 0.9)";
      this.ctx.fillRect(this.width / 2 - 120, 78, 240, 56);
      this.ctx.fillStyle = "#ff6b6b";
      this.ctx.fillText("CRASHED!", this.width / 2 - 42, 100);
      this.ctx.fillStyle = "#f8fafc";
      this.ctx.fillText(`Lives Left ${snapshot.lives}`, this.width / 2 - 72, 120);
    }

    if ((snapshot.levelUpBannerMs ?? 0) > 0 && !snapshot.isGameOver) {
      this.ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
      this.ctx.fillRect(this.width / 2 - 112, 136, 224, 34);
      this.ctx.fillStyle = "#86efac";
      this.ctx.fillText(`LEVEL ${snapshot.speedLevel}!`, this.width / 2 - 66, 158);
    }

    if (snapshot.isGameOver) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = "#fff";
      this.ctx.fillText("GAME OVER", this.width / 2 - 56, this.height / 2);
      this.ctx.fillText(`Final Score ${snapshot.score}`, this.width / 2 - 78, this.height / 2 + 24);
      this.ctx.fillText("Tap Restart below", this.width / 2 - 70, this.height / 2 + 48);
    }
  }

  private drawSlopeEdges(offsetY: number): void {
    const placements = this.computeSlopeEdgeDecorations(offsetY);
    for (const placement of placements) {
      if (placement.kind === "tree") {
        drawTree(this.ctx, placement.x, placement.y);
      } else {
        drawRock(this.ctx, placement.x, placement.y);
      }
    }
  }

  private computeSlopeEdgeDecorations(offsetY: number): SideDecorationPlacement[] {
    const treeSpacing = 54;
    const rockSpacing = 170;
    const treeStart = -16 + (offsetY % treeSpacing);
    const rockStart = 45 + (offsetY % rockSpacing);
    const placements: SideDecorationPlacement[] = [];

    const tryPlace = (kind: "tree" | "rock", x: number, y: number): void => {
      const bounds = this.sideDecorationBounds(kind, x, y);
      if (placements.some((placement) => intersects(placement.bounds, bounds))) {
        return;
      }
      placements.push({ kind, x, y, bounds });
    };

    for (let y = rockStart - rockSpacing; y < this.height + 24; y += rockSpacing) {
      tryPlace("rock", 6, y);
      tryPlace("rock", this.width - 26, y + 80);
    }

    for (let y = treeStart - treeSpacing; y < this.height + 24; y += treeSpacing) {
      tryPlace("tree", 2, y);
      tryPlace("tree", this.width - 24, y + 20);
    }

    return placements;
  }

  private sideDecorationBounds(kind: "tree" | "rock", x: number, y: number): Bounds {
    if (kind === "tree") {
      return { x, y, width: 20, height: 30 };
    }
    return { x: x + 2, y: y + 2, width: 16, height: 12 };
  }
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number): void { ctx.fillStyle = "#2d6a4f"; ctx.fillRect(x + 3, y, 14, 18); ctx.fillRect(x, y + 8, 20, 12); ctx.fillStyle = "#7f5539"; ctx.fillRect(x + 8, y + 20, 4, 10); }
function drawRock(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#6b7280";
  ctx.fillRect(x + 1, y + 7, 18, 11);
  ctx.fillRect(x + 3, y + 4, 14, 4);
  ctx.fillStyle = "#9ca3af";
  ctx.fillRect(x + 5, y + 5, 8, 2);
  ctx.fillRect(x + 12, y + 8, 4, 2);
  ctx.fillStyle = "#4b5563";
  ctx.fillRect(x + 10, y + 10, 2, 6);
  ctx.fillRect(x + 8, y + 13, 6, 1);
}
function drawBloodstain(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#7f1d1d";
  ctx.fillRect(x + 2, y + 11, 16, 6);
  ctx.fillRect(x + 5, y + 9, 10, 3);
  ctx.fillRect(x + 1, y + 14, 3, 3);
  ctx.fillRect(x + 16, y + 13, 4, 3);
  ctx.fillStyle = "#b91c1c";
  ctx.fillRect(x + 6, y + 10, 8, 3);
  ctx.fillRect(x + 9, y + 14, 5, 2);
  ctx.fillRect(x + 13, y + 8, 2, 2);
}
function drawSpaniel(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#8b5e3c";
  ctx.fillRect(x + 3, y + 9, 12, 7);
  ctx.fillRect(x + 14, y + 10, 4, 5);
  ctx.fillRect(x + 15, y + 7, 5, 5);
  ctx.fillRect(x + 19, y + 9, 3, 2);
  ctx.fillRect(x + 1, y + 8, 3, 2);
  ctx.fillStyle = "#c58f63";
  ctx.fillRect(x + 5, y + 10, 7, 2);
  ctx.fillRect(x + 16, y + 9, 3, 2);
  ctx.fillRect(x + 20, y + 10, 2, 1);
  ctx.fillStyle = "#6b3f2a";
  ctx.fillRect(x + 15, y + 8, 1, 5);
  ctx.fillRect(x + 18, y + 8, 1, 5);
  ctx.fillRect(x + 5, y + 16, 2, 3);
  ctx.fillRect(x + 10, y + 16, 2, 3);
  ctx.fillRect(x + 15, y + 15, 2, 4);
  ctx.fillStyle = "#2a9d8f";
  ctx.fillRect(x + 13, y + 11, 2, 2);
  ctx.fillStyle = "#111827";
  ctx.fillRect(x + 18, y + 9, 1, 1);
  ctx.fillRect(x + 21, y + 10, 1, 1);
}
function drawPuddlePatch(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#1e40af";
  ctx.fillRect(x + 1, y + 13, 20, 6);
  ctx.fillRect(x + 3, y + 11, 16, 3);
  ctx.fillRect(x + 5, y + 10, 6, 1);
  ctx.fillRect(x + 12, y + 10, 5, 1);
  ctx.fillStyle = "#2563eb";
  ctx.fillRect(x + 4, y + 12, 6, 3);
  ctx.fillRect(x + 12, y + 12, 6, 3);
  ctx.fillRect(x + 8, y + 15, 7, 2);
  ctx.fillStyle = "#93c5fd";
  ctx.fillRect(x + 6, y + 12, 3, 1);
  ctx.fillRect(x + 14, y + 13, 3, 1);
  ctx.fillRect(x + 9, y + 14, 4, 1);
}
function drawIcePatch(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#bfdbfe";
  ctx.fillRect(x + 2, y + 11, 18, 8);
  ctx.fillRect(x + 4, y + 9, 4, 2);
  ctx.fillRect(x + 9, y + 9, 3, 2);
  ctx.fillRect(x + 14, y + 9, 4, 2);
  ctx.fillRect(x + 1, y + 18, 3, 1);
  ctx.fillRect(x + 17, y + 18, 3, 1);
  ctx.fillStyle = "#dbeafe";
  ctx.fillRect(x + 5, y + 12, 10, 2);
  ctx.fillRect(x + 8, y + 15, 9, 1);
  ctx.fillStyle = "#60a5fa";
  ctx.fillRect(x + 3, y + 18, 14, 1);
  ctx.fillRect(x + 7, y + 10, 1, 8);
  ctx.fillRect(x + 12, y + 11, 1, 7);
}
function drawDroneTelegraph(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "rgba(239, 68, 68, 0.75)";
  ctx.fillRect(x + 3, y + 11, 14, 2);
  ctx.fillRect(x + 9, y + 6, 2, 12);
  ctx.fillStyle = "rgba(248, 113, 113, 0.55)";
  ctx.fillRect(x + 1, y + 9, 18, 1);
  ctx.fillRect(x + 1, y + 15, 18, 1);
}
function drawDroneCrate(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#92400e";
  ctx.fillRect(x + 3, y + 6, 16, 14);
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(x + 4, y + 7, 14, 12);
  ctx.fillStyle = "#7c2d12";
  ctx.fillRect(x + 9, y + 7, 2, 12);
  ctx.fillRect(x + 4, y + 12, 14, 2);
}
function drawPooBag(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#14532d";
  ctx.fillRect(x + 4, y + 5, 12, 10);
  ctx.fillRect(x + 8, y + 3, 4, 2);
  ctx.fillRect(x + 4, y + 7, 2, 6);
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(x + 6, y + 7, 8, 6);
  ctx.fillStyle = "#86efac";
  ctx.fillRect(x + 11, y + 8, 2, 2);
}
function drawSkier(ctx: CanvasRenderingContext2D, x: number, y: number, bodyColor: string, helmetColor: string, jumpOffset = 0): void {
  const inAir = jumpOffset > 0;
  const bodyHeight = inAir ? 12 : 14;
  const bodyY = inAir ? y + 11 : y + 10;
  const helmetY = inAir ? y + 2 : y + 3;
  const skiInset = inAir ? 2 : 0;
  const skiWidth = inAir ? 20 : 24;
  const poleY = inAir ? y + 8 : y + 9;

  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 5, bodyY, 12, bodyHeight);
  ctx.fillRect(x + 4, bodyY + 4, 2, 5);
  ctx.fillStyle = helmetColor;
  ctx.fillRect(x + 7, helmetY, 8, 8);
  ctx.fillStyle = "#475569";
  ctx.fillRect(x + 17, poleY, 1, 12);
  ctx.fillRect(x + 16, poleY + 11, 3, 1);
  ctx.fillStyle = "#264653";
  ctx.fillRect(x + skiInset, y + 22, skiWidth, 2);
  ctx.fillRect(x + skiInset, y + 25, skiWidth, 2);
}
function drawDowndraftZone(ctx: CanvasRenderingContext2D, x: number, y: number, pushDirection: 1 | -1): void {
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(x + 1, y + 1, 20, 2);
  ctx.fillStyle = "#475569";
  ctx.fillRect(x + 10, y + 3, 2, 2);
  ctx.fillStyle = "#334155";
  ctx.fillRect(x + 6, y + 5, 11, 6);
  ctx.fillRect(x + 17, y + 7, 4, 2);
  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(x + 13, y + 6, 3, 3);
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(x + 21, y + 6, 1, 4);
  ctx.fillRect(x + 20, y + 7, 3, 1);
  ctx.fillStyle = "#475569";
  ctx.fillRect(x + 7, y + 12, 10, 1);
  ctx.fillRect(x + 8, y + 13, 1, 1);
  ctx.fillRect(x + 15, y + 13, 1, 1);

  const gustBaseX = pushDirection === 1 ? x + 16 : x + 4;
  ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
  ctx.fillRect(gustBaseX, y + 14, 2, 4);
  ctx.fillRect(gustBaseX + 2 * pushDirection, y + 17, 2, 5);
  ctx.fillRect(gustBaseX + 4 * pushDirection, y + 20, 2, 3);
  const arrowX = gustBaseX + 6 * pushDirection;
  ctx.fillRect(arrowX, y + 21, 1, 1);
  ctx.fillRect(arrowX + pushDirection, y + 20, 1, 3);
  ctx.fillStyle = "rgba(125, 211, 252, 0.85)";
  ctx.fillRect(gustBaseX + pushDirection, y + 15, 1, 1);
  ctx.fillRect(gustBaseX + 3 * pushDirection, y + 18, 1, 1);
  ctx.fillRect(gustBaseX + 5 * pushDirection, y + 21, 1, 1);
}
function drawAndy(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#7c2d12";
  ctx.fillRect(x + 1, y + 17, 22, 2);
  ctx.fillStyle = "#92400e";
  ctx.fillRect(x + 1, y + 19, 18, 1);
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(x + 19, y + 16, 4, 4);
  ctx.fillRect(x + 22, y + 17, 1, 2);

  ctx.fillStyle = "#111827";
  ctx.fillRect(x + 8, y + 7, 8, 9);
  ctx.fillRect(x + 6, y + 12, 12, 4);
  ctx.fillRect(x + 9, y + 3, 6, 4);
  ctx.fillRect(x + 7, y + 6, 10, 2);

  ctx.fillStyle = "#86efac";
  ctx.fillRect(x + 10, y + 8, 4, 3);
  ctx.fillStyle = "#ef4444";
  ctx.fillRect(x + 11, y + 9, 1, 1);
  ctx.fillRect(x + 13, y + 9, 1, 1);
  ctx.fillStyle = "#374151";
  ctx.fillRect(x + 9, y + 5, 6, 1);
  ctx.fillRect(x + 9, y + 13, 6, 2);
}
function drawCrashedSkier(ctx: CanvasRenderingContext2D, x: number, y: number, bodyColor: string, helmetColor: string): void { ctx.fillStyle = bodyColor; ctx.fillRect(x + 3, y + 16, 18, 10); ctx.fillStyle = helmetColor; ctx.fillRect(x - 1, y + 12, 8, 8); ctx.fillStyle = "#264653"; ctx.fillRect(x - 2, y + 25, 28, 2); ctx.fillRect(x + 8, y + 7, 2, 22); }
function drawJumpShadow(ctx: CanvasRenderingContext2D, x: number, y: number, jumpOffset: number): void { const width = Math.max(6, 16 - jumpOffset / 3); ctx.fillStyle = "rgba(15, 23, 42, 0.25)"; ctx.fillRect(x + 12 - width / 2, y + 26, width, 2); }

function drawSmashEffect(ctx: CanvasRenderingContext2D, effect: SmashEffect): void {
  if (effect.kind === "coin-pop") {
    const progress = 1 - effect.ttlMs / effect.maxTtlMs;
    const shimmer = progress > 0.45 && progress < 0.7;
    ctx.fillStyle = shimmer ? "#fde68a" : "#facc15";
    ctx.fillRect(effect.x + 16, effect.y + 4, 6, 6);
    ctx.fillStyle = "#ca8a04";
    ctx.fillRect(effect.x + 17, effect.y + 5, 4, 4);
    return;
  }

  const progress = 1 - effect.ttlMs / effect.maxTtlMs;
  const radius = Math.floor(progress * 10) + 2;
  const color = effect.kind === "spaniel-smash" ? "#dc2626" : effect.kind === "poo-splat" ? "#22c55e" : "#f97316";
  ctx.fillStyle = color;
  ctx.fillRect(effect.x + 8 - radius, effect.y + 8 - radius, radius, radius);
  ctx.fillRect(effect.x + 8 + radius / 2, effect.y + 5, radius, radius);
  ctx.fillRect(effect.x + 4, effect.y + 12 + radius / 2, radius, radius);
}

function drawCrashPulse(ctx: CanvasRenderingContext2D, x: number, y: number, crashAnimationMs: number, color: string): void {
  const intensity = Math.max(0.2, crashAnimationMs / 260);
  ctx.fillStyle = color;
  ctx.fillRect(x - 1, y + 2, 22 * intensity, 3);
}
