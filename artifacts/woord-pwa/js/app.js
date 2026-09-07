import { GLOSSARY, searchGlossary } from "./glossary.js";
import { translateUtterance, looksRisky } from "./translate.js";
import { speechSupported, createAfrikaansRecognizer, checkMic } from "./speech.js";
import { makeCode, makeHashtag, pewUrl, createRoomBus, lockScreen } from "./room.js";
import { DEMO } from "./demo-sermon.js";

const root = document.getElementById("app");
const state = {
  route: parseRoute(),
  host: null,
};

window.addEventListener("hashchange", () => {
  teardownHost();
  state.route = parseRoute();
  render();
});

render();

function parseRoute() {
  const h = (location.hash || "#/").replace(/^#/, "");
  const pew = h.match(/^\/pew\/([A-Z0-9]{6})$/i);
  if (pew) return { name: "pew", code: pew[1].toUpperCase() };
  if (h.startsWith("/host")) return { name: "host" };
  if (h.startsWith("/join")) return { name: "join" };
  if (h.startsWith("/glossary")) return { name: "glossary" };
  if (h.startsWith("/how")) return { name: "how" };
  return { name: "home" };
}

function teardownHost() {
  if (state.host?.rec) {
    try {
      state.host.rec.stop();
    } catch {
      /* */
    }
  }
  state.host?.bus?.close();
  state.host?.demoTimer && clearInterval(state.host.demoTimer);
  state.host = null;
}

function render() {
  const r = state.route;
  if (r.name === "host") return renderHost();
  if (r.name === "join") return renderJoin();
  if (r.name === "pew") return renderPew(r.code);
  if (r.name === "glossary") return renderGlossary();
  if (r.name === "how") return renderHow();
  renderHome();
}

function shell(body, opts = {}) {
  root.innerHTML = `
    <header class="top">
      <a class="brand" href="#/">
        <span class="mark" aria-hidden="true">W</span>
        <span>
          <strong>Woord</strong>
          <em>Afrikaans pulpit · English pew</em>
        </span>
      </a>
      <nav>
        <a href="#/how">How</a>
        <a href="#/glossary">Glossary</a>
        <a href="#/join">Join</a>
        <a class="btn small" href="#/host">Host</a>
      </nav>
    </header>
    ${body}
    ${opts.footer !== false ? `<footer class="foot">Source language is always shown. Scripture is pinned, not invented.</footer>` : ""}
  `;
}

function renderHome() {
  shell(`
    <section class="hero">
      <p class="kicker">Seventh-day Adventist · live service captions</p>
      <h1>Hear the Word in the language of your heart — without losing the Afrikaans.</h1>
      <p class="lead">The host phone listens to the pulpit. Pew phones join with a 6-letter code. Every line keeps the original Afrikaans as the deep backup if English slips.</p>
      <div class="cta">
        <a class="btn" href="#/host">Open host console</a>
        <a class="btn ghost" href="#/join">Join a service</a>
      </div>
    </section>
    <section class="grid3">
      <article class="card">
        <h2>1. Safe first</h2>
        <p>Default mode waits for a host tap before a line reaches the pews. Live mode exists for when you trust the line.</p>
      </article>
      <article class="card">
        <h2>2. Do not invent Scripture</h2>
        <p>Verse references are detected and pinned. People open John 3:16 in their own Bible instead of reading a machine verse.</p>
      </article>
      <article class="card">
        <h2>3. Zero-cost path</h2>
        <p>Chrome speech is free. Liturgy and the SDA glossary never touch an API. Machine translation is only the leftover sentences.</p>
      </article>
    </section>
  `);
}

function renderHow() {
  shell(`
    <section class="prose">
      <h1>How Woord stays accurate</h1>
      <p>Church caption products that work (Church Cap, spf.io, OneAccord, CaptionLift) all do the same four things. Woord copies those, not the paid stack.</p>
      <ol>
        <li><strong>Always show the source.</strong> If English is wrong, Afrikaans is still on screen. That is the deep backup.</li>
        <li><strong>Human gate.</strong> Safe mode = host sends the line. OneAccord calls this Moderation: edit before translation leaves the desk.</li>
        <li><strong>Glossary + liturgy memory.</strong> Sabbath, remnant, sanctuary, three angels, seal — never guessed. Stock lines like “Laat ons bid” are canned.</li>
        <li><strong>Do not MT Scripture.</strong> Detect the reference. Tell the pew to open the Bible they trust.</li>
        <li><strong>Translate finished sentences only.</strong> Partial speech flickers and wastes quota. Google’s live-translate team masks unstable tails for the same reason.</li>
        <li><strong>Pew can flag a line.</strong> Host sees it and can rewrite.</li>
        <li><strong>Projector fallback.</strong> If phones cannot sync, the host screen itself is the foyer board.</li>
      </ol>
      <h2>Sabbath morning</h2>
      <ol>
        <li>Host phone, Chrome, church Wi-Fi, sit near the pulpit or an aux feed.</li>
        <li>Start in <em>Safe</em> until you have heard three good lines.</li>
        <li>Put the QR on the foyer screen.</li>
        <li>If translation fails, leave Safe mode on and type the line.</li>
      </ol>
    </section>
  `);
}

function renderGlossary() {
  shell(`
    <section class="prose">
      <h1>SDA glossary</h1>
      <p>${GLOSSARY.length} pinned terms. Speech errors like “seel” are corrected to “seël” before translation.</p>
      <input id="gq" class="input" placeholder="Search Sabbath, remnant, seël…" />
      <div id="glist" class="terms"></div>
    </section>
  `);
  const paint = () => {
    const rows = searchGlossary(document.getElementById("gq").value);
    document.getElementById("glist").innerHTML = rows
      .map(
        (r) =>
          `<div class="term"><b>${esc(r.af)}</b><span>${esc(r.en)}</span>${r.note ? `<i>${esc(r.note)}</i>` : ""}</div>`
      )
      .join("");
  };
  document.getElementById("gq").addEventListener("input", paint);
  paint();
}

function renderJoin() {
  shell(`
    <section class="join">
      <h1>Join the pew</h1>
      <p>Type the 6-character code from the foyer screen.</p>
      <form id="joinForm" class="code-row">
        <input id="joinCode" class="input code" maxlength="6" autocomplete="off" placeholder="K7M2PQ" />
        <button class="btn" type="submit">Enter</button>
      </form>
    </section>
  `);
  document.getElementById("joinForm").onsubmit = (e) => {
    e.preventDefault();
    const code = document.getElementById("joinCode").value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    if (code.length === 6) location.hash = "#/pew/" + code;
  };
}

function renderHost() {
  if (!state.host) {
    const code = makeCode();
    state.host = {
      code,
      tag: makeHashtag(code),
      url: pewUrl(code),
      mode: "safe",
      listening: false,
      rec: null,
      bus: createRoomBus(code, "host"),
      lines: [],
      pending: null,
      interim: "",
      flags: 0,
      peerOk: false,
      demoTimer: null,
    };
    state.host.bus.attachPeer().then((r) => {
      state.host.peerOk = r.peerOk;
      const el = document.getElementById("peerState");
      if (el) el.textContent = r.peerOk ? "Pew link: PeerJS ready" : "Pew link: this device / projector";
    });
    state.host.bus.on((msg) => {
      if (msg.type === "flag") {
        state.host.flags += 1;
        const line = state.host.lines.find((l) => l.id === msg.id);
        if (line) line.flagged = true;
        const f = document.getElementById("flagCount");
        if (f) f.textContent = String(state.host.flags);
      }
    });
  }
  const h = state.host;
  shell(`
    <section class="host">
      <aside class="qr-col">
        <div class="code-big">${h.code}</div>
        <div class="hash">${h.tag}</div>
        <canvas id="qr" width="180" height="180"></canvas>
        <a class="pew-link" href="${h.url}" target="_blank" rel="noopener">Open pew view</a>
        <p class="tiny" id="peerState">Connecting pew link…</p>
      </aside>
      <div class="console">
        <div class="toolbar">
          <label>Mode
            <select id="modeSel">
              <option value="safe" ${h.mode === "safe" ? "selected" : ""}>Safe — tap Send</option>
              <option value="live" ${h.mode === "live" ? "selected" : ""}>Live — auto send finals</option>
            </select>
          </label>
          <button class="btn" id="micBtn">${h.listening ? "Stop mic" : "Start mic af-ZA"}</button>
          <button class="btn ghost" id="micCheck">Check mic</button>
          <button class="btn ghost" id="demoBtn">Demo sermon</button>
          <span class="pill">Flags <b id="flagCount">${h.flags}</b></span>
        </div>
        <p class="tiny" id="speechHint">${speechSupported() ? "Chrome / Edge required for Afrikaans speech." : "Speech API missing. Type lines instead."}</p>
        <div class="type-row">
          <input id="typed" class="input" placeholder="Type Afrikaans if the mic misses a line…" />
          <button class="btn" id="sendTyped">Translate</button>
        </div>
        <div class="pending card" id="pendingBox">${pendingHtml(h.pending, h.interim)}</div>
        <div class="board" id="hostBoard">${boardHtml(h.lines)}</div>
      </div>
    </section>
  `, { footer: false });

  drawQr("qr", h.url);
  document.getElementById("modeSel").onchange = (e) => {
    h.mode = e.target.value;
  };
  document.getElementById("micCheck").onclick = async () => {
    const r = await checkMic();
    toast(r.message);
  };
  document.getElementById("micBtn").onclick = () => toggleMic();
  document.getElementById("demoBtn").onclick = () => runDemo();
  document.getElementById("sendTyped").onclick = () => submitTyped();
  document.getElementById("typed").addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitTyped();
  });
  document.getElementById("pendingBox").onclick = (e) => {
    const act = e.target.dataset.act;
    if (act === "send") publishPending();
    if (act === "drop") {
      h.pending = null;
      refreshPending();
    }
  };
  document.getElementById("hostBoard").onclick = (e) => {
    const id = e.target.dataset.edit;
    if (!id) return;
    const line = h.lines.find((l) => l.id === id);
    if (!line) return;
    const next = prompt("Correct the English (Afrikaans stays):", line.en);
    if (next == null) return;
    line.en = next.trim();
    line.engine = "host-edit";
    line.flagged = false;
    h.bus.send({ type: "line", line });
    document.getElementById("hostBoard").innerHTML = boardHtml(h.lines);
  };
}

function pendingHtml(pending, interim) {
  if (interim && !pending) {
    return `<p class="dim">Listening…</p><p class="af">${esc(interim)}</p>`;
  }
  if (!pending) return `<p class="dim">No line waiting. Speak or type. In Safe mode you send each line yourself.</p>`;
  const risk = looksRisky(pending) ? `<span class="warn">Review this line</span>` : `<span class="ok">Looks stable</span>`;
  return `
    <div class="row-between">
      <strong>Ready to send</strong>
      ${risk}
    </div>
    <p class="af">${esc(pending.af)}</p>
    <p class="en">${pending.en ? esc(pending.en) : "<em>No English — Afrikaans is the backup</em>"}</p>
    ${pending.warning ? `<p class="warn">${esc(pending.warning)}</p>` : ""}
    <div class="cta">
      <button class="btn" data-act="send">Send to pews</button>
      <button class="btn ghost" data-act="drop">Drop</button>
    </div>
  `;
}

function boardHtml(lines) {
  if (!lines.length) return `<p class="dim">Sent lines will stack here.</p>`;
  return lines
    .slice()
    .reverse()
    .map(
      (l) => `
      <article class="line ${l.flagged ? "flagged" : ""}">
        <p class="af">${esc(l.af)}</p>
        <p class="en">${l.en ? esc(l.en) : "<em>source only</em>"}</p>
        <div class="meta">${esc(l.engine)}${l.flagged ? " · flagged" : ""} · <button data-edit="${l.id}">Edit English</button></div>
      </article>`
    )
    .join("");
}

function refreshPending() {
  const box = document.getElementById("pendingBox");
  if (box) box.innerHTML = pendingHtml(state.host.pending, state.host.interim);
}

function refreshBoard() {
  const b = document.getElementById("hostBoard");
  if (b) b.innerHTML = boardHtml(state.host.lines);
}

async function ingestFinal(text) {
  const h = state.host;
  h.interim = "";
  const result = await translateUtterance(text);
  const line = {
    id: crypto.randomUUID(),
    ts: Date.now(),
    ...result,
  };
  if (h.mode === "live" && !looksRisky(line)) {
    h.pending = null;
    publishLine(line);
  } else {
    h.pending = line;
    refreshPending();
  }
}

function publishPending() {
  const h = state.host;
  if (!h.pending) return;
  publishLine(h.pending);
  h.pending = null;
  refreshPending();
}

function publishLine(line) {
  const h = state.host;
  h.lines.push(line);
  h.bus.send({ type: "line", line });
  refreshBoard();
}

async function submitTyped() {
  const el = document.getElementById("typed");
  const t = el.value.trim();
  if (!t) return;
  el.value = "";
  await ingestFinal(t);
}

function toggleMic() {
  const h = state.host;
  if (h.listening) {
    try {
      h.rec?.stop();
    } catch {
      /* */
    }
    h.listening = false;
    document.getElementById("micBtn").textContent = "Start mic af-ZA";
    return;
  }
  const rec = createAfrikaansRecognizer({
    onStart() {
      h.listening = true;
      const b = document.getElementById("micBtn");
      if (b) b.textContent = "Stop mic";
    },
    onEnd() {
      h.listening = false;
      const b = document.getElementById("micBtn");
      if (b) b.textContent = "Start mic af-ZA";
    },
    onError(err) {
      toast("Speech: " + err);
    },
    onInterim(t) {
      h.interim = t;
      refreshPending();
    },
    onFinal(t) {
      ingestFinal(t);
    },
  });
  if (!rec) {
    toast("Use Chrome or Edge for Afrikaans speech.");
    return;
  }
  h.rec = rec;
  rec.start();
}

function runDemo() {
  const h = state.host;
  if (h.demoTimer) {
    clearInterval(h.demoTimer);
    h.demoTimer = null;
    toast("Demo stopped");
    return;
  }
  let i = 0;
  const tick = () => {
    if (i >= DEMO.length) {
      clearInterval(h.demoTimer);
      h.demoTimer = null;
      return;
    }
    const d = DEMO[i++];
    const line = {
      id: crypto.randomUUID(),
      ts: Date.now(),
      af: d.af,
      en: d.en,
      engine: d.engine,
      confidence: 1,
      scripture: [],
      warning: d.warning || null,
    };
    if (h.mode === "safe") {
      h.pending = line;
      refreshPending();
    } else {
      publishLine(line);
    }
  };
  tick();
  h.demoTimer = setInterval(tick, 4200);
}

function renderPew(code) {
  const lines = [];
  const bus = createRoomBus(code, "pew");
  let font = Number(localStorage.getItem("woord-font") || 22);
  shell(`
    <section class="pew">
      <div class="pew-top">
        <span class="code-big sm">${esc(code)}</span>
        <label>Text <input id="font" type="range" min="16" max="42" value="${font}" /></label>
      </div>
      <div class="pew-board" id="pewBoard" style="font-size:${font}px">
        <p class="dim">Waiting for the host. Afrikaans will always appear even if English does not.</p>
      </div>
    </section>
  `, { footer: false });
  lockScreen();
  bus.attachPeer();
  bus.on((msg) => {
    if (msg.type !== "line") return;
    const i = lines.findIndex((l) => l.id === msg.line.id);
    if (i >= 0) lines[i] = msg.line;
    else lines.push(msg.line);
    paintPew(lines);
  });
  document.getElementById("font").oninput = (e) => {
    font = Number(e.target.value);
    localStorage.setItem("woord-font", String(font));
    document.getElementById("pewBoard").style.fontSize = font + "px";
  };
  document.getElementById("pewBoard").onclick = (e) => {
    const id = e.target.dataset.flag;
    if (!id) return;
    bus.send({ type: "flag", id });
    toast("Host notified");
  };
}

function paintPew(lines) {
  const el = document.getElementById("pewBoard");
  if (!el) return;
  el.innerHTML = lines
    .slice(-12)
    .map((l, idx, arr) => {
      const last = idx === arr.length - 1;
      return `
        <article class="line ${last ? "live" : "prev"}">
          <p class="af">${esc(l.af)}</p>
          <p class="en">${l.en ? esc(l.en) : "<em>English unavailable — follow the Afrikaans</em>"}</p>
          ${l.warning ? `<p class="warn">${esc(l.warning)}</p>` : ""}
          ${last ? `<button data-flag="${l.id}" class="flag">Doesn’t look right</button>` : ""}
        </article>`;
    })
    .join("");
  el.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" });
}

function drawQr(id, text) {
  const canvas = document.getElementById(id);
  if (!canvas || !window.QRCode) return;
  window.QRCode.toCanvas(canvas, text, { width: 180, margin: 1, color: { dark: "#e8dcc8", light: "#16131e" } });
}

function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
