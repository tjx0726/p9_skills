'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const g = require('../scripts/games.cjs');
const zero = 'pokemon=0;magic=0;yugioh=0;fab=0;elestrals=0;gundam=0;riftbound=0;digimon=0;';
const schema = { type: 'string', minLength: 76, maxLength: 76,
  pattern: '^pokemon=[01];magic=[01];yugioh=[01];fab=[01];elestrals=[01];gundam=[01];riftbound=[01];digimon=[01];$' };
const title = ` ${JSON.stringify({ title: 'Games', schema, note: 'synthetic' })} `;
const definition = {
  id: '123', uid: '9223372036854775807', userId: '42', groupType: 0,
  attributeKey: 'attribute7', attributeValue: title, attributeDataType: 0, isEditable: 0,
};

test('fixed value round-trips; unset remains different from all zero', () => {
  assert.equal(zero.length, 76);
  assert.equal(g.encodeGames(g.parseGames(zero)), zero);
  for (const value of [null, undefined, '']) assert.equal(g.parseGames(value), null);
  assert.notEqual(g.parseGames(zero), null);
});

test('single-interest changes preserve every other interest for all bit combinations', () => {
  for (let mask = 0; mask < 256; mask++) {
    const bits = Object.fromEntries(g.KEYS.map((key, i) => [key, (mask >> i) & 1]));
    for (const key of g.KEYS) {
      const value = g.setInterest(g.encodeGames(bits), key, 1 - bits[key]);
      assert.equal(value.length, 76);
      assert.deepEqual(g.parseGames(value), { ...bits, [key]: 1 - bits[key] });
    }
  }
});

test('malformed, reordered, duplicated and truncated inputs cannot silently initialize', () => {
  const invalid = [zero.slice(0, -1), zero.slice(0, 20), ` ${zero}`,
    zero.replace('magic=0', 'magic=2'), zero.replace('magic=0', 'Magic=0'),
    zero.replace('magic=0', 'pokemon=0'), zero.replace('pokemon=0;magic=0;', 'magic=0;pokemon=0;'),
    zero.replace('digimon=0;', ''), zero.replace('magic=0', 'magic=00')];
  for (const value of invalid) {
    assert.throws(() => g.parseGames(value));
    assert.throws(() => g.setInterest(value, 'magic', 1, { initializeUnset: true }));
  }
  assert.throws(() => g.setInterest('', 'magic', 1));
  assert.equal(g.setInterest('', 'magic', 1, { initializeUnset: true }), zero.replace('magic=0', 'magic=1'));
  assert.throws(() => g.setInterest(zero, 'unknown', 1));
  assert.throws(() => g.setInterest(zero, 'magic', true));
});

test('definition uses parsed title, live key/owner and complete original title', () => {
  const unrelated = { ...definition, attributeValue: '{"title":"Other"}' };
  const privateField = { ...definition, groupType: 1 };
  const found = g.findGamesDefinition([unrelated, privateField, definition]);
  assert.equal(found.uid, '9223372036854775807');
  assert.equal(found.userId, '42');
  assert.equal(found.isEditable, 0);
  assert.deepEqual(g.gamesAttribute(found, zero), {
    AttributeKey: 'attribute7', AttributeValue: title, CustomerValue: zero,
  });
  assert.equal(definition.attributeValue, title);
  assert.throws(() => g.findGamesDefinition([definition, definition]));
  assert.throws(() => g.findGamesDefinition([{ ...definition, attributeValue: 'Games' }]));
  assert.throws(() => g.gamesAttribute(found, ''));
});

test('raw 64-bit IDs survive, while rounded objects and malformed JSON fail privately', () => {
  const parsed = g.parseLossless('{"uid":9223372036854775807,"id":123,"userId":42,"fraction":1.25}');
  assert.equal(parsed.uid, '9223372036854775807');
  assert.equal(parsed.id, 123);
  assert.equal(parsed.fraction, 1.25);
  assert.equal(g.findGamesDefinition([{ ...definition, ...parsed }]).uid, parsed.uid);
  assert.throws(() => g.findGamesDefinition([{ ...definition, uid: Number(parsed.uid) }]));
  assert.throws(() => g.parseLossless('{"private":"FAKE_VALUE",'), error => !error.message.includes('FAKE_VALUE'));
});

test('write path rejects schema drift and non-text fields while preserving complete compatible metadata', () => {
  for (const patch of [{ type: 'number' }, { minLength: 0 }, { maxLength: 255 },
    { pattern: '.*' }]) {
    const attributeValue = JSON.stringify({ title: 'Games', schema: { ...schema, ...patch } });
    assert.throws(() => g.gamesAttribute({ ...definition, attributeValue }, zero), /schema/);
  }
  assert.throws(() => g.gamesAttribute({ ...definition, attributeValue: '{"title":"Games"}' }, zero));
  assert.throws(() => g.gamesAttribute({ ...definition, attributeDataType: 1 }, zero));
  const extra = `\n${JSON.stringify({ title: 'Games', schema, note: 'keep', other: { future: true } })}\n`;
  assert.equal(g.gamesAttribute({ ...definition, attributeValue: extra }, zero).AttributeValue, extra);
});
