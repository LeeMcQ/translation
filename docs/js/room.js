/** Room code + pew sync. PeerJS when available; BroadcastChannel always. */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeCode() {
  let s = "";
  const buf = new Uint8Array(6);
  crypto.getRandomValues(buf);
  for (const b of buf) s += ALPHABET[b % ALPHABET.length];
  return s;
}

export function makeHashtag(code) {
  return "#Woord" + code;
}

export function pewUrl(code) {
  const base = location.origin + location.pathname.replace(/index\.html$/, "");
  return `${base}#/pew/${code}`;
}

export function createRoomBus(code, role) {
  const channel = new BroadcastChannel("woord-" + code);
  let peer = null;
  let conns = [];
  const listeners = new Set();
  let snapshotFn = () => ({ type: "sync", lines: [] });

  channel.onmessage = (ev) => {
    handle(ev.data);
  };

  function emit(msg) {
    for (const fn of listeners) fn(msg);
  }

  function handle(msg) {
    if (role === "host" && msg?.type === "hello") {
      send(snapshotFn());
      return;
    }
    emit(msg);
  }

  function send(msg) {
    try {
      channel.postMessage(msg);
    } catch {
      /* closed */
    }
    for (const c of conns) {
      try {
        c.send(msg);
      } catch {
        /* closed */
      }
    }
  }

  async function attachPeer() {
    if (!window.Peer) return { peerOk: false };
    try {
      const id = "woord" + code.toLowerCase();
      peer = role === "host" ? new window.Peer(id) : new window.Peer();
      await new Promise((resolve, reject) => {
        const t = setTimeout(() => reject(new Error("peer-timeout")), 6000);
        peer.on("open", () => {
          clearTimeout(t);
          resolve();
        });
        peer.on("error", (e) => {
          clearTimeout(t);
          reject(e);
        });
      });
      if (role === "host") {
        peer.on("connection", (conn) => {
          conns.push(conn);
          conn.on("open", () => {
            try {
              conn.send(snapshotFn());
            } catch {
              /* */
            }
          });
          conn.on("data", (msg) => handle(msg));
          conn.on("close", () => {
            conns = conns.filter((c) => c !== conn);
          });
        });
      } else {
        const conn = peer.connect(id);
        conn.on("data", (msg) => emit(msg));
        await new Promise((resolve, reject) => {
          const t = setTimeout(() => reject(new Error("pew-timeout")), 6000);
          conn.on("open", () => {
            clearTimeout(t);
            resolve();
          });
          conn.on("error", reject);
        });
        conns.push(conn);
        send({ type: "hello" });
      }
      return { peerOk: true };
    } catch {
      if (role === "pew") send({ type: "hello" });
      return { peerOk: false };
    }
  }

  return {
    send,
    on: (fn) => listeners.add(fn),
    off: (fn) => listeners.delete(fn),
    setSnapshot: (fn) => {
      snapshotFn = fn;
    },
    attachPeer,
    close() {
      try {
        channel.close();
      } catch {
        /* */
      }
      try {
        peer?.destroy();
      } catch {
        /* */
      }
    },
  };
}

export async function lockScreen() {
  try {
    if (navigator.wakeLock) return await navigator.wakeLock.request("screen");
  } catch {
    return null;
  }
  return null;
}
