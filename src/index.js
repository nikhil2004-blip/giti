'use strict';

/**
 * giti — natural-language Git command lookup
 * Main entry point orchestrating: parse → match → render
 */

const { match } = require('./matcher');
const { renderSingle } = require('./renderer');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { version } = require('../package.json');
const VERSION = version;
const MISSED_LOG_MAX_BYTES = 1024 * 1024;

function redactSensitiveText(input) {
  return String(input)
    .replace(/\b(gsk_[A-Za-z0-9_-]{10,}|sk-[A-Za-z0-9_-]{10,}|ghp_[A-Za-z0-9_]{20,}|AIza[0-9A-Za-z_-]{20,})\b/g, '[REDACTED]')
    .replace(/\b(api[_-]?key|token|password|secret)\s*[:=]\s*\S+/gi, '$1=[REDACTED]');
}

function run(argv) {
  const args = argv.slice(2);

  // ─── Flags ────────────────────────────────────────────────────────────────
  if (args.includes('--version') || args.includes('-v') || args.includes('-version') || args.length === 1 && args[0] === 'version') {
    console.log(`giti v${VERSION}`);
    process.exit(0);
  }

  if (args.includes('--help') || args.includes('-h') || args.includes('-help') || args.length === 1 && args[0] === 'help') {
    printHelp();
    process.exit(0);
  }

  if (args.includes('--learn')) {
    const logPath = path.join(os.homedir(), '.giti', 'missed.log');
    if (fs.existsSync(logPath)) {
      console.log(`\x1b[33m\x1b[1mMissed Queries Log (~/.giti/missed.log):\x1b[0m\n`);
      console.log(fs.readFileSync(logPath, 'utf8'));
    } else {
      console.log(`\x1b[32mNo missed queries logged yet. (~/.giti/missed.log)\x1b[0m`);
    }
    process.exit(0);
  }

  if (args.includes('--auth')) {
    const keyIdx = args.indexOf('--auth');
    const key = args[keyIdx + 1];
    if (!key || key.startsWith('--')) {
      console.log(`\n\x1b[31m✖ Error:\x1b[0m Please provide your Groq API key.`);
      console.log(`\x1b[33mTip:\x1b[0m Get one for free at \x1b[4mhttps://console.groq.com/keys\x1b[0m\n`);
      console.log(`Usage: giti --auth <YOUR_KEY>\n`);
      process.exit(1);
    }
    const { setApiKey } = require('./ai');
    if (setApiKey(key)) {
      console.log(`\n\x1b[32m✔ Success!\x1b[0m Your API key has been saved.`);
      console.log(`giti will now use your personal quota for AI suggestions.\n`);
    }
    process.exit(0);
  }

  const compMatch = args.find(a => a.startsWith('--completion='));
  if (compMatch) {
    const shell = compMatch.split('=')[1] || 'bash';
    const { generateCompletion } = require('./completion');
    console.log(generateCompletion(shell));
    process.exit(0);
  }
  const compIdx = args.indexOf('--completion');
  if (compIdx !== -1 && args[compIdx + 1]) {
    const shell = args[compIdx + 1];
    const { generateCompletion } = require('./completion');
    console.log(generateCompletion(shell));
    process.exit(0);
  }

  // ─── Build raw query ──────────────────────────────────────────────────────
  const rawQuery = args
    .filter(a => !a.startsWith('--'))
    .join(' ')
    .trim();

  // ─── No query → Help ──────────────────────────────────────────────────────
  if (!rawQuery) {
    printHelp();
    return;
  }

  // ─── Run matcher ──────────────────────────────────────────────────────────
  const result = match(rawQuery);

  switch (result.type) {
    case 'single':
      renderSingle(result.result);
      break;
    case 'multiple':
    case 'fallback':
    default: {
      if (rawQuery) {
        logMissedQuery(rawQuery);
      }
      const { askAI } = require('./ai');
      console.log(`\n\x1b[36m⠋\x1b[0m Asking AI for a suggestion...`);

      askAI(rawQuery).then(({ command, warning }) => {
        // Clear the asking message
        process.stdout.write('\x1b[1A\x1b[2K\x1b[1A\x1b[2K'); 
        console.log(`\n\x1b[35m✨ AI Suggestion:\x1b[0m\n`);
        console.log(`  ❯ ${command}`);
        if (warning) {
          console.log(`\n  \x1b[33m⚠ Warning:\x1b[0m ${warning}`);
        }
        console.log();
      }).catch((err) => {
        process.stdout.write('\x1b[1A\x1b[2K\x1b[1A\x1b[2K'); // clear loading
        
        if (err.message === "Not a git command.") {
          console.log(`\n\x1b[31m✖ Error:\x1b[0m That doesn't seem to be a Git-related request.\n`);
        } else if (err.message.includes("No API key found") || err.message.includes("invalid") || err.message.toLowerCase().includes("rate limit") || err.message.toLowerCase().includes("too many repeated ai requests")) {
          console.log(`\n\x1b[31m✖ AI Error:\x1b[0m ${err.message}`);
          console.log(`\x1b[33mTip:\x1b[0m Get a free key at \x1b[4mhttps://console.groq.com/keys\x1b[0m\n`);
        } else {
          console.log(`\n\x1b[31m✖ Error:\x1b[0m ${err.message}\n`);
        }
      });
      break;
    }
  }
}

function printHelp() {
  console.log(`
${'\x1b[1m'}giti${'\x1b[0m'} — natural-language Git command lookup

${'\x1b[33m'}USAGE${'\x1b[0m'}
  giti <your query in plain English>

${'\x1b[33m'}EXAMPLES${'\x1b[0m'}
  giti remove staged file
  giti i messed up last commit
  giti remve stagd file          # typos are handled
  giti how do i see all branches
  giti unstash
  giti who changed this file
  giti squash last 3 commits

${'\x1b[33m'}FLAGS${'\x1b[0m'}
  --help, -h             Show this help
  --version, -v          Show version
  --auth <KEY>           Set your personal Groq API key (Recommended)
  --learn                Show logged queries that giti could not understand
  --completion=<shell>   Output completion script for bash, zsh, or fish

${'\x1b[33m'}HOW IT WORKS${'\x1b[0m'}
  • Offline — no internet required for standard commands
  • AI Fallback — uses Groq for complex/conversational queries
  • Hybrid — lightning fast matching + intelligent suggestions
`);
}

function logMissedQuery(query) {
  try {
    if (process.env.GITI_DISABLE_QUERY_LOG === '1') return;

    const dir = path.join(os.homedir(), '.giti');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    const logPath = path.join(dir, 'missed.log');
    if (fs.existsSync(logPath)) {
      const { size } = fs.statSync(logPath);
      if (size > MISSED_LOG_MAX_BYTES) {
        fs.writeFileSync(logPath, '', { mode: 0o600 });
      }
    }

    const cleaned = redactSensitiveText(query).replace(/[\r\n]+/g, ' ').trim();
    fs.appendFileSync(logPath, `[${new Date().toISOString()}] ${cleaned}\n`, { mode: 0o600 });
  } catch (e) {
    // Ignore logging errors silently to not disrupt the user experience
  }
}

module.exports = { run };
