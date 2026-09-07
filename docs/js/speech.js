export function speechSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function createAfrikaansRecognizer({ onInterim, onFinal, onError, onStart, onEnd }) {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = "af-ZA";
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;

  rec.onstart = () => onStart?.();
  rec.onend = () => onEnd?.();
  rec.onerror = (e) => onError?.(e.error || "speech");

  rec.onresult = (event) => {
    let interim = "";
    let finals = [];
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

  return rec;
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
