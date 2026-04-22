# giti

> Natural-language Git command lookup — hybrid, fuzzy, instant.

```bash
giti remove staged file
giti i messed up last commit
giti remve stagd file          # typos handled
giti who changed this file
giti squash last 3 commits
```

## Install

```bash
npm install -g giti
```

## Usage

```bash
giti <your question in plain English>
```

### Setup (AI suggestions)

To get high-quality suggestions for complex or conversational queries, set your free Groq API key:

```bash
giti --auth <YOUR_GROQ_API_KEY>
```
*Get a free key at [console.groq.com/keys](https://console.groq.com/keys)*

## Why giti?

| Query | Top Result |
|---|---|
| `giti unstage file` | `git restore --staged <file>` |
| `giti delete remote branch` | `git push origin --delete <name>` |
| `giti see commit graph` | `git log --graph --oneline --all` |
| `giti cherry pick commit` | `git cherry-pick <commit>` |
| `giti force push` | `git push --force-with-lease` |
| `giti find when bug introduced` | `git bisect start` |

## Features

- **Hybrid Engine** — Uses a fast offline matcher for standard commands and AI for complex ones.
- **BYOK (Bring Your Own Key)** — Set your own API key to get personal quota and privacy.
- **Fuzzy matching** — Handles typos, slang, and synonym expansion.
- **Lightning Fast** — < 100ms response for offline matches.
- **No Legacy Menus** — Just direct, intelligent responses.

## License

MIT
