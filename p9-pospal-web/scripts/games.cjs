'use strict';

const KEYS = Object.freeze([
  'pokemon', 'magic', 'yugioh', 'fab', 'elestrals', 'gundam', 'riftbound', 'digimon',
]);
const PATTERN = new RegExp(`^${KEYS.map(key => `${key}=[01];`).join('')}$`);

function parseLossless(text) {
  if (typeof text !== 'string') throw new TypeError('Read the raw JSON text first.');
  try {
    return JSON.parse(text, (_key, value, context) => {
      if (typeof value === 'number' && !Number.isSafeInteger(value) &&
          (!context?.source || /^-?\d+$/.test(context.source))) {
        if (!context?.source) throw new Error('A source-aware JSON parser is required.');
        return context.source;
      }
      return value;
    });
  } catch {
    throw new Error('Cannot parse JSON losslessly; inspect the response privately.');
  }
}

function idString(value) {
  if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) {
    return String(value);
  }
  if (typeof value === 'string' && /^\d+$/.test(value)) return value;
  throw new Error('An exact decimal ID is required; reacquire raw JSON if rounded.');
}

function findGamesDefinition(definitions) {
  if (!Array.isArray(definitions)) throw new TypeError('Provide the basic definition array.');
  const matches = definitions.filter(definition => {
    if (!definition || ![0, '0'].includes(definition.groupType)) return false;
    try {
      return JSON.parse(definition.attributeValue)?.title === 'Games';
    } catch {
      return false;
    }
  });
  if (matches.length !== 1) throw new Error('Exactly one basic Games definition is required.');
  const definition = matches[0];
  if (typeof definition.attributeKey !== 'string' || !definition.attributeKey) {
    throw new Error('The current Games field key is missing.');
  }
  return {
    ...definition,
    id: idString(definition.id),
    uid: idString(definition.uid),
    userId: idString(definition.userId),
  };
}

function parseGames(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string' || value.length !== 76 || !PATTERN.test(value)) {
    throw new Error('Games must use the complete fixed 76-character format.');
  }
  return Object.fromEntries(value.slice(0, -1).split(';').map(item => {
    const [key, bit] = item.split('=');
    return [key, Number(bit)];
  }));
}

function encodeGames(bits) {
  if (!bits || Object.keys(bits).length !== KEYS.length ||
      !KEYS.every(key => Object.hasOwn(bits, key) && [0, 1].includes(bits[key]))) {
    throw new Error('Provide exactly eight Games keys with numeric 0/1 values.');
  }
  return KEYS.map(key => `${key}=${bits[key]};`).join('');
}

function setInterest(value, key, bit, { initializeUnset = false } = {}) {
  if (!KEYS.includes(key) || ![0, 1].includes(bit)) {
    throw new Error('Choose one known Games key and a numeric 0/1 value.');
  }
  let bits = parseGames(value);
  if (!bits) {
    if (!initializeUnset) throw new Error('Unset Games requires explicit initialization.');
    bits = Object.fromEntries(KEYS.map(item => [item, 0]));
  }
  return encodeGames({ ...bits, [key]: bit });
}

function gamesAttribute(definition, value) {
  const current = findGamesDefinition([definition]);
  const schema = JSON.parse(current.attributeValue).schema;
  if (![0, '0'].includes(current.attributeDataType) || !schema ||
      schema.type !== 'string' || schema.minLength !== 76 || schema.maxLength !== 76 ||
      schema.pattern !== PATTERN.source) {
    throw new Error('The live Games definition is not the supported text schema.');
  }
  if (!parseGames(value)) throw new Error('A Games save requires an explicit complete value.');
  return {
    AttributeKey: current.attributeKey,
    AttributeValue: current.attributeValue,
    CustomerValue: value,
  };
}

module.exports = {
  KEYS, idString, parseLossless, findGamesDefinition, parseGames, encodeGames, setInterest, gamesAttribute,
};
