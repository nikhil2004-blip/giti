'use strict';

const { SYNONYM_MAP, STOP_WORDS, ADJACENCY } = require('./data/synonyms');

// ─── Tokenizer ─────────────────────────────────────────────────────────────

/**
 * Tokenize raw input string.
 * Lowercases, strips punctuation except hyphens (cherry-pick), splits on whitespace.
 * Truncates to 20 tokens per PRD §13.
 */
function tokenize(input) {
  return String(input)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')  // keep hyphens for cherry-pick etc.
    .replace(/-+/g, ' ')             // then expand hyphens to spaces
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 20);
}

// ─── Stop-word removal ─────────────────────────────────────────────────────

function removeStopWords(tokens) {
  return tokens.filter(t => !STOP_WORDS.has(t));
}

// ─── Strip leading "git" if present ────────────────────────────────────────

function stripGitPrefix(tokens) {
  if (tokens[0] === 'git') return tokens.slice(1);
  return tokens;
}

// ─── Strip trailing filenames / hex commit SHAs ────────────────────────────

const HEX_RE  = /^[0-9a-f]{6,40}$/;
const FILE_RE = /\.[a-z]{1,5}$/;
const NUM_RE  = /^\d+$/;  // bare numbers (e.g. "3" in "last 3 commits") kept for context

function stripSpecialTokens(tokens) {
  return tokens.filter(t => !HEX_RE.test(t) && !FILE_RE.test(t));
}

// ─── Multi-word synonym expansion ──────────────────────────────────────────
// Tries two-token bigrams first, then falls back to single-token lookup.

function expandSynonyms(tokens) {
  const result = [];
  let i = 0;
  while (i < tokens.length) {
    // Try 2-gram
    if (i + 1 < tokens.length) {
      const bigram = `${tokens[i]} ${tokens[i + 1]}`;
      if (SYNONYM_MAP[bigram]) {
        result.push(SYNONYM_MAP[bigram]);
        i += 2;
        continue;
      }
    }
    // Single token
    result.push(SYNONYM_MAP[tokens[i]] || tokens[i]);
    i++;
  }
  return result;
}

// ─── Levenshtein with keyboard-adjacency weighting ─────────────────────────

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  // Early exit: if strings are too different in length, skip expensive computation
  if (Math.abs(m - n) > 5) return Math.abs(m - n);

  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        const subCost = isAdjacent(a[i - 1], b[j - 1]) ? 0.5 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,          // delete
          dp[i][j - 1] + 1,          // insert
          dp[i - 1][j - 1] + subCost // substitute
        );
      }
    }
  }
  return dp[m][n];
}

function isAdjacent(a, b) {
  return !!(ADJACENCY[a] && ADJACENCY[a].includes(b));
}

// ─── Fuzzy token similarity ────────────────────────────────────────────────

/**
 * Returns 0-1 similarity for two tokens.
 * 1 = exact match, 0 = completely different.
 * Uses prefix bonus: if one token is a prefix of the other with ≥3 chars match.
 */
function tokenSimilarity(a, b) {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  if (maxLen === 1) return a === b ? 1 : 0;

  // Prefix bonus: "untrack" matches "untracked"
  if (a.length >= 4 && b.startsWith(a)) return 0.92;
  if (b.length >= 4 && a.startsWith(b)) return 0.92;

  const dist = levenshtein(a, b);
  // Stricter threshold: allow up to 40% edit distance
  const threshold = Math.max(2, Math.floor(maxLen * 0.4));
  if (dist > threshold) return 0;
  return Math.max(0, 1 - dist / maxLen);
}

// ─── Full pre-processing pipeline ──────────────────────────────────────────

function preProcess(raw) {
  let tokens = tokenize(raw);
  tokens = stripGitPrefix(tokens);
  tokens = removeStopWords(tokens);
  tokens = stripSpecialTokens(tokens);
  tokens = expandSynonyms(tokens);
  // De-duplicate while preserving order
  const seen = new Set();
  tokens = tokens.filter(t => {
    if (seen.has(t)) return false;
    seen.add(t);
    return true;
  });
  return tokens;
}

module.exports = { tokenize, removeStopWords, expandSynonyms, levenshtein, tokenSimilarity, preProcess };
