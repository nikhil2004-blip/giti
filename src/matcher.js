'use strict';

const { preProcess, tokenSimilarity } = require('./nlp');
const { INTENTS } = require('./data/intents');

// Keep offline matching focused on high-frequency daily workflows.
const CORE_CATEGORIES = new Set([
  'Stage & Unstage',
  'Commit',
  'Branches',
  'Remote & Sync',
  'Stash',
  'History & Log',
  'Status & Diff',
]);

const ACTIVE_INTENTS = INTENTS.filter((intent) => CORE_CATEGORIES.has(intent.category));

// ─── Intent map ────────────────────────────────────────────────────────────

const INTENT_MAP = Object.fromEntries(ACTIVE_INTENTS.map(i => [i.id, i]));

// ─── Inverted index ────────────────────────────────────────────────────────

let _index = null;

function getIndex() {
  if (_index) return _index;
  try {
    // JSON index: invertedIndex values are plain arrays (not Sets)
    _index = require('../index.json');
  } catch {
    _index = buildIndex();
  }
  return _index;
}

/**
 * Build an in-memory inverted index.
 * Returns JSON-compatible structure (arrays, not Sets).
 */
function buildIndex() {
  const invertedIndex = {};  // token → string[]
  const intentTokens  = {};  // intentId → string[][]

  for (const intent of ACTIVE_INTENTS) {
    intentTokens[intent.id] = [];
    for (const phrase of intent.phrases) {
      const tokens = preProcess(phrase);
      intentTokens[intent.id].push(tokens);
      for (const token of tokens) {
        if (!invertedIndex[token]) invertedIndex[token] = [];
        if (!invertedIndex[token].includes(intent.id)) {
          invertedIndex[token].push(intent.id);
        }
      }
    }
  }

  return { invertedIndex, intentTokens };
}

// ─── Scoring ───────────────────────────────────────────────────────────────

function scoreIntentForQuery(queryTokens, phraseArrays) {
  if (queryTokens.length === 0 || !phraseArrays) return 0;

  let totalScore = 0;
  for (const qt of queryTokens) {
    let best = 0;
    for (const phrase of phraseArrays) {
      for (const pt of phrase) {
        const sim = tokenSimilarity(qt, pt);
        if (sim > best) best = sim;
      }
    }
    totalScore += best;
  }
  const avgScore = totalScore / queryTokens.length;

  let coverageBoost = 0;
  for (const phrase of phraseArrays) {
    if (phrase.length === 0) continue;
    let phraseScore = 0;
    for (const pt of phrase) {
      let best = 0;
      for (const qt of queryTokens) {
        const sim = tokenSimilarity(qt, pt);
        if (sim > best) best = sim;
      }
      phraseScore += best;
    }
    const coverage = phraseScore / phrase.length;
    if (coverage > coverageBoost) coverageBoost = coverage;
  }

  let finalScore = avgScore * 0.6 + coverageBoost * 0.4;

  // Add penalty if the query is significantly longer than the phrase
  // This prevents long conversational queries from accidentally getting high scores
  const lengthDiff = Math.max(0, queryTokens.length - phraseArrays[0].length);
  if (lengthDiff > 2) {
    finalScore -= (lengthDiff * 0.05);
  }

  return Math.max(0, finalScore);
}

// ─── Candidate filtering ───────────────────────────────────────────────────

function getCandidates(queryTokens, index) {
  const { invertedIndex } = index;
  const candidates = new Set();

  for (const qt of queryTokens) {
    if (invertedIndex[qt]) {
      for (const id of invertedIndex[qt]) candidates.add(id);
    }
    for (const indexToken of Object.keys(invertedIndex)) {
      if (tokenSimilarity(qt, indexToken) > 0.6) {
        for (const id of invertedIndex[indexToken]) candidates.add(id);
      }
    }
  }

  if (candidates.size === 0) {
    for (const intent of ACTIVE_INTENTS) candidates.add(intent.id);
  }

  return candidates;
}

// ─── Main match function ───────────────────────────────────────────────────

const HIGH_CONFIDENCE   = 0.75;
const MAX_RESULTS       = 3;

function match(rawQuery) {
  const queryTokens = preProcess(rawQuery);
  if (queryTokens.length === 0) return { type: 'fallback' };

  const index      = getIndex();
  const candidates = getCandidates(queryTokens, index);
  const scored     = [];

  for (const id of candidates) {
    const intent = INTENT_MAP[id];
    if (!intent) continue;
    const phraseArrays = index.intentTokens[id];
    if (!phraseArrays) continue;
    const score = scoreIntentForQuery(queryTokens, phraseArrays);
    if (score > 0.1) scored.push({ intent, score });
  }

  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, MAX_RESULTS);

  if (top.length === 0) return { type: 'fallback' };

  if (top[0].score >= HIGH_CONFIDENCE) {
    return { type: 'single', result: top[0] };
  }

  return { type: 'fallback' };
}

module.exports = { match, buildIndex, HIGH_CONFIDENCE };
