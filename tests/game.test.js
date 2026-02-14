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

test('player movement uses cooldown and ignores conflicting input', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0]));
  game.step(16, { left: true, right: false });
  assert.equal(game.snapshot().playerX, 22);

  game.step(16, { left: true, right: false });
  assert.equal(game.snapshot().playerX, 22);

  game.step(140, { left: false, right: true });
  assert.equal(game.snapshot().playerX, 122);

  game.step(160, { left: true, right: true });
  assert.equal(game.snapshot().playerX, 122);
});

test('spawnEntity supports tree, rock, skier and spaniel', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([
    0.1, 0.1, 0.5,
    0.1, 0.3, 0.3,
    0.1, 0.5, 0.4,
    0.1, 0.9, 0.2
  ]));

  game.step(450, { left: false, right: false });
  game.step(450, { left: false, right: false });
  game.step(450, { left: false, right: false });
  game.step(450, { left: false, right: false });

  const types = game.snapshot().entities.map((entity) => entity.type);
  assert.deepEqual(types, ['tree', 'rock', 'skier', 'spaniel']);
});

test('non-spaniel collisions reduce lives and can end game', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]));

  game.forceSpawn({ type: 'tree', x: 122, y: 560, width: 30, height: 30, speed: 0 });
  game.forceSpawn({ type: 'rock', x: 122, y: 560, width: 30, height: 30, speed: 0 });
  game.forceSpawn({ type: 'skier', x: 122, y: 560, width: 30, height: 30, speed: 0 });
  game.step(16, { left: false, right: false });

  const snap = game.snapshot();
  assert.equal(snap.lives, 0);
  assert.equal(snap.isGameOver, true);
});

test('smashing spaniels scores and triggers witch attack and andy spawn', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.4, 0.1]));

  for (let i = 0; i < 10; i += 1) {
    game.forceSpawn({ type: 'spaniel', x: 122, y: 560, width: 30, height: 30, speed: 0 });
    game.step(16, { left: false, right: false });
  }

  const snap = game.snapshot();
  assert.equal(snap.score, 1000);
  assert.equal(snap.spanielsSmashed, 10);
  assert.equal(snap.speedLevel, 2);

  game.step(450, { left: false, right: false });
  assert.equal(game.snapshot().entities[0].type, 'andy');
});

test('andy tracks player, collision clears witch attack, and existing andy blocks respawn', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.9, 0.3]));
  for (let i = 0; i < 10; i += 1) {
    game.forceSpawn({ type: 'spaniel', x: 122, y: 560, width: 30, height: 30, speed: 0 });
    game.step(16, { left: false, right: false });
  }

  game.forceSpawn({ type: 'andy', x: 10, y: 100, width: 30, height: 30, speed: 0 });
  game.forceSpawn({ type: 'andy', x: 260, y: 100, width: 30, height: 30, speed: 0 });
  game.step(16, { left: false, right: false });

  let andy = game.snapshot().entities.find((entity) => entity.type === 'andy' && entity.x < 100);
  assert.ok(andy && andy.x > 10);
  andy = game.snapshot().entities.find((entity) => entity.type === 'andy' && entity.x > 200);
  assert.ok(andy && andy.x < 260);

  game.step(450, { left: false, right: false });
  assert.equal(game.snapshot().entities.filter((entity) => entity.type === 'andy').length, 2);

  game.forceSpawn({ type: 'andy', x: 122, y: 560, width: 30, height: 30, speed: 0 });
  game.step(16, { left: false, right: false });
  assert.equal(game.snapshot().lives, 2);

  game.step(450, { left: false, right: false });
  assert.ok(game.snapshot().entities.some((entity) => entity.type !== 'andy'));
});

test('game over prevents updates and offscreen entities are culled', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.9, 0.9, 0.9]));

  game.forceSpawn({ type: 'tree', x: 122, y: 560, width: 30, height: 30, speed: 0 });
  game.forceSpawn({ type: 'rock', x: 122, y: 560, width: 30, height: 30, speed: 0 });
  game.forceSpawn({ type: 'skier', x: 122, y: 560, width: 30, height: 30, speed: 0 });
  game.forceSpawn({ type: 'spaniel', x: 122, y: 700, width: 30, height: 30, speed: 0 });
  game.step(16, { left: false, right: false });

  const ended = game.snapshot();
  assert.equal(ended.isGameOver, true);
  assert.equal(ended.entities.length, 0);

  game.step(450, { left: false, right: false });
  assert.equal(game.snapshot().entities.length, 0);
});

test('restart resets gameplay state', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.8]));

  game.forceSpawn({ type: 'spaniel', x: 122, y: 560, width: 30, height: 30, speed: 0 });
  game.step(16, { left: false, right: false });
  game.forceSpawn({ type: 'tree', x: 122, y: 560, width: 30, height: 30, speed: 0 });
  game.step(16, { left: false, right: false });

  game.restart();
  const snap = game.snapshot();
  assert.equal(snap.lives, 3);
  assert.equal(snap.score, 0);
  assert.equal(snap.speedLevel, 1);
  assert.equal(snap.spanielsSmashed, 0);
  assert.equal(snap.isGameOver, false);
  assert.equal(snap.entities.length, 0);
  assert.equal(snap.playerX, 122);
});

test('snapshot returns copied entity data', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.8, 0.5]));
  game.step(450, { left: false, right: false });

  const snap1 = game.snapshot();
  snap1.entities[0].x = 999;
  const snap2 = game.snapshot();
  assert.notEqual(snap2.entities[0].x, 999);
});

test('pixel renderer paints all hud and game over layers', () => {
  const calls = [];
  const ctx = {
    fillStyle: '',
    strokeStyle: '',
    font: '',
    fillRect: (...args) => calls.push(['fillRect', ...args]),
    fillText: (...args) => calls.push(['fillText', ...args]),
    beginPath: () => calls.push(['beginPath']),
    moveTo: (...args) => calls.push(['moveTo', ...args]),
    lineTo: (...args) => calls.push(['lineTo', ...args]),
    stroke: () => calls.push(['stroke'])
  };

  const renderer = new PixelRenderer(ctx, 300, 600);
  renderer.render({
    lives: 1,
    score: 200,
    speedLevel: 3,
    spanielsSmashed: 12,
    isGameOver: true,
    playerX: 120,
    entities: [
      { type: 'tree', x: 10, y: 10, width: 20, height: 20, speed: 1 },
      { type: 'rock', x: 40, y: 40, width: 20, height: 20, speed: 1 },
      { type: 'skier', x: 70, y: 70, width: 20, height: 20, speed: 1 },
      { type: 'spaniel', x: 100, y: 100, width: 20, height: 20, speed: 1 },
      { type: 'andy', x: 130, y: 130, width: 20, height: 20, speed: 1 }
    ]
  });

  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Score 200')));
  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Final Score 200')));
  assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Tap Restart below')));
  assert.ok(calls.some((entry) => entry[0] === 'lineTo'));
});
