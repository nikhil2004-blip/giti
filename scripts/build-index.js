'use strict';

/**
 * Builds a persistent index.json from the intent dataset.
 * Run once: node scripts/build-index.js
 * Output: index.json — loaded by matcher.js for fast startup.
 */

const path = require('path');
const fs   = require('fs');
const { buildIndex } = require('../src/matcher');

const t0 = Date.now();
const index = buildIndex();
const t1 = Date.now();

// Convert Sets to Arrays for JSON serialisation
const serialisable = {
  invertedIndex: {},
  intentTokens: index.intentTokens,
};

for (const [token, set] of Object.entries(index.invertedIndex)) {
  serialisable.invertedIndex[token] = [...set];
}

const outPath = path.join(__dirname, '..', 'index.json');
fs.writeFileSync(outPath, JSON.stringify(serialisable), 'utf8');

console.log(`✓ index.json written in ${t1 - t0} ms  (${Object.keys(serialisable.invertedIndex).length} tokens indexed)`);
