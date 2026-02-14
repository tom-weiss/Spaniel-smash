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
    start() {
        if (!window.AudioContext) {
            return;
        }
        if (!this.audioCtx) {
            this.audioCtx = new window.AudioContext();
            this.master = this.audioCtx.createGain();
            this.master.gain.value = 0.03;
            this.master.connect(this.audioCtx.destination);
            this.resetSequence();
            this.scheduler = window.setInterval(() => this.scheduleNotes(), 100);
        }
        if (this.audioCtx.state === "suspended") {
            void this.audioCtx.resume();
        }
    }
    resetSequence() {
        this.lcgState = 1;
        if (this.audioCtx) {
            this.nextNoteTime = this.audioCtx.currentTime + 0.02;
        }
    }
    scheduleNotes() {
        if (!this.audioCtx || !this.master) {
            return;
        }
        const lookAhead = this.audioCtx.currentTime + 0.3;
        while (this.nextNoteTime < lookAhead) {
            const note = this.generateNote();
            this.playNote(note, this.nextNoteTime, 0.13);
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
    playNote(freq, at, duration) {
        if (!this.audioCtx || !this.master) {
            return;
        }
        const osc = this.audioCtx.createOscillator();
        osc.type = "square";
        osc.frequency.setValueAtTime(Math.round(freq), at);
        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.22, at + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start(at);
        osc.stop(at + duration + 0.02);
    }
}
const game = new SpanielSmashGame(canvas.width, canvas.height);
const renderer = new PixelRenderer(ctx, canvas.width, canvas.height);
const music = new SkiMusic();
const input = { left: false, right: false };
const startupBanner = document.getElementById("startup-banner");
const dismissBanner = () => {
    if (!startupBanner) {
        return;
    }
    startupBanner.classList.add("hidden");
};
window.addEventListener("keydown", (event) => {
    music.start();
    if (event.key === "ArrowLeft") {
        input.left = true;
    }
    if (event.key === "ArrowRight") {
        input.right = true;
    }
});
window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
        input.left = false;
    }
    if (event.key === "ArrowRight") {
        input.right = false;
    }
});
const leftControl = document.getElementById("control-left");
const rightControl = document.getElementById("control-right");
const restartControl = document.getElementById("control-restart");
function bindTouchControl(control, key) {
    if (!control) {
        return;
    }
    const activate = (event) => {
        event.preventDefault();
        dismissBanner();
        music.start();
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
if (restartControl) {
    restartControl.addEventListener("click", () => {
        game.restart();
        music.resetSequence();
        dismissBanner();
    });
}
window.addEventListener("keydown", dismissBanner, { once: true });
window.addEventListener("pointerdown", dismissBanner, { once: true });
let lastFrame = performance.now();
function frame(now) {
    const delta = Math.min(33, now - lastFrame);
    lastFrame = now;
    game.step(delta, input);
    const snapshot = game.snapshot();
    renderer.render(snapshot);
    if (restartControl) {
        restartControl.toggleAttribute("hidden", !snapshot.isGameOver);
    }
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
