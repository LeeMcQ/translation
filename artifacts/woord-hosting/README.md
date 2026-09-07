# Woord hosting kit

Drop these files into `LeeMcQ/church-live-translator` or a new `LeeMcQ/woord` repo.

| File | Purpose |
|---|---|
| `SETUP.md` | Full click-by-click for Pages, Vercel, Neon, xAI, Gemini |
| `.env.example` | Env var names only — no secrets |
| `neon-schema.sql` | `services` + `transcript_lines` tables |
| `vercel.json` | Cache / security headers |
| `.github/workflows/pages.yml` | Publish the PWA on every push to `main` |

Live MVP today: https://leemcq.github.io/church-live-translator/
