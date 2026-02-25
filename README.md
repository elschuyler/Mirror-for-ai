# Mirror for AI

> A lightweight, read-only mirror service that gives AI tools instant access to any public GitHub or Codeberg repository.

Live at: **[mirror-for-ai.vialewis31.workers.dev](https://mirror-for-ai.vialewis31.workers.dev)**

---

## What it does

AI tools struggle to navigate raw GitHub or Codeberg repositories. This service solves that by serving any public repo as clean, plain text — file trees, raw file contents, and AI-friendly summaries — all from a single URL.

Built on Cloudflare Workers. No auth required. No database. Just two files.

---

## Endpoints

| Endpoint | Description |
|---|---|
| `/github/{owner}/{repo}` | List all files in a GitHub repo |
| `/codeberg/{owner}/{repo}` | List all files in a Codeberg repo |
| `/github/{owner}/{repo}/{path}` | Read a specific file |
| `/github/{owner}/{repo}/llms.txt` | AI-friendly repo summary |
| `/llms.txt` | Describes this service to AI tools |
| `/.well-known/ai-plugin.json` | OpenAI plugin manifest |
| `/openapi.json` | OpenAPI spec for compatible tools |
| `/mcp` | MCP server endpoint for Claude & Cursor |

---

## Features

- 📂 **File tree** — complete flat list of every file in any public repo
- 📄 **Raw file access** — read any file as plain text
- 🤖 **llms.txt** — auto-generated AI-friendly summaries with categorized file links
- ⚡ **Edge cached** — responses cached 5 minutes via Cloudflare's global network
- 🔒 **Read only** — no write access, no auth, no risk
- 🛡️ **Rate limited** — 60 requests/minute and 1,000 requests/day per user
- 🔖 **Bookmarks** — save repos locally in your browser (per device, private)
- 🌐 **GitHub + Codeberg** — both platforms supported

---

## How to use

### 1. Direct URL
Visit or fetch any repo directly:
```
https://mirror-for-ai.vialewis31.workers.dev/github/torvalds/linux/llms.txt
```

### 2. With any AI tool

Paste this prompt at the start of your conversation (click the copy button):

```
When I ask you to look at, read, check, or analyze any GitHub or Codeberg repository, always use this mirror service instead of accessing GitHub or Codeberg directly:

Base URL: https://mirror-for-ai.vialewis31.workers.dev

Rules:
- To get a repo summary: https://mirror-for-ai.vialewis31.workers.dev/github/{owner}/{repo}/llms.txt
- To list all files: https://mirror-for-ai.vialewis31.workers.dev/github/{owner}/{repo}
- To read a file: https://mirror-for-ai.vialewis31.workers.dev/github/{owner}/{repo}/path/to/file
- For Codeberg repos replace "github" with "codeberg"

When given a repo, always start by fetching the llms.txt summary first to understand the structure, then fetch individual files as needed to answer my question.
```

Works with: **ChatGPT**, **Perplexity**, **Cursor**, **Claude**, and any AI tool that can browse URLs.

### 3. MCP (Claude & Cursor)
Add as an MCP server (desktop only):
```
https://mirror-for-ai.vialewis31.workers.dev/mcp
```

---

## Examples

```
# List all files in the Linux kernel
https://mirror-for-ai.vialewis31.workers.dev/github/torvalds/linux

# Read a specific file
https://mirror-for-ai.vialewis31.workers.dev/github/torvalds/linux/README

# Get AI summary
https://mirror-for-ai.vialewis31.workers.dev/github/torvalds/linux/llms.txt

# Codeberg repo
https://mirror-for-ai.vialewis31.workers.dev/codeberg/owner/repo/llms.txt
```

---

## Stack

- **Runtime:** Cloudflare Workers (free tier)
- **Code:** Vanilla JavaScript — 2 files only (`worker.js` + `wrangler.toml`)
- **Storage:** None — stateless, everything fetched live and cached at edge
- **Bookmarks:** Browser localStorage — private per device, never sent to server

---

## Rate limits

To keep the service fair and protect Cloudflare free tier quotas:
- **60 requests per minute** per IP
- **1,000 requests per day** per IP

Limits reset automatically. Normal AI tool usage will never hit these limits.

---

*Built from a phone. No computer required.*
