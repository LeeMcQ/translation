import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Copy,
  Hash,
  Mic,
  MicOff,
  Shield,
  Square,
  Type,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { CaptionBoard } from "@/components/caption-board";
import { QrPanel } from "@/components/qr-panel";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Waveform } from "@/components/waveform";
import { useWakeLock } from "@/components/wake-lock";
import { formatCode, rememberHost } from "@/lib/codes";
import { DEMO_SERMON } from "@/lib/demo-sermon";
import {
  createService,
  endService,
  getEngines,
  previewUtterance,
  publishUtterance,
  type PublicService,
  type TranscriptLine,
} from "@/lib/service-api";
import { createAfrikaansListener, speechSupported } from "@/lib/speech";

type Search = { demo?: boolean };

type Draft = {
  source: string;
  english: string;
  engine: string;
  filtered: boolean;
};

export const Route = createFileRoute("/host")({
  validateSearch: (raw: Record<string, unknown>): Search => {
    if (raw.demo === "1" || raw.demo === true || raw.demo === "true") {
      return { demo: true };
    }
    return {};
  },
  component: HostPage,
});

function HostPage() {
  const { demo } = Route.useSearch();
  const [phase, setPhase] = useState<"setup" | "live">("setup");
  const [title, setTitle] = useState("Sabbath service");
  const [busy, setBusy] = useState(false);
  const [service, setService] = useState<PublicService | null>(null);
  const [hostToken, setHostToken] = useState("");
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [typed, setTyped] = useState("");
  const [engines, setEngines] = useState({
    gemini: false,
    grokTranslate: false,
    localBackup: true,
  });
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [copied, setCopied] = useState<"code" | "hash" | "link" | null>(null);
  const [safeMode, setSafeMode] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [draftBusy, setDraftBusy] = useState(false);
  const [queued, setQueued] = useState(0);
  const demoTimer = useRef<number | null>(null);
  const listener = useRef<ReturnType<typeof createAfrikaansListener> | null>(null);
  const queueRef = useRef<string[]>([]);
  const serviceRef = useRef<{ code: string; token: string } | null>(null);

  useWakeLock(phase === "live");

  useEffect(() => {
    void getEngines().then(setEngines);
  }, []);

  useEffect(() => {
    return () => {
      listener.current?.stop();
      if (demoTimer.current) window.clearTimeout(demoTimer.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinUrl = useMemo(() => {
    if (!service || typeof window === "undefined") return "";
    return `${window.location.origin}/listen/${service.code}`;
  }, [service]);

  async function begin(asDemo: boolean) {
    setBusy(true);
    try {
      const created = await createService({
        data: { title: asDemo ? "Sample Sabbath service" : title },
      });
      rememberHost(created.service.code, created.hostToken);
      setService(created.service);
      setHostToken(created.hostToken);
      serviceRef.current = { code: created.service.code, token: created.hostToken };
      setPhase("live");
      if (asDemo) {
        setSafeMode(false);
        runDemo(created.service.code, created.hostToken);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start the service.");
    } finally {
      setBusy(false);
    }
  }

  function runDemo(code: string, token: string) {
    let i = 0;
    const step = async () => {
      const beat = DEMO_SERMON[i];
      if (!beat) return;
      setInterim(beat.af);
      try {
        const res = await publishUtterance({
          data: { code, hostToken: token, text: beat.af, english: beat.en },
        });
        if (res.ok && !res.duplicate) {
          setLines((prev) => [...prev, res.line]);
        }
      } catch {
        /* keep playing */
      }
      setInterim("");
      i += 1;
      if (i < DEMO_SERMON.length) {
        demoTimer.current = window.setTimeout(() => void step(), beat.afterMs);
      }
    };
    void step();
  }

  async function startMic() {
    if (!speechSupported()) {
      toast.error("Afrikaans dictation needs Chrome on this host phone. You can still type lines.");
      return;
    }
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(media);
    } catch {
      toast.error("Microphone permission was denied.");
      return;
    }
    listener.current = createAfrikaansListener({
      onInterim: setInterim,
      onFinal: (text) => {
        setInterim("");
        void enqueueOrPublish(text);
      },
      onError: (msg) => toast.error(msg),
      onStart: () => setListening(true),
      onStop: () => setListening(false),
    });
    listener.current.start();
  }

  function stopMic() {
    listener.current?.stop();
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setListening(false);
  }

  async function loadDraft(text: string) {
    const creds = serviceRef.current;
    if (!creds) return;
    setDraftBusy(true);
    setInterim(text);
    try {
      const res = await previewUtterance({
        data: { code: creds.code, hostToken: creds.token, text },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      setDraft({
        source: res.source,
        english: res.english,
        engine: res.engine,
        filtered: res.filtered,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not prepare that line.");
    } finally {
      setDraftBusy(false);
      setInterim("");
    }
  }

  async function enqueueOrPublish(text: string, english?: string) {
    if (!safeMode || english) {
      await publish(text, english);
      return;
    }
    if (draft || draftBusy) {
      queueRef.current.push(text);
      setQueued(queueRef.current.length);
      return;
    }
    await loadDraft(text);
  }

  async function confirmDraft() {
    if (!draft) return;
    const next = { ...draft };
    setDraft(null);
    await publish(next.source, next.english);
    const queuedLine = queueRef.current.shift();
    setQueued(queueRef.current.length);
    if (queuedLine) void loadDraft(queuedLine);
  }

  function discardDraft() {
    setDraft(null);
    const queuedLine = queueRef.current.shift();
    setQueued(queueRef.current.length);
    if (queuedLine) void loadDraft(queuedLine);
  }

  async function publish(text: string, english?: string) {
    if (!service || !hostToken) return;
    setInterim(text);
    try {
      const res = await publishUtterance({
        data: { code: service.code, hostToken, text, english },
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      if (!res.duplicate) setLines((prev) => [...prev, res.line]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish that line.");
    } finally {
      setInterim("");
    }
  }

  async function copy(kind: "code" | "hash" | "link", value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      toast.success("Copied");
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      toast.error("Could not copy");
    }
  }

  async function finish() {
    if (!service) return;
    stopMic();
    if (demoTimer.current) window.clearTimeout(demoTimer.current);
    await endService({ data: { code: service.code, hostToken } });
    setService((s) => (s ? { ...s, status: "ended" } : s));
    toast.success("Service ended");
  }

  if (phase === "setup") {
    return (
      <div className="flex min-h-dvh flex-col">
        <SiteHeader quiet />
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 py-10">
          <p className="text-xs tracking-[0.22em] text-muted uppercase">Host console</p>
          <h1 className="mt-3 font-display text-5xl tracking-tight">Begin the service</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Place this phone near the pulpit. A code and hashtag will appear for
            English speakers to join. Safe mode is on by default — you approve
            each line before the pews see it.
          </p>
          <div className="mt-8 space-y-2">
            <Label htmlFor="title">Service name</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sabbath service"
            />
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button size="xl" disabled={busy} onClick={() => void begin(false)}>
              <Mic />
              Start listening
            </Button>
            <Button
              size="xl"
              variant="outline"
              disabled={busy}
              onClick={() => void begin(true)}
            >
              Play a sample sermon
            </Button>
            {demo ? (
              <p className="text-xs text-muted">
                Sample mode streams a short Adventist pulpit reading so you can
                open the pew view on another phone.
              </p>
            ) : null}
          </div>
        </main>
      </div>
    );
  }

  if (!service) return null;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader quiet />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-8 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-8">
        <section className="flex min-h-[28rem] flex-col">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-live uppercase">
              <span className="woord-live-dot size-1.5 rounded-full bg-live" />
              {service.status === "live" ? "Live" : "Ended"}
            </span>
            <span className="text-xs text-subtle">{service.title}</span>
            <span className="text-xs text-subtle">
              {engines.gemini ? "Gemini Transcribe" : "On-device Afrikaans"}
              {" · "}
              {engines.grokTranslate ? "English by Grok" : "English by liturgy · lexicon"}
            </span>
            <button
              type="button"
              onClick={() => setSafeMode((v) => !v)}
              className="inline-flex h-11 items-center gap-1.5 rounded-full bg-elevated px-3 text-xs text-muted shadow-[var(--shadow-border)] hover:text-fg"
            >
              {safeMode ? <Shield className="size-3.5" /> : <Zap className="size-3.5" />}
              {safeMode ? "Safe · approve each line" : "Live · send as spoken"}
            </button>
          </div>
          <CaptionBoard lines={lines} pendingSource={interim} pendingEnglish={draftBusy ? "" : undefined} />

          {draft ? (
            <div className="mt-6 rounded-xl bg-elevated p-4 shadow-[var(--shadow-border)]">
              <p className="text-xs tracking-[0.18em] text-subtle uppercase">
                Review before the pews
                {queued ? ` · ${queued} waiting` : ""}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{draft.source}</p>
              <textarea
                value={draft.english}
                onChange={(e) => setDraft({ ...draft, english: e.target.value })}
                rows={3}
                aria-label="English caption"
                className="mt-3 w-full resize-y rounded-md bg-bg px-3 py-2 text-sm leading-relaxed text-fg shadow-[var(--shadow-border)] placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="mt-2 text-xs text-subtle">
                {draft.engine}
                {draft.filtered ? " · language held" : ""}
                {" · Afrikaans stays on the pew board"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => void confirmDraft()}>Send to pews</Button>
                <Button variant="ghost" onClick={discardDraft}>
                  Discard
                </Button>
              </div>
            </div>
          ) : draftBusy ? (
            <p className="mt-4 text-xs text-subtle">Preparing English…</p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5">
            <div className="flex flex-wrap items-center gap-3">
              {listening ? (
                <Button variant="danger" onClick={stopMic}>
                  <MicOff />
                  Stop mic
                </Button>
              ) : (
                <Button onClick={() => void startMic()} disabled={service.status !== "live"}>
                  <Mic />
                  Listen
                </Button>
              )}
              <Waveform stream={stream} active={listening} />
              <Button variant="ghost" onClick={() => void finish()}>
                <Square className="size-3.5 fill-current" />
                End
              </Button>
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!typed.trim()) return;
                void enqueueOrPublish(typed.trim());
                setTyped("");
              }}
            >
              <Input
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="Type a line if the mic is quiet"
                aria-label="Type a pulpit line"
              />
              <Button type="submit" variant="outline" size="icon" aria-label="Publish typed line">
                <Type />
              </Button>
            </form>
          </div>
        </section>

        <aside className="flex flex-col items-center gap-5 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] lg:p-6">
          <p className="text-xs tracking-[0.18em] text-subtle uppercase">Join this service</p>
          <p className="font-mono text-4xl tracking-[0.16em] text-fg">{formatCode(service.code)}</p>
          {joinUrl ? <QrPanel value={joinUrl} size={180} label="Scan to open English captions" /> : null}
          <div className="flex w-full flex-col gap-2">
            <CopyRow
              icon={copied === "code" ? Check : Copy}
              label={formatCode(service.code)}
              onClick={() => void copy("code", service.code)}
            />
            <CopyRow
              icon={copied === "hash" ? Check : Hash}
              label={service.hashtag}
              onClick={() => void copy("hash", service.hashtag)}
            />
            <CopyRow
              icon={copied === "link" ? Check : Copy}
              label="Copy pew link"
              onClick={() => void copy("link", joinUrl)}
            />
          </div>
          <Button asChild variant="outline" className="w-full">
            <a href={`/listen/${service.code}`} target="_blank" rel="noreferrer">
              Open pew view
            </a>
          </Button>
        </aside>
      </main>
    </div>
  );
}

function CopyRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Copy;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-between rounded-md bg-elevated px-3 text-left text-sm text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
    >
      <span className="truncate font-mono">{label}</span>
      <Icon className="size-4 text-muted" />
    </button>
  );
}
