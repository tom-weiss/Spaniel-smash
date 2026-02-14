import { PixelRenderer, SpanielSmashGame } from "./game.js";
const canvas = document.getElementById("game");
if (!canvas) {
    throw new Error("Missing #game canvas");
}
const ctx = canvas.getContext("2d");
if (!ctx) {
    throw new Error("Canvas 2d context unavailable");
}
class SkiMusic {
    audioCtx = null;
    master = null;
    nextNoteTime = 0;
    scheduler = null;
    lcgState = 1;
    muted = false;
    setMuted(muted) {
        this.muted = muted;
        if (muted) {
            this.stopBackground();
            return;
        }
        if (this.audioCtx?.state === "suspended") {
            void this.audioCtx.resume();
        }
    }
    start() {
        if (this.muted) {
            return;
        }
        if (!window.AudioContext) {
            return;
        }
        if (!this.audioCtx) {
            this.audioCtx = new window.AudioContext();
            this.master = this.audioCtx.createGain();
            this.master.gain.value = 0.03;
            this.master.connect(this.audioCtx.destination);
            this.resetSequence();
        }
        if (this.scheduler === null) {
            this.scheduler = window.setInterval(() => this.scheduleNotes(), 100);
        }
        if (this.audioCtx.state === "suspended") {
            void this.audioCtx.resume();
        }
    }
    stopBackground(delayMs = 0) {
        if (this.scheduler !== null) {
            window.clearInterval(this.scheduler);
            this.scheduler = null;
        }
        if (this.audioCtx?.state === "running") {
            const stop = () => {
                if (this.audioCtx?.state === "running") {
                    void this.audioCtx.suspend();
                }
            };
            if (delayMs > 0) {
                window.setTimeout(stop, delayMs);
            }
            else {
                stop();
            }
        }
    }
    resetSequence() {
        this.lcgState = 1;
        if (this.audioCtx) {
            this.nextNoteTime = this.audioCtx.currentTime + 0.02;
        }
    }
    smash() {
        if (!window.AudioContext || this.muted) {
            return;
        }
        if (!this.audioCtx) {
            this.audioCtx = new window.AudioContext();
            this.master = this.audioCtx.createGain();
            this.master.gain.value = 0.04;
            this.master.connect(this.audioCtx.destination);
            this.resetSequence();
        }
        if (this.audioCtx.state === "suspended") {
            void this.audioCtx.resume();
        }
        if (!this.master || !this.audioCtx) {
            return;
        }
        const at = this.audioCtx.currentTime + 0.005;
        this.playNote(180, at, 0.05, "sawtooth", 0.22);
        this.playNote(120, at + 0.03, 0.09, "square", 0.2);
    }
    bark() {
        if (!window.AudioContext || this.muted) {
            return;
        }
        if (!this.audioCtx) {
            this.audioCtx = new window.AudioContext();
            this.master = this.audioCtx.createGain();
            this.master.gain.value = 0.04;
            this.master.connect(this.audioCtx.destination);
            this.resetSequence();
        }
        if (this.audioCtx.state === "suspended") {
            void this.audioCtx.resume();
        }
        if (!this.master || !this.audioCtx) {
            return;
        }
        const at = this.audioCtx.currentTime + 0.01;
        const barkNotes = [330, 280, 240];
        barkNotes.forEach((freq, index) => {
            this.playNote(freq, at + index * 0.045, 0.04, "square", 0.26);
        });
    }
    scheduleNotes() {
        if (!this.audioCtx || !this.master) {
            return;
        }
        const lookAhead = this.audioCtx.currentTime + 0.3;
        while (this.nextNoteTime < lookAhead) {
            const note = this.generateNote();
            this.playNote(note, this.nextNoteTime, 0.13, "square", 0.22);
            this.nextNoteTime += 0.14;
        }
    }
    generateNote() {
        this.lcgState = (this.lcgState * 48271) % 2147483647;
        const r = this.lcgState / 2147483647;
        const scale = [0, 3, 5, 7, 10, 12, 15, 17];
        const root = 220;
        const octave = r > 0.72 ? 2 : r > 0.45 ? 1 : 0;
        const degree = scale[Math.floor(r * scale.length)];
        return root * 2 ** ((degree + octave * 12) / 12);
    }
    playNote(freq, at, duration, wave, peak) {
        if (!this.audioCtx || !this.master) {
            return;
        }
        const osc = this.audioCtx.createOscillator();
        osc.type = wave;
        osc.frequency.setValueAtTime(Math.round(freq), at);
        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(peak, at + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start(at);
        osc.stop(at + duration + 0.02);
    }
}
const FRIENDLY_SPANIEL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%230f172a'/%3E%3Crect x='5' y='8' width='12' height='8' fill='%23f4a261'/%3E%3Crect x='15' y='6' width='6' height='6' fill='%23f4a261'/%3E%3Crect x='16' y='8' width='2' height='2' fill='%23000000'/%3E%3Crect x='18' y='10' width='2' height='2' fill='%23000000'/%3E%3Crect x='19' y='5' width='2' height='6' fill='%238b5a2b'/%3E%3Crect x='4' y='9' width='2' height='5' fill='%238b5a2b'/%3E%3Crect x='8' y='16' width='2' height='4' fill='%23d97706'/%3E%3Crect x='13' y='16' width='2' height='4' fill='%23d97706'/%3E%3C/svg%3E";
const GRINNING_SPANIEL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%230f172a'/%3E%3Crect x='5' y='8' width='12' height='8' fill='%23f4a261'/%3E%3Crect x='15' y='6' width='6' height='6' fill='%23f4a261'/%3E%3Crect x='16' y='8' width='2' height='2' fill='%23000000'/%3E%3Crect x='18' y='8' width='2' height='2' fill='%23000000'/%3E%3Crect x='17' y='11' width='3' height='2' fill='%23ffffff'/%3E%3Crect x='16' y='13' width='5' height='1' fill='%23000000'/%3E%3Crect x='19' y='5' width='2' height='6' fill='%238b5a2b'/%3E%3Crect x='4' y='9' width='2' height='5' fill='%238b5a2b'/%3E%3Crect x='8' y='16' width='2' height='4' fill='%23d97706'/%3E%3Crect x='13' y='16' width='2' height='4' fill='%23d97706'/%3E%3C/svg%3E";
const game = new SpanielSmashGame(canvas.width, canvas.height);
const renderer = new PixelRenderer(ctx, canvas.width, canvas.height);
const music = new SkiMusic();
const input = { left: false, right: false, jump: false };
const splashScreen = document.getElementById("splash-screen");
const splashTitle = document.getElementById("splash-title");
const splashCopy = document.getElementById("splash-copy");
const splashButton = document.getElementById("splash-start");
const splashImage = document.getElementById("splash-image");
const statusScore = document.getElementById("status-score");
const statusLives = document.getElementById("status-lives");
const statusLevel = document.getElementById("status-level");
const muteToggle = document.getElementById("splash-mute-toggle");
let isPlaying = false;
let gameOverHandled = false;
let lastSpanielSmashCount = 0;
const STORAGE_MUTE_KEY = "spaniel-smash-muted";
const initialMuted = window.localStorage.getItem(STORAGE_MUTE_KEY) === "true";
music.setMuted(initialMuted);
if (muteToggle) {
    muteToggle.checked = initialMuted;
    muteToggle.addEventListener("change", () => {
        const muted = muteToggle.checked;
        music.setMuted(muted);
        window.localStorage.setItem(STORAGE_MUTE_KEY, String(muted));
    });
}
function showSplash(mode) {
    if (!splashScreen || !splashTitle || !splashCopy || !splashButton || !splashImage) {
        return;
    }
    splashScreen.classList.remove("hidden");
    if (mode === "start") {
        splashTitle.textContent = "SPANIEL SMASH";
        splashCopy.textContent = "Arrow keys or tap controls move left/right. Smash spaniels to score. Trees block you. Dodge rocks, skiers, and witch Andy.";
        splashButton.textContent = "START";
        splashImage.src = FRIENDLY_SPANIEL;
        splashImage.alt = "Pixel art spaniel";
        return;
    }
    splashTitle.textContent = "GAME OVER";
    splashCopy.textContent = "Grrr! The spaniel wins this round. Hit restart and smash them all again.";
    splashButton.textContent = "RESTART";
    splashImage.src = GRINNING_SPANIEL;
    splashImage.alt = "Grinning pixel spaniel";
}
function hideSplash() {
    splashScreen?.classList.add("hidden");
}
window.addEventListener("keydown", (event) => {
    if (!isPlaying || game.snapshot().isGameOver) {
        return;
    }
    if (event.key === "ArrowLeft") {
        input.left = true;
    }
    if (event.key === "ArrowRight") {
        input.right = true;
    }
    if (event.key === "ArrowUp" || event.key === " " || event.key === "Spacebar") {
        input.jump = true;
    }
});
window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
        input.left = false;
    }
    if (event.key === "ArrowRight") {
        input.right = false;
    }
    if (event.key === "ArrowUp" || event.key === " " || event.key === "Spacebar") {
        input.jump = false;
    }
});
const leftControl = document.getElementById("control-left");
const rightControl = document.getElementById("control-right");
const jumpControl = document.getElementById("control-jump");
for (const eventName of ["gesturestart", "gesturechange", "gestureend"]) {
    window.addEventListener(eventName, (event) => {
        event.preventDefault();
    }, { passive: false });
}
window.addEventListener("selectstart", (event) => {
    event.preventDefault();
});
function bindTouchControl(control, key) {
    if (!control) {
        return;
    }
    const activate = (event) => {
        event.preventDefault();
        if (!isPlaying || game.snapshot().isGameOver) {
            return;
        }
        input[key] = true;
    };
    const deactivate = (event) => {
        event.preventDefault();
        input[key] = false;
    };
    control.addEventListener("pointerdown", activate);
    control.addEventListener("pointerup", deactivate);
    control.addEventListener("pointercancel", deactivate);
    control.addEventListener("pointerleave", deactivate);
    control.addEventListener("dblclick", (event) => {
        event.preventDefault();
    });
}
bindTouchControl(leftControl, "left");
bindTouchControl(rightControl, "right");
bindTouchControl(jumpControl, "jump");
splashButton?.addEventListener("click", () => {
    if (game.snapshot().isGameOver) {
        game.restart();
        music.resetSequence();
    }
    gameOverHandled = false;
    lastSpanielSmashCount = 0;
    input.left = false;
    input.right = false;
    input.jump = false;
    isPlaying = true;
    music.start();
    hideSplash();
});
showSplash("start");
let lastFrame = performance.now();
function frame(now) {
    const delta = Math.min(33, now - lastFrame);
    lastFrame = now;
    if (isPlaying) {
        game.step(delta, input);
    }
    const snapshot = game.snapshot();
    renderer.render(snapshot);
    if (statusScore) {
        statusScore.textContent = `Score ${snapshot.score}`;
    }
    if (statusLives) {
        statusLives.textContent = `Lives ${snapshot.lives}`;
    }
    if (statusLevel) {
        statusLevel.textContent = `Level ${snapshot.speedLevel}`;
    }
    if (leftControl) {
        leftControl.toggleAttribute("hidden", !isPlaying || snapshot.isGameOver);
    }
    if (rightControl) {
        rightControl.toggleAttribute("hidden", !isPlaying || snapshot.isGameOver);
    }
    if (jumpControl) {
        jumpControl.toggleAttribute("hidden", !isPlaying || snapshot.isGameOver);
    }
    if (snapshot.spanielsSmashed > lastSpanielSmashCount) {
        lastSpanielSmashCount = snapshot.spanielsSmashed;
        music.smash();
    }
    if (snapshot.isGameOver && !gameOverHandled) {
        gameOverHandled = true;
        isPlaying = false;
        music.stopBackground();
        music.bark();
        music.stopBackground(260);
        showSplash("game-over");
    }
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
