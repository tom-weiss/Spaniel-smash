const STANDARD_OBSTACLES = [
    { type: "tree", obstacleId: "cracked-sidewalk-slab", jumpRule: "low", widthScale: 0.5, height: 24, speed: 2.2, moving: false },
    { type: "rock", obstacleId: "trash-bag-cluster", jumpRule: "low", widthScale: 0.55, height: 22, speed: 2.2, moving: false },
    { type: "tree", obstacleId: "construction-cone-pair", jumpRule: "low", widthScale: 0.52, height: 24, speed: 2.2, moving: false },
    { type: "puddle-patch", obstacleId: "puddle-patch", jumpRule: "none", widthScale: 0.52, height: 20, speed: 2.2, moving: false },
    { type: "tree", obstacleId: "mail-crate-stack", jumpRule: "high", widthScale: 0.58, height: 32, speed: 2.2, moving: false },
    { type: "skier", obstacleId: "rolling-skateboard", jumpRule: "low", widthScale: 0.56, height: 28, speed: 1.6, moving: true },
    { type: "skier", obstacleId: "jogger-crossing", jumpRule: "none", widthScale: 0.56, height: 30, speed: 1.4, moving: true },
    { type: "spaniel", obstacleId: "bouncing-ball", jumpRule: "low", widthScale: 0.45, height: 18, speed: 1.7, moving: true },
    { type: "andy", obstacleId: "delivery-cart-drift", jumpRule: "high", widthScale: 0.68, height: 34, speed: 1.0, moving: true },
    { type: "spaniel", obstacleId: "squirrel-zigzag", jumpRule: "none", widthScale: 0.5, height: 22, speed: 1.8, moving: true }
];
const RARE_OBSTACLES = [
    { type: "tree", obstacleId: "fence-segment", jumpRule: "high", widthScale: 0.62, height: 36, speed: 2.3, moving: false },
    { type: "rock", obstacleId: "open-manhole", jumpRule: "high", widthScale: 0.6, height: 28, speed: 2.3, moving: false },
    { type: "ice-patch", obstacleId: "ice-patch", jumpRule: "none", widthScale: 0.58, height: 20, speed: 1.3, moving: false },
    { type: "skier", obstacleId: "fallen-signboard", jumpRule: "high", widthScale: 0.62, height: 30, speed: 1.5, moving: true },
    { type: "rock", obstacleId: "glass-debris-field", jumpRule: "low", widthScale: 0.58, height: 22, speed: 2.3, moving: false },
    { type: "andy", obstacleId: "street-sweeper-pass", jumpRule: "high", widthScale: 0.72, height: 34, speed: 1.4, moving: true },
    { type: "drone-package-drop", obstacleId: "drone-package-drop", jumpRule: "low", widthScale: 0.54, height: 24, speed: 2.1, moving: false },
    { type: "spaniel", obstacleId: "leashed-dog-lunge", jumpRule: "none", widthScale: 0.52, height: 22, speed: 1.7, moving: true },
    { type: "skier", obstacleId: "scooter-rider", jumpRule: "none", widthScale: 0.58, height: 32, speed: 2.0, moving: true },
    { type: "andy", obstacleId: "crow-flock-sweep", jumpRule: "high", widthScale: 0.7, height: 30, speed: 1.7, moving: true }
];
const SUPER_RARE_OBSTACLES = [
    { type: "tree", obstacleId: "collapsed-scaffolding", jumpRule: "high", widthScale: 0.75, height: 40, speed: 2.5, moving: false },
    { type: "rock", obstacleId: "roadwork-trench", jumpRule: "high", widthScale: 0.76, height: 40, speed: 2.45, moving: false },
    { type: "andy", obstacleId: "power-line-arc-zone", jumpRule: "high", widthScale: 0.72, height: 34, speed: 1.4, moving: true },
    { type: "tree", obstacleId: "blocked-intersection", jumpRule: "none", widthScale: 0.8, height: 38, speed: 2.3, moving: false },
    { type: "rock", obstacleId: "statue-base-rubble", jumpRule: "high", widthScale: 0.72, height: 34, speed: 2.4, moving: false },
    { type: "andy", obstacleId: "runaway-parade-float", jumpRule: "high", widthScale: 0.8, height: 36, speed: 1.2, moving: true },
    { type: "andy", obstacleId: "garbage-truck-reverse-event", jumpRule: "high", widthScale: 0.74, height: 34, speed: 1.5, moving: true },
    { type: "helicopter-downdraft", obstacleId: "helicopter-downdraft", jumpRule: "none", widthScale: 0.66, height: 32, speed: 1.8, moving: true },
    { type: "andy", obstacleId: "mini-boss-bulldog", jumpRule: "high", widthScale: 0.7, height: 34, speed: 1.5, moving: true },
    { type: "andy", obstacleId: "train-crossing-burst", jumpRule: "high", widthScale: 0.8, height: 34, speed: 2.0, moving: true }
];
const MYTHIC_OBSTACLES = [
    { type: "skier", obstacleId: "mirror-maze-gate", jumpRule: "none", widthScale: 0.66, height: 32, speed: 1.7, moving: true },
    { type: "spaniel", obstacleId: "frozen-street-tile-set", jumpRule: "low", widthScale: 0.6, height: 20, speed: 1.6, moving: true },
    { type: "tree", obstacleId: "ancient-bell-tower-debris", jumpRule: "high", widthScale: 0.7, height: 36, speed: 2.4, moving: false },
    { type: "rock", obstacleId: "meteor-shard-rain", jumpRule: "high", widthScale: 0.66, height: 30, speed: 2.4, moving: false },
    { type: "andy", obstacleId: "shadow-doppelganger", jumpRule: "none", widthScale: 0.68, height: 32, speed: 1.8, moving: true },
    { type: "andy", obstacleId: "festival-dragon-sweep", jumpRule: "high", widthScale: 0.8, height: 36, speed: 1.7, moving: true }
];
export class SpanielSmashGame {
    width;
    height;
    laneCount;
    laneWidth;
    playerLane;
    lives = 3;
    score = 0;
    speedLevel = 1;
    spanielsSmashed = 0;
    gameOver = false;
    witchAttackActive = false;
    entities = [];
    effects = [];
    rng;
    spawnClock = 0;
    rareSpawnClock = 0;
    superRareSpawnClock = 0;
    mythicSpawnClock = 0;
    nextRareSpawnMs = 12000;
    nextSuperRareSpawnMs = 180000;
    nextMythicSpawnMs = 45000;
    laneSwitchCooldownMs = 0;
    jumpCooldownMs = 0;
    jumpTimerMs = 0;
    crashFreezeMs = 0;
    sideObstacleOffsetY = 0;
    mythicUnlocked = false;
    puddleSlowMs = 0;
    wetPaintSlipMs = 0;
    static staticObstacleSpeed = 2.2;
    static movingEntityBaseSpeed = 1.2;
    static jumpDurationMs = 520;
    static puddleSlowDurationMs = 900;
    static wetPaintSlipDurationMs = 1400;
    static droneTelegraphDurationMs = 650;
    static downdraftPushIntervalMs = 180;
    constructor(width, height, rng = Math.random, laneCount = 20) {
        this.width = width;
        this.height = height;
        this.laneCount = laneCount;
        this.laneWidth = width / laneCount;
        this.rng = rng;
        this.playerLane = this.startingLane();
        this.nextRareSpawnMs = this.rollRareSpawnMs();
        this.nextSuperRareSpawnMs = this.rollSuperRareSpawnMs();
        this.nextMythicSpawnMs = this.rollMythicSpawnMs();
    }
    step(deltaMs, input) {
        if (this.gameOver) {
            return;
        }
        this.tickEffects(deltaMs);
        this.tickPlayerEffectTimers(deltaMs);
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
            this.tickEntityBehaviorState(entity, deltaMs);
            this.maybeMoveEntityLane(entity, deltaMs);
            entity.y += entity.speed * (entity.direction ?? 1) * speedMultiplier * (deltaMs / 16.67);
            entity.x = this.laneX(this.entityLane(entity));
            entity.crashAnimationMs = Math.max(0, (entity.crashAnimationMs ?? 0) - deltaMs);
        }
        this.applyDowndraftPushes();
        this.resolveEntityCollisions();
        this.resolveCollisions();
        this.entities = this.entities.filter((entity) => entity.y < this.height + 40 && entity.y + entity.height > -40);
    }
    handleInput(input, deltaMs) {
        this.laneSwitchCooldownMs = Math.max(0, this.laneSwitchCooldownMs - deltaMs);
        this.jumpCooldownMs = Math.max(0, this.jumpCooldownMs - deltaMs);
        this.jumpTimerMs = Math.max(0, this.jumpTimerMs - deltaMs);
        if (input.jump && this.jumpCooldownMs === 0) {
            this.jumpTimerMs = SpanielSmashGame.jumpDurationMs;
            this.jumpCooldownMs = this.puddleSlowMs > 0 ? 760 : 560;
        }
        if (this.laneSwitchCooldownMs > 0) {
            return;
        }
        const laneSwitchCooldown = this.puddleSlowMs > 0 ? 230 : 140;
        if (input.left && !input.right) {
            if (this.wetPaintSlipMs > 0 && this.rng() < 0.4) {
                this.laneSwitchCooldownMs = 260;
                return;
            }
            this.playerLane = Math.max(this.minPlayableLane(), this.playerLane - 1);
            this.laneSwitchCooldownMs = laneSwitchCooldown;
        }
        if (input.right && !input.left) {
            if (this.wetPaintSlipMs > 0 && this.rng() < 0.4) {
                this.laneSwitchCooldownMs = 260;
                return;
            }
            this.playerLane = Math.min(this.maxPlayableLane(), this.playerLane + 1);
            this.laneSwitchCooldownMs = laneSwitchCooldown;
        }
    }
    spawnEntity() {
        const spawnLane = this.pickSpawnLane();
        const spawnX = this.laneX(spawnLane);
        const movingDirection = this.rng() < 0.5 ? 1 : -1;
        const movingSpawnY = movingDirection === 1 ? -26 : this.height + 26;
        if (this.witchAttackActive && !this.entities.some((entity) => entity.type === "andy")) {
            this.entities.push(this.makeEntityFromTemplate({ type: "andy", obstacleId: "mini-boss-bulldog", jumpRule: "high", widthScale: 0.56, height: 32, speed: SpanielSmashGame.movingEntityBaseSpeed, moving: true }, "super-rare", spawnLane, spawnX, movingDirection, movingSpawnY));
            return;
        }
        this.rareSpawnClock += 450;
        this.superRareSpawnClock += 450;
        this.mythicSpawnClock += 450;
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
    spawnTieredObstacle(tier, spawnLane, spawnX, movingDirection, movingSpawnY) {
        const templates = tier === "standard" ? STANDARD_OBSTACLES : tier === "rare" ? RARE_OBSTACLES : tier === "super-rare" ? SUPER_RARE_OBSTACLES : MYTHIC_OBSTACLES;
        const template = templates[Math.floor(this.rng() * templates.length)] ?? templates[0];
        this.entities.push(this.makeEntityFromTemplate(template, tier, spawnLane, spawnX, movingDirection, movingSpawnY));
    }
    makeEntityFromTemplate(template, tier, spawnLane, spawnX, movingDirection, movingSpawnY) {
        const behaviorState = this.createBehaviorState(template.type, movingDirection);
        const isLanePatch = template.type === "puddle-patch" || template.type === "ice-patch";
        const isDroneTelegraph = behaviorState?.kind === "droneDrop" && behaviorState.phase === "telegraph";
        const isMoving = template.moving && !isLanePatch && !isDroneTelegraph;
        const speedVariance = isMoving ? this.rng() * 0.35 : 0;
        return {
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
    createBehaviorState(type, movingDirection) {
        if (type === "drone-package-drop") {
            return { kind: "droneDrop", phase: "telegraph", phaseMs: SpanielSmashGame.droneTelegraphDurationMs };
        }
        if (type === "helicopter-downdraft") {
            return { kind: "downdraft", pushDirection: movingDirection, pushCooldownMs: 0 };
        }
        return undefined;
    }
    rollRareSpawnMs() { return 10000 + Math.floor(this.rng() * 10001); }
    rollSuperRareSpawnMs() { return 60000 + Math.floor(this.rng() * 540001); }
    rollMythicSpawnMs() { return 30000 + Math.floor(this.rng() * 60001); }
    tickPlayerEffectTimers(deltaMs) {
        this.puddleSlowMs = Math.max(0, this.puddleSlowMs - deltaMs);
        this.wetPaintSlipMs = Math.max(0, this.wetPaintSlipMs - deltaMs);
    }
    tickEntityBehaviorState(entity, deltaMs) {
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
        }
    }
    applyDowndraftPushes() {
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
    canClearByJump(entity) {
        if (this.jumpTimerMs <= 0) {
            return false;
        }
        if (entity.type === "rock") {
            return true;
        }
        return entity.jumpRule === "low" || entity.jumpRule === "high";
    }
    resolveCollisions() {
        const player = this.playerCollisionBounds();
        const survivors = [];
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
                this.puddleSlowMs = SpanielSmashGame.puddleSlowDurationMs;
                survivors.push(entity);
                continue;
            }
            if (entity.type === "ice-patch") {
                this.wetPaintSlipMs = SpanielSmashGame.wetPaintSlipDurationMs;
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
                this.mythicUnlocked = this.mythicUnlocked || this.spanielsSmashed >= 25;
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
    playerCollisionBounds() {
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
    entityCollisionBounds(entity) {
        const bounds = { x: entity.x, y: entity.y, width: entity.width, height: entity.height };
        if (entity.type === "rock" || entity.type === "drone-package-drop") {
            return {
                x: bounds.x + bounds.width * 0.12,
                y: bounds.y + bounds.height * 0.18,
                width: bounds.width * 0.76,
                height: bounds.height * 0.58
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
    resolveEntityCollisions() {
        const indicesToTransform = new Set();
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
            this.spawnSmashEffect(entity.x, entity.y, entity.type === "spaniel" ? "spaniel-smash" : "obstacle-crash");
            this.entities[index] = {
                ...entity,
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
    isMovingObstacle(entity) { return entity.type === "skier" || entity.type === "spaniel" || entity.type === "andy" || entity.type === "helicopter-downdraft"; }
    spawnSmashEffect(x, y, kind) { this.effects.push({ kind, x, y, ttlMs: 300, maxTtlMs: 300 }); }
    spawnBloodstain(entity) {
        this.entities.push({ type: "bloodstain", x: this.laneX(this.entityLane(entity)), y: entity.y + entity.height + 4, width: this.laneWidth * 0.55, height: 18, speed: SpanielSmashGame.staticObstacleSpeed, lane: this.entityLane(entity), laneSwitchCooldownMs: 0, direction: 1, crashAnimationMs: 0 });
    }
    tickEffects(deltaMs) {
        this.effects = this.effects.map((effect) => {
            const ttlMs = Math.max(0, effect.ttlMs - deltaMs);
            if (effect.kind !== "coin-pop") {
                return { ...effect, ttlMs };
            }
            const travelUnit = deltaMs / 16.67;
            return { ...effect, ttlMs, x: effect.x + 3 * travelUnit, y: effect.y - 0.8 * travelUnit };
        }).filter((effect) => effect.ttlMs > 0);
    }
    forceSpawn(entity) {
        if (!entity.behaviorState) {
            entity.behaviorState = this.createBehaviorState(entity.type, entity.direction ?? 1);
        }
        entity.lane = this.entityLane(entity);
        entity.x = this.laneX(entity.lane);
        entity.laneSwitchCooldownMs ??= 0;
        entity.direction ??= 1;
        entity.crashAnimationMs ??= 0;
        this.entities.push(entity);
    }
    restart() {
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
    }
    snapshot() {
        return {
            lives: this.lives,
            score: this.score,
            speedLevel: this.speedLevel,
            spanielsSmashed: this.spanielsSmashed,
            isGameOver: this.gameOver,
            playerX: this.playerX(),
            playerY: this.playerY(),
            playerJumpOffset: this.playerJumpOffset(),
            isCrashActive: this.crashFreezeMs > 0,
            sideObstacleOffsetY: this.sideObstacleOffsetY,
            activeEffects: {
                puddleSlowMs: this.puddleSlowMs,
                wetPaintSlipMs: this.wetPaintSlipMs
            },
            entities: this.entities.map((entity) => ({ ...entity, behaviorState: entity.behaviorState ? { ...entity.behaviorState } : undefined })),
            effects: this.effects.map((effect) => ({ ...effect }))
        };
    }
    playerJumpOffset() {
        if (this.jumpTimerMs <= 0) {
            return 0;
        }
        const progress = 1 - this.jumpTimerMs / SpanielSmashGame.jumpDurationMs;
        return Math.sin(Math.PI * progress) * 26;
    }
    playerX() { return this.laneX(this.playerLane); }
    playerY() { return this.height - Math.floor(this.height / 3) - 34; }
    startingLane() { return Math.floor(this.laneCount / 2); }
    minPlayableLane() { return Math.min(2, Math.floor((this.laneCount - 1) / 2)); }
    maxPlayableLane() { return Math.max(this.minPlayableLane(), this.laneCount - 1 - this.minPlayableLane()); }
    laneX(lane) { return lane * this.laneWidth + this.laneWidth * 0.22; }
    entityLane(entity) {
        if (typeof entity.lane === "number")
            return Math.max(0, Math.min(this.laneCount - 1, entity.lane));
        const lane = Math.round((entity.x - this.laneWidth * 0.22) / this.laneWidth);
        return Math.max(0, Math.min(this.laneCount - 1, lane));
    }
    maybeMoveEntityLane(entity, deltaMs) {
        if (entity.type !== "skier" && entity.type !== "spaniel" && entity.type !== "andy" && entity.type !== "helicopter-downdraft")
            return;
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
            if (currentLane < this.playerLane)
                targetLane = currentLane + laneStep;
            else if (currentLane > this.playerLane)
                targetLane = currentLane - laneStep;
        }
        else if (this.rng() < 0.3) {
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
    isLaneClearForEntity(entity, lane) {
        for (const other of this.entities) {
            if (other === entity)
                continue;
            if (this.entityLane(other) !== lane)
                continue;
            if (Math.abs(other.y - entity.y) < Math.max(other.height, entity.height) + 4)
                return false;
        }
        return true;
    }
    pickSpawnLane() {
        const preferred = this.minPlayableLane() + Math.floor(this.rng() * (this.maxPlayableLane() - this.minPlayableLane() + 1));
        if (this.isSpawnLaneClear(preferred))
            return preferred;
        for (let offset = 1; offset < this.laneCount; offset += 1) {
            const left = preferred - offset;
            const right = preferred + offset;
            if (left >= this.minPlayableLane() && this.isSpawnLaneClear(left))
                return left;
            if (right <= this.maxPlayableLane() && this.isSpawnLaneClear(right))
                return right;
        }
        return preferred;
    }
    isSpawnLaneClear(lane) { return !this.entities.some((entity) => this.entityLane(entity) === lane && entity.y < 40); }
}
function intersects(a, b) {
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
export class PixelRenderer {
    ctx;
    width;
    height;
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }
    render(snapshot) {
        this.ctx.fillStyle = "#f3fbff";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#f3fbff";
        this.ctx.fillRect(20, 0, this.width - 40, this.height);
        this.drawSlopeEdges(snapshot.sideObstacleOffsetY);
        if (snapshot.isCrashActive) {
            drawCrashedSkier(this.ctx, snapshot.playerX, snapshot.playerY, "#2e3fbc", "#ffd166");
        }
        else {
            drawSkier(this.ctx, snapshot.playerX, snapshot.playerY - snapshot.playerJumpOffset, "#2e3fbc", "#ffd166", snapshot.playerJumpOffset);
            if (snapshot.playerJumpOffset > 0) {
                drawJumpShadow(this.ctx, snapshot.playerX, snapshot.playerY, snapshot.playerJumpOffset);
            }
        }
        for (const entity of snapshot.entities) {
            if (entity.type === "puddle-patch") {
                drawPuddlePatch(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "ice-patch") {
                drawIcePatch(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "drone-package-drop") {
                if (entity.behaviorState?.kind === "droneDrop" && entity.behaviorState.phase === "telegraph") {
                    drawDroneTelegraph(this.ctx, entity.x, entity.y);
                }
                else {
                    drawDroneCrate(this.ctx, entity.x, entity.y);
                }
            }
            else if (entity.type === "helicopter-downdraft") {
                if (entity.behaviorState?.kind === "downdraft") {
                    drawDowndraftZone(this.ctx, entity.x, entity.y, entity.behaviorState.pushDirection);
                }
                else {
                    drawDowndraftZone(this.ctx, entity.x, entity.y, 1);
                }
            }
            else if (entity.type === "tree")
                drawTree(this.ctx, entity.x, entity.y);
            else if (entity.type === "rock") {
                if ((entity.crashAnimationMs ?? 0) > 0)
                    drawCrashPulse(this.ctx, entity.x, entity.y, entity.crashAnimationMs ?? 0, "#ffa500");
                drawRock(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "skier")
                drawSkier(this.ctx, entity.x, entity.y, "#3a86ff", "#f1fa8c");
            else if (entity.type === "spaniel")
                drawSpaniel(this.ctx, entity.x, entity.y);
            else if (entity.type === "bloodstain")
                drawBloodstain(this.ctx, entity.x, entity.y);
            else
                drawWitch(this.ctx, entity.x, entity.y);
        }
        for (const effect of snapshot.effects)
            drawSmashEffect(this.ctx, effect);
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
        if (snapshot.isGameOver) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = "#fff";
            this.ctx.fillText("GAME OVER", this.width / 2 - 56, this.height / 2);
            this.ctx.fillText(`Final Score ${snapshot.score}`, this.width / 2 - 78, this.height / 2 + 24);
            this.ctx.fillText("Tap Restart below", this.width / 2 - 70, this.height / 2 + 48);
        }
    }
    drawSlopeEdges(offsetY) {
        const placements = this.computeSlopeEdgeDecorations(offsetY);
        for (const placement of placements) {
            if (placement.kind === "tree") {
                drawTree(this.ctx, placement.x, placement.y);
            }
            else {
                drawRock(this.ctx, placement.x, placement.y);
            }
        }
    }
    computeSlopeEdgeDecorations(offsetY) {
        const treeSpacing = 54;
        const rockSpacing = 170;
        const treeStart = -16 + (offsetY % treeSpacing);
        const rockStart = 45 + (offsetY % rockSpacing);
        const placements = [];
        const tryPlace = (kind, x, y) => {
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
    sideDecorationBounds(kind, x, y) {
        if (kind === "tree") {
            return { x, y, width: 20, height: 30 };
        }
        return { x: x + 2, y: y + 2, width: 16, height: 12 };
    }
}
function drawTree(ctx, x, y) { ctx.fillStyle = "#2d6a4f"; ctx.fillRect(x + 3, y, 14, 18); ctx.fillRect(x, y + 8, 20, 12); ctx.fillStyle = "#7f5539"; ctx.fillRect(x + 8, y + 20, 4, 10); }
function drawRock(ctx, x, y) { ctx.fillStyle = "#6c757d"; ctx.fillRect(x + 2, y + 4, 16, 10); ctx.fillStyle = "#adb5bd"; ctx.fillRect(x + 5, y + 2, 10, 4); }
function drawBloodstain(ctx, x, y) { ctx.fillStyle = "#7f1d1d"; ctx.fillRect(x + 1, y + 8, 20, 7); ctx.fillStyle = "#b91c1c"; ctx.fillRect(x + 4, y + 5, 14, 4); }
function drawSpaniel(ctx, x, y) { ctx.fillStyle = "#f4a261"; ctx.fillRect(x, y, 20, 14); ctx.fillRect(x + 14, y - 3, 8, 8); ctx.fillStyle = "#2a9d8f"; ctx.fillRect(x + 18, y - 1, 2, 4); }
function drawPuddlePatch(ctx, x, y) {
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(x + 1, y + 12, 20, 8);
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(x + 3, y + 10, 8, 3);
    ctx.fillRect(x + 13, y + 11, 6, 3);
    ctx.fillStyle = "#bfdbfe";
    ctx.fillRect(x + 8, y + 12, 3, 1);
}
function drawIcePatch(ctx, x, y) {
    ctx.fillStyle = "#93c5fd";
    ctx.fillRect(x + 1, y + 10, 20, 10);
    ctx.fillStyle = "#dbeafe";
    ctx.fillRect(x + 4, y + 11, 14, 2);
    ctx.fillRect(x + 5, y + 15, 12, 2);
    ctx.fillStyle = "#60a5fa";
    ctx.fillRect(x + 2, y + 19, 18, 1);
}
function drawDroneTelegraph(ctx, x, y) {
    ctx.fillStyle = "rgba(239, 68, 68, 0.75)";
    ctx.fillRect(x + 3, y + 11, 14, 2);
    ctx.fillRect(x + 9, y + 6, 2, 12);
    ctx.fillStyle = "rgba(248, 113, 113, 0.55)";
    ctx.fillRect(x + 1, y + 9, 18, 1);
    ctx.fillRect(x + 1, y + 15, 18, 1);
}
function drawDroneCrate(ctx, x, y) {
    ctx.fillStyle = "#92400e";
    ctx.fillRect(x + 3, y + 6, 16, 14);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(x + 4, y + 7, 14, 12);
    ctx.fillStyle = "#7c2d12";
    ctx.fillRect(x + 9, y + 7, 2, 12);
    ctx.fillRect(x + 4, y + 12, 14, 2);
}
function drawSkier(ctx, x, y, bodyColor, helmetColor, jumpOffset = 0) {
    const inAir = jumpOffset > 0;
    const bodyHeight = inAir ? 12 : 14;
    const bodyY = inAir ? y + 11 : y + 10;
    const helmetY = inAir ? y + 2 : y + 3;
    const skiInset = inAir ? 2 : 0;
    const skiWidth = inAir ? 20 : 24;
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 5, bodyY, 12, bodyHeight);
    ctx.fillStyle = helmetColor;
    ctx.fillRect(x + 7, helmetY, 8, 8);
    ctx.fillStyle = "#264653";
    ctx.fillRect(x + skiInset, y + 22, skiWidth, 2);
    ctx.fillRect(x + skiInset, y + 25, skiWidth, 2);
}
function drawDowndraftZone(ctx, x, y, pushDirection) {
    ctx.fillStyle = "#334155";
    ctx.fillRect(x + 5, y + 1, 12, 6);
    ctx.fillRect(x + 2, y + 3, 18, 2);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(x + 8, y + 2, 6, 2);
    const gustX = pushDirection === 1 ? x + 16 : x + 2;
    ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
    ctx.fillRect(gustX, y + 8, 2, 5);
    ctx.fillRect(gustX + (pushDirection === 1 ? 2 : -2), y + 12, 2, 6);
    ctx.fillRect(gustX + (pushDirection === 1 ? 4 : -4), y + 16, 2, 6);
}
function drawWitch(ctx, x, y) { ctx.fillStyle = "#1f2937"; ctx.fillRect(x + 4, y + 4, 14, 2); ctx.fillStyle = "#4c1d95"; ctx.fillRect(x + 7, y, 8, 5); ctx.fillRect(x + 6, y + 6, 10, 10); ctx.fillStyle = "#f59e0b"; ctx.fillRect(x + 9, y + 5, 4, 1); ctx.fillStyle = "#86efac"; ctx.fillRect(x + 8, y + 8, 6, 5); ctx.fillStyle = "#111827"; ctx.fillRect(x + 9, y + 9, 1, 1); ctx.fillRect(x + 12, y + 9, 1, 1); ctx.fillStyle = "#7c2d12"; ctx.fillRect(x + 2, y + 17, 20, 2); ctx.fillStyle = "#fbbf24"; ctx.fillRect(x + 17, y + 16, 3, 3); }
function drawCrashedSkier(ctx, x, y, bodyColor, helmetColor) { ctx.fillStyle = bodyColor; ctx.fillRect(x + 3, y + 16, 18, 10); ctx.fillStyle = helmetColor; ctx.fillRect(x - 1, y + 12, 8, 8); ctx.fillStyle = "#264653"; ctx.fillRect(x - 2, y + 25, 28, 2); ctx.fillRect(x + 8, y + 7, 2, 22); }
function drawJumpShadow(ctx, x, y, jumpOffset) { const width = Math.max(6, 16 - jumpOffset / 3); ctx.fillStyle = "rgba(15, 23, 42, 0.25)"; ctx.fillRect(x + 12 - width / 2, y + 26, width, 2); }
function drawSmashEffect(ctx, effect) {
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
function drawCrashPulse(ctx, x, y, crashAnimationMs, color) {
    const intensity = Math.max(0.2, crashAnimationMs / 260);
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y + 2, 22 * intensity, 3);
}
