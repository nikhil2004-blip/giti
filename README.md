# 🌌 giti

[![npm version](https://img.shields.io/badge/npm-v1.0.2-blue.svg)](https://www.npmjs.com/package/gitnik)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Engine: Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org)

> **Natural-language Git command lookup — hybrid, fuzzy, instant.**

Stop memorizing obscure Git flags. Just ask `giti` in plain English what you want to do, and it will give you the exact command you need.

![giti Banner](assets/banner.png)

---

## ✨ Features

- **🚀 Hybrid Matcher** — Lightning-fast offline matching (<100ms) for common commands, with an intelligent AI fallback for complex or conversational queries.
- **🧠 Intelligent NLP** — Handles typos, slang, and synonym expansion using Levenshtein distance with keyboard-adjacency weighting.
- **🔒 Secure by Default** — Local API keys are encrypted using AES-256-GCM. On Windows, it leverages the OS-backed DPAPI for maximum security.
- **⚡ AI Powered** — Uses Groq's high-speed inference (Llama 3.1) for suggestions when the local engine is stumped.
- **🛠 Shell Integration** — Built-in support for generating completion scripts for `bash`, `zsh`, and `fish`.
- **📈 Self-Improving** — Logs missed queries locally so you can see what the tool (and you) are missing.

---

## 📦 Installation

Install globally via npm:

```bash
npm install -g gitnik
```

*Note: The package is named `gitnik` on NPM, but the command you use is `giti`.*

---

## 🚀 Quick Start

Once installed, simply run `giti` followed by your request:

```bash
giti remove staged file
# ❯ git restore --staged <file>

giti i messed up last commit
# ❯ git commit --amend -m "new message"

giti remve stagd file          # typos are handled automatically
# ❯ git restore --staged <file>

giti who changed this file
# ❯ git blame <file>

giti squash last 3 commits
# ❯ git reset --soft HEAD~3 && git commit -m "merged 3 commits"
```

---

## 🤖 AI Suggestions (Groq)

While `giti` works perfectly offline for standard commands, you can unlock full conversational intelligence by adding a **Groq API Key**.

1. Get a free key at [console.groq.com](https://console.groq.com/keys).
2. Authenticate `giti`:

```bash
giti --auth <YOUR_GROQ_API_KEY>
```

Your key will be securely encrypted and stored locally. `giti` will only use the AI if the offline engine cannot find a high-confidence match.

---

## 🛠 Advanced Usage

| Flag | Description |
|---|---|
| `--help`, `-h` | Show the help menu |
| `--version`, `-v` | Show the current version |
| `--auth <KEY>` | Save your personal Groq API key |
| `--learn` | Show queries that `giti` couldn't match (stored in `~/.giti/missed.log`) |
| `--completion=<shell>` | Generate shell completion for `bash`, `zsh`, or `fish` |

### Environment Variables

- `GITI_API_KEY`: Set one or more API keys (comma-separated) to bypass local storage.
- `GITI_CONFIG_SECRET`: provide a custom secret for key encryption.
- `GITI_DISABLE_QUERY_LOG`: Set to `1` to disable logging of missed queries.

---

## 🛡 Security & Privacy

- **No Data Leakage**: Your queries are only sent to Groq if the local engine fails and you have a key configured.
- **Local Encryption**: API keys are never stored in plaintext. We use `aes-256-gcm` and OS-level protection where available.
- **Redaction**: Missed-query logs are automatically redacted to remove potential API keys or sensitive tokens.
- **Safety**: AI-generated commands are sanitized to prevent shell injection (blocked operators like `;`, `&`, `|`, etc.).

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for developers who forget git commands every 5 minutes.
</p>
