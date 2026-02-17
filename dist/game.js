const STANDARD_OBSTACLES = [
    { type: "spaniel", obstacleId: "bouncing-ball", jumpRule: "low", widthScale: 0.45, height: 18, speed: 1.7, moving: true, minLevel: 1, weight: 1.4 },
    { type: "spaniel", obstacleId: "squirrel-zigzag", jumpRule: "none", widthScale: 0.5, height: 22, speed: 1.8, moving: true, minLevel: 1, weight: 1.35 },
    { type: "slalom-poles", obstacleId: "slalom-poles", jumpRule: "low", widthScale: 0.48, height: 28, speed: 2.2, moving: false, minLevel: 1, weight: 1.8 },
    { type: "tree", obstacleId: "cracked-sidewalk-slab", jumpRule: "low", widthScale: 0.5, height: 24, speed: 2.2, moving: false, minLevel: 1, weight: 0.9 },
    { type: "rock", obstacleId: "trash-bag-cluster", jumpRule: "low", widthScale: 0.55, height: 22, speed: 2.2, moving: false, minLevel: 1, weight: 0.85 },
    { type: "tree", obstacleId: "construction-cone-pair", jumpRule: "low", widthScale: 0.52, height: 24, speed: 2.2, moving: false, minLevel: 1, weight: 0.75 },
    { type: "ice-patch", obstacleId: "ice-patch", jumpRule: "none", widthScale: 0.58, height: 20, speed: 2.2, moving: false, minLevel: 2, weight: 0.8 },
    { type: "skier", obstacleId: "rolling-skateboard", jumpRule: "low", widthScale: 0.56, height: 28, speed: 1.6, moving: true, minLevel: 2, weight: 0.7 },
    { type: "tree", obstacleId: "mail-crate-stack", jumpRule: "high", widthScale: 0.58, height: 32, speed: 2.2, moving: false, minLevel: 3, weight: 0.6 },
    { type: "skier", obstacleId: "jogger-crossing", jumpRule: "none", widthScale: 0.56, height: 30, speed: 1.4, moving: true, minLevel: 3, weight: 0.55 }
];
const RARE_OBSTACLES = [
    { type: "tree", obstacleId: "fence-segment", jumpRule: "high", widthScale: 0.62, height: 36, speed: 2.3, moving: false, minLevel: 1, weight: 0.95 },
    { type: "rock", obstacleId: "open-manhole", jumpRule: "high", widthScale: 0.6, height: 28, speed: 2.3, moving: false, minLevel: 1, weight: 0.9 },
    { type: "spaniel", obstacleId: "leashed-dog-lunge", jumpRule: "none", widthScale: 0.52, height: 22, speed: 1.7, moving: true, minLevel: 2, weight: 0.8 },
    { type: "black-spaniel", obstacleId: "black-spaniel", jumpRule: "none", widthScale: 0.52, height: 22, speed: 1.75, moving: true, minLevel: 2, weight: 0.36 },
    { type: "ski-school-instructor", obstacleId: "ski-school-snake", jumpRule: "low", widthScale: 0.56, height: 30, speed: 1.5, moving: true, minLevel: 3, weight: 0.42 },
    { type: "ice-crevasse", obstacleId: "ice-crevasse", jumpRule: "high", widthScale: 1.55, height: 24, speed: 2.25, moving: false, minLevel: 2, weight: 0.42 },
    { type: "puddle-patch", obstacleId: "puddle-patch", jumpRule: "none", widthScale: 0.52, height: 20, speed: 2.2, moving: false, minLevel: 2, weight: 0.72 },
    { type: "rock", obstacleId: "glass-debris-field", jumpRule: "low", widthScale: 0.58, height: 22, speed: 2.3, moving: false, minLevel: 2, weight: 0.78 },
    { type: "skier", obstacleId: "fallen-signboard", jumpRule: "high", widthScale: 0.62, height: 30, speed: 1.5, moving: true, minLevel: 3, weight: 0.64 },
    { type: "drone-package-drop", obstacleId: "drone-package-drop", jumpRule: "low", widthScale: 0.54, height: 24, speed: 2.1, moving: false, minLevel: 3, weight: 0.5 },
    { type: "skier", obstacleId: "scooter-rider", jumpRule: "none", widthScale: 0.58, height: 32, speed: 2.0, moving: true, minLevel: 3, weight: 0.54 }
];
const SUPER_RARE_OBSTACLES = [
    { type: "tree", obstacleId: "collapsed-scaffolding", jumpRule: "high", widthScale: 0.75, height: 40, speed: 2.5, moving: false, minLevel: 2, weight: 0.9 },
    { type: "rock", obstacleId: "roadwork-trench", jumpRule: "high", widthScale: 0.76, height: 40, speed: 2.45, moving: false, minLevel: 2, weight: 0.82 },
    { type: "tree", obstacleId: "blocked-intersection", jumpRule: "none", widthScale: 0.8, height: 38, speed: 2.3, moving: false, minLevel: 3, weight: 0.7 },
    { type: "rock", obstacleId: "statue-base-rubble", jumpRule: "high", widthScale: 0.72, height: 34, speed: 2.4, moving: false, minLevel: 3, weight: 0.66 },
    { type: "helicopter-downdraft", obstacleId: "helicopter-downdraft", jumpRule: "none", widthScale: 0.66, height: 32, speed: 1.8, moving: true, minLevel: 3, weight: 0.58 },
    { type: "naked-skier", obstacleId: "naked-skier", jumpRule: "low", widthScale: 0.58, height: 30, speed: 1.95, moving: true, minLevel: 4, weight: 0.16 }
];
const MYTHIC_OBSTACLES = [
    { type: "skier", obstacleId: "mirror-maze-gate", jumpRule: "none", widthScale: 0.66, height: 32, speed: 1.7, moving: true },
    { type: "spaniel", obstacleId: "frozen-street-tile-set", jumpRule: "low", widthScale: 0.6, height: 20, speed: 1.6, moving: true },
    { type: "tree", obstacleId: "ancient-bell-tower-debris", jumpRule: "high", widthScale: 0.7, height: 36, speed: 2.4, moving: false },
    { type: "rock", obstacleId: "meteor-shard-rain", jumpRule: "high", widthScale: 0.66, height: 30, speed: 2.4, moving: false }
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
    levelSpanielsSmashed = 0;
    gameOver = false;
    andyBossActive = false;
    victory = false;
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
    playerImmortalMs = 0;
    levelUpBannerMs = 0;
    levelTransitionBoostMs = 0;
    nextBossSpanielGoal = 12;
    nextEntityId = 1;
    touchingSurfaceEntityIds = new Set();
    static staticObstacleSpeed = 2.2;
    static movingEntityBaseSpeed = 1.2;
    static jumpDurationMs = 520;
    static puddleSlowDurationMs = 900;
    static icePatchBoostDurationMs = 1400;
    static droneTelegraphDurationMs = 650;
    static downdraftPushIntervalMs = 180;
    static andyBossEnterY = 58;
    static andyBossHoverDurationMs = 20000;
    static andyBossEnterSpeed = 2.05;
    static andyBossExitSpeed = 1.95;
    static andyBossLaneMoveMs = 240;
    static andyBossThrowMinMs = 820;
    static andyBossThrowMaxMs = 1500;
    static andyBossThrowMinFloorMs = 260;
    static andyBossThrowRangeFloorMs = 180;
    static andyThrowLevelReductionMs = 60;
    static andyBossBonusScore = 1800;
    static entityCullMarginPx = 40;
    static levelStartImmortalMs = 2600;
    static respawnImmortalMs = 2200;
    static levelUpBannerDurationMs = 1800;
    static levelTransitionBoostDurationMs = 3800;
    static levelTransitionSpawnIntervalMs = 230;
    static levelTransitionSpawnFloorMs = 150;
    static levelOneBaseSpawnIntervalMs = 540;
    static spawnIntervalLevelStepMs = 50;
    static minSpawnIntervalMs = 160;
    static levelOneStandardSpanielChance = 0.56;
    static levelSpeedStepMultiplier = 0.2;
    static levelTransitionScrollMultiplier = 1.2;
    // Speed/spawn tuning caps at level 6; campaign progression continues to victoryLevel.
    static maxSpeedLevel = 6;
    static pooBagSpeed = 2.8;
    static pooBagWidthScale = 0.34;
    static pooBagHeight = 16;
    static maxPuddleStackMs = 5400;
    static maxIceStackMs = 5600;
    static maxEffectStacks = 4;
    static defaultLaneSwitchCooldownMs = 140;
    static defaultJumpCooldownMs = 560;
    static puddleLaneSwitchCooldownMs = 280;
    static puddleJumpCooldownMs = 920;
    static iceLaneSwitchCooldownMs = 80;
    static iceJumpCooldownMs = 360;
    static puddleScrollSpeedMultiplier = 0.72;
    static iceScrollSpeedMultiplier = 1.35;
    static skiSchoolObstacleId = "ski-school-snake";
    static skiSchoolMinChildren = 3;
    static skiSchoolBaseChildren = 3;
    static skiSchoolMaxChildren = 16;
    static skiSchoolInstructorWidthScale = 0.56;
    static skiSchoolChildWidthScale = 0.5;
    static skiSchoolInstructorHeight = 30;
    static skiSchoolChildHeight = 28;
    static skiSchoolSegmentSpacingPx = 16;
    static skiSchoolWavePeriodMs = 1080;
    static skiSchoolWaveOffsetMs = 170;
    static skiSchoolSpeedVariance = 0.16;
    static victoryLevel = 10;
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
        this.playerImmortalMs = 0;
    }
    step(deltaMs, input) {
        if (this.gameOver) {
            return;
        }
        this.tickEffects(deltaMs);
        this.tickRuntimeTimers(deltaMs);
        if (this.crashFreezeMs > 0) {
            this.crashFreezeMs = Math.max(0, this.crashFreezeMs - deltaMs);
            if (this.crashFreezeMs > 0) {
                return;
            }
        }
        this.handleInput(input, deltaMs);
        this.spawnClock += deltaMs;
        const spawnIntervalMs = this.currentSpawnIntervalMs();
        while (this.spawnClock >= spawnIntervalMs) {
            this.spawnClock -= spawnIntervalMs;
            this.spawnEntity();
        }
        const speedMultiplier = this.currentLevelSpeedMultiplier() * this.currentScrollSpeedMultiplier();
        this.sideObstacleOffsetY += SpanielSmashGame.staticObstacleSpeed * speedMultiplier * (deltaMs / 16.67);
        for (const entity of this.entities) {
            this.tickEntityBehaviorState(entity, deltaMs);
            this.maybeMoveEntityLane(entity, deltaMs);
            entity.y += entity.speed * (entity.direction ?? 1) * speedMultiplier * (deltaMs / 16.67);
            entity.x = this.laneX(this.entityLane(entity));
            entity.crashAnimationMs = Math.max(0, (entity.crashAnimationMs ?? 0) - deltaMs);
            this.maybeCompleteBossFromOffscreenExit(entity);
        }
        this.applyDowndraftPushes();
        this.resolveEntityCollisions();
        this.resolveCollisions();
        this.maybeStartBossEncounter();
        this.handleBossExitState();
        this.entities = this.entities.filter((entity) => entity.y < this.height + SpanielSmashGame.entityCullMarginPx && entity.y + entity.height > -SpanielSmashGame.entityCullMarginPx);
    }
    handleInput(input, deltaMs) {
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
    currentControlProfile() {
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
    currentScrollSpeedMultiplier() {
        const puddleStacks = this.effectStacks(this.puddleSlowMs, SpanielSmashGame.puddleSlowDurationMs);
        const iceStacks = this.effectStacks(this.wetPaintSlipMs, SpanielSmashGame.icePatchBoostDurationMs);
        const levelTransition = this.levelTransitionBoostMs > 0 ? SpanielSmashGame.levelTransitionScrollMultiplier : 1;
        const effectSpeed = Math.pow(SpanielSmashGame.puddleScrollSpeedMultiplier, puddleStacks)
            * Math.pow(SpanielSmashGame.iceScrollSpeedMultiplier, iceStacks);
        return Math.max(0.35, Math.min(2.5, levelTransition * effectSpeed));
    }
    currentLevelSpeedMultiplier() {
        const effectiveLevel = Math.min(this.speedLevel, SpanielSmashGame.maxSpeedLevel);
        return 1 + (effectiveLevel - 1) * SpanielSmashGame.levelSpeedStepMultiplier;
    }
    currentSpawnIntervalMs() {
        const effectiveLevel = Math.min(this.speedLevel, SpanielSmashGame.maxSpeedLevel);
        const baselineSpawnInterval = Math.max(SpanielSmashGame.minSpawnIntervalMs, SpanielSmashGame.levelOneBaseSpawnIntervalMs - (effectiveLevel - 1) * SpanielSmashGame.spawnIntervalLevelStepMs);
        if (this.levelTransitionBoostMs > 0) {
            return Math.max(SpanielSmashGame.levelTransitionSpawnFloorMs, Math.min(SpanielSmashGame.levelTransitionSpawnIntervalMs, baselineSpawnInterval - 80));
        }
        return baselineSpawnInterval;
    }
    effectStacks(ms, durationMs) {
        if (ms <= 0) {
            return 0;
        }
        return Math.min(SpanielSmashGame.maxEffectStacks, Math.ceil(ms / durationMs));
    }
    spawnEntity() {
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
        const extraSpawnRoll = this.rng();
        if (this.speedLevel >= 4 && extraSpawnRoll < Math.min(0.55, (this.speedLevel - 3) * 0.08)) {
            const bonusLane = this.pickSpawnLane();
            const bonusDirection = this.rng() < 0.5 ? 1 : -1;
            const bonusY = bonusDirection === 1 ? -26 : this.height + 26;
            this.spawnTieredObstacle(this.speedLevel >= 7 && this.rng() < 0.42 ? "rare" : "standard", bonusLane, this.laneX(bonusLane), bonusDirection, bonusY);
        }
    }
    spawnTieredObstacle(tier, spawnLane, spawnX, movingDirection, movingSpawnY) {
        const template = this.pickTemplateForTier(tier);
        if (template.type === "ski-school-instructor") {
            this.spawnSkiSchoolSnake(spawnLane, movingDirection, tier, this.skiSchoolChildrenForLevel());
            return;
        }
        this.entities.push(this.makeEntityFromTemplate(template, tier, spawnLane, spawnX, movingDirection, movingSpawnY));
    }
    templatesForTier(tier) {
        const templates = tier === "standard" ? STANDARD_OBSTACLES : tier === "rare" ? RARE_OBSTACLES : tier === "super-rare" ? SUPER_RARE_OBSTACLES : MYTHIC_OBSTACLES;
        return templates.filter((template) => {
            const minLevel = template.minLevel ?? 1;
            const maxLevel = template.maxLevel ?? Number.POSITIVE_INFINITY;
            return this.speedLevel >= minLevel && this.speedLevel <= maxLevel;
        });
    }
    pickWeightedTemplate(templates) {
        const totalWeight = templates.reduce((sum, template) => sum + Math.max(0.01, template.weight ?? 1), 0);
        let cursor = this.rng() * totalWeight;
        for (const template of templates) {
            cursor -= Math.max(0.01, template.weight ?? 1);
            if (cursor <= 0) {
                return template;
            }
        }
        return templates[templates.length - 1] ?? STANDARD_OBSTACLES[0];
    }
    pickTemplateForTier(tier) {
        let templates = this.templatesForTier(tier);
        if (templates.length === 0 && tier !== "standard") {
            templates = this.templatesForTier("standard");
        }
        if (templates.length === 0) {
            templates = STANDARD_OBSTACLES;
        }
        const roll = this.rng();
        if (tier === "standard" && this.speedLevel === 1) {
            const spanielTemplates = templates.filter((template) => template.type === "spaniel" || template.type === "black-spaniel");
            const nonSpanielTemplates = templates.filter((template) => template.type !== "spaniel" && template.type !== "black-spaniel");
            if (spanielTemplates.length > 0 && nonSpanielTemplates.length > 0) {
                if (roll < SpanielSmashGame.levelOneStandardSpanielChance) {
                    return this.pickWeightedTemplate(spanielTemplates);
                }
                return this.pickWeightedTemplate(nonSpanielTemplates);
            }
        }
        return this.pickWeightedTemplate(templates);
    }
    makeEntityFromTemplate(template, tier, spawnLane, spawnX, movingDirection, movingSpawnY) {
        const behaviorState = this.createBehaviorState(template.type, movingDirection);
        const isLanePatch = template.type === "puddle-patch" || template.type === "ice-patch";
        const isDroneTelegraph = behaviorState?.kind === "droneDrop" && behaviorState.phase === "telegraph";
        const isMoving = template.moving && !isLanePatch && !isDroneTelegraph;
        const speedVariance = isMoving ? this.rng() * 0.35 : 0;
        const staticSpawnY = template.type === "ice-crevasse" ? -30 : -24;
        return {
            id: this.nextEntityId++,
            type: template.type,
            obstacleId: template.obstacleId,
            obstacleTier: tier,
            jumpRule: template.jumpRule,
            behaviorState,
            x: spawnX,
            y: isDroneTelegraph ? this.playerY() + 8 : isMoving ? movingSpawnY : staticSpawnY,
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
    skiSchoolChildrenForLevel(level = this.speedLevel) {
        const scaled = SpanielSmashGame.skiSchoolBaseChildren + Math.max(0, level - 3) * 2;
        return Math.max(SpanielSmashGame.skiSchoolMinChildren, Math.min(SpanielSmashGame.skiSchoolMaxChildren, scaled));
    }
    skiSchoolLaneSpanForLevel(level = this.speedLevel) {
        return level >= 7 ? 2 : 1;
    }
    clampSkiSchoolAnchorLane(lane, laneSpan) {
        const minAnchor = this.minPlayableLane() + laneSpan;
        const maxAnchor = this.maxPlayableLane() - laneSpan;
        if (minAnchor > maxAnchor) {
            return Math.max(this.minPlayableLane(), Math.min(this.maxPlayableLane(), lane));
        }
        return Math.max(minAnchor, Math.min(maxAnchor, lane));
    }
    computeSkiSchoolLane(anchorLane, laneSpan, phaseMs, wavePeriodMs) {
        const normalizedPhaseMs = ((phaseMs % wavePeriodMs) + wavePeriodMs) % wavePeriodMs;
        const theta = (normalizedPhaseMs / wavePeriodMs) * Math.PI * 2;
        const lane = Math.round(anchorLane + Math.sin(theta) * laneSpan);
        return Math.max(this.minPlayableLane(), Math.min(this.maxPlayableLane(), lane));
    }
    spawnSkiSchoolSnake(spawnLane, movingDirection, tier, childrenCount, spawnYOverride) {
        const laneSpan = this.skiSchoolLaneSpanForLevel();
        const anchorLane = this.clampSkiSchoolAnchorLane(spawnLane, laneSpan);
        const childTotal = Math.max(SpanielSmashGame.skiSchoolMinChildren, Math.min(SpanielSmashGame.skiSchoolMaxChildren, Math.floor(childrenCount)));
        const baseY = typeof spawnYOverride === "number"
            ? spawnYOverride
            : movingDirection === 1 ? -30 : this.height + 30;
        const waveSeedMs = Math.floor(this.rng() * SpanielSmashGame.skiSchoolWavePeriodMs);
        const baseSpeed = 1.36 + this.rng() * SpanielSmashGame.skiSchoolSpeedVariance;
        const totalRiders = childTotal + 1;
        for (let riderIndex = 0; riderIndex < totalRiders; riderIndex += 1) {
            const isInstructor = riderIndex === 0;
            const phaseOffsetMs = riderIndex * SpanielSmashGame.skiSchoolWaveOffsetMs;
            const lane = this.computeSkiSchoolLane(anchorLane, laneSpan, waveSeedMs + phaseOffsetMs, SpanielSmashGame.skiSchoolWavePeriodMs);
            const verticalOffset = riderIndex * SpanielSmashGame.skiSchoolSegmentSpacingPx;
            this.entities.push({
                id: this.nextEntityId++,
                type: isInstructor ? "ski-school-instructor" : "ski-school-child",
                obstacleId: SpanielSmashGame.skiSchoolObstacleId,
                obstacleTier: tier,
                jumpRule: "low",
                behaviorState: {
                    kind: "skiSchoolSnake",
                    anchorLane,
                    laneSpan,
                    phaseMs: waveSeedMs,
                    phaseOffsetMs,
                    wavePeriodMs: SpanielSmashGame.skiSchoolWavePeriodMs,
                    paletteIndex: isInstructor ? 0 : riderIndex - 1
                },
                x: this.laneX(lane),
                y: baseY + verticalOffset,
                width: this.laneWidth * (isInstructor ? SpanielSmashGame.skiSchoolInstructorWidthScale : SpanielSmashGame.skiSchoolChildWidthScale),
                height: isInstructor ? SpanielSmashGame.skiSchoolInstructorHeight : SpanielSmashGame.skiSchoolChildHeight,
                speed: baseSpeed,
                lane,
                laneSwitchCooldownMs: 0,
                direction: movingDirection,
                crashAnimationMs: 0
            });
        }
    }
    spawnAndyBoss() {
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
    maybeStartBossEncounter() {
        if (this.andyBossActive) {
            return;
        }
        if (this.levelSpanielsSmashed < this.nextBossSpanielGoal) {
            return;
        }
        this.spawnAndyBoss();
    }
    handleBossExitState() {
        if (this.andyBossActive) {
            return;
        }
        if (this.entities.some((entity) => entity.type === "poo-bag" || (entity.type === "andy" && entity.behaviorState?.kind === "andyBoss"))) {
            this.entities = this.entities.filter((entity) => entity.type !== "poo-bag" && !(entity.type === "andy" && entity.behaviorState?.kind === "andyBoss"));
        }
    }
    completeBossEncounter(defeated) {
        if (!this.andyBossActive) {
            return;
        }
        this.andyBossActive = false;
        if (defeated) {
            this.score += SpanielSmashGame.andyBossBonusScore;
            this.lives += 2;
        }
        if (this.speedLevel >= SpanielSmashGame.victoryLevel) {
            this.victory = true;
            this.gameOver = true;
            this.levelUpBannerMs = 0;
            this.levelTransitionBoostMs = 0;
            return;
        }
        const canAdvanceLevel = this.speedLevel < SpanielSmashGame.victoryLevel;
        if (canAdvanceLevel) {
            this.speedLevel += 1;
        }
        this.crashFreezeMs = 0;
        this.levelSpanielsSmashed = 0;
        this.nextBossSpanielGoal = this.bossSpanielGoalForLevel(this.speedLevel);
        this.levelUpBannerMs = canAdvanceLevel ? SpanielSmashGame.levelUpBannerDurationMs : 0;
        this.levelTransitionBoostMs = canAdvanceLevel ? SpanielSmashGame.levelTransitionBoostDurationMs : 0;
        this.playerImmortalMs = Math.max(this.playerImmortalMs, SpanielSmashGame.levelStartImmortalMs);
        this.spawnClock = Math.min(this.spawnClock, this.currentSpawnIntervalMs() - 1);
    }
    spawnAndyPooBag(andy) {
        const maxSpread = Math.max(0, Math.min(2, Math.floor((this.speedLevel - 3) / 3)));
        const lanes = new Set([this.playerLane]);
        while (lanes.size < 1 + maxSpread) {
            const delta = this.rng() < 0.5 ? -1 : 1;
            const lane = Math.max(this.minPlayableLane(), Math.min(this.maxPlayableLane(), this.playerLane + delta * Math.max(1, Math.floor(this.rng() * 3))));
            lanes.add(lane);
        }
        for (const lane of lanes) {
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
    }
    rollRareSpawnMs() { return 10000 + Math.floor(this.rng() * 10001); }
    rollSuperRareSpawnMs() { return 60000 + Math.floor(this.rng() * 540001); }
    rollMythicSpawnMs() { return 30000 + Math.floor(this.rng() * 60001); }
    rollAndyThrowCooldownMs() {
        const effectiveLevel = Math.min(this.speedLevel, SpanielSmashGame.maxSpeedLevel);
        const reductionMs = (effectiveLevel - 1) * SpanielSmashGame.andyThrowLevelReductionMs;
        const minThrowMs = Math.max(SpanielSmashGame.andyBossThrowMinFloorMs, SpanielSmashGame.andyBossThrowMinMs - reductionMs);
        const maxThrowMs = Math.max(minThrowMs + SpanielSmashGame.andyBossThrowRangeFloorMs, SpanielSmashGame.andyBossThrowMaxMs - reductionMs);
        const span = maxThrowMs - minThrowMs;
        return minThrowMs + Math.floor(this.rng() * (span + 1));
    }
    bossSpanielGoalForLevel(level) {
        const clampedLevel = Math.max(1, Math.min(SpanielSmashGame.maxSpeedLevel, Math.floor(level)));
        if (clampedLevel === 1) {
            return 12;
        }
        return Math.min(14, 10 + ((clampedLevel - 1) % 6));
    }
    maybeCompleteBossFromOffscreenExit(entity) {
        if (!this.andyBossActive || entity.type !== "andy" || entity.behaviorState?.kind !== "andyBoss") {
            return;
        }
        if (entity.y > this.height + SpanielSmashGame.entityCullMarginPx || entity.y + entity.height < -SpanielSmashGame.entityCullMarginPx) {
            this.completeBossEncounter(false);
        }
    }
    tickRuntimeTimers(deltaMs) {
        this.puddleSlowMs = Math.max(0, this.puddleSlowMs - deltaMs);
        this.wetPaintSlipMs = Math.max(0, this.wetPaintSlipMs - deltaMs);
        if (this.crashFreezeMs === 0) {
            this.playerImmortalMs = Math.max(0, this.playerImmortalMs - deltaMs);
        }
        this.levelUpBannerMs = Math.max(0, this.levelUpBannerMs - deltaMs);
        this.levelTransitionBoostMs = Math.max(0, this.levelTransitionBoostMs - deltaMs);
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
            return;
        }
        if (behavior.kind === "skiSchoolSnake") {
            behavior.phaseMs = (behavior.phaseMs + deltaMs) % behavior.wavePeriodMs;
            const lane = this.computeSkiSchoolLane(behavior.anchorLane, behavior.laneSpan, behavior.phaseMs + behavior.phaseOffsetMs, behavior.wavePeriodMs);
            entity.lane = lane;
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
        const nextTouchingSurfaceEntityIds = new Set();
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
                if (this.jumpTimerMs > 0) {
                    survivors.push(entity);
                    continue;
                }
                const id = entity.id ?? -1;
                if (id >= 0) {
                    nextTouchingSurfaceEntityIds.add(id);
                }
                if (id < 0 || !this.touchingSurfaceEntityIds.has(id)) {
                    this.puddleSlowMs = Math.min(SpanielSmashGame.maxPuddleStackMs, this.puddleSlowMs + SpanielSmashGame.puddleSlowDurationMs);
                }
                survivors.push(entity);
                continue;
            }
            if (entity.type === "ice-patch") {
                if (this.jumpTimerMs > 0) {
                    survivors.push(entity);
                    continue;
                }
                const id = entity.id ?? -1;
                if (id >= 0) {
                    nextTouchingSurfaceEntityIds.add(id);
                }
                if (id < 0 || !this.touchingSurfaceEntityIds.has(id)) {
                    this.wetPaintSlipMs = Math.min(SpanielSmashGame.maxIceStackMs, this.wetPaintSlipMs + SpanielSmashGame.icePatchBoostDurationMs);
                }
                survivors.push(entity);
                continue;
            }
            if (entity.type === "slalom-poles") {
                if (this.jumpTimerMs > 0) {
                    survivors.push(entity);
                    continue;
                }
                const id = entity.id ?? -1;
                if (id >= 0) {
                    nextTouchingSurfaceEntityIds.add(id);
                }
                if (id < 0 || !this.touchingSurfaceEntityIds.has(id)) {
                    this.puddleSlowMs = Math.min(SpanielSmashGame.maxPuddleStackMs, this.puddleSlowMs + SpanielSmashGame.puddleSlowDurationMs);
                }
                survivors.push(entity);
                continue;
            }
            if (entity.type === "drone-package-drop" && entity.behaviorState?.kind === "droneDrop" && entity.behaviorState.phase === "telegraph") {
                survivors.push(entity);
                continue;
            }
            if (entity.type === "spaniel" || entity.type === "black-spaniel") {
                this.spawnSmashEffect(entity.x, entity.y, "spaniel-smash");
                this.spawnSmashEffect(entity.x, entity.y, "coin-pop");
                this.spawnBloodstain(entity);
                this.score += entity.type === "black-spaniel" ? 200 : 100;
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
    damagePlayer() {
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
        if (entity.type === "poo-bag") {
            return {
                x: bounds.x + bounds.width * 0.18,
                y: bounds.y + bounds.height * 0.18,
                width: bounds.width * 0.64,
                height: bounds.height * 0.64
            };
        }
        if (entity.type === "slalom-poles") {
            return {
                x: bounds.x + bounds.width * 0.28,
                y: bounds.y + bounds.height * 0.05,
                width: bounds.width * 0.44,
                height: bounds.height * 0.92
            };
        }
        if (entity.type === "ice-crevasse") {
            return {
                x: bounds.x + bounds.width * 0.05,
                y: bounds.y + bounds.height * 0.2,
                width: bounds.width * 0.9,
                height: bounds.height * 0.72
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
                if (first.type === "andy" || second.type === "andy" || first.type === "poo-bag" || second.type === "poo-bag") {
                    continue;
                }
                if (this.isSameSkiSchoolGroup(first, second)) {
                    continue;
                }
                if (!intersects(first, second)) {
                    continue;
                }
                if (this.isMovingObstacle(first) && this.isLethalForMovingObstacleCollision(second)) {
                    indicesToTransform.add(i);
                }
                if (this.isMovingObstacle(second) && this.isLethalForMovingObstacleCollision(first)) {
                    indicesToTransform.add(j);
                }
            }
        }
        for (const index of indicesToTransform) {
            const entity = this.entities[index];
            this.spawnSmashEffect(entity.x, entity.y, (entity.type === "spaniel" || entity.type === "black-spaniel") ? "spaniel-smash" : "obstacle-crash");
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
    isMovingObstacle(entity) {
        return entity.type === "skier"
            || entity.type === "ski-school-instructor"
            || entity.type === "ski-school-child"
            || entity.type === "naked-skier"
            || entity.type === "spaniel"
            || entity.type === "black-spaniel"
            || entity.type === "helicopter-downdraft";
    }
    isSkiSchoolEntity(entity) {
        return entity.type === "ski-school-instructor" || entity.type === "ski-school-child";
    }
    isSameSkiSchoolGroup(first, second) {
        if (!this.isSkiSchoolEntity(first) || !this.isSkiSchoolEntity(second)) {
            return false;
        }
        return first.obstacleId === SpanielSmashGame.skiSchoolObstacleId
            && second.obstacleId === SpanielSmashGame.skiSchoolObstacleId;
    }
    isLethalForMovingObstacleCollision(entity) {
        if (entity.type === "bloodstain"
            || entity.type === "puddle-patch"
            || entity.type === "slalom-poles"
            || entity.type === "ice-patch"
            || entity.type === "spaniel"
            || entity.type === "black-spaniel") {
            return false;
        }
        if (entity.type === "drone-package-drop" && entity.behaviorState?.kind === "droneDrop" && entity.behaviorState.phase === "telegraph") {
            return false;
        }
        return true;
    }
    spawnSmashEffect(x, y, kind) { this.effects.push({ kind, x, y, ttlMs: 300, maxTtlMs: 300 }); }
    spawnBloodstain(entity) {
        this.entities.push({ id: this.nextEntityId++, type: "bloodstain", x: this.laneX(this.entityLane(entity)), y: entity.y + entity.height + 4, width: this.laneWidth * 0.55, height: 18, speed: SpanielSmashGame.staticObstacleSpeed, lane: this.entityLane(entity), laneSwitchCooldownMs: 0, direction: 1, crashAnimationMs: 0 });
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
        entity.id ??= this.nextEntityId++;
        entity.lane = this.entityLane(entity);
        entity.x = this.laneX(entity.lane);
        entity.laneSwitchCooldownMs ??= 0;
        entity.direction ??= 1;
        entity.crashAnimationMs ??= 0;
        this.entities.push(entity);
    }
    spawnSkiSchoolDebug(childrenCount) {
        if (this.gameOver) {
            return;
        }
        const spawnLane = this.playerLane;
        const childTotal = typeof childrenCount === "number"
            ? Math.max(SpanielSmashGame.skiSchoolMinChildren, Math.min(SpanielSmashGame.skiSchoolMaxChildren, Math.floor(childrenCount)))
            : this.skiSchoolChildrenForLevel();
        this.spawnSkiSchoolSnake(spawnLane, 1, "rare", childTotal, 92);
    }
    restart() {
        this.playerLane = this.startingLane();
        this.lives = 3;
        this.score = 0;
        this.speedLevel = 1;
        this.spanielsSmashed = 0;
        this.levelSpanielsSmashed = 0;
        this.gameOver = false;
        this.andyBossActive = false;
        this.victory = false;
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
        this.playerImmortalMs = 0;
        this.levelUpBannerMs = 0;
        this.levelTransitionBoostMs = 0;
        this.nextBossSpanielGoal = this.bossSpanielGoalForLevel(this.speedLevel);
        this.nextEntityId = 1;
        this.touchingSurfaceEntityIds = new Set();
    }
    snapshot() {
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
            playerImmortalMs: this.playerImmortalMs,
            isCrashActive: this.crashFreezeMs > 0,
            isBossActive: this.andyBossActive,
            isVictory: this.victory,
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
        if (entity.type !== "skier"
            && entity.type !== "naked-skier"
            && entity.type !== "spaniel"
            && entity.type !== "black-spaniel"
            && entity.type !== "andy"
            && entity.type !== "helicopter-downdraft")
            return;
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
                if (currentLane < this.playerLane)
                    targetLane = currentLane + 1;
                else if (currentLane > this.playerLane)
                    targetLane = currentLane - 1;
            }
            entity.lane = Math.max(this.minPlayableLane(), Math.min(this.maxPlayableLane(), targetLane));
            entity.laneSwitchCooldownMs = SpanielSmashGame.andyBossLaneMoveMs;
            return;
        }
        if (entity.type === "andy") {
            if (currentLane < this.playerLane)
                targetLane = currentLane + 1;
            else if (currentLane > this.playerLane)
                targetLane = currentLane - 1;
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
    static levelUpAnimationDurationMs = 1800;
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
        const isJumping = !snapshot.isCrashActive && snapshot.playerJumpOffset > 0;
        if (isJumping) {
            drawJumpShadow(this.ctx, snapshot.playerX, snapshot.playerY, snapshot.playerJumpOffset);
        }
        for (const entity of snapshot.entities) {
            if (entity.type === "puddle-patch") {
                drawPuddlePatch(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "ice-patch") {
                drawIcePatch(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "ice-crevasse") {
                drawIceCrevasse(this.ctx, entity.x, entity.y, entity.width);
            }
            else if (entity.type === "slalom-poles") {
                drawSlalomPoles(this.ctx, entity.x, entity.y);
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
            else if (entity.type === "poo-bag") {
                drawPooBag(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "tree")
                drawTree(this.ctx, entity.x, entity.y);
            else if (entity.type === "rock") {
                if ((entity.crashAnimationMs ?? 0) > 0)
                    drawCrashPulse(this.ctx, entity.x, entity.y, entity.crashAnimationMs ?? 0, "#ffa500");
                drawRock(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "skier")
                drawSkierSlim(this.ctx, entity.x, entity.y, "#3a86ff", "#ff6b6b");
            else if (entity.type === "ski-school-instructor")
                drawSkierSlim(this.ctx, entity.x, entity.y, "#dc2626", "#fde68a");
            else if (entity.type === "ski-school-child") {
                const paletteIndex = entity.behaviorState?.kind === "skiSchoolSnake" ? entity.behaviorState.paletteIndex : 0;
                drawSkiSchoolChild(this.ctx, entity.x, entity.y, paletteIndex);
            }
            else if (entity.type === "naked-skier")
                drawNakedSkier(this.ctx, entity.x, entity.y);
            else if (entity.type === "spaniel")
                drawSpaniel(this.ctx, entity.x, entity.y, snapshot.sideObstacleOffsetY + entity.x, "brown");
            else if (entity.type === "black-spaniel")
                drawSpaniel(this.ctx, entity.x, entity.y, snapshot.sideObstacleOffsetY + entity.x, "black");
            else if (entity.type === "bloodstain")
                drawBloodstain(this.ctx, entity.x, entity.y);
            else {
                drawAndyShadow(this.ctx, entity.x, entity.y, snapshot.sideObstacleOffsetY + entity.x);
                drawAndy(this.ctx, entity.x, entity.y, snapshot.sideObstacleOffsetY + entity.x);
            }
        }
        const playerRenderY = snapshot.isCrashActive ? snapshot.playerY : snapshot.playerY - snapshot.playerJumpOffset;
        if (snapshot.isPlayerImmortal && !snapshot.isCrashActive) {
            drawImmortalForceField(this.ctx, snapshot.playerX, playerRenderY, snapshot.playerImmortalMs ?? 0);
        }
        if (snapshot.isCrashActive) {
            drawCrashedSkier(this.ctx, snapshot.playerX, snapshot.playerY, "#f97316", "#ffd166");
        }
        else {
            drawSkierSlim(this.ctx, snapshot.playerX, snapshot.playerY - snapshot.playerJumpOffset, "#f97316", "#ffd166", snapshot.playerJumpOffset);
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
        if ((snapshot.levelUpBannerMs ?? 0) > 0 && !snapshot.isGameOver) {
            this.drawLevelUpCelebration(snapshot.levelUpBannerMs ?? 0);
            const pulse = 0.7 + Math.abs(Math.sin((snapshot.levelUpBannerMs ?? 0) / 90)) * 0.3;
            const bannerWidth = Math.round(214 + pulse * 18);
            const bannerX = Math.round(this.width / 2 - bannerWidth / 2);
            this.ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
            this.ctx.fillRect(bannerX, 132, bannerWidth, 40);
            this.ctx.fillStyle = "#fef08a";
            this.ctx.fillRect(bannerX + 6, 136, bannerWidth - 12, 2);
            this.ctx.fillStyle = "#86efac";
            this.ctx.fillText(`LEVEL ${snapshot.speedLevel}!`, this.width / 2 - 66, 158);
        }
        if (snapshot.isVictory) {
            this.drawVictoryFireworks();
            this.ctx.fillStyle = "rgba(3, 7, 18, 0.58)";
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = "#fef08a";
            this.ctx.fillText("CONGRATULATIONS", this.width / 2 - 86, this.height / 2 - 10);
            this.ctx.fillStyle = "#dcfce7";
            this.ctx.fillText("You beat Evil Andy", this.width / 2 - 82, this.height / 2 + 14);
            this.ctx.fillStyle = "#fff";
            this.ctx.fillText(`Final Score ${snapshot.score}`, this.width / 2 - 78, this.height / 2 + 38);
        }
        else if (snapshot.isGameOver) {
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
    drawVictoryFireworks() {
        const bursts = 8;
        for (let burst = 0; burst < bursts; burst += 1) {
            const burstX = 48 + burst * ((this.width - 96) / (bursts - 1));
            const burstY = 66 + (burst % 3) * 34;
            const hue = (burst * 47) % 360;
            for (let spark = 0; spark < 14; spark += 1) {
                const angle = (Math.PI * 2 * spark) / 14;
                const radius = 10 + (spark % 4) * 6;
                const x = burstX + Math.cos(angle) * radius;
                const y = burstY + Math.sin(angle) * radius;
                this.ctx.fillStyle = `hsl(${hue + spark * 4} 95% 66%)`;
                this.ctx.fillRect(Math.round(x), Math.round(y), 3, 3);
            }
        }
    }
    drawLevelUpCelebration(levelUpBannerMs) {
        const clampedMs = Math.max(0, Math.min(PixelRenderer.levelUpAnimationDurationMs, levelUpBannerMs));
        const progress = 1 - clampedMs / PixelRenderer.levelUpAnimationDurationMs;
        const centerX = this.width / 2;
        const centerY = 152;
        const ringRadius = 12 + progress * 74;
        const sparkleRadius = 20 + progress * 52;
        const glowAlpha = Math.max(0.18, 0.7 - progress * 0.46);
        const sparkleAlpha = Math.max(0.16, 0.64 - progress * 0.34);
        this.ctx.fillStyle = `rgba(134, 239, 172, ${glowAlpha.toFixed(2)})`;
        this.ctx.fillRect(Math.round(centerX - ringRadius), centerY - 2, Math.round(ringRadius * 2), 4);
        this.ctx.fillRect(Math.round(centerX - 2), Math.round(centerY - ringRadius), 4, Math.round(ringRadius * 2));
        this.ctx.fillStyle = `rgba(250, 204, 21, ${sparkleAlpha.toFixed(2)})`;
        for (let index = 0; index < 8; index += 1) {
            const angle = progress * 2.4 + (Math.PI * 2 * index) / 8;
            const sparkleX = centerX + Math.cos(angle) * sparkleRadius;
            const sparkleY = centerY + Math.sin(angle) * sparkleRadius;
            this.ctx.fillRect(Math.round(sparkleX) - 1, Math.round(sparkleY) - 1, 3, 3);
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
function drawTree(ctx, x, y) {
    // Conifer silhouette: pointed crown with layered branch tiers.
    ctx.fillStyle = "#14532d";
    ctx.fillRect(x + 10, y, 1, 1);
    ctx.fillRect(x + 9, y + 1, 3, 1);
    ctx.fillRect(x + 8, y + 2, 5, 1);
    ctx.fillRect(x + 7, y + 3, 7, 2);
    ctx.fillRect(x + 6, y + 5, 9, 2);
    ctx.fillStyle = "#166534";
    ctx.fillRect(x + 5, y + 7, 11, 3);
    ctx.fillRect(x + 4, y + 10, 13, 3);
    ctx.fillStyle = "#15803d";
    ctx.fillRect(x + 3, y + 13, 15, 3);
    ctx.fillRect(x + 2, y + 16, 17, 3);
    ctx.fillRect(x + 3, y + 19, 15, 3);
    ctx.fillRect(x + 4, y + 22, 13, 2);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(x + 8, y + 3, 2, 1);
    ctx.fillRect(x + 6, y + 8, 3, 1);
    ctx.fillRect(x + 12, y + 9, 2, 1);
    ctx.fillRect(x + 5, y + 14, 2, 1);
    ctx.fillRect(x + 13, y + 15, 2, 1);
    ctx.fillRect(x + 6, y + 20, 2, 1);
    ctx.fillRect(x + 12, y + 21, 2, 1);
    ctx.fillStyle = "#0f3d2e";
    ctx.fillRect(x + 2, y + 20, 2, 2);
    ctx.fillRect(x + 16, y + 20, 2, 2);
    ctx.fillStyle = "#7f5539";
    ctx.fillRect(x + 8, y + 24, 4, 6);
    ctx.fillStyle = "#5e3b2a";
    ctx.fillRect(x + 9, y + 24, 2, 6);
}
function drawRock(ctx, x, y) {
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
function drawBloodstain(ctx, x, y) {
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
function drawSpaniel(ctx, x, y, animationSeed = 0, coat = "brown") {
    const wagFrame = Math.floor(animationSeed / 5) % 4;
    const tailOffsetX = wagFrame < 2 ? -1 : 0;
    const tailOffsetY = wagFrame === 1 || wagFrame === 2 ? -1 : 0;
    const baseCoat = coat === "black" ? "#1f2937" : "#8b5e3c";
    const highlightCoat = coat === "black" ? "#4b5563" : "#c58f63";
    const shadowCoat = coat === "black" ? "#111827" : "#6b3f2a";
    const collarColor = coat === "black" ? "#60a5fa" : "#2a9d8f";
    ctx.fillStyle = baseCoat;
    ctx.fillRect(x + 3, y + 9, 12, 7);
    ctx.fillRect(x + 14, y + 10, 4, 5);
    ctx.fillRect(x + 15, y + 7, 5, 5);
    ctx.fillRect(x + 19, y + 9, 3, 2);
    ctx.fillRect(x + 1 + tailOffsetX, y + 8 + tailOffsetY, 3, 2);
    ctx.fillStyle = highlightCoat;
    ctx.fillRect(x + 5, y + 10, 7, 2);
    ctx.fillRect(x + 16, y + 9, 3, 2);
    ctx.fillRect(x + 20, y + 10, 2, 1);
    ctx.fillRect(x + 2 + tailOffsetX, y + 8 + tailOffsetY, 1, 1);
    ctx.fillStyle = shadowCoat;
    ctx.fillRect(x + 15, y + 8, 1, 5);
    ctx.fillRect(x + 18, y + 8, 1, 5);
    ctx.fillRect(x + 5, y + 16, 2, 3);
    ctx.fillRect(x + 10, y + 16, 2, 3);
    ctx.fillRect(x + 15, y + 15, 2, 4);
    ctx.fillStyle = collarColor;
    ctx.fillRect(x + 13, y + 11, 2, 2);
    ctx.fillStyle = "#111827";
    ctx.fillRect(x + 18, y + 9, 1, 1);
    ctx.fillRect(x + 21, y + 10, 1, 1);
}
function drawPuddlePatch(ctx, x, y) {
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
function drawIcePatch(ctx, x, y) {
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
function drawSlalomPoles(ctx, x, y) {
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x + 6, y + 3, 2, 20);
    ctx.fillStyle = "#1d4ed8";
    ctx.fillRect(x + 14, y + 3, 2, 20);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 6, y + 8, 2, 2);
    ctx.fillRect(x + 6, y + 13, 2, 2);
    ctx.fillRect(x + 6, y + 18, 2, 2);
    ctx.fillRect(x + 14, y + 6, 2, 2);
    ctx.fillRect(x + 14, y + 11, 2, 2);
    ctx.fillRect(x + 14, y + 16, 2, 2);
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(x + 5, y + 23, 4, 1);
    ctx.fillRect(x + 13, y + 23, 4, 1);
}
function drawIceCrevasse(ctx, x, y, width) {
    const totalWidth = Math.max(24, Math.round(width));
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(Math.round(x), y + 9, totalWidth, 9);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(Math.round(x) + 2, y + 11, Math.max(6, totalWidth - 4), 5);
    ctx.fillStyle = "#93c5fd";
    ctx.fillRect(Math.round(x) + 1, y + 8, Math.max(6, totalWidth - 2), 1);
    ctx.fillRect(Math.round(x) + 3, y + 18, Math.max(4, totalWidth - 6), 1);
    const crackStart = Math.round(x) + Math.max(3, Math.floor(totalWidth * 0.16));
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(crackStart, y + 12, 2, 3);
    ctx.fillRect(crackStart + Math.floor(totalWidth * 0.18), y + 13, 2, 2);
    ctx.fillRect(crackStart + Math.floor(totalWidth * 0.4), y + 11, 2, 3);
    ctx.fillRect(crackStart + Math.floor(totalWidth * 0.64), y + 12, 2, 2);
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
function drawPooBag(ctx, x, y) {
    ctx.fillStyle = "#14532d";
    ctx.fillRect(x + 4, y + 5, 12, 10);
    ctx.fillRect(x + 8, y + 3, 4, 2);
    ctx.fillRect(x + 4, y + 7, 2, 6);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(x + 6, y + 7, 8, 6);
    ctx.fillStyle = "#86efac";
    ctx.fillRect(x + 11, y + 8, 2, 2);
}
function drawSkierSlim(ctx, x, y, bodyColor, helmetColor, jumpOffset = 0) {
    const inAir = jumpOffset > 0;
    const bodyHeight = inAir ? 9 : 10;
    const bodyY = inAir ? y + 13 : y + 12;
    const helmetY = inAir ? y + 5 : y + 6;
    const poleStartY = bodyY + 1;
    const poleLength = inAir ? 11 : 13;
    const skiStartY = inAir ? y + 24 : y + 26;
    const skiSpread = inAir ? [0, 1, 1, 2, 2, 3] : [0, 1, 1, 2, 2, 3, 3];
    const legTopY = bodyY + bodyHeight - 1;
    const legHeight = inAir ? 5 : 6;
    // Slimmer torso/helmet while keeping the established downhill ski stance.
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 6, bodyY, 10, bodyHeight);
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 7, bodyY + 1, 8, bodyHeight - 1);
    ctx.fillRect(x + 6, bodyY + 2, 1, 2);
    ctx.fillRect(x + 15, bodyY + 2, 1, 2);
    ctx.fillStyle = "rgba(15, 23, 42, 0.3)";
    ctx.fillRect(x + 11, bodyY + 2, 1, Math.max(2, bodyHeight - 4));
    ctx.fillRect(x + 9, bodyY + bodyHeight - 3, 4, 1);
    ctx.fillStyle = helmetColor;
    ctx.fillRect(x + 9, helmetY, 5, 5);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 10, helmetY + 2, 3, 2);
    ctx.fillRect(x + 9, helmetY + 4, 5, 1);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(x + 10, helmetY + 1, 2, 1);
    ctx.fillStyle = "#475569";
    ctx.fillRect(x + 9, helmetY + 2, 1, 2);
    ctx.fillRect(x + 13, helmetY + 2, 1, 2);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(x + 9, helmetY + 5, 5, 1);
    ctx.fillRect(x + 10, helmetY + 6, 2, 1);
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(x + 8, legTopY, 2, legHeight);
    ctx.fillRect(x + 12, legTopY, 2, legHeight);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(x + 7, legTopY + legHeight - 1, 3, 2);
    ctx.fillRect(x + 12, legTopY + legHeight - 1, 3, 2);
    for (let index = 0; index < poleLength; index += 1) {
        const diagonalOffset = Math.floor((index + 1) / 3);
        const rowY = poleStartY + index;
        const leftX = x + 6 - diagonalOffset;
        const rightX = x + 16 + diagonalOffset;
        ctx.fillStyle = "#000000";
        ctx.fillRect(leftX, rowY, 1, 1);
        ctx.fillRect(rightX, rowY, 1, 1);
    }
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 6, poleStartY, 1, 1);
    ctx.fillRect(x + 15, poleStartY, 1, 1);
    const poleTipY = poleStartY + poleLength - 1;
    const poleTipOffset = Math.floor((poleLength + 1) / 3);
    const leftPoleTipX = x + 6 - poleTipOffset;
    const rightPoleTipX = x + 16 + poleTipOffset;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(leftPoleTipX, poleTipY, 2, 1);
    ctx.fillRect(rightPoleTipX, poleTipY, 2, 1);
    for (let index = 0; index < skiSpread.length; index += 1) {
        const spread = skiSpread[index] ?? 0;
        const rowY = skiStartY + index;
        const leftSkiX = x + 7 - spread;
        const rightSkiX = x + 12 + spread;
        ctx.fillStyle = "#334155";
        ctx.fillRect(leftSkiX, rowY, 4, 1);
        ctx.fillRect(rightSkiX, rowY, 4, 1);
        ctx.fillStyle = "#111827";
        ctx.fillRect(leftSkiX + 3, rowY, 1, 1);
        ctx.fillRect(rightSkiX + 3, rowY, 1, 1);
        ctx.fillStyle = "#93c5fd";
        ctx.fillRect(leftSkiX, rowY, 1, 1);
        ctx.fillRect(rightSkiX, rowY, 1, 1);
    }
    const tipSpread = skiSpread[skiSpread.length - 1] ?? 0;
    const skiTipY = skiStartY + skiSpread.length - 1;
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(x + 6 - tipSpread, skiTipY, 1, 1);
    ctx.fillRect(x + 16 + tipSpread, skiTipY, 1, 1);
}
const SKI_SCHOOL_CHILD_COLORS = [
    { body: "#2563eb", helmet: "#bfdbfe" },
    { body: "#16a34a", helmet: "#dcfce7" },
    { body: "#7c3aed", helmet: "#ddd6fe" },
    { body: "#d97706", helmet: "#fde68a" },
    { body: "#0f766e", helmet: "#99f6e4" }
];
function drawSkiSchoolChild(ctx, x, y, paletteIndex) {
    const palette = SKI_SCHOOL_CHILD_COLORS[((paletteIndex % SKI_SCHOOL_CHILD_COLORS.length) + SKI_SCHOOL_CHILD_COLORS.length) % SKI_SCHOOL_CHILD_COLORS.length];
    const helmetY = y + 9;
    const bodyY = y + 14;
    const legY = y + 20;
    const poleStartY = bodyY + 1;
    const skiRows = [0, 1, 1, 2];
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 8, bodyY, 6, 7);
    ctx.fillStyle = palette.body;
    ctx.fillRect(x + 9, bodyY + 1, 4, 6);
    ctx.fillRect(x + 8, bodyY + 2, 1, 2);
    ctx.fillRect(x + 13, bodyY + 2, 1, 2);
    ctx.fillStyle = "rgba(15, 23, 42, 0.3)";
    ctx.fillRect(x + 11, bodyY + 2, 1, 4);
    ctx.fillStyle = palette.helmet;
    ctx.fillRect(x + 9, helmetY, 4, 4);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 10, helmetY + 2, 2, 1);
    ctx.fillRect(x + 9, helmetY + 3, 4, 1);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(x + 10, helmetY + 1, 1, 1);
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(x + 9, legY, 1, 4);
    ctx.fillRect(x + 12, legY, 1, 4);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(x + 9, legY + 3, 2, 1);
    ctx.fillRect(x + 12, legY + 3, 2, 1);
    for (let index = 0; index < 8; index += 1) {
        const diagonalOffset = Math.floor(index / 4);
        const rowY = poleStartY + index;
        ctx.fillStyle = "#000000";
        ctx.fillRect(x + 8 - diagonalOffset, rowY, 1, 1);
        ctx.fillRect(x + 14 + diagonalOffset, rowY, 1, 1);
    }
    const skiStartY = y + 25;
    for (let index = 0; index < skiRows.length; index += 1) {
        const spread = skiRows[index] ?? 0;
        const rowY = skiStartY + index;
        const leftSkiX = x + 8 - spread;
        const rightSkiX = x + 12 + spread;
        ctx.fillStyle = "#334155";
        ctx.fillRect(leftSkiX, rowY, 3, 1);
        ctx.fillRect(rightSkiX, rowY, 3, 1);
        ctx.fillStyle = "#93c5fd";
        ctx.fillRect(leftSkiX, rowY, 1, 1);
        ctx.fillRect(rightSkiX, rowY, 1, 1);
    }
}
function drawSkier(ctx, x, y, bodyColor, helmetColor, jumpOffset = 0) {
    const inAir = jumpOffset > 0;
    const bodyHeight = inAir ? 10 : 12;
    const bodyY = inAir ? y + 12 : y + 11;
    const helmetY = inAir ? y + 4 : y + 5;
    const poleStartY = bodyY + 2;
    const poleLength = inAir ? 11 : 13;
    const skiStartY = inAir ? y + 24 : y + 26;
    const skiSpread = inAir ? [0, 1, 1, 2, 2, 3] : [0, 1, 1, 2, 2, 3, 3];
    const legTopY = bodyY + bodyHeight - 1;
    const legHeight = inAir ? 5 : 6;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 5, bodyY, 12, bodyHeight);
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 6, bodyY + 1, 10, bodyHeight - 1);
    ctx.fillRect(x + 5, bodyY + 2, 1, 3);
    ctx.fillRect(x + 16, bodyY + 2, 1, 3);
    ctx.fillStyle = "rgba(15, 23, 42, 0.3)";
    ctx.fillRect(x + 11, bodyY + 2, 2, Math.max(2, bodyHeight - 4));
    ctx.fillRect(x + 8, bodyY + bodyHeight - 3, 6, 1);
    ctx.fillStyle = helmetColor;
    ctx.fillRect(x + 8, helmetY, 6, 6);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 9, helmetY + 2, 4, 3);
    ctx.fillRect(x + 8, helmetY + 5, 6, 1);
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(x + 9, helmetY + 1, 3, 1);
    ctx.fillStyle = "#475569";
    ctx.fillRect(x + 8, helmetY + 3, 1, 2);
    ctx.fillRect(x + 13, helmetY + 3, 1, 2);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(x + 8, helmetY + 6, 6, 1);
    ctx.fillRect(x + 10, helmetY + 7, 2, 1);
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(x + 8, legTopY, 2, legHeight);
    ctx.fillRect(x + 12, legTopY, 2, legHeight);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(x + 7, legTopY + legHeight - 1, 3, 2);
    ctx.fillRect(x + 12, legTopY + legHeight - 1, 3, 2);
    for (let index = 0; index < poleLength; index += 1) {
        const diagonalOffset = Math.floor((index + 1) / 3);
        const rowY = poleStartY + index;
        const leftX = x + 6 - diagonalOffset;
        const rightX = x + 16 + diagonalOffset;
        ctx.fillStyle = "#000000";
        ctx.fillRect(leftX, rowY, 1, 1);
        ctx.fillRect(rightX, rowY, 1, 1);
    }
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 5, poleStartY, 2, 1);
    ctx.fillRect(x + 15, poleStartY, 2, 1);
    const poleTipY = poleStartY + poleLength - 1;
    const poleTipOffset = Math.floor((poleLength + 1) / 3);
    const leftPoleTipX = x + 6 - poleTipOffset;
    const rightPoleTipX = x + 16 + poleTipOffset;
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(leftPoleTipX, poleTipY, 2, 1);
    ctx.fillRect(rightPoleTipX, poleTipY, 2, 1);
    for (let index = 0; index < skiSpread.length; index += 1) {
        const spread = skiSpread[index] ?? 0;
        const rowY = skiStartY + index;
        const leftSkiX = x + 7 - spread;
        const rightSkiX = x + 12 + spread;
        ctx.fillStyle = "#334155";
        ctx.fillRect(leftSkiX, rowY, 4, 1);
        ctx.fillRect(rightSkiX, rowY, 4, 1);
        ctx.fillStyle = "#111827";
        ctx.fillRect(leftSkiX + 3, rowY, 1, 1);
        ctx.fillRect(rightSkiX + 3, rowY, 1, 1);
        ctx.fillStyle = "#93c5fd";
        ctx.fillRect(leftSkiX, rowY, 1, 1);
        ctx.fillRect(rightSkiX, rowY, 1, 1);
    }
    const tipSpread = skiSpread[skiSpread.length - 1] ?? 0;
    const skiTipY = skiStartY + skiSpread.length - 1;
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(x + 6 - tipSpread, skiTipY, 1, 1);
    ctx.fillRect(x + 16 + tipSpread, skiTipY, 1, 1);
}
function drawNakedSkier(ctx, x, y) {
    drawSkier(ctx, x, y, "#f2c29b", "#fde68a");
    ctx.fillStyle = "#d97706";
    ctx.fillRect(x + 8, y + 21, 6, 2);
    ctx.fillStyle = "#7c2d12";
    ctx.fillRect(x + 8, y + 23, 2, 1);
    ctx.fillRect(x + 12, y + 23, 2, 1);
}
function drawDowndraftZone(ctx, x, y, pushDirection) {
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
function drawAndyShadow(ctx, x, y, animationSeed = 0) {
    const pulse = Math.floor(animationSeed / 8) % 3;
    const width = 14 + pulse;
    const shadowX = x + 11 - Math.floor(width / 2);
    const shadowY = y + 31;
    ctx.fillStyle = "rgba(15, 23, 42, 0.22)";
    ctx.fillRect(shadowX, shadowY, width, 2);
    ctx.fillStyle = "rgba(15, 23, 42, 0.15)";
    ctx.fillRect(shadowX + 2, shadowY + 2, Math.max(6, width - 4), 1);
}
function drawAndy(ctx, x, y, animationSeed = 0) {
    const trailFrame = Math.floor(animationSeed / 6) % 3;
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
    // Add air-trail cues to reinforce that Andy is flying above the slope.
    ctx.fillStyle = trailFrame === 0 ? "rgba(125, 211, 252, 0.65)" : "rgba(56, 189, 248, 0.55)";
    ctx.fillRect(x + 5, y + 21, 2, 3);
    ctx.fillRect(x + 9, y + 22 + (trailFrame === 1 ? 1 : 0), 2, 3);
    ctx.fillRect(x + 13, y + 21 + (trailFrame === 2 ? 1 : 0), 2, 3);
    ctx.fillStyle = "rgba(186, 230, 253, 0.6)";
    ctx.fillRect(x + 7, y + 25, 8, 1);
}
function drawCrashedSkier(ctx, x, y, bodyColor, helmetColor) {
    // Crashed pose that still matches the slim skier proportions and palette.
    ctx.fillStyle = "rgba(15, 23, 42, 0.22)";
    ctx.fillRect(x + 4, y + 31, 16, 2);
    ctx.fillStyle = "#334155";
    ctx.fillRect(x + 2, y + 29, 22, 2);
    ctx.fillRect(x + 10, y + 20, 2, 13);
    ctx.fillStyle = "#111827";
    ctx.fillRect(x + 3, y + 30, 20, 1);
    ctx.fillRect(x + 11, y + 21, 1, 11);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 5, y + 20, 14, 8);
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 6, y + 21, 12, 6);
    ctx.fillStyle = "rgba(15, 23, 42, 0.3)";
    ctx.fillRect(x + 12, y + 22, 4, 4);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(x + 9, y + 27, 3, 2);
    ctx.fillRect(x + 15, y + 27, 3, 2);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 1, y + 17, 7, 7);
    ctx.fillStyle = helmetColor;
    ctx.fillRect(x + 2, y + 18, 5, 5);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x + 3, y + 20, 3, 2);
    ctx.fillStyle = "#cbd5e1";
    ctx.fillRect(x + 3, y + 19, 2, 1);
    ctx.fillStyle = "#000000";
    ctx.fillRect(x + 20, y + 18, 1, 10);
    ctx.fillStyle = "#f59e0b";
    ctx.fillRect(x + 19, y + 27, 2, 1);
}
function drawJumpShadow(ctx, x, y, jumpOffset) {
    const lift = Math.max(0, Math.min(28, jumpOffset));
    const bodyShadowWidth = Math.max(4, Math.round(8 - lift / 6));
    const bodyShadowX = x + 11 - Math.floor(bodyShadowWidth / 2);
    const bodyShadowY = y + 25;
    const skiShadowWidth = Math.max(2, Math.round(4 - lift / 10));
    const skiSpread = Math.min(4, Math.floor(lift / 8));
    const alphaBody = Math.max(0.12, 0.28 - lift * 0.005);
    const alphaSkis = Math.max(0.08, 0.22 - lift * 0.004);
    ctx.fillStyle = `rgba(15, 23, 42, ${alphaBody.toFixed(2)})`;
    ctx.fillRect(bodyShadowX, bodyShadowY, bodyShadowWidth, 2);
    ctx.fillStyle = `rgba(15, 23, 42, ${alphaSkis.toFixed(2)})`;
    ctx.fillRect(x + 7 - skiSpread, bodyShadowY + 2, skiShadowWidth, 1);
    ctx.fillRect(x + 16 + skiSpread - skiShadowWidth + 1, bodyShadowY + 2, skiShadowWidth, 1);
    ctx.fillRect(x + 6 - skiSpread, bodyShadowY + 1, 1, 1);
    ctx.fillRect(x + 17 + skiSpread, bodyShadowY + 1, 1, 1);
}
function drawImmortalForceField(ctx, x, y, immortalMs) {
    const flashOn = Math.floor(immortalMs / 110) % 2 === 0;
    if (!flashOn) {
        return;
    }
    // Align to the slim skier sprite bounds (including poles/skis) with even padding.
    const fieldX = x - 2;
    const fieldY = y + 2;
    const fieldWidth = 28;
    const fieldHeight = 34;
    const pulse = Math.floor(immortalMs / 220) % 2;
    ctx.fillStyle = pulse === 0 ? "rgba(34, 197, 94, 0.14)" : "rgba(74, 222, 128, 0.24)";
    ctx.fillRect(fieldX + 4, fieldY + 4, fieldWidth - 8, fieldHeight - 8);
    ctx.fillStyle = pulse === 0 ? "rgba(22, 163, 74, 0.42)" : "rgba(74, 222, 128, 0.8)";
    ctx.fillRect(fieldX + 2, fieldY, fieldWidth - 4, 1);
    ctx.fillRect(fieldX + 2, fieldY + fieldHeight - 1, fieldWidth - 4, 1);
    ctx.fillRect(fieldX, fieldY + 2, 1, fieldHeight - 4);
    ctx.fillRect(fieldX + fieldWidth - 1, fieldY + 2, 1, fieldHeight - 4);
    ctx.fillRect(fieldX + 1, fieldY + 1, 1, 1);
    ctx.fillRect(fieldX + fieldWidth - 2, fieldY + 1, 1, 1);
    ctx.fillRect(fieldX + 1, fieldY + fieldHeight - 2, 1, 1);
    ctx.fillRect(fieldX + fieldWidth - 2, fieldY + fieldHeight - 2, 1, 1);
    const nodePhase = Math.floor(immortalMs / 70) % 4;
    const sparkNodes = [
        [fieldX + 5, fieldY + 1],
        [fieldX + fieldWidth - 7, fieldY + 2],
        [fieldX + fieldWidth - 3, fieldY + 16],
        [fieldX + fieldWidth - 11, fieldY + fieldHeight - 3],
        [fieldX + 8, fieldY + fieldHeight - 2],
        [fieldX + 1, fieldY + 19]
    ];
    ctx.fillStyle = pulse === 0 ? "rgba(187, 247, 208, 0.7)" : "rgba(240, 253, 244, 0.95)";
    for (let index = 0; index < 3; index += 1) {
        const [sparkX, sparkY] = sparkNodes[(nodePhase + index * 2) % sparkNodes.length] ?? sparkNodes[0];
        ctx.fillRect(sparkX, sparkY, 2, 2);
    }
}
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
    const color = effect.kind === "spaniel-smash" ? "#dc2626" : effect.kind === "poo-splat" ? "#8b5a2b" : "#f97316";
    ctx.fillStyle = color;
    ctx.fillRect(effect.x + 8 - radius, effect.y + 8 - radius, radius, radius);
    ctx.fillRect(effect.x + 8 + radius / 2, effect.y + 5, radius, radius);
    ctx.fillRect(effect.x + 4, effect.y + 12 + radius / 2, radius, radius);
    if (effect.kind === "poo-splat") {
        ctx.fillStyle = "#5b3715";
        const centerSize = Math.max(2, Math.floor(radius * 0.6));
        ctx.fillRect(effect.x + 8 - Math.floor(centerSize / 2), effect.y + 8 - Math.floor(centerSize / 2), centerSize, centerSize);
    }
}
function drawCrashPulse(ctx, x, y, crashAnimationMs, color) {
    const intensity = Math.max(0.2, crashAnimationMs / 260);
    ctx.fillStyle = color;
    ctx.fillRect(x - 1, y + 2, 22 * intensity, 3);
}
