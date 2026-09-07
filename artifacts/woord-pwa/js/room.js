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
  return "#WOORD" + code.slice(0, 3);
}

export function pewUrl(code) {
  const base = location.origin + location.pathname;
  return `${base}#/pew/${code}`;
}

export function createRoomBus(code, role) {
  const channel = new BroadcastChannel("woord-" + code);
  let peer = null;
  let conns = [];
  const listeners = new Set();

  channel.onmessage = (ev) => emit(ev.data);

  function emit(msg) {
    for (const fn of listeners) fn(msg);
  }

  function send(msg) {
    channel.postMessage(msg);
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
          conn.on("close", () => {
            conns = conns.filter((c) => c !== conn);
          });
        });
      } else {
        const conn = peer.connect(id);
        conn.on("data", (msg) => emit(msg));
        await new Promise((resolve) => conn.on("open", resolve));
      }
      return { peerOk: true };
    } catch {
      return { peerOk: false };
    }
  }

  return {
    send,
    on: (fn) => listeners.add(fn),
    off: (fn) => listeners.delete(fn),
    attachPeer,
    close() {
      channel.close();
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
