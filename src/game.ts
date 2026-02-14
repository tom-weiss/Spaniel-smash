export type EntityType = "tree" | "rock" | "skier" | "spaniel" | "andy";

export interface Entity {
  type: EntityType;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  lane?: number;
  laneSwitchCooldownMs?: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
}

export interface GameSnapshot {
  lives: number;
  score: number;
  speedLevel: number;
  spanielsSmashed: number;
  isGameOver: boolean;
  playerX: number;
  entities: ReadonlyArray<Entity>;
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
  private rng: () => number;
  private spawnClock = 0;
  private laneSwitchCooldownMs = 0;

  constructor(width: number, height: number, rng: () => number = Math.random, laneCount = 20) {
    this.width = width;
    this.height = height;
    this.laneCount = laneCount;
    this.laneWidth = width / laneCount;
    this.rng = rng;
    this.playerLane = this.startingLane();
  }

  public step(deltaMs: number, input: InputState): void {
    if (this.gameOver) {
      return;
    }

    this.handleInput(input, deltaMs);
    this.spawnClock += deltaMs;
    if (this.spawnClock >= 450) {
      this.spawnClock = 0;
      this.spawnEntity();
    }

    const speedMultiplier = 1 + (this.speedLevel - 1) * 0.2;
    for (const entity of this.entities) {
      this.maybeMoveEntityLane(entity, deltaMs);
      entity.y += entity.speed * speedMultiplier * (deltaMs / 16.67);
      entity.x = this.laneX(this.entityLane(entity));
    }

    this.preventEntityOverlaps();

    this.resolveCollisions();
    this.entities = this.entities.filter((entity) => entity.y < this.height + 40);
  }

  private handleInput(input: InputState, deltaMs: number): void {
    this.laneSwitchCooldownMs = Math.max(0, this.laneSwitchCooldownMs - deltaMs);
    if (this.laneSwitchCooldownMs > 0) {
      return;
    }

    if (input.left && !input.right) {
      this.playerLane = Math.max(0, this.playerLane - 1);
      this.laneSwitchCooldownMs = 140;
    }
    if (input.right && !input.left) {
      this.playerLane = Math.min(this.laneCount - 1, this.playerLane + 1);
      this.laneSwitchCooldownMs = 140;
    }
  }

  private spawnEntity(): void {
    const spawnLane = this.pickSpawnLane();
    const spawnX = this.laneX(spawnLane);

    if (this.witchAttackActive && !this.entities.some((entity) => entity.type === "andy")) {
      this.entities.push({
        type: "andy",
        x: spawnX,
        y: -26,
        width: this.laneWidth * 0.56,
        height: 32,
        speed: 2.4,
        lane: spawnLane,
        laneSwitchCooldownMs: 0
      });
      return;
    }

    const roll = this.rng();
    if (roll < 0.18) {
      this.entities.push({
        type: "tree",
        x: spawnX,
        y: -24,
        width: this.laneWidth * 0.5,
        height: 30,
        speed: 2.2,
        lane: spawnLane,
        laneSwitchCooldownMs: 0
      });
      return;
    }

    if (roll < 0.36) {
      this.entities.push({
        type: "rock",
        x: spawnX,
        y: -20,
        width: this.laneWidth * 0.4,
        height: 20,
        speed: 2.2,
        lane: spawnLane,
        laneSwitchCooldownMs: 0
      });
      return;
    }

    if (roll < 0.56) {
      this.entities.push({
        type: "skier",
        x: spawnX,
        y: -24,
        width: this.laneWidth * 0.56,
        height: 30,
        speed: 2.1 + this.rng(),
        lane: spawnLane,
        laneSwitchCooldownMs: 0
      });
      return;
    }

    this.entities.push({
      type: "spaniel",
      x: spawnX,
      y: -20,
      width: this.laneWidth * 0.5,
      height: 22,
      speed: 2 + this.rng(),
      lane: spawnLane,
      laneSwitchCooldownMs: 0
    });
  }

  private resolveCollisions(): void {
    const player = {
      x: this.playerX(),
      y: this.height - 58,
      width: this.laneWidth * 0.56,
      height: 34
    };

    const survivors: Entity[] = [];

    for (const entity of this.entities) {
      const hit = intersects(player, entity);
      if (!hit) {
        survivors.push(entity);
        continue;
      }

      if (entity.type === "spaniel") {
        this.score += 100;
        this.spanielsSmashed += 1;
        if (this.spanielsSmashed % 10 === 0) {
          this.witchAttackActive = true;
          this.speedLevel += 1;
        }
        continue;
      }

      this.lives -= 1;
      if (entity.type === "andy") {
        this.witchAttackActive = false;
      }
      if (this.lives <= 0) {
        this.gameOver = true;
      }
    }

    this.entities = survivors;
  }

  public forceSpawn(entity: Entity): void {
    entity.lane = this.entityLane(entity);
    entity.x = this.laneX(entity.lane);
    entity.laneSwitchCooldownMs ??= 0;
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
    this.spawnClock = 0;
    this.laneSwitchCooldownMs = 0;
  }

  public snapshot(): GameSnapshot {
    return {
      lives: this.lives,
      score: this.score,
      speedLevel: this.speedLevel,
      spanielsSmashed: this.spanielsSmashed,
      isGameOver: this.gameOver,
      playerX: this.playerX(),
      entities: this.entities.map((entity) => ({ ...entity }))
    };
  }

  private playerX(): number {
    return this.laneX(this.playerLane);
  }

  private startingLane(): number {
    return Math.floor(this.laneCount / 2);
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
      if (currentLane < this.playerLane) {
        targetLane = currentLane + 1;
      } else if (currentLane > this.playerLane) {
        targetLane = currentLane - 1;
      }
    } else if (this.rng() < 0.3) {
      targetLane = currentLane + (this.rng() < 0.5 ? -1 : 1);
    }

    if (targetLane < 0 || targetLane >= this.laneCount) {
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

  private preventEntityOverlaps(): void {
    for (let lane = 0; lane < this.laneCount; lane += 1) {
      const laneEntities = this.entities
        .filter((entity) => this.entityLane(entity) === lane)
        .sort((a, b) => b.y - a.y);

      for (let i = 1; i < laneEntities.length; i += 1) {
        const lower = laneEntities[i - 1];
        const upper = laneEntities[i];
        const maxUpperY = lower.y - upper.height - 2;
        if (upper.y > maxUpperY) {
          upper.y = maxUpperY;
        }
      }
    }
  }

  private pickSpawnLane(): number {
    const preferred = Math.floor(this.rng() * this.laneCount);
    if (this.isSpawnLaneClear(preferred)) {
      return preferred;
    }

    for (let offset = 1; offset < this.laneCount; offset += 1) {
      const left = preferred - offset;
      const right = preferred + offset;
      if (left >= 0 && this.isSpawnLaneClear(left)) {
        return left;
      }
      if (right < this.laneCount && this.isSpawnLaneClear(right)) {
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

    drawSkier(this.ctx, snapshot.playerX, this.height - 58, "#2e3fbc", "#ffd166");

    for (const entity of snapshot.entities) {
      if (entity.type === "tree") {
        drawTree(this.ctx, entity.x, entity.y);
      } else if (entity.type === "rock") {
        drawRock(this.ctx, entity.x, entity.y);
      } else if (entity.type === "skier") {
        drawSkier(this.ctx, entity.x, entity.y, "#3a86ff", "#f1fa8c");
      } else if (entity.type === "spaniel") {
        drawSpaniel(this.ctx, entity.x, entity.y);
      } else {
        drawSkier(this.ctx, entity.x, entity.y, "#7b1fa2", "#ff7da0");
      }
    }

    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.font = "16px monospace";
    this.ctx.fillText(`Score ${snapshot.score}`, 14, 24);
    this.ctx.fillText(`Lives ${snapshot.lives}`, 14, 44);
    this.ctx.fillText(`Level ${snapshot.speedLevel}`, 14, 64);

    if (snapshot.isGameOver) {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = "#fff";
      this.ctx.fillText("GAME OVER", this.width / 2 - 56, this.height / 2);
      this.ctx.fillText(`Final Score ${snapshot.score}`, this.width / 2 - 78, this.height / 2 + 24);
      this.ctx.fillText("Tap Restart below", this.width / 2 - 70, this.height / 2 + 48);
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
