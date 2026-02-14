import test from 'node:test';
import assert from 'node:assert/strict';
import { PixelRenderer, SpanielSmashGame } from '../dist/game.js';

function rngFrom(values) {
  let index = 0;
  return () => {
    const value = values[index] !== undefined ? values[index] : 0;
    index += 1;
    return value;
  };
}

test('player movement is lane-limited and avoids side trees', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  for (let i = 0; i < 20; i += 1) {
    game.step(150, { left: true, right: false });
  }
  assert.equal(game.snapshot().playerX, 66.6);

  for (let i = 0; i < 20; i += 1) {
    game.step(150, { left: false, right: true });
  }
  assert.equal(game.snapshot().playerX, 216.6);
});

test('spawned moving obstacles stay in playable lanes', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.99, 0.2, 0.99, 0.2]), 10);
  game.step(450, { left: false, right: false });
  game.step(450, { left: false, right: false });

  const lanes = game.snapshot().entities.map((entity) => entity.lane);
  assert.ok(lanes.every((lane) => lane >= 2 && lane <= 7));
});

test('smashing spaniel produces score, animation effect, and bloodstain obstacle', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'spaniel', x: 122, y: 366, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });

  const snap = game.snapshot();
  assert.equal(snap.score, 100);
  assert.equal(snap.spanielsSmashed, 1);
  assert.ok(snap.effects.some((effect) => effect.kind === 'spaniel-smash'));
  const coinEffect = snap.effects.find((effect) => effect.kind === 'coin-pop');
  assert.ok(coinEffect);
  assert.ok(snap.entities.some((entity) => entity.type === 'bloodstain'));

  game.step(16, { left: false, right: false });
  const movedCoin = game.snapshot().effects.find((effect) => effect.kind === 'coin-pop');
  assert.ok(movedCoin.x > coinEffect.x);

  game.step(320, { left: false, right: false });
  assert.equal(game.snapshot().effects.length, 0);
});

test('spaniel streak upgrades speed level and can spawn andy', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.4, 0.2, 0.2]), 10);
  for (let i = 0; i < 10; i += 1) {
    game.forceSpawn({ type: 'spaniel', x: 122, y: 366, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
    game.step(16, { left: false, right: false });
  }

  const snap = game.snapshot();
  assert.equal(snap.score, 1000);
  assert.equal(snap.speedLevel, 2);

  game.step(450, { left: false, right: false });
  assert.ok(game.snapshot().entities.some((entity) => entity.type === 'andy'));
});

test('moving obstacle collisions convert moving entities to the correct crash remains', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'skier', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.forceSpawn({ type: 'spaniel', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });

  game.step(16, { left: false, right: false });
  const collided = game.snapshot();
  const convertedRock = collided.entities.find((entity) => entity.type === 'rock' && entity.crashAnimationMs > 0);
  const convertedBloodstain = collided.entities.find((entity) => entity.type === 'bloodstain');
  assert.ok(convertedRock);
  assert.ok(convertedBloodstain);
  assert.ok(collided.effects.some((effect) => effect.kind === 'obstacle-crash'));
  assert.ok(collided.effects.some((effect) => effect.kind === 'spaniel-smash'));

  game.step(320, { left: false, right: false });
  const settledRock = game.snapshot().entities.find((entity) => entity.type === 'rock');
  assert.equal(settledRock.crashAnimationMs, 0);
});


test('entity collision marks second moving obstacle index', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'tree', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5 });
  game.forceSpawn({ type: 'skier', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });

  game.step(16, { left: false, right: false });
  assert.ok(game.snapshot().entities.some((entity) => entity.type === 'rock' && entity.crashAnimationMs > 0));
});

test('non-spaniel collisions remove lives and game over freezes state updates', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'tree', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false });
  game.step(700, { left: false, right: false });
  game.forceSpawn({ type: 'rock', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false });
  game.step(700, { left: false, right: false });
  game.forceSpawn({ type: 'andy', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });

  assert.equal(game.snapshot().isGameOver, true);
  const before = game.snapshot().entities.length;
  game.step(1000, { left: false, right: false });
  assert.equal(game.snapshot().entities.length, before);
});

test('spawn lane fallback chooses nearest clear lane', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.3, 0.1]), 10);
  game.forceSpawn({ type: 'tree', x: 100, y: 0, width: 10, height: 10, speed: 2.2, lane: 3 });
  game.forceSpawn({ type: 'rock', x: 130, y: 0, width: 10, height: 10, speed: 2.2, lane: 4 });
  game.step(450, { left: false, right: false });

  const spawned = game.snapshot().entities.at(-1);
  assert.equal(spawned.lane, 2);
});



test('forceSpawn computes lane from x-position when lane is omitted', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'tree', x: 154, y: 40, width: 10, height: 10, speed: 0 });

  const spawned = game.snapshot().entities[0];
  assert.equal(spawned.lane, 5);
  assert.equal(spawned.x, 156.6);
});

test('restart resets game and clears effects', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.8]), 10);
  game.forceSpawn({ type: 'spaniel', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });

  game.restart();
  const snap = game.snapshot();
  assert.equal(snap.score, 0);
  assert.equal(snap.lives, 3);
  assert.equal(snap.effects.length, 0);
  assert.equal(snap.entities.length, 0);
});

test('snapshot returns copied entities and effects', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'spaniel', x: 122, y: 366, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });

  const snap1 = game.snapshot();
  snap1.entities[0].x = 999;
  snap1.effects[0].x = 999;
  const snap2 = game.snapshot();
  assert.notEqual(snap2.entities[0].x, 999);
  assert.notEqual(snap2.effects[0].x, 999);
});

test('pixel renderer paints HUD, effects, crash panel, and end states', () => {
  const calls = [];
  const ctx = {
    fillStyle: '',
    font: '',
    fillRect: (...args) => calls.push(['fillRect', ...args]),
    fillText: (...args) => calls.push(['fillText', ...args])
  };

  const renderer = new PixelRenderer(ctx, 300, 600);
  renderer.render({
    lives: 1,
    score: 200,
    speedLevel: 3,
    spanielsSmashed: 12,
    isGameOver: true,
    playerX: 120,
    playerY: 366,
    isCrashActive: true,
    sideObstacleOffsetY: 32,
    entities: [
      { type: 'tree', x: 10, y: 10, width: 20, height: 20, speed: 1 },
      { type: 'rock', x: 40, y: 40, width: 20, height: 20, speed: 1, crashAnimationMs: 200 },
      { type: 'skier', x: 70, y: 70, width: 20, height: 20, speed: 1 },
      { type: 'spaniel', x: 100, y: 100, width: 20, height: 20, speed: 1 },
      { type: 'bloodstain', x: 110, y: 90, width: 20, height: 20, speed: 1 },
      { type: 'andy', x: 130, y: 130, width: 20, height: 20, speed: 1 }
    ],
    effects: [
      { kind: 'obstacle-crash', x: 90, y: 90, ttlMs: 100, maxTtlMs: 300 },
      { kind: 'coin-pop', x: 105, y: 95, ttlMs: 120, maxTtlMs: 300 }
    ]
  });

  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Score 200')));
  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Final Score 200')));

  renderer.render({
    lives: 2,
    score: 20,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 120,
    playerY: 366,
    isCrashActive: true,
    sideObstacleOffsetY: 0,
    entities: [],
    effects: []
  });
  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('CRASHED!')));
  assert.ok(calls.some((entry) => entry[0] === 'fillRect'));

  renderer.render({
    lives: 3,
    score: 0,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 100,
    playerY: 300,
    isCrashActive: false,
    sideObstacleOffsetY: 8,
    entities: [],
    effects: []
  });
  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Level 1')));
});


test('spawn branches include rock and skier entities', () => {
  const rockGame = new SpanielSmashGame(300, 600, rngFrom([0.2, 0.2, 0.2]), 10);
  rockGame.step(450, { left: false, right: false });
  assert.ok(rockGame.snapshot().entities.some((entity) => entity.type === 'rock'));

  const skierGame = new SpanielSmashGame(300, 600, rngFrom([0.2, 0.2, 0.4, 0.1]), 10);
  skierGame.step(450, { left: false, right: false });
  assert.ok(skierGame.snapshot().entities.some((entity) => entity.type === 'skier'));
});

test('input cooldown blocks repeated turns and ignores opposing keys', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.step(16, { left: true, right: false });
  const afterFirstMove = game.snapshot().playerX;

  game.step(16, { left: true, right: false });
  assert.equal(game.snapshot().playerX, afterFirstMove);

  game.step(200, { left: true, right: true });
  assert.equal(game.snapshot().playerX, afterFirstMove);
});

test('moving entity lane logic covers andy pursuit, bounds, and blocked lane fallback', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.9]), 10);

  game.forceSpawn({ type: 'andy', x: 122, y: 200, width: 20, height: 20, speed: 0, lane: 8, direction: -1, laneSwitchCooldownMs: 0 });
  game.step(200, { left: true, right: false }); // player moves to lane 4, andy lane attempts to move right (blocked by bounds rule fallback)
  const andy = game.snapshot().entities.find((entity) => entity.type === 'andy');
  assert.ok(andy);
  assert.equal(andy.lane, 8);

  game.forceSpawn({ type: 'skier', x: 122, y: 230, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 0 });
  game.forceSpawn({ type: 'tree', x: 122, y: 231, width: 20, height: 20, speed: 0, lane: 6 });
  game.forceSpawn({ type: 'rock', x: 122, y: 230, width: 20, height: 20, speed: 0, lane: 3 });
  game.step(200, { left: false, right: false });
  const skier = game.snapshot().entities.find((entity) => entity.type === 'skier');
  assert.ok(skier);
  assert.equal(skier.lane, 5);
});

test('spawn lane can return preferred when all lanes are blocked', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0, 0.2]), 3);
  game.forceSpawn({ type: 'tree', x: 10, y: 0, width: 10, height: 10, speed: 0, lane: 1 });
  game.step(450, { left: false, right: false });
  const spawned = game.snapshot().entities.at(-1);
  assert.equal(spawned.lane, 1);
});
