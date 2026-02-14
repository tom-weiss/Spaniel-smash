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
    laneSwitchCooldownMs = 0;
    crashFreezeMs = 0;
    sideObstacleOffsetY = 0;
    static staticObstacleSpeed = 2.2;
    static movingEntityBaseSpeed = 1.2;
    constructor(width, height, rng = Math.random, laneCount = 20) {
        this.width = width;
        this.height = height;
        this.laneCount = laneCount;
        this.laneWidth = width / laneCount;
        this.rng = rng;
        this.playerLane = this.startingLane();
    }
    step(deltaMs, input) {
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
    handleInput(input, deltaMs) {
        this.laneSwitchCooldownMs = Math.max(0, this.laneSwitchCooldownMs - deltaMs);
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
    spawnEntity() {
        const spawnLane = this.pickSpawnLane();
        const spawnX = this.laneX(spawnLane);
        const movingDirection = this.rng() < 0.5 ? 1 : -1;
        const movingSpawnY = movingDirection === 1 ? -26 : this.height + 26;
        if (this.witchAttackActive && !this.entities.some((entity) => entity.type === "andy")) {
            this.entities.push({
                type: "andy",
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
        const roll = this.rng();
        if (roll < 0.18) {
            this.entities.push({
                type: "tree",
                x: spawnX,
                y: -24,
                width: this.laneWidth * 0.5,
                height: 30,
                speed: SpanielSmashGame.staticObstacleSpeed,
                lane: spawnLane,
                laneSwitchCooldownMs: 0,
                direction: 1,
                crashAnimationMs: 0
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
                speed: SpanielSmashGame.staticObstacleSpeed,
                lane: spawnLane,
                laneSwitchCooldownMs: 0,
                direction: 1,
                crashAnimationMs: 0
            });
            return;
        }
        if (roll < 0.56) {
            this.entities.push({
                type: "skier",
                x: spawnX,
                y: movingSpawnY,
                width: this.laneWidth * 0.56,
                height: 30,
                speed: SpanielSmashGame.movingEntityBaseSpeed + this.rng() * 0.5,
                lane: spawnLane,
                laneSwitchCooldownMs: 0,
                direction: movingDirection,
                crashAnimationMs: 0
            });
            return;
        }
        this.entities.push({
            type: "spaniel",
            x: spawnX,
            y: movingSpawnY,
            width: this.laneWidth * 0.5,
            height: 22,
            speed: SpanielSmashGame.movingEntityBaseSpeed + this.rng() * 0.5,
            lane: spawnLane,
            laneSwitchCooldownMs: 0,
            direction: movingDirection,
            crashAnimationMs: 0
        });
    }
    resolveCollisions() {
        const player = {
            x: this.playerX(),
            y: this.playerY(),
            width: this.laneWidth * 0.56,
            height: 34
        };
        const survivors = [];
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
    isMovingObstacle(entity) {
        return entity.type === "skier" || entity.type === "spaniel" || entity.type === "andy";
    }
    spawnSmashEffect(x, y, kind) {
        this.effects.push({
            kind,
            x,
            y,
            ttlMs: 300,
            maxTtlMs: 300
        });
    }
    spawnBloodstain(entity) {
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
    tickEffects(deltaMs) {
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
    forceSpawn(entity) {
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
        this.laneSwitchCooldownMs = 0;
        this.crashFreezeMs = 0;
        this.sideObstacleOffsetY = 0;
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
            isCrashActive: this.crashFreezeMs > 0,
            sideObstacleOffsetY: this.sideObstacleOffsetY,
            entities: this.entities.map((entity) => ({ ...entity })),
            effects: this.effects.map((effect) => ({ ...effect }))
        };
    }
    playerX() {
        return this.laneX(this.playerLane);
    }
    playerY() {
        return this.height - Math.floor(this.height / 3) - 34;
    }
    startingLane() {
        return Math.floor(this.laneCount / 2);
    }
    minPlayableLane() {
        return Math.min(2, Math.floor((this.laneCount - 1) / 2));
    }
    maxPlayableLane() {
        return Math.max(this.minPlayableLane(), this.laneCount - 1 - this.minPlayableLane());
    }
    laneX(lane) {
        return lane * this.laneWidth + this.laneWidth * 0.22;
    }
    entityLane(entity) {
        if (typeof entity.lane === "number") {
            return Math.max(0, Math.min(this.laneCount - 1, entity.lane));
        }
        const lane = Math.round((entity.x - this.laneWidth * 0.22) / this.laneWidth);
        return Math.max(0, Math.min(this.laneCount - 1, lane));
    }
    maybeMoveEntityLane(entity, deltaMs) {
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
            }
            else if (currentLane > this.playerLane) {
                targetLane = currentLane - laneStep;
            }
        }
        else if (this.rng() < 0.3) {
            targetLane = currentLane + (this.rng() < 0.5 ? -1 : 1);
        }
        if (targetLane < this.minPlayableLane() || targetLane > this.maxPlayableLane()) {
            entity.lane = currentLane;
            entity.laneSwitchCooldownMs = 110;
            return;
        }
        if (targetLane !== currentLane && this.isLaneClearForEntity(entity, targetLane)) {
            entity.lane = targetLane;
        }
        else {
            entity.lane = currentLane;
        }
        entity.laneSwitchCooldownMs = 110;
    }
    isLaneClearForEntity(entity, lane) {
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
    pickSpawnLane() {
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
    isSpawnLaneClear(lane) {
        return !this.entities.some((entity) => this.entityLane(entity) === lane && entity.y < 40);
    }
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
        this.ctx.fillStyle = "#9de0ff";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#f3fbff";
        this.ctx.fillRect(20, 0, this.width - 40, this.height);
        this.drawSlopeEdges(snapshot.sideObstacleOffsetY);
        if (snapshot.isCrashActive) {
            drawCrashedSkier(this.ctx, snapshot.playerX, snapshot.playerY, "#2e3fbc", "#ffd166");
        }
        else {
            drawSkier(this.ctx, snapshot.playerX, snapshot.playerY, "#2e3fbc", "#ffd166");
        }
        for (const entity of snapshot.entities) {
            if (entity.type === "tree") {
                drawTree(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "rock") {
                if ((entity.crashAnimationMs ?? 0) > 0) {
                    drawCrashPulse(this.ctx, entity.x, entity.y, entity.crashAnimationMs ?? 0, "#ffa500");
                }
                drawRock(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "skier") {
                drawSkier(this.ctx, entity.x, entity.y, "#3a86ff", "#f1fa8c");
            }
            else if (entity.type === "spaniel") {
                drawSpaniel(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "bloodstain") {
                drawBloodstain(this.ctx, entity.x, entity.y);
            }
            else {
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
    drawSlopeEdges(offsetY) {
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
function drawTree(ctx, x, y) {
    ctx.fillStyle = "#2d6a4f";
    ctx.fillRect(x + 3, y, 14, 18);
    ctx.fillRect(x, y + 8, 20, 12);
    ctx.fillStyle = "#7f5539";
    ctx.fillRect(x + 8, y + 20, 4, 10);
}
function drawRock(ctx, x, y) {
    ctx.fillStyle = "#6c757d";
    ctx.fillRect(x + 2, y + 4, 16, 10);
    ctx.fillStyle = "#adb5bd";
    ctx.fillRect(x + 5, y + 2, 10, 4);
}
function drawBloodstain(ctx, x, y) {
    ctx.fillStyle = "#7f1d1d";
    ctx.fillRect(x + 1, y + 8, 20, 7);
    ctx.fillStyle = "#b91c1c";
    ctx.fillRect(x + 4, y + 5, 14, 4);
}
function drawSpaniel(ctx, x, y) {
    ctx.fillStyle = "#f4a261";
    ctx.fillRect(x, y, 20, 14);
    ctx.fillRect(x + 14, y - 3, 8, 8);
    ctx.fillStyle = "#2a9d8f";
    ctx.fillRect(x + 18, y - 1, 2, 4);
}
function drawSkier(ctx, x, y, bodyColor, helmetColor) {
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 5, y + 10, 12, 14);
    ctx.fillStyle = helmetColor;
    ctx.fillRect(x + 7, y + 3, 8, 8);
    ctx.fillStyle = "#264653";
    ctx.fillRect(x, y + 22, 24, 2);
    ctx.fillRect(x, y + 25, 24, 2);
}
function drawCrashedSkier(ctx, x, y, bodyColor, helmetColor) {
    ctx.fillStyle = bodyColor;
    ctx.fillRect(x + 3, y + 16, 18, 10);
    ctx.fillStyle = helmetColor;
    ctx.fillRect(x - 1, y + 12, 8, 8);
    ctx.fillStyle = "#264653";
    ctx.fillRect(x - 2, y + 25, 28, 2);
    ctx.fillRect(x + 8, y + 7, 2, 22);
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
