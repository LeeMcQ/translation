export type SpeechHandlers = {
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (message: string) => void;
  onStart?: () => void;
  onStop?: () => void;
};

type RecogCtor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((ev: SpeechRecogEvent) => void) | null;
  onerror: ((ev: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecogEvent {
  resultIndex: number;
  results: {
    length: number;
    [i: number]: {
      isFinal: boolean;
      length: number;
      [j: number]: { transcript: string };
    };
  };
}

function getCtor(): RecogCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: RecogCtor;
    webkitSpeechRecognition?: RecogCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function speechSupported(): boolean {
  return getCtor() !== null;
}

export function createAfrikaansListener(handlers: SpeechHandlers) {
  const Ctor = getCtor();
  if (!Ctor) {
    return {
      supported: false as const,
      start: () => handlers.onError("Speech recognition is not available in this browser."),
      stop: () => undefined,
    };
  }

  let recog: SpeechRecognitionLike | null = null;
  let running = false;
  let buffer = "";
  let silenceTimer: number | null = null;
  const SILENCE_MS = 1400;

  const flush = () => {
    const text = buffer.trim();
    buffer = "";
    if (text) handlers.onFinal(text);
  };

  const armSilence = () => {
    if (silenceTimer) window.clearTimeout(silenceTimer);
    silenceTimer = window.setTimeout(() => {
      flush();
    }, SILENCE_MS);
  };

  const attach = () => {
    const r = new Ctor();
    r.lang = "af-ZA";
    r.continuous = true;
    r.interimResults = true;
    r.maxAlternatives = 1;

    r.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i += 1) {
        const piece = ev.results[i][0]?.transcript ?? "";
        if (ev.results[i].isFinal) {
          buffer = `${buffer} ${piece}`.trim();
          armSilence();
        } else {
          interim += piece;
        }
      }
      const live = `${buffer} ${interim}`.trim();
      if (live) handlers.onInterim(live);
    };

    r.onerror = (ev) => {
      if (ev.error === "no-speech" || ev.error === "aborted") return;
      if (ev.error === "not-allowed") {
        running = false;
        handlers.onError("Microphone permission was denied.");
        handlers.onStop?.();
        return;
      }
      handlers.onError(`Microphone error: ${ev.error}`);
    };

    r.onend = () => {
      if (!running) {
        handlers.onStop?.();
        return;
      }
      try {
        r.start();
      } catch {
        window.setTimeout(() => {
          if (running) {
            try {
              r.start();
            } catch {
              /* ignore restart races */
            }
          }
        }, 240);
      }
    };

    recog = r;
  };

  return {
    supported: true as const,
    start: () => {
      if (running) return;
      attach();
      running = true;
      buffer = "";
      try {
        recog?.start();
        handlers.onStart?.();
      } catch (err) {
        running = false;
        handlers.onError(err instanceof Error ? err.message : "Could not start the microphone.");
      }
    },
    stop: () => {
      running = false;
      if (silenceTimer) window.clearTimeout(silenceTimer);
      flush();
      try {
        recog?.abort();
      } catch {
        /* already stopped */
      }
      recog = null;
      handlers.onStop?.();
    },
  };
}
