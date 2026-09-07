# Woord

Live Afrikaans → English church captions for Seventh-day Adventist services.

**Cost target: $0 / month.** Chrome speech + local liturgy/glossary + MyMemory only for leftover sentences. The Afrikaans line is never discarded.

## The deep backup

Wrong English is the failure mode that matters in church. Woord treats that as a design constraint, not an afterthought.

| Layer | What it does |
|---|---|
| Source always on screen | Pew sees Afrikaans even when English is empty or flagged |
| Safe mode (default) | Host taps **Send** after reading both languages |
| Liturgy memory | “Laat ons bid”, Sabbath blessing, greetings — never MT |
| SDA glossary | Sabbath, remnant, sanctuary, three angels, seal, 1844… |
| Scripture pin | Detects “Openbaring 14:6”. Does **not** invent a verse. Tells the pew to open their Bible |
| Risky-line gate | Long MT lines, scripture hits, empty English stay in the review tray |
| Pew flag | “Doesn’t look right” notifies the host; host can edit English in place |
| Projector fallback | Host console *is* the foyer board if phones cannot sync |
| Cache | A sentence translated once is free the next time |

This follows what working church tools already do:

- **spf.io** — Autopilot / Supervised / Manuscript. Human edits before the line leaves the desk.
- **OneAccord** — Moderation function: fix the transcript *before* translation.
- **Church Cap** — Local glossary + Christian corrections; they warn that MT is unsafe for Scripture.
- **CaptionLift / Rev hybrid** — Custom theological lexicon beats generic meeting captions.
- **Google Translate live** — Mask unstable tails; do not flicker the words already on screen.
- **Broadcast captioning research** — Wait for a sentence boundary. Partial speech is cheap latency and expensive error.

## How a Sabbath works

1. Host phone, **Chrome**, church Wi-Fi, near the pulpit or an aux feed.
2. Open Host → leave mode on **Safe**.
3. Check microphone. Speak or type `Die Sabbat is die seël van die Skepper.`
4. Confirm Afrikaans + English. Send.
5. Put the QR / 6-character code on the foyer screen.
6. Pew phones: Join → Add to Home Screen. Font slider + wake lock.
7. After three clean lines you may switch to **Live**.

If the translator is down, the pew still has the Afrikaans. That is the product working, not failing.

## Deploy on GitHub Pages ($0)

1. Create a public repo (for example `LeeMcQ/woord`).
2. Upload this folder.
3. Settings → Pages → Source: GitHub Actions.
4. Settings → Actions → General → Read and write.
5. Site: `https://leemcq.github.io/woord/`

The existing MVP remains at [leemcq.github.io/church-live-translator](https://leemcq.github.io/church-live-translator/).

## What this build does **not** spend money on

- No Gemini Transcribe (Chrome `af-ZA` first).
- No Grok on every line (glossary + liturgy cover the dangerous words).
- No Neon. Rooms use BroadcastChannel on the same device and PeerJS across phones when the public broker is up.

Upgrade later only if you outgrow MyMemory: Azure Translator F0 is 2 million characters/month free and is the next cheapest quality step. Put that key in a tiny worker, never in the browser.

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`. Modules will not load from `file://`.
