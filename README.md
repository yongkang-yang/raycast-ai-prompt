# Prompt

Translate, polish, shorten, explain, and reply to selected text using
your own model, right inside Raycast.

> **Not published to the Raycast Store yet.** Install it locally — see
> [Installation](#installation) below.

## Commands

- **Polish Selection** — polish selected text while preserving its language and meaning.
- **Friendly Reply** — write a concise, polite reply to selected text.
- **Make Concise** — shorten selected text while preserving its meaning and language.
- **Explain Selection** — explain selected text in plain Chinese.
- **Translate & Learn** — Chinese-English translation with examples and optional contextual dialogues.
- **OCR Translate** (macOS only) — select a screen region and translate its text using your vision model.

## Setup

In extension preferences, set:

- **API Key** — your model provider's API key.
- **Base URL** — an OpenAI-compatible API base URL (defaults to OpenRouter).
- **Model** — the exact model ID from your provider.

Any OpenAI-compatible endpoint works, so you can point this at OpenRouter,
OpenAI directly, or a self-hosted gateway.

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
