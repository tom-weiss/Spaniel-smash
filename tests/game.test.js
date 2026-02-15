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
  game.step(540, { left: false, right: false });
  game.step(540, { left: false, right: false });

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

test('black spaniel awards double points and still advances spaniel counters', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'black-spaniel', x: 122, y: 366, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });

  const snap = game.snapshot();
  assert.equal(snap.score, 200);
  assert.equal(snap.spanielsSmashed, 1);
  assert.equal(snap.levelSpanielsSmashed, 1);
  assert.ok(snap.entities.some((entity) => entity.type === 'bloodstain'));
});

test('new obstacle templates are level-gated and slalom poles stay in standard pool', () => {
  const levelOne = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  const levelOneRare = levelOne.templatesForTier('rare');
  assert.equal(levelOneRare.some((template) => template.type === 'black-spaniel'), false);
  assert.equal(levelOneRare.some((template) => template.type === 'ice-crevasse'), false);
  assert.equal(levelOneRare.some((template) => template.type === 'ski-school-instructor'), false);
  assert.ok(levelOne.templatesForTier('standard').some((template) => template.type === 'slalom-poles'));

  const levelTwo = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  levelTwo.speedLevel = 2;
  const levelTwoRare = levelTwo.templatesForTier('rare');
  assert.ok(levelTwoRare.some((template) => template.type === 'black-spaniel'));
  assert.ok(levelTwoRare.some((template) => template.type === 'ice-crevasse'));
  assert.equal(levelTwoRare.some((template) => template.type === 'ski-school-instructor'), false);

  const levelThree = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  levelThree.speedLevel = 3;
  assert.ok(levelThree.templatesForTier('rare').some((template) => template.type === 'ski-school-instructor'));
  assert.equal(levelThree.templatesForTier('super-rare').some((template) => template.type === 'naked-skier'), false);

  const levelFour = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  levelFour.speedLevel = 4;
  assert.ok(levelFour.templatesForTier('super-rare').some((template) => template.type === 'naked-skier'));
  assert.ok(levelFour.templatesForTier('standard').some((template) => template.type === 'slalom-poles'));
});

test('ice crevasse requires a jump to avoid damage', () => {
  const grounded = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  grounded.playerImmortalMs = 0;
  grounded.forceSpawn({ type: 'ice-crevasse', obstacleId: 'ice-crevasse', jumpRule: 'high', x: 122, y: 366, width: 46, height: 24, speed: 0, lane: 5 });
  grounded.step(16, { left: false, right: false, jump: false });
  assert.equal(grounded.snapshot().lives, 2);

  const jumping = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  jumping.playerImmortalMs = 0;
  jumping.forceSpawn({ type: 'ice-crevasse', obstacleId: 'ice-crevasse', jumpRule: 'high', x: 122, y: 366, width: 46, height: 24, speed: 0, lane: 5 });
  jumping.step(16, { left: false, right: false, jump: true });
  assert.equal(jumping.snapshot().lives, 3);
});

test('ski school spawn scales children by level and supports debug override count', () => {
  const levelThree = new SpanielSmashGame(300, 600, rngFrom([0.2, 0.3, 0.4]), 10);
  levelThree.speedLevel = 3;
  levelThree.spawnSkiSchoolDebug();
  let school = levelThree.snapshot().entities.filter((entity) => entity.type === 'ski-school-instructor' || entity.type === 'ski-school-child');
  assert.equal(school.filter((entity) => entity.type === 'ski-school-instructor').length, 1);
  assert.equal(school.filter((entity) => entity.type === 'ski-school-child').length, 3);
  const instructor = school.find((entity) => entity.type === 'ski-school-instructor');
  const children = school.filter((entity) => entity.type === 'ski-school-child');
  assert.ok(instructor);
  assert.ok(children.every((entity) => entity.y > instructor.y));
  assert.ok(school.every((entity) => entity.obstacleId === 'ski-school-snake'));
  assert.ok(new Set(school.map((entity) => entity.lane)).size >= 2);

  const beforeLanes = school.map((entity) => entity.lane);
  levelThree.step(320, { left: false, right: false });
  school = levelThree.snapshot().entities.filter((entity) => entity.type === 'ski-school-instructor' || entity.type === 'ski-school-child');
  assert.equal(school.filter((entity) => entity.type === 'ski-school-instructor').length, 1);
  assert.equal(school.filter((entity) => entity.type === 'ski-school-child').length, 3);
  assert.ok(school.some((entity, index) => entity.lane !== beforeLanes[index]));

  const levelSix = new SpanielSmashGame(300, 600, rngFrom([0.2, 0.3, 0.4]), 10);
  levelSix.speedLevel = 6;
  levelSix.spawnSkiSchoolDebug();
  const longSchool = levelSix.snapshot().entities.filter((entity) => entity.type === 'ski-school-instructor' || entity.type === 'ski-school-child');
  assert.equal(longSchool.filter((entity) => entity.type === 'ski-school-child').length, 12);

  const debugOverride = new SpanielSmashGame(300, 600, rngFrom([0.2, 0.3, 0.4]), 10);
  debugOverride.spawnSkiSchoolDebug(4);
  const overrideSchool = debugOverride.snapshot().entities.filter((entity) => entity.type === 'ski-school-instructor' || entity.type === 'ski-school-child');
  assert.equal(overrideSchool.filter((entity) => entity.type === 'ski-school-instructor').length, 1);
  assert.equal(overrideSchool.filter((entity) => entity.type === 'ski-school-child').length, 4);
  debugOverride.step(32, { left: false, right: false });
  const overrideAfterStep = debugOverride.snapshot().entities.filter((entity) => entity.type === 'ski-school-instructor' || entity.type === 'ski-school-child');
  assert.equal(overrideAfterStep.filter((entity) => entity.type === 'ski-school-instructor').length, 1);
  assert.equal(overrideAfterStep.filter((entity) => entity.type === 'ski-school-child').length, 4);
});

test('andy boss appears after spaniel threshold and jump defeat levels up with bonus', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.4, 0.2, 0.2]), 10);
  for (let i = 0; i < 12; i += 1) {
    game.forceSpawn({ type: 'spaniel', x: 122, y: 366, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
    game.step(16, { left: false, right: false });
  }

  const withBoss = game.snapshot();
  assert.equal(withBoss.score, 1200);
  assert.equal(withBoss.speedLevel, 1);
  assert.equal(withBoss.levelSpanielsSmashed, 12);
  assert.equal(withBoss.isBossActive, true);

  const runtimeBoss = game.entities.find((entity) => entity.type === 'andy' && entity.behaviorState?.kind === 'andyBoss');
  assert.ok(runtimeBoss);
  runtimeBoss.behaviorState.phase = 'hovering';
  runtimeBoss.behaviorState.phaseMs = 4000;
  runtimeBoss.y = 366;
  runtimeBoss.speed = 0;
  runtimeBoss.lane = 5;

  game.step(16, { left: false, right: false, jump: true });
  const afterDefeat = game.snapshot();
  assert.equal(afterDefeat.isBossActive, false);
  assert.equal(afterDefeat.speedLevel, 2);
  assert.equal(afterDefeat.levelSpanielsSmashed, 0);
  assert.ok(afterDefeat.levelUpBannerMs > 0);
  assert.equal(afterDefeat.score, 3000);
});



test('defeating level ten boss triggers victory state', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.speedLevel = 10;
  game.andyBossActive = true;
  game.forceSpawn({
    type: 'andy',
    obstacleId: 'andy-boss',
    jumpRule: 'high',
    behaviorState: { kind: 'andyBoss', phase: 'hovering', phaseMs: 2000, throwCooldownMs: 9999 },
    x: 122,
    y: 366,
    width: 28,
    height: 34,
    speed: 0,
    lane: 5,
    laneSwitchCooldownMs: 0
  });

  game.step(16, { left: false, right: false, jump: true });
  const snap = game.snapshot();
  assert.equal(snap.isVictory, true);
  assert.equal(snap.isGameOver, true);
  assert.equal(snap.speedLevel, 10);
});

test('moving obstacles only convert when colliding with lethal obstacles', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'skier', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.forceSpawn({ type: 'spaniel', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });

  game.step(16, { left: false, right: false });
  const collided = game.snapshot();
  const bloodstains = collided.entities.filter((entity) => entity.type === 'bloodstain');
  assert.equal(bloodstains.length, 1);
  assert.ok(collided.entities.some((entity) => entity.type === 'skier'));
  assert.equal(collided.entities.some((entity) => entity.type === 'spaniel'), false);
  assert.ok(collided.effects.some((effect) => effect.kind === 'spaniel-smash'));
});

test('bloodstains do not transform skiers or spaniels on overlap', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'bloodstain', x: 122, y: 120, width: 20, height: 18, speed: 0, lane: 5 });
  game.forceSpawn({ type: 'skier', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.forceSpawn({ type: 'bloodstain', x: 152, y: 200, width: 20, height: 18, speed: 0, lane: 6 });
  game.forceSpawn({ type: 'spaniel', x: 152, y: 200, width: 20, height: 20, speed: 0, lane: 6, laneSwitchCooldownMs: 999 });

  game.step(16, { left: false, right: false });
  const snap = game.snapshot();
  assert.ok(snap.entities.some((entity) => entity.type === 'skier'));
  assert.ok(snap.entities.some((entity) => entity.type === 'spaniel'));
  assert.equal(snap.entities.filter((entity) => entity.type === 'bloodstain').length, 2);
});

test('puddle, ice, and drone telegraph do not transform moving obstacles on overlap', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'puddle-patch', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5 });
  game.forceSpawn({ type: 'skier', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.forceSpawn({ type: 'ice-patch', x: 152, y: 120, width: 20, height: 20, speed: 0, lane: 6 });
  game.forceSpawn({ type: 'spaniel', x: 152, y: 120, width: 20, height: 20, speed: 0, lane: 6, laneSwitchCooldownMs: 999 });
  game.forceSpawn({
    type: 'drone-package-drop',
    obstacleId: 'drone-package-drop',
    behaviorState: { kind: 'droneDrop', phase: 'telegraph', phaseMs: 650 },
    x: 182,
    y: 120,
    width: 20,
    height: 20,
    speed: 0,
    lane: 7
  });
  game.forceSpawn({ type: 'helicopter-downdraft', x: 182, y: 120, width: 20, height: 20, speed: 0, lane: 7, laneSwitchCooldownMs: 999 });

  game.step(16, { left: false, right: false });
  const snap = game.snapshot();
  assert.ok(snap.entities.some((entity) => entity.type === 'skier'));
  assert.ok(snap.entities.some((entity) => entity.type === 'spaniel'));
  assert.ok(snap.entities.some((entity) => entity.type === 'helicopter-downdraft'));
  assert.equal(snap.entities.filter((entity) => entity.type === 'bloodstain').length, 0);
});


test('entity collision marks second moving obstacle index', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'tree', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5 });
  game.forceSpawn({ type: 'skier', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });

  game.step(16, { left: false, right: false });
  assert.ok(game.snapshot().entities.some((entity) => entity.type === 'bloodstain'));
});

test('obstacle collision bloodstains keep no obstacle metadata and do not hurt player', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'tree', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5 });
  game.forceSpawn({ type: 'skier', jumpRule: 'none', x: 122, y: 120, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });

  game.step(16, { left: false, right: false });
  const debrisBloodstain = game.snapshot().entities.find((entity) => entity.type === 'bloodstain');
  assert.ok(debrisBloodstain);
  assert.equal(debrisBloodstain.jumpRule, undefined);
  assert.equal(debrisBloodstain.obstacleId, undefined);

  const runtimeBloodstain = game.entities.find((entity) => entity.type === 'bloodstain');
  assert.ok(runtimeBloodstain);
  runtimeBloodstain.y = 366;
  runtimeBloodstain.speed = 0;
  runtimeBloodstain.lane = 5;
  runtimeBloodstain.direction = 1;

  const livesBefore = game.snapshot().lives;
  game.step(16, { left: false, right: false, jump: false });
  assert.equal(game.snapshot().lives, livesBefore);
});

test('non-spaniel collisions remove lives and game over freezes state updates', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.playerImmortalMs = 0;
  game.forceSpawn({ type: 'tree', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false });
  game.step(700, { left: false, right: false });
  game.playerImmortalMs = 0;
  game.forceSpawn({ type: 'rock', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false });
  game.step(700, { left: false, right: false });
  game.playerImmortalMs = 0;
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
  game.step(540, { left: false, right: false });

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
  game.forceSpawn({ type: 'puddle-patch', obstacleId: 'puddle-patch', x: 122, y: 366, width: 24, height: 24, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  game.step(16, { left: false, right: false });
  assert.ok(game.snapshot().activeEffects.puddleSlowMs > 0);

  game.restart();
  const snap = game.snapshot();
  assert.equal(snap.score, 0);
  assert.equal(snap.lives, 3);
  assert.equal(snap.effects.length, 0);
  assert.equal(snap.entities.length, 0);
  assert.equal(snap.activeEffects.puddleSlowMs, 0);
  assert.equal(snap.activeEffects.wetPaintSlipMs, 0);
});

test('level one does not start with invulnerability but level-up still grants it', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  assert.equal(game.snapshot().isPlayerImmortal, false);

  game.andyBossActive = true;
  game.forceSpawn({
    type: 'andy',
    obstacleId: 'andy-boss',
    jumpRule: 'high',
    behaviorState: { kind: 'andyBoss', phase: 'exiting', phaseMs: 0, throwCooldownMs: 9999 },
    x: 122,
    y: 660,
    width: 28,
    height: 34,
    speed: 0,
    lane: 5
  });

  game.step(16, { left: false, right: false });
  assert.equal(game.snapshot().speedLevel, 2);
  assert.equal(game.snapshot().isPlayerImmortal, true);

  game.restart();
  assert.equal(game.snapshot().isPlayerImmortal, false);
});

test('respawn invulnerability starts when crash freeze ends and movement resumes', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.playerImmortalMs = 0;
  game.forceSpawn({ type: 'tree', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5 });

  game.step(16, { left: false, right: false });
  const afterCrash = game.snapshot();
  assert.equal(afterCrash.isCrashActive, true);
  assert.equal(afterCrash.isPlayerImmortal, true);
  const respawnImmortalMs = afterCrash.playerImmortalMs;
  const frozenX = afterCrash.playerX;

  game.step(640, { left: true, right: false });
  const stillFrozen = game.snapshot();
  assert.equal(stillFrozen.isCrashActive, true);
  assert.equal(stillFrozen.playerImmortalMs, respawnImmortalMs);
  assert.equal(stillFrozen.playerX, frozenX);

  game.step(16, { left: true, right: false });
  const resumed = game.snapshot();
  assert.equal(resumed.isCrashActive, false);
  assert.equal(resumed.isPlayerImmortal, true);
  assert.equal(resumed.playerImmortalMs, respawnImmortalMs);
  assert.notEqual(resumed.playerX, frozenX);
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
    playerJumpOffset: 0,
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

    assert.ok(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('Final Score 200')));

  renderer.render({
    lives: 2,
    score: 20,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 120,
    playerY: 366,
    playerJumpOffset: 0,
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
    playerJumpOffset: 12,
    isCrashActive: false,
    sideObstacleOffsetY: 8,
    entities: [],
    effects: []
  });
});

test('pixel renderer draws force field around player while immortal', () => {
  const makeCtx = () => {
    const calls = [];
    const ctx = {
      fillStyle: '#000',
      font: '16px monospace',
      fillRect: (...args) => calls.push(args),
      fillText: () => {}
    };
    return { ctx, calls };
  };

  const onCase = makeCtx();
  const onRenderer = new PixelRenderer(onCase.ctx, 300, 600);
  onRenderer.render({
    lives: 3,
    score: 0,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 100,
    playerY: 300,
    playerJumpOffset: 0,
    isPlayerImmortal: true,
    playerImmortalMs: 40,
    isCrashActive: false,
    sideObstacleOffsetY: 0,
    entities: [],
    effects: []
  });

  assert.ok(onCase.calls.some((entry) => entry[0] === 100 && entry[1] === 302 && entry[2] === 24 && entry[3] === 1));

  const offCase = makeCtx();
  const offRenderer = new PixelRenderer(offCase.ctx, 300, 600);
  offRenderer.render({
    lives: 3,
    score: 0,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 100,
    playerY: 300,
    playerJumpOffset: 0,
    isPlayerImmortal: true,
    playerImmortalMs: 140,
    isCrashActive: false,
    sideObstacleOffsetY: 0,
    entities: [],
    effects: []
  });
  assert.equal(offCase.calls.some((entry) => entry[0] === 100 && entry[1] === 302 && entry[2] === 24 && entry[3] === 1), false);
});

test('pixel renderer draws ski school instructor in red and children in varied colors', () => {
  const calls = [];
  let activeFillStyle = '#000';
  const ctx = {
    font: '16px monospace',
    get fillStyle() {
      return activeFillStyle;
    },
    set fillStyle(value) {
      activeFillStyle = value;
    },
    fillRect: (...args) => calls.push({ args, fillStyle: activeFillStyle }),
    fillText: () => {}
  };
  const renderer = new PixelRenderer(ctx, 360, 640);
  renderer.render({
    lives: 3,
    score: 0,
    speedLevel: 3,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 120,
    playerY: 366,
    playerJumpOffset: 0,
    isCrashActive: false,
    sideObstacleOffsetY: 0,
    entities: [
      {
        type: 'ski-school-instructor',
        obstacleId: 'ski-school-snake',
        jumpRule: 'low',
        behaviorState: { kind: 'skiSchoolSnake', anchorLane: 5, laneSpan: 1, phaseMs: 0, phaseOffsetMs: 0, wavePeriodMs: 1080, paletteIndex: 0 },
        x: 122,
        y: 120,
        width: 18,
        height: 30,
        speed: 1.3,
        lane: 5,
        direction: 1
      },
      {
        type: 'ski-school-child',
        obstacleId: 'ski-school-snake',
        jumpRule: 'low',
        behaviorState: { kind: 'skiSchoolSnake', anchorLane: 5, laneSpan: 1, phaseMs: 0, phaseOffsetMs: 170, wavePeriodMs: 1080, paletteIndex: 0 },
        x: 122,
        y: 104,
        width: 16,
        height: 28,
        speed: 1.3,
        lane: 5,
        direction: 1
      },
      {
        type: 'ski-school-child',
        obstacleId: 'ski-school-snake',
        jumpRule: 'low',
        behaviorState: { kind: 'skiSchoolSnake', anchorLane: 5, laneSpan: 1, phaseMs: 0, phaseOffsetMs: 340, wavePeriodMs: 1080, paletteIndex: 1 },
        x: 122,
        y: 88,
        width: 16,
        height: 28,
        speed: 1.3,
        lane: 5,
        direction: 1
      }
    ],
    effects: []
  });
  assert.ok(calls.some((entry) => entry.fillStyle === '#dc2626'));
  assert.ok(calls.some((entry) => entry.fillStyle === '#2563eb'));
  assert.ok(calls.some((entry) => entry.fillStyle === '#16a34a'));
  assert.equal(calls.some((entry) => entry.fillStyle === '#2563eb' && entry.args[2] === 8 && entry.args[3] === 9), false);
  assert.ok(calls.some((entry) => entry.fillStyle === '#2563eb' && entry.args[2] === 4 && entry.args[3] === 6));
});

test('pixel renderer draws angled downhill skis and visible poles for skier sprite', () => {
  const calls = [];
  let activeFillStyle = '#000';
  const ctx = {
    font: '16px monospace',
    get fillStyle() {
      return activeFillStyle;
    },
    set fillStyle(value) {
      activeFillStyle = value;
    },
    fillRect: (...args) => calls.push({ args, fillStyle: activeFillStyle }),
    fillText: () => {}
  };

  const renderer = new PixelRenderer(ctx, 300, 600);
  renderer.render({
    lives: 3,
    score: 0,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 100,
    playerY: 300,
    playerJumpOffset: 0,
    isCrashActive: false,
    sideObstacleOffsetY: 0,
    entities: [],
    effects: []
  });

  assert.ok(calls.some((entry) => entry.fillStyle === '#334155' && entry.args[0] === 107 && entry.args[1] === 326 && entry.args[2] === 4 && entry.args[3] === 1));
  assert.ok(calls.some((entry) => entry.fillStyle === '#334155' && entry.args[0] === 104 && entry.args[1] === 332 && entry.args[2] === 4 && entry.args[3] === 1));
  assert.ok(calls.some((entry) => entry.fillStyle === '#334155' && entry.args[0] === 112 && entry.args[1] === 326 && entry.args[2] === 4 && entry.args[3] === 1));
  assert.ok(calls.some((entry) => entry.fillStyle === '#334155' && entry.args[0] === 115 && entry.args[1] === 332 && entry.args[2] === 4 && entry.args[3] === 1));
  assert.ok(calls.some((entry) => entry.fillStyle === '#000000' && entry.args[0] === 106 && entry.args[1] === 313 && entry.args[2] === 1 && entry.args[3] === 1));
  assert.ok(calls.some((entry) => entry.fillStyle === '#000000' && entry.args[0] === 102 && entry.args[1] === 325 && entry.args[2] === 1 && entry.args[3] === 1));
  assert.ok(calls.some((entry) => entry.fillStyle === '#000000' && entry.args[0] === 116 && entry.args[1] === 313 && entry.args[2] === 1 && entry.args[3] === 1));
  assert.ok(calls.some((entry) => entry.fillStyle === '#000000' && entry.args[0] === 120 && entry.args[1] === 325 && entry.args[2] === 1 && entry.args[3] === 1));
});

test('spaniel sprite tail wags across animation phases', () => {
  const makeCalls = (sideObstacleOffsetY) => {
    const calls = [];
    const ctx = {
      fillStyle: '#000',
      font: '16px monospace',
      fillRect: (...args) => calls.push(args),
      fillText: () => {}
    };
    const renderer = new PixelRenderer(ctx, 300, 600);
    renderer.render({
      lives: 3,
      score: 0,
      speedLevel: 1,
      spanielsSmashed: 0,
      isGameOver: false,
      playerX: 40,
      playerY: 300,
      playerJumpOffset: 0,
      isCrashActive: false,
      sideObstacleOffsetY,
      entities: [
        { type: 'spaniel', x: 100, y: 200, width: 20, height: 20, speed: 0 }
      ],
      effects: []
    });
    return calls;
  };

  const wagLeftCalls = makeCalls(0);
  const wagRightCalls = makeCalls(10);
  assert.ok(wagLeftCalls.some((entry) => entry[0] === 100 && entry[1] === 208 && entry[2] === 3 && entry[3] === 2));
  assert.ok(wagRightCalls.some((entry) => entry[0] === 101 && entry[1] === 207 && entry[2] === 3 && entry[3] === 2));
});

test('poo splat effect renders brown explosion tones', () => {
  const calls = [];
  let activeFillStyle = '#000';
  const ctx = {
    font: '16px monospace',
    get fillStyle() {
      return activeFillStyle;
    },
    set fillStyle(value) {
      activeFillStyle = value;
    },
    fillRect: (...args) => calls.push({ args, fillStyle: activeFillStyle }),
    fillText: () => {}
  };

  const renderer = new PixelRenderer(ctx, 300, 600);
  renderer.render({
    lives: 3,
    score: 0,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 100,
    playerY: 300,
    playerJumpOffset: 0,
    isCrashActive: false,
    sideObstacleOffsetY: 0,
    entities: [],
    effects: [
      { kind: 'poo-splat', x: 120, y: 160, ttlMs: 150, maxTtlMs: 300 }
    ]
  });

  assert.ok(calls.some((entry) => entry.fillStyle === '#8b5a2b'));
  assert.ok(calls.some((entry) => entry.fillStyle === '#5b3715'));
});



test('trees cannot be cleared by jump', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.playerImmortalMs = 0;
  game.forceSpawn({ type: 'tree', obstacleTier: 'standard', jumpRule: 'none', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false, jump: true });
  assert.equal(game.snapshot().lives, 2);
});

test('spawn branches include obstacle ids from brainstorming catalog', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2, 0.2, 0.2, 0.6, 0.2]), 10);
  game.step(540, { left: false, right: false });

  const first = game.snapshot().entities[0];
  assert.ok(first.obstacleId);
  assert.ok(first.obstacleId.includes('-'));
  assert.ok(['standard', 'rare', 'super-rare', 'mythic'].includes(first.obstacleTier));
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

test('puddle patch collision applies slow timer and longer turn cooldown', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'puddle-patch', obstacleId: 'puddle-patch', x: 122, y: 366, width: 24, height: 24, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });

  game.step(16, { left: false, right: false });
  const afterHit = game.snapshot();
  assert.equal(afterHit.lives, 3);
  assert.ok(afterHit.activeEffects.puddleSlowMs > 0);
  assert.ok(afterHit.entities.some((entity) => entity.type === 'puddle-patch'));

  game.step(16, { left: true, right: false });
  const afterMove = game.snapshot().playerX;
  game.step(150, { left: true, right: false });
  assert.equal(game.snapshot().playerX, afterMove);
  game.step(140, { left: true, right: false });
  assert.notEqual(game.snapshot().playerX, afterMove);
});

test('ice patch collision applies speed-boost timer and faster turn cadence', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({ type: 'ice-patch', obstacleId: 'ice-patch', x: 122, y: 366, width: 24, height: 24, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });

  game.step(16, { left: false, right: false });
  const afterHit = game.snapshot();
  assert.ok(afterHit.activeEffects.wetPaintSlipMs > 0);
  assert.ok(afterHit.entities.some((entity) => entity.type === 'ice-patch'));

  const startX = afterHit.playerX;
  game.step(16, { left: true, right: false });
  const afterFirstTurn = game.snapshot().playerX;
  assert.notEqual(afterFirstTurn, startX);

  game.step(90, { left: true, right: false });
  assert.notEqual(game.snapshot().playerX, afterFirstTurn);
});

test('jumping over puddle and ice patches does not apply surface effects', () => {
  const puddleGame = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  puddleGame.forceSpawn({ type: 'puddle-patch', obstacleId: 'puddle-patch', x: 122, y: 366, width: 24, height: 24, speed: 0, lane: 5 });
  puddleGame.step(16, { left: false, right: false, jump: true });
  assert.equal(puddleGame.snapshot().activeEffects.puddleSlowMs, 0);

  const iceGame = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  iceGame.forceSpawn({ type: 'ice-patch', obstacleId: 'ice-patch', x: 122, y: 366, width: 24, height: 24, speed: 0, lane: 5 });
  iceGame.step(16, { left: false, right: false, jump: true });
  assert.equal(iceGame.snapshot().activeEffects.wetPaintSlipMs, 0);
});

test('puddle and ice effects stack when hitting multiple patches', () => {
  const slowGame = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  slowGame.forceSpawn({ type: 'puddle-patch', obstacleId: 'puddle-patch', x: 122, y: 366, width: 24, height: 24, speed: 0, lane: 5 });
  slowGame.forceSpawn({ type: 'puddle-patch', obstacleId: 'puddle-patch', x: 122, y: 366, width: 24, height: 24, speed: 0, lane: 5 });
  slowGame.step(16, { left: false, right: false });
  assert.ok(slowGame.snapshot().activeEffects.puddleSlowMs > 900);

  slowGame.step(16, { left: true, right: false });
  const slowFirstTurn = slowGame.snapshot().playerX;
  slowGame.step(320, { left: true, right: false });
  assert.equal(slowGame.snapshot().playerX, slowFirstTurn);
  slowGame.step(120, { left: true, right: false });
  assert.notEqual(slowGame.snapshot().playerX, slowFirstTurn);

  const fastGame = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  fastGame.forceSpawn({ type: 'ice-patch', obstacleId: 'ice-patch', x: 122, y: 366, width: 24, height: 24, speed: 0, lane: 5 });
  fastGame.forceSpawn({ type: 'ice-patch', obstacleId: 'ice-patch', x: 122, y: 366, width: 24, height: 24, speed: 0, lane: 5 });
  fastGame.step(16, { left: false, right: false });
  assert.ok(fastGame.snapshot().activeEffects.wetPaintSlipMs > 1400);

  fastGame.step(16, { left: true, right: false });
  const fastFirstTurn = fastGame.snapshot().playerX;
  fastGame.step(50, { left: true, right: false });
  assert.notEqual(fastGame.snapshot().playerX, fastFirstTurn);
});

test('puddle and ice effects adjust overall world scrolling speed', () => {
  const base = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  const slow = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  const fast = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);

  slow.puddleSlowMs = 900;
  fast.wetPaintSlipMs = 1400;

  base.step(100, { left: false, right: false });
  slow.step(100, { left: false, right: false });
  fast.step(100, { left: false, right: false });

  const baseOffset = base.snapshot().sideObstacleOffsetY;
  const slowOffset = slow.snapshot().sideObstacleOffsetY;
  const fastOffset = fast.snapshot().sideObstacleOffsetY;

  assert.ok(slowOffset < baseOffset);
  assert.ok(fastOffset > baseOffset);
});

test('drone package drop telegraph is harmless then falling phase can deal damage', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({
    type: 'drone-package-drop',
    obstacleId: 'drone-package-drop',
    behaviorState: { kind: 'droneDrop', phase: 'telegraph', phaseMs: 650 },
    x: 122,
    y: 366,
    width: 24,
    height: 24,
    speed: 0,
    lane: 5
  });

  game.step(16, { left: false, right: false });
  assert.equal(game.snapshot().lives, 3);
  assert.equal(game.snapshot().entities.find((entity) => entity.obstacleId === 'drone-package-drop')?.behaviorState?.phase, 'telegraph');

  game.spawnClock = -100000;
  game.step(700, { left: false, right: false });
  assert.equal(game.snapshot().entities.find((entity) => entity.obstacleId === 'drone-package-drop')?.behaviorState?.phase, 'falling');

  const runtimeDrone = game.entities.find((entity) => entity.obstacleId === 'drone-package-drop');
  assert.ok(runtimeDrone);
  runtimeDrone.y = 366;
  runtimeDrone.speed = 0;
  runtimeDrone.direction = 1;
  runtimeDrone.lane = 5;

  game.playerImmortalMs = 0;
  game.step(16, { left: false, right: false });
  assert.equal(game.snapshot().lives, 2);
});

test('andy boss throws poo bags and level completes when boss exits', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.playerImmortalMs = 0;
  game.andyBossActive = true;
  game.forceSpawn({
    type: 'andy',
    obstacleId: 'andy-boss',
    jumpRule: 'high',
    behaviorState: { kind: 'andyBoss', phase: 'hovering', phaseMs: 2000, throwCooldownMs: 0 },
    x: 122,
    y: 60,
    width: 28,
    height: 34,
    speed: 0,
    lane: 5,
    laneSwitchCooldownMs: 0
  });

  game.step(16, { left: false, right: false });
  const poo = game.entities.filter((entity) => entity.type === 'poo-bag');
  assert.ok(poo.length >= 1);
  for (const bag of poo) {
    bag.y = 366;
    bag.speed = 0;
    bag.lane = 5;
  }

  game.step(16, { left: false, right: false });
  assert.equal(game.snapshot().lives, 2);
  assert.ok(game.snapshot().effects.some((effect) => effect.kind === 'poo-splat'));

  game.step(700, { left: false, right: false });
  const boss = game.entities.find((entity) => entity.type === 'andy' && entity.behaviorState?.kind === 'andyBoss');
  assert.ok(boss);
  boss.behaviorState.phase = 'hovering';
  boss.y = 660;

  game.step(16, { left: false, right: false });
  const afterExit = game.snapshot();
  assert.equal(afterExit.isBossActive, false);
  assert.equal(afterExit.speedLevel, 2);
  assert.equal(afterExit.lives, 3);
  assert.ok(afterExit.levelUpBannerMs > 0);
});

test('andy exit crossing cull boundary in same frame still levels up', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.andyBossActive = true;
  game.forceSpawn({
    type: 'andy',
    obstacleId: 'andy-boss',
    jumpRule: 'high',
    behaviorState: { kind: 'andyBoss', phase: 'exiting', phaseMs: 0, throwCooldownMs: 9999 },
    x: 122,
    y: 639,
    width: 28,
    height: 34,
    speed: 0,
    lane: 5,
    laneSwitchCooldownMs: 0
  });

  game.step(16, { left: false, right: false });
  const snap = game.snapshot();
  assert.equal(snap.isBossActive, false);
  assert.equal(snap.speedLevel, 2);
  assert.equal(snap.lives, 3);
});

test('level one standard spawns bias toward spaniels and higher levels spawn more entities', () => {
  const levelOne = new SpanielSmashGame(300, 600, rngFrom([0.2, 0.2, 0.2, 0.2]), 10);
  levelOne.step(540, { left: false, right: false });
  const firstSpawn = levelOne.snapshot().entities[0];
  assert.equal(firstSpawn.type, 'spaniel');

  const lowLevel = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  const highLevel = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  highLevel.speedLevel = 8;

  for (let i = 0; i < 20; i += 1) {
    lowLevel.step(120, { left: false, right: false });
    highLevel.step(120, { left: false, right: false });
  }

  assert.ok(highLevel.nextEntityId > lowLevel.nextEntityId);
});

test('helicopter downdraft pushes the player lane on its pulse interval', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.2]), 10);
  game.forceSpawn({
    type: 'helicopter-downdraft',
    obstacleId: 'helicopter-downdraft',
    behaviorState: { kind: 'downdraft', pushDirection: 1, pushCooldownMs: 0 },
    x: 122,
    y: 360,
    width: 24,
    height: 24,
    speed: 0,
    lane: 5,
    laneSwitchCooldownMs: 999
  });

  const startX = game.snapshot().playerX;
  game.step(16, { left: false, right: false });
  const firstPushX = game.snapshot().playerX;
  assert.ok(firstPushX > startX);

  game.step(100, { left: false, right: false });
  assert.equal(game.snapshot().playerX, firstPushX);

  game.step(100, { left: false, right: false });
  assert.ok(game.snapshot().playerX > firstPushX);
});

test('moving entity lane logic covers andy pursuit, bounds, and blocked lane fallback', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0.9, 0.9, 0.9, 0.9, 0.9]), 10);

  game.forceSpawn({ type: 'andy', x: 122, y: 200, width: 20, height: 20, speed: 0, lane: 8, direction: -1, laneSwitchCooldownMs: 0 });
  game.step(200, { left: true, right: false }); // player moves to lane 4, andy pursues by one lane step
  const andy = game.snapshot().entities.find((entity) => entity.type === 'andy');
  assert.ok(andy);
  assert.equal(andy.lane, 7);

  game.forceSpawn({ type: 'skier', x: 122, y: 230, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 0 });
  game.forceSpawn({ type: 'tree', x: 122, y: 231, width: 20, height: 20, speed: 0, lane: 6 });
  game.forceSpawn({ type: 'rock', x: 122, y: 230, width: 20, height: 20, speed: 0, lane: 3 });
  game.step(200, { left: false, right: false });
  const skier = game.snapshot().entities.find((entity) => entity.type === 'skier');
  assert.ok(skier);
  assert.equal(skier.lane, 5);
});



test('jumping clears jump-rule obstacles and rare/super-rare cadence spawns expected tiers', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0, 0, 0.2, 0.2, 0.2]), 10);
  game.forceSpawn({ type: 'rock', obstacleTier: 'super-rare', jumpRule: 'high', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5 });

  game.step(16, { left: false, right: false, jump: true });
  assert.equal(game.snapshot().lives, 3);

  game.step(700, { left: false, right: false, jump: false });
  game.playerImmortalMs = 0;
  game.forceSpawn({ type: 'rock', obstacleTier: 'super-rare', jumpRule: 'high', x: 122, y: 366, width: 30, height: 30, speed: 0, lane: 5 });
  game.step(16, { left: false, right: false, jump: false });
  assert.equal(game.snapshot().lives, 2);

  const rareGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1, 0.2, 0.2, 0.2]), 10);
  rareGame.nextRareSpawnMs = 450;
  rareGame.step(540, { left: false, right: false });
  assert.ok(rareGame.snapshot().entities.some((entity) => entity.obstacleTier === 'rare'));

  const superRareGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1, 0.2, 0.2, 0.8]), 10);
  superRareGame.nextSuperRareSpawnMs = 450;
  superRareGame.step(540, { left: false, right: false });
  assert.ok(superRareGame.snapshot().entities.some((entity) => entity.obstacleTier === 'super-rare'));
});

test('tiered spawns hit standard/rare/super-rare/mythic cadence branches', () => {
  const standardGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.2, 0.05, 0.2, 0.2]), 10);
  standardGame.step(540, { left: false, right: false });
  assert.ok(standardGame.snapshot().entities.some((entity) => entity.obstacleTier === 'standard'));

  const rareGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1, 0.2, 0.2, 0.2]), 10);
  rareGame.nextRareSpawnMs = 450;
  rareGame.step(540, { left: false, right: false });
  assert.ok(rareGame.snapshot().entities.some((entity) => entity.obstacleTier === 'rare'));

  const superGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1, 0.2, 0.2, 0.2]), 10);
  superGame.nextSuperRareSpawnMs = 450;
  superGame.step(540, { left: false, right: false });
  assert.ok(superGame.snapshot().entities.some((entity) => entity.obstacleTier === 'super-rare'));

  const mythicGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1, 0.2, 0.2, 0.2, 0.2]), 10);
  for (let i = 0; i < 25; i += 1) {
    mythicGame.forceSpawn({ type: 'spaniel', x: 122, y: 366, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
    mythicGame.step(16, { left: false, right: false });
  }
  mythicGame.forceSpawn({ type: 'andy', x: 122, y: 20, width: 16, height: 16, speed: 0, lane: 5, laneSwitchCooldownMs: 999 });
  mythicGame.nextMythicSpawnMs = 450;
  mythicGame.step(540, { left: false, right: false });
  assert.ok(mythicGame.snapshot().entities.some((entity) => entity.obstacleTier === 'mythic'));
});


test('spawn lane fallback can choose right lane and lane blocking check can reject move', () => {
  const spawnRightGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1, 0.2, 0.2]), 10);
  spawnRightGame.speedLevel = 2;
  spawnRightGame.forceSpawn({ type: 'tree', x: 60, y: 0, width: 10, height: 10, speed: 2.2, lane: 2 });
  spawnRightGame.forceSpawn({ type: 'rock', x: 90, y: 0, width: 10, height: 10, speed: 2.2, lane: 3 });
  assert.equal(spawnRightGame.pickSpawnLane(), 4);

  const laneBlockGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1, 0.9, 0.6]), 10);
  laneBlockGame.forceSpawn({ type: 'spaniel', x: 122, y: 220, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 0 });
  laneBlockGame.forceSpawn({ type: 'tree', x: 122, y: 221, width: 20, height: 20, speed: 0, lane: 6 });
  laneBlockGame.step(200, { left: false, right: false });
  const mover = laneBlockGame.snapshot().entities.find((entity) => entity.type === 'spaniel');
  assert.equal(mover.lane, 5);
});


test('lane switching and spawn lane fallback exercise left-priority and blocked-lane checks', () => {
  const leftSpawnGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1, 0.3, 0.2]), 10);
  leftSpawnGame.forceSpawn({ type: 'tree', x: 100, y: 0, width: 10, height: 10, speed: 2.2, lane: 3 });
  leftSpawnGame.step(540, { left: false, right: false });
  assert.equal(leftSpawnGame.snapshot().entities.at(-1).lane, 2);

  const blockedLaneGame = new SpanielSmashGame(300, 600, rngFrom([0.1, 0.1, 0.1, 0.1]), 10);
  blockedLaneGame.forceSpawn({ type: 'skier', x: 122, y: 230, width: 20, height: 20, speed: 0, lane: 5, laneSwitchCooldownMs: 0 });
  blockedLaneGame.forceSpawn({ type: 'tree', x: 122, y: 231, width: 20, height: 20, speed: 0, lane: 4 });
  blockedLaneGame.step(200, { left: false, right: false });
  const skier = blockedLaneGame.snapshot().entities.find((entity) => entity.type === 'skier');
  assert.equal(skier.lane, 5);
});
test('spawn lane can return preferred when all lanes are blocked', () => {
  const game = new SpanielSmashGame(300, 600, rngFrom([0, 0.2]), 3);
  game.forceSpawn({ type: 'tree', x: 10, y: 0, width: 10, height: 10, speed: 0, lane: 1 });
  game.step(540, { left: false, right: false });
  const spawned = game.snapshot().entities.at(-1);
  assert.equal(spawned.lane, 1);
});

test('renderer no longer draws text obstacle labels for obstacle ids', () => {
  const calls = [];
  const ctx = {
    fillStyle: '#000',
    font: '16px monospace',
    fillRect: (...args) => calls.push(['fillRect', ...args]),
    fillText: (...args) => calls.push(['fillText', ...args])
  };
  const renderer = new PixelRenderer(ctx, 360, 640);
  renderer.render({
    lives: 3,
    score: 0,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 120,
    playerY: 366,
    playerJumpOffset: 0,
    isCrashActive: false,
    sideObstacleOffsetY: 0,
    entities: [
      { type: 'tree', obstacleId: 'cracked-sidewalk-slab', x: 122, y: 140, width: 20, height: 20, speed: 0 }
    ],
    effects: []
  });

  assert.equal(calls.some((entry) => entry[0] === 'fillText' && String(entry[1]).includes('CRACKED SID')), false);
});

test('jumping player renders in front of obstacles', () => {
  const calls = [];
  const ctx = {
    fillStyle: '#000',
    font: '16px monospace',
    fillRect: (...args) => calls.push(args),
    fillText: () => {}
  };
  const renderer = new PixelRenderer(ctx, 360, 640);
  renderer.render({
    lives: 3,
    score: 0,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 100,
    playerY: 300,
    playerJumpOffset: 12,
    isCrashActive: false,
    sideObstacleOffsetY: 0,
    entities: [
      { type: 'tree', x: 10, y: 10, width: 20, height: 20, speed: 0 }
    ],
    effects: []
  });

  const treeBodyIndex = calls.findIndex((entry) => entry[0] === 12 && entry[1] === 26 && entry[2] === 17 && entry[3] === 3);
  const playerBodyIndex = calls.findIndex((entry) => entry[0] === 106 && entry[1] === 301 && entry[2] === 10 && entry[3] === 9);

  assert.ok(treeBodyIndex >= 0);
  assert.ok(playerBodyIndex >= 0);
  assert.ok(playerBodyIndex > treeBodyIndex);
});

test('grounded player renders in front of obstacles', () => {
  const calls = [];
  const ctx = {
    fillStyle: '#000',
    font: '16px monospace',
    fillRect: (...args) => calls.push(args),
    fillText: () => {}
  };
  const renderer = new PixelRenderer(ctx, 360, 640);
  renderer.render({
    lives: 3,
    score: 0,
    speedLevel: 1,
    spanielsSmashed: 0,
    isGameOver: false,
    playerX: 100,
    playerY: 300,
    playerJumpOffset: 0,
    isCrashActive: false,
    sideObstacleOffsetY: 0,
    entities: [
      { type: 'tree', x: 10, y: 10, width: 20, height: 20, speed: 0 }
    ],
    effects: []
  });

  const treeBodyIndex = calls.findIndex((entry) => entry[0] === 12 && entry[1] === 26 && entry[2] === 17 && entry[3] === 3);
  const playerBodyIndex = calls.findIndex((entry) => entry[0] === 106 && entry[1] === 312 && entry[2] === 10 && entry[3] === 10);

  assert.ok(treeBodyIndex >= 0);
  assert.ok(playerBodyIndex >= 0);
  assert.ok(playerBodyIndex > treeBodyIndex);
});

test('side edge tree and rock decorations never overlap', () => {
  const ctx = {
    fillStyle: '#000',
    font: '16px monospace',
    fillRect: () => {},
    fillText: () => {}
  };
  const renderer = new PixelRenderer(ctx, 360, 640);
  const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

  for (let offset = 0; offset < 2000; offset += 7) {
    const placements = renderer.computeSlopeEdgeDecorations(offset);
    for (let i = 0; i < placements.length; i += 1) {
      for (let j = i + 1; j < placements.length; j += 1) {
        assert.equal(
          overlaps(placements[i].bounds, placements[j].bounds),
          false,
          `overlap at offset ${offset}`
        );
      }
    }
  }
});
