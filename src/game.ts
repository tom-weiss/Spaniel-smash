export type EntityType = "tree" | "rock" | "skier" | "spaniel" | "andy" | "bloodstain";
type ObstacleTier = "standard" | "rare" | "super-rare" | "mythic";
type JumpRule = "none" | "low" | "high";

export interface Entity {
  type: EntityType;
  obstacleId?: string;
  obstacleTier?: ObstacleTier;
  jumpRule?: JumpRule;
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
  kind: "spaniel-smash" | "obstacle-crash" | "coin-pop";
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

export interface GameSnapshot {
  lives: number;
  score: number;
  speedLevel: number;
  spanielsSmashed: number;
  isGameOver: boolean;
  playerX: number;
  playerY: number;
  isCrashActive: boolean;
  sideObstacleOffsetY: number;
  entities: ReadonlyArray<Entity>;
  effects: ReadonlyArray<SmashEffect>;
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
  private gameOver = false;
  private witchAttackActive = false;
  private entities: Entity[] = [];
  private effects: SmashEffect[] = [];
  private rng: () => number;
  private spawnClock = 0;
  private rareSpawnClock = 0;
  private superRareSpawnClock = 0;
  private nextRareSpawnMs = 12000;
  private nextSuperRareSpawnMs = 180000;
  private laneSwitchCooldownMs = 0;
  private jumpCooldownMs = 0;
  private jumpTimerMs = 0;
  private crashFreezeMs = 0;
  private sideObstacleOffsetY = 0;

  private static readonly staticObstacleSpeed = 2.2;
  private static readonly movingEntityBaseSpeed = 1.2;
  private static readonly jumpDurationMs = 320;

  constructor(width: number, height: number, rng: () => number = Math.random, laneCount = 20) {
    this.width = width;
    this.height = height;
    this.laneCount = laneCount;
    this.laneWidth = width / laneCount;
    this.rng = rng;
    this.playerLane = this.startingLane();
    this.nextRareSpawnMs = this.rollRareSpawnMs();
    this.nextSuperRareSpawnMs = this.rollSuperRareSpawnMs();
  }

  public step(deltaMs: number, input: InputState): void {
    if (this.gameOver) {
      return;
    }

    this.tickEffects(deltaMs);

    if (this.crashFreezeMs > 0) {
      this.crashFreezeMs = Math.max(0, this.crashFreezeMs - deltaMs);
      return;
    }

    this.handleInput(input, deltaMs);
    this.spawnClock += deltaMs;
    if (this.spawnClock >= 450) {
      this.spawnClock = 0;
      this.spawnEntity();
    }

    const speedMultiplier = 1 + (this.speedLevel - 1) * 0.2;
    this.sideObstacleOffsetY += SpanielSmashGame.staticObstacleSpeed * speedMultiplier * (deltaMs / 16.67);
    for (const entity of this.entities) {
      this.maybeMoveEntityLane(entity, deltaMs);
      entity.y += entity.speed * (entity.direction ?? 1) * speedMultiplier * (deltaMs / 16.67);
      entity.x = this.laneX(this.entityLane(entity));
      entity.crashAnimationMs = Math.max(0, (entity.crashAnimationMs ?? 0) - deltaMs);
    }

    this.resolveEntityCollisions();
    this.resolveCollisions();
    this.entities = this.entities.filter((entity) => entity.y < this.height + 40 && entity.y + entity.height > -40);
  }

  private handleInput(input: InputState, deltaMs: number): void {
    this.laneSwitchCooldownMs = Math.max(0, this.laneSwitchCooldownMs - deltaMs);
    this.jumpCooldownMs = Math.max(0, this.jumpCooldownMs - deltaMs);
    this.jumpTimerMs = Math.max(0, this.jumpTimerMs - deltaMs);

    if (input.jump && this.jumpCooldownMs === 0) {
      this.jumpTimerMs = SpanielSmashGame.jumpDurationMs;
      this.jumpCooldownMs = 450;
    }

    if (this.laneSwitchCooldownMs > 0) {
      return;
    }

    if (input.left && !input.right) {
      this.playerLane = Math.max(this.minPlayableLane(), this.playerLane - 1);
      this.laneSwitchCooldownMs = 140;
    }
    if (input.right && !input.left) {
      this.playerLane = Math.min(this.maxPlayableLane(), this.playerLane + 1);
      this.laneSwitchCooldownMs = 140;
    }
  }

  private spawnEntity(): void {
    const spawnLane = this.pickSpawnLane();
    const spawnX = this.laneX(spawnLane);
    const movingDirection = this.rng() < 0.5 ? 1 : -1;
    const movingSpawnY = movingDirection === 1 ? -26 : this.height + 26;

    if (this.witchAttackActive && !this.entities.some((entity) => entity.type === "andy")) {
      this.entities.push({
        type: "andy",
        obstacleId: "mini-boss-bulldog",
        obstacleTier: "super-rare",
        jumpRule: "high",
        x: spawnX,
        y: movingSpawnY,
        width: this.laneWidth * 0.56,
        height: 32,
        speed: SpanielSmashGame.movingEntityBaseSpeed,
        lane: spawnLane,
        laneSwitchCooldownMs: 0,
        direction: movingDirection,
        crashAnimationMs: 0
      });
      return;
    }

    this.rareSpawnClock += 450;
    this.superRareSpawnClock += 450;

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
    const makeEntity = (
      type: EntityType,
      obstacleId: string,
      jumpRule: JumpRule,
      width: number,
      height: number,
      speed: number,
      isMoving: boolean
    ): Entity => ({
      type,
      obstacleId,
      obstacleTier: tier,
      jumpRule,
      x: spawnX,
      y: isMoving ? movingSpawnY : -24,
      width,
      height,
      speed,
      lane: spawnLane,
      laneSwitchCooldownMs: 0,
      direction: isMoving ? movingDirection : 1,
      crashAnimationMs: 0
    });

    const roll = this.rng();
    if (tier === "standard") {
      if (roll < 0.18) {
        this.entities.push(makeEntity("tree", "cracked-sidewalk-slab", "low", this.laneWidth * 0.5, 30, SpanielSmashGame.staticObstacleSpeed, false));
        return;
      }
      if (roll < 0.36) {
        this.entities.push(makeEntity("rock", "trash-bag-cluster", "low", this.laneWidth * 0.4, 20, SpanielSmashGame.staticObstacleSpeed, false));
        return;
      }
      if (roll < 0.56) {
        this.entities.push(makeEntity("skier", "rolling-skateboard", "none", this.laneWidth * 0.56, 30, SpanielSmashGame.movingEntityBaseSpeed + this.rng() * 0.5, true));
        return;
      }
      this.entities.push(makeEntity("spaniel", "squirrel-zigzag", "none", this.laneWidth * 0.5, 22, SpanielSmashGame.movingEntityBaseSpeed + this.rng() * 0.5, true));
      return;
    }

    if (tier === "rare") {
      if (roll < 0.5) {
        this.entities.push(makeEntity("tree", "fence-segment", "high", this.laneWidth * 0.6, 36, SpanielSmashGame.staticObstacleSpeed + 0.1, false));
        return;
      }
      this.entities.push(makeEntity("skier", "scooter-rider", "none", this.laneWidth * 0.58, 32, SpanielSmashGame.movingEntityBaseSpeed + 0.8, true));
      return;
    }

    if (roll < 0.5) {
      this.entities.push(makeEntity("rock", "roadwork-trench", "high", this.laneWidth * 0.75, 40, SpanielSmashGame.staticObstacleSpeed + 0.25, false));
      return;
    }
    this.entities.push(makeEntity("andy", "garbage-truck-reverse", "high", this.laneWidth * 0.7, 34, SpanielSmashGame.movingEntityBaseSpeed + 0.3, true));
  }

  private rollRareSpawnMs(): number {
    return 10000 + Math.floor(this.rng() * 10001);
  }

  private rollSuperRareSpawnMs(): number {
    return 60000 + Math.floor(this.rng() * 540001);
  }

  private canClearByJump(entity: Entity): boolean {
    if (this.jumpTimerMs <= 0) {
      return false;
    }
    return entity.jumpRule === "low" || entity.jumpRule === "high";
  }

  private resolveCollisions(): void {
    const player = {
      x: this.playerX(),
      y: this.playerY(),
      width: this.laneWidth * 0.56,
      height: 34
    };

    const survivors: Entity[] = [];

    for (const entity of this.entities) {
      if (entity.type === "bloodstain") {
        survivors.push(entity);
        continue;
      }

      const hit = intersects(player, entity);
      if (!hit) {
        survivors.push(entity);
        continue;
      }

      if (entity.type === "spaniel") {
        this.spawnSmashEffect(entity.x, entity.y, "spaniel-smash");
        this.spawnSmashEffect(entity.x, entity.y, "coin-pop");
        this.spawnBloodstain(entity);
        this.score += 100;
        this.spanielsSmashed += 1;
        if (this.spanielsSmashed % 10 === 0) {
          this.witchAttackActive = true;
          this.speedLevel += 1;
        }
        continue;
      }

      if (this.canClearByJump(entity)) {
        survivors.push(entity);
        continue;
      }

      this.lives -= 1;
      this.crashFreezeMs = 650;
      if (entity.type === "andy") {
        this.witchAttackActive = false;
      }
      if (this.lives <= 0) {
        this.gameOver = true;
      }
    }

    this.entities = survivors;
  }

  private resolveEntityCollisions(): void {
    const indicesToTransform = new Set<number>();
    for (let i = 0; i < this.entities.length; i += 1) {
      for (let j = i + 1; j < this.entities.length; j += 1) {
        const first = this.entities[i];
        const second = this.entities[j];
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
      if (entity.type === "spaniel") {
        this.spawnSmashEffect(entity.x, entity.y, "spaniel-smash");
        this.entities[index] = {
          ...entity,
          type: "bloodstain",
          y: entity.y + entity.height + 4,
          width: this.laneWidth * 0.55,
          height: 18,
          speed: SpanielSmashGame.staticObstacleSpeed,
          direction: 1,
          laneSwitchCooldownMs: 0,
          crashAnimationMs: 0
        };
        continue;
      }

      this.spawnSmashEffect(entity.x, entity.y, "obstacle-crash");
      this.entities[index] = {
        ...entity,
        type: "rock",
        speed: SpanielSmashGame.staticObstacleSpeed,
        direction: 1,
        laneSwitchCooldownMs: 0,
        crashAnimationMs: 260
      };
    }
  }

  private isMovingObstacle(entity: Entity): boolean {
    return entity.type === "skier" || entity.type === "spaniel" || entity.type === "andy";
  }

  private spawnSmashEffect(x: number, y: number, kind: SmashEffect["kind"]): void {
    this.effects.push({
      kind,
      x,
      y,
      ttlMs: 300,
      maxTtlMs: 300
    });
  }

  private spawnBloodstain(entity: Entity): void {
    this.entities.push({
      type: "bloodstain",
      x: this.laneX(this.entityLane(entity)),
      y: entity.y + entity.height + 4,
      width: this.laneWidth * 0.55,
      height: 18,
      speed: SpanielSmashGame.staticObstacleSpeed,
      lane: this.entityLane(entity),
      laneSwitchCooldownMs: 0,
      direction: 1,
      crashAnimationMs: 0
    });
  }

  private tickEffects(deltaMs: number): void {
    this.effects = this.effects
      .map((effect) => {
        const ttlMs = Math.max(0, effect.ttlMs - deltaMs);
        if (effect.kind !== "coin-pop") {
          return { ...effect, ttlMs };
        }

        const travelUnit = deltaMs / 16.67;
        return {
          ...effect,
          ttlMs,
          x: effect.x + 3 * travelUnit,
          y: effect.y - 0.8 * travelUnit
        };
      })
      .filter((effect) => effect.ttlMs > 0);
  }

  public forceSpawn(entity: Entity): void {
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
    this.gameOver = false;
    this.witchAttackActive = false;
    this.entities = [];
    this.effects = [];
    this.spawnClock = 0;
    this.rareSpawnClock = 0;
    this.superRareSpawnClock = 0;
    this.nextRareSpawnMs = this.rollRareSpawnMs();
    this.nextSuperRareSpawnMs = this.rollSuperRareSpawnMs();
    this.laneSwitchCooldownMs = 0;
    this.jumpCooldownMs = 0;
    this.jumpTimerMs = 0;
    this.crashFreezeMs = 0;
    this.sideObstacleOffsetY = 0;
  }

  public snapshot(): GameSnapshot {
    return {
      lives: this.lives,
      score: this.score,
      speedLevel: this.speedLevel,
      spanielsSmashed: this.spanielsSmashed,
      isGameOver: this.gameOver,
      playerX: this.playerX(),
      playerY: this.playerY(),
      isCrashActive: this.crashFreezeMs > 0,
      sideObstacleOffsetY: this.sideObstacleOffsetY,
      entities: this.entities.map((entity) => ({ ...entity })),
      effects: this.effects.map((effect) => ({ ...effect }))
    };
  }

  private playerX(): number {
    return this.laneX(this.playerLane);
  }

  private playerY(): number {
    return this.height - Math.floor(this.height / 3) - 34;
  }

  private startingLane(): number {
    return Math.floor(this.laneCount / 2);
  }

  private minPlayableLane(): number {
    return Math.min(2, Math.floor((this.laneCount - 1) / 2));
  }

  private maxPlayableLane(): number {
    return Math.max(this.minPlayableLane(), this.laneCount - 1 - this.minPlayableLane());
  }

  private laneX(lane: number): number {
    return lane * this.laneWidth + this.laneWidth * 0.22;
  }

  private entityLane(entity: Entity): number {
    if (typeof entity.lane === "number") {
      return Math.max(0, Math.min(this.laneCount - 1, entity.lane));
    }
    const lane = Math.round((entity.x - this.laneWidth * 0.22) / this.laneWidth);
    return Math.max(0, Math.min(this.laneCount - 1, lane));
  }

  private maybeMoveEntityLane(entity: Entity, deltaMs: number): void {
    if (entity.type !== "skier" && entity.type !== "spaniel" && entity.type !== "andy") {
      return;
    }

    const currentLane = this.entityLane(entity);
    const cooldown = Math.max(0, (entity.laneSwitchCooldownMs ?? 0) - deltaMs);
    entity.laneSwitchCooldownMs = cooldown;
    if (cooldown > 0) {
      entity.lane = currentLane;
      return;
    }

    let targetLane = currentLane;
    if (entity.type === "andy") {
      const laneStep = entity.direction === -1 ? -1 : 1;
      if (currentLane < this.playerLane) {
        targetLane = currentLane + laneStep;
      } else if (currentLane > this.playerLane) {
        targetLane = currentLane - laneStep;
      }
    } else if (this.rng() < 0.3) {
      targetLane = currentLane + (this.rng() < 0.5 ? -1 : 1);
    }

    if (targetLane < this.minPlayableLane() || targetLane > this.maxPlayableLane()) {
      entity.lane = currentLane;
      entity.laneSwitchCooldownMs = 110;
      return;
    }

    if (targetLane !== currentLane && this.isLaneClearForEntity(entity, targetLane)) {
      entity.lane = targetLane;
    } else {
      entity.lane = currentLane;
    }
    entity.laneSwitchCooldownMs = 110;
  }

  private isLaneClearForEntity(entity: Entity, lane: number): boolean {
    for (const other of this.entities) {
      if (other === entity) {
        continue;
      }
      if (this.entityLane(other) !== lane) {
        continue;
      }
      if (Math.abs(other.y - entity.y) < Math.max(other.height, entity.height) + 4) {
        return false;
      }
    }
    return true;
  }

  private pickSpawnLane(): number {
    const preferred = this.minPlayableLane() + Math.floor(this.rng() * (this.maxPlayableLane() - this.minPlayableLane() + 1));
    if (this.isSpawnLaneClear(preferred)) {
      return preferred;
    }

    for (let offset = 1; offset < this.laneCount; offset += 1) {
      const left = preferred - offset;
      const right = preferred + offset;
      if (left >= this.minPlayableLane() && this.isSpawnLaneClear(left)) {
        return left;
      }
      if (right <= this.maxPlayableLane() && this.isSpawnLaneClear(right)) {
        return right;
      }
    }
    return preferred;
  }

  private isSpawnLaneClear(lane: number): boolean {
    return !this.entities.some((entity) => this.entityLane(entity) === lane && entity.y < 40);
  }
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
    this.ctx.fillStyle = "#9de0ff";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = "#f3fbff";
    this.ctx.fillRect(20, 0, this.width - 40, this.height);

    this.drawSlopeEdges(snapshot.sideObstacleOffsetY);

    if (snapshot.isCrashActive) {
      drawCrashedSkier(this.ctx, snapshot.playerX, snapshot.playerY, "#2e3fbc", "#ffd166");
    } else {
      drawSkier(this.ctx, snapshot.playerX, snapshot.playerY, "#2e3fbc", "#ffd166");
    }

    for (const entity of snapshot.entities) {
      if (entity.type === "tree") {
        drawTree(this.ctx, entity.x, entity.y);
      } else if (entity.type === "rock") {
        if ((entity.crashAnimationMs ?? 0) > 0) {
          drawCrashPulse(this.ctx, entity.x, entity.y, entity.crashAnimationMs ?? 0, "#ffa500");
        }
        drawRock(this.ctx, entity.x, entity.y);
      } else if (entity.type === "skier") {
        drawSkier(this.ctx, entity.x, entity.y, "#3a86ff", "#f1fa8c");
      } else if (entity.type === "spaniel") {
        drawSpaniel(this.ctx, entity.x, entity.y);
      } else if (entity.type === "bloodstain") {
        drawBloodstain(this.ctx, entity.x, entity.y);
      } else {
        drawSkier(this.ctx, entity.x, entity.y, "#7b1fa2", "#ff7da0");
      }
    }

    for (const effect of snapshot.effects) {
      drawSmashEffect(this.ctx, effect);
    }

    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.font = "16px monospace";
    this.ctx.fillText(`Score ${snapshot.score}`, 14, 24);
    this.ctx.fillText(`Lives ${snapshot.lives}`, 14, 44);
    this.ctx.fillText(`Level ${snapshot.speedLevel}`, 14, 64);

    if (snapshot.isCrashActive && !snapshot.isGameOver) {
      this.ctx.fillStyle = "rgba(12, 18, 31, 0.9)";
      this.ctx.fillRect(this.width / 2 - 120, 78, 240, 56);
      this.ctx.fillStyle = "#ff6b6b";
      this.ctx.fillText("CRASHED!", this.width / 2 - 42, 100);
      this.ctx.fillStyle = "#f8fafc";
      this.ctx.fillText(`Lives Left ${snapshot.lives}`, this.width / 2 - 72, 120);
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
    const treeSpacing = 54;
    const rockSpacing = 170;
    const treeStart = -16 + (offsetY % treeSpacing);
    const rockStart = 45 + (offsetY % rockSpacing);

    for (let y = treeStart - treeSpacing; y < this.height + 24; y += treeSpacing) {
      drawTree(this.ctx, 2, y);
      drawTree(this.ctx, this.width - 24, y + 20);
    }

    for (let y = rockStart - rockSpacing; y < this.height + 24; y += rockSpacing) {
      drawRock(this.ctx, 6, y);
      drawRock(this.ctx, this.width - 26, y + 80);
    }
  }
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#2d6a4f";
  ctx.fillRect(x + 3, y, 14, 18);
  ctx.fillRect(x, y + 8, 20, 12);
  ctx.fillStyle = "#7f5539";
  ctx.fillRect(x + 8, y + 20, 4, 10);
}

function drawRock(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#6c757d";
  ctx.fillRect(x + 2, y + 4, 16, 10);
  ctx.fillStyle = "#adb5bd";
  ctx.fillRect(x + 5, y + 2, 10, 4);
}

function drawBloodstain(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#7f1d1d";
  ctx.fillRect(x + 1, y + 8, 20, 7);
  ctx.fillStyle = "#b91c1c";
  ctx.fillRect(x + 4, y + 5, 14, 4);
}

function drawSpaniel(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  ctx.fillStyle = "#f4a261";
  ctx.fillRect(x, y, 20, 14);
  ctx.fillRect(x + 14, y - 3, 8, 8);
  ctx.fillStyle = "#2a9d8f";
  ctx.fillRect(x + 18, y - 1, 2, 4);
}

function drawSkier(ctx: CanvasRenderingContext2D, x: number, y: number, bodyColor: string, helmetColor: string): void {
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 5, y + 10, 12, 14);
  ctx.fillStyle = helmetColor;
  ctx.fillRect(x + 7, y + 3, 8, 8);
  ctx.fillStyle = "#264653";
  ctx.fillRect(x, y + 22, 24, 2);
  ctx.fillRect(x, y + 25, 24, 2);
}

function drawCrashedSkier(ctx: CanvasRenderingContext2D, x: number, y: number, bodyColor: string, helmetColor: string): void {
  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 3, y + 16, 18, 10);
  ctx.fillStyle = helmetColor;
  ctx.fillRect(x - 1, y + 12, 8, 8);
  ctx.fillStyle = "#264653";
  ctx.fillRect(x - 2, y + 25, 28, 2);
  ctx.fillRect(x + 8, y + 7, 2, 22);
}

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
  const color = effect.kind === "spaniel-smash" ? "#dc2626" : "#f97316";
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
