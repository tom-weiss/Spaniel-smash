export class SpanielSmashGame {
    width;
    height;
    laneCount;
    laneWidth;
    playerLane = 1;
    lives = 3;
    score = 0;
    speedLevel = 1;
    spanielsSmashed = 0;
    gameOver = false;
    witchAttackActive = false;
    entities = [];
    rng;
    spawnClock = 0;
    laneSwitchCooldownMs = 0;
    constructor(width, height, rng = Math.random, laneCount = 3) {
        this.width = width;
        this.height = height;
        this.laneCount = laneCount;
        this.laneWidth = width / laneCount;
        this.rng = rng;
    }
    step(deltaMs, input) {
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
            entity.y += entity.speed * speedMultiplier * (deltaMs / 16.67);
            if (entity.type === "andy") {
                if (entity.x < this.playerX()) {
                    entity.x += 0.9;
                }
                else if (entity.x > this.playerX()) {
                    entity.x -= 0.9;
                }
            }
        }
        this.resolveCollisions();
        this.entities = this.entities.filter((entity) => entity.y < this.height + 40);
    }
    handleInput(input, deltaMs) {
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
    spawnEntity() {
        const spawnLane = Math.floor(this.rng() * this.laneCount);
        const spawnX = spawnLane * this.laneWidth + this.laneWidth * 0.22;
        if (this.witchAttackActive && !this.entities.some((entity) => entity.type === "andy")) {
            this.entities.push({
                type: "andy",
                x: spawnX,
                y: -26,
                width: this.laneWidth * 0.56,
                height: 32,
                speed: 2.7
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
                speed: 1.9 + this.rng()
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
                speed: 2.5 + this.rng() * 0.9
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
                speed: 2.1 + this.rng()
            });
            return;
        }
        this.entities.push({
            type: "spaniel",
            x: spawnX,
            y: -20,
            width: this.laneWidth * 0.5,
            height: 22,
            speed: 2 + this.rng()
        });
    }
    resolveCollisions() {
        const player = {
            x: this.playerX(),
            y: this.height - 58,
            width: this.laneWidth * 0.56,
            height: 34
        };
        const survivors = [];
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
    forceSpawn(entity) {
        this.entities.push(entity);
    }
    restart() {
        this.playerLane = 1;
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
    snapshot() {
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
    playerX() {
        return this.playerLane * this.laneWidth + this.laneWidth * 0.22;
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
        this.ctx.strokeStyle = "#c7e8f7";
        for (let i = 1; i < 3; i += 1) {
            this.ctx.beginPath();
            this.ctx.moveTo((this.width / 3) * i, 0);
            this.ctx.lineTo((this.width / 3) * i, this.height);
            this.ctx.stroke();
        }
        drawSkier(this.ctx, snapshot.playerX, this.height - 58, "#2e3fbc", "#ffd166");
        for (const entity of snapshot.entities) {
            if (entity.type === "tree") {
                drawTree(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "rock") {
                drawRock(this.ctx, entity.x, entity.y);
            }
            else if (entity.type === "skier") {
                drawSkier(this.ctx, entity.x, entity.y, "#3a86ff", "#f1fa8c");
            }
            else if (entity.type === "spaniel") {
                drawSpaniel(this.ctx, entity.x, entity.y);
            }
            else {
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
