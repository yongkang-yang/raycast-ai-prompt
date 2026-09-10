# Prompt

Translate, explain, polish, and reply to selected text using your own
model, right inside Raycast.

> **Not published to the Raycast Store yet.** Install it locally — see
> [Installation](#installation) below.

## Commands

- **Selection Assistant** — the main entry point; bind this one to a hotkey (e.g. `⌥D`). Reads the current selection and auto-detects whether it's a word/phrase or a sentence/passage:
  - Word or phrase → runs **Translate & Learn** (vocabulary mode: 中英对照, example sentences) + **Explain**.
  - Sentence or passage → runs **Polish** + **Translate** (the more-used case).

  Each section gets its own Paste/Copy actions (⌘K), so you're not stuck with the combined output.

- **Friendly Reply** — write a concise, polite reply to selected text.

Raycast reuses an already-open command's window instead of remounting it
on a repeat hotkey press, so pressing the hotkey again while a result is
still showing won't automatically re-read the new selection. Selection
Assistant and Friendly Reply both pin **⏎ (Enter) to always re-read the
current selection and rerun**, rather than pasting — there's no reliable
way to tell whether what's on screen is still current, so Enter never
risks pasting a stale result. Once fresh results are showing, **⌘⏎
pastes** (Selection Assistant's primary section — Polish for a sentence,
Translate & Learn for a word — or Friendly Reply's reply).
- **OCR Translate** (macOS only) — select a screen region and translate its text using your vision model; displays its result in Selection Assistant.

## Setup

In extension preferences, set:

- **API Key** — your model provider's API key.
- **Base URL** — an OpenAI-compatible API base URL (defaults to OpenRouter).
- **Model** — the exact model ID from your provider.

Any OpenAI-compatible endpoint works, so you can point this at OpenRouter,
OpenAI directly, or a self-hosted gateway.

**Polish** is tuned toward native, idiomatic phrasing rather than just
grammar correctness — it targets fixing translated-sounding or stilted
wording (the common case being polishing a drafted email) while keeping
your meaning, tone, and facts unchanged.

## Installation

```
git clone https://github.com/yongkang-yang/raycast-ai-prompt.git
cd raycast-ai-prompt
npm install
npm run dev
```

`npm run dev` (`ray develop`) builds the extension and registers it with
your local Raycast app in dev mode — the commands show up immediately and
hot-reload on further changes. Stop it with Ctrl+C; the extension stays
installed until Raycast is told otherwise.
