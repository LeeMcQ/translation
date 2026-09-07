# Woord

Live Afrikaans → English church captions for Seventh-day Adventist services.

**Cost: $0 / month. No server.** Chrome speech + local liturgy / Kaaps slang / SDA glossary. MyMemory is only leftover sentences. The Afrikaans line is never discarded.

Live: [leemcq.github.io/translation](https://leemcq.github.io/translation/)

## The deep backup

Wrong English is the failure mode that matters in church. Woord treats that as a design constraint.

| Layer | What it does |
|---|---|
| Source always on screen | Pew sees Afrikaans even when English is empty or flagged |
| Safe mode (default) | Host taps **Send** after reading both languages |
| Liturgy memory | “Laat ons bid”, Sabbath blessing, greetings — never MT |
| SDA glossary | Sabbath, remnant, sanctuary, three angels, seal, 1844… |
| Kaaps / slang first | lekker, ja-nee, nou-nou, tannie — before any public translator |
| Scripture pin | Detects “Openbaring 14:6”. Does **not** invent a verse |
| Risky-line gate | Long MT lines, scripture, empty English, slurs stay in the review tray |
| Pew flag | “Doesn’t look right” notifies the host |
| Projector fallback | Host console *is* the foyer board if phones cannot sync |

## Sabbath morning

1. Host phone, **Chrome**, church Wi-Fi, near the pulpit.
2. Open Host → leave mode on **Safe**.
3. Check microphone. Speak or type `Die Sabbat is die seël van die Skepper.`
4. Confirm Afrikaans + English. Send.
5. Put the QR / 6-character code on the foyer screen.
6. Pew phones: Join → Add to Home Screen.
7. After three clean lines you may switch to **Live**.

If the translator is down, the pew still has the Afrikaans. That is the product working.

## What this build does **not** spend money on

- No Gemini. Chrome `af-ZA` first.
- No Grok on every line.
- No Neon. Rooms use BroadcastChannel on the same device and PeerJS across phones when the public broker is up.

The older tester remains at [leemcq.github.io/church-live-translator](https://leemcq.github.io/church-live-translator/).
