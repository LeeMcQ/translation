export function speechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

/**
 * Chrome drops the recognizer after a pause. For a sermon we keep restarting
 * until the host taps Stop.
 */
export function createAfrikaansRecognizer({ onInterim, onFinal, onError, onStart, onEnd }) {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = "af-ZA";
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;

  let wanted = false;

  rec.onstart = () => onStart?.();
  rec.onend = () => {
    if (wanted) {
      setTimeout(() => {
        if (!wanted) return;
        try {
          rec.start();
        } catch {
          /* already started */
        }
      }, 180);
      return;
    }
    onEnd?.();
  };
  rec.onerror = (e) => {
    const err = e.error || "speech";
    if (err === "no-speech" || err === "aborted") return;
    onError?.(err);
  };

  rec.onresult = (event) => {
    let interim = "";
    const finals = [];
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const piece = event.results[i][0].transcript;
      if (event.results[i].isFinal) finals.push(piece);
      else interim += piece;
    }
    if (interim) onInterim?.(interim.trim());
    for (const f of finals) {
      const t = f.trim();
      if (t) onFinal?.(t);
    }
  };

  return {
    start() {
      wanted = true;
      rec.start();
    },
    stop() {
      wanted = false;
      try {
        rec.stop();
      } catch {
        /* */
      }
    },
  };
}

export async function checkMic() {
  if (!navigator.mediaDevices?.getUserMedia) {
    return { ok: false, message: "This browser cannot use the microphone." };
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return { ok: true, message: "Microphone allowed." };
  } catch {
    return { ok: false, message: "Microphone blocked. Allow it in the browser padlock." };
  }
}
