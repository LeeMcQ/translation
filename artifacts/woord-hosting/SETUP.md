# Woord hosting + supporting software

GitHub account: **LeeMcQ**  
Existing repo: https://github.com/LeeMcQ/church-live-translator  
PWA already live: https://leemcq.github.io/church-live-translator/

This folder is the kit to drop into that repo (or into a new public repo named `woord`).

## What is already done

- Your GitHub login is connected as `LeeMcQ`.
- `church-live-translator` is public, has Pages enabled, and the v4.1 PWA is serving.
- This kit adds the missing ops layer: Pages workflow, Vercel config, Neon schema, env template.

## What I could not do from this session

The GitHub connector is **read-mostly**. Creating `LeeMcQ/woord`, pushing files, and opening issues all returned `403 Resource not accessible by integration`.

Fix that in one of two ways:

1. **Upload this folder yourself** (fastest — 2 minutes).
2. **Reconnect GitHub in Grok** and grant repo create + contents write, then ask me to push.

---

## Path A — keep using church-live-translator (recommended today)

1. Open https://github.com/LeeMcQ/church-live-translator
2. Add files:
   - drag `.github/workflows/pages.yml` into the repo (GitHub will create the folders)
   - add `SETUP.md`, `.env.example`, `vercel.json`, `neon-schema.sql`
3. Settings → Pages
   - Source: **GitHub Actions**
4. Settings → Actions → General → Workflow permissions → **Read and write**
5. After the Actions run is green, the same URL stays live:
   https://leemcq.github.io/church-live-translator/

On a pew phone: open that URL → browser menu → **Add to Home Screen**.

---

## Path B — new repo named `woord`

1. https://github.com/new
2. Owner `LeeMcQ`, name `woord`, Public, add a README, Create.
3. Upload every file from this kit **plus** the current PWA files from `church-live-translator` (`index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.webmanifest`, `icon.svg`).
4. Settings → Pages → GitHub Actions.
5. Live URL will be: https://leemcq.github.io/woord/

---

## Supporting software (do in this order)

### 1. xAI Grok key — translation

1. https://console.x.ai/
2. Create API key named `woord-church`.
3. Save it in a password manager. Never commit it.

### 2. Gemini key — optional cloud transcribe

1. https://aistudio.google.com/apikey
2. Create a key. Save it as `GEMINI_API_KEY`.
3. Until this exists, the pulpit uses Chrome/Edge on-device speech (`af-ZA`). That is enough for a first Sabbath test.

### 3. Neon — database for rooms + captions

1. https://console.neon.tech/ → New project → name `woord`.
2. Region: Europe if offered (`eu-central` / `eu-west`).
3. Copy the **pooled** `DATABASE_URL`.
4. SQL Editor → paste and run `neon-schema.sql` from this folder.

### 4. Vercel — server that hides the keys

GitHub Pages cannot keep `XAI_API_KEY` secret or write caption lines for every pew phone. Vercel can.

1. https://vercel.com/signup → Continue with GitHub → authorize `LeeMcQ`.
2. Add New Project → import `LeeMcQ/church-live-translator` (or `LeeMcQ/woord`).
3. Environment Variables, Production + Preview:

| Name | Value |
|---|---|
| `XAI_API_KEY` | from xAI console |
| `XAI_MODEL` | `grok-4-1-fast-reasoning` |
| `GEMINI_API_KEY` | from AI Studio (optional) |
| `DATABASE_URL` | Neon pooled URL |
| `PUBLIC_APP_URL` | your Vercel URL, set after first deploy |

4. Deploy. Copy the `*.vercel.app` URL into `PUBLIC_APP_URL` and redeploy once.
5. Point foyer QR codes at the **Vercel** URL once rooms are wired. Pages stays useful as a static fallback.

### 5. Custom church domain (optional)

Example: `woord.yourchurch.org`

- GitHub Pages: repo Settings → Pages → Custom domain, then a DNS `CNAME` to `leemcq.github.io`.
- Or Vercel: Project → Domains → add the hostname, then the DNS records Vercel shows.

---

## Local smoke test

```bash
git clone https://github.com/LeeMcQ/church-live-translator.git
cd church-live-translator
npx --yes serve .
```

Chrome or Edge only for the microphone. Type `Die Sabbat is die seël van die Skepper.` before you test speech.

---

## Sabbath morning

1. Host phone, church Wi-Fi, Chrome, battery saver off.
2. Typed line first, then Start listening (`Afrikaans (South Africa)`).
3. Put the QR / code on the foyer screen.
4. Pew phones: join → Add to Home Screen → font up, brightness down.
5. End the service so the room code dies with the benediction.

---

## Security

- Keys belong in Vercel / Neon / a password manager. Not in `app.js`. Not in Issues. Not in screenshots.
- If a key leaks, rotate it the same day.
- `.env.example` is safe to commit. `.env.local` is not.
