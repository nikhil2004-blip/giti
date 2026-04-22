'use strict';

/**
 * Terminal output renderer for giti.
 * Uses ANSI escape codes for color — falls back gracefully if NO_COLOR is set.
 */

const NO_COLOR = process.env.NO_COLOR || !process.stdout.isTTY;

const c = {
  reset:  NO_COLOR ? '' : '\x1b[0m',
  bold:   NO_COLOR ? '' : '\x1b[1m',
  dim:    NO_COLOR ? '' : '\x1b[2m',
  green:  NO_COLOR ? '' : '\x1b[32m',
  cyan:   NO_COLOR ? '' : '\x1b[36m',
  yellow: NO_COLOR ? '' : '\x1b[33m',
  blue:   NO_COLOR ? '' : '\x1b[34m',
  magenta:NO_COLOR ? '' : '\x1b[35m',
  gray:   NO_COLOR ? '' : '\x1b[90m',
  white:  NO_COLOR ? '' : '\x1b[97m',
};

const CATEGORY_COLORS = [
  c.cyan, c.green, c.yellow, c.blue, c.magenta,
  c.cyan, c.green, c.yellow, c.blue, c.magenta,
];

function colorForCategory(cat) {
  const cats = ['Stage & Unstage','Commit','Branches','Remote & Sync','Stash',
                 'History & Log','Conflict Resolution','Rebase & Cherry-pick',
                 'Tags & Releases','Config & Setup','Submodules','Worktrees & Advanced'];
  const idx = cats.indexOf(cat);
  return CATEGORY_COLORS[idx % CATEGORY_COLORS.length] || c.cyan;
}

// ─── Single result ─────────────────────────────────────────────────────────

function renderSingle({ intent }) {
  const col = colorForCategory(intent.category);
  console.log();
  console.log(`${c.green}${c.bold}✓ Did you mean:${c.reset} ${c.white}${c.bold}${intent.human}?${c.reset}  ${c.gray}[${intent.id}]${c.reset}`);
  console.log();
  for (const { cmd, note } of intent.commands) {
    console.log(`  ${col}${c.bold}❯ ${cmd}${c.reset}`);
    console.log(`    ${c.dim}${note}${c.reset}`);
    console.log();
  }
}


module.exports = { renderSingle };
