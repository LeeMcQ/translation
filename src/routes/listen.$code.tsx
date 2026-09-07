import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { CaptionBoard } from "@/components/caption-board";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useWakeLock } from "@/components/wake-lock";
import { formatCode, normalizeCode } from "@/lib/codes";
import { getServiceByCode, pollService, type PublicService, type TranscriptLine } from "@/lib/service-api";

export const Route = createFileRoute("/listen/$code")({
  component: ListenPage,
});

function ListenPage() {
  const { code: raw } = Route.useParams();
  const code = normalizeCode(raw);
  const [service, setService] = useState<PublicService | null>(null);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [missing, setMissing] = useState(false);
  const [scale, setScale] = useState(1.15);
  const [showChrome, setShowChrome] = useState(true);

  useWakeLock(Boolean(service && service.status === "live"));

  useEffect(() => {
    let cancelled = false;
    void getServiceByCode({ data: { code, asListener: true } }).then((res) => {
      if (cancelled) return;
      if (!res.service) {
        setMissing(true);
        return;
      }
      setService(res.service);
      setLines(res.lines);
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const sinceSeq = useMemo(
    () => (lines.length ? lines[lines.length - 1].seq : 0),
    [lines],
  );

  useEffect(() => {
    if (!service || service.status !== "live") return;
    const tick = async () => {
      const res = await pollService({ data: { code, sinceSeq } });
      if (res.service) setService(res.service);
      if (res.lines.length) {
        setLines((prev) => {
          const seen = new Set(prev.map((l) => l.id));
          const add = res.lines.filter((l) => !seen.has(l.id));
          return add.length ? [...prev, ...add] : prev;
        });
      }
    };
    const id = window.setInterval(() => void tick(), 1400);
    return () => window.clearInterval(id);
  }, [code, service, sinceSeq]);

  if (missing) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <BrandMark />
        <h1 className="mt-8 font-display text-4xl">Service not found</h1>
        <p className="mt-3 max-w-sm text-sm text-muted">
          Check the six-character code on the foyer board. The host may not have
          started yet.
        </p>
        <Button asChild className="mt-8">
          <Link to="/join">Try another code</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-dvh flex-col"
      onClick={() => setShowChrome((v) => !v)}
    >
      <header
        className={`flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 transition-opacity duration-150 ${showChrome ? "opacity-100" : "opacity-0"}`}
      >
        <BrandMark size="sm" />
        <div className="flex items-center gap-3">
          {service?.status === "live" ? (
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.18em] text-live uppercase">
              <span className="woord-live-dot size-1.5 rounded-full bg-live" />
              Live
            </span>
          ) : (
            <span className="text-xs text-subtle">Ended</span>
          )}
          <span className="font-mono text-xs tracking-widest text-muted">
            {formatCode(code)}
          </span>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-5 pb-4 sm:px-10">
        <CaptionBoard
          lines={lines}
          scale={scale}
          emptyLabel={
            service?.status === "ended"
              ? "This service has ended."
              : "Waiting for the pulpit."
          }
        />
      </main>

      <footer
        className={`flex items-center gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 transition-opacity duration-150 ${showChrome ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Smaller type"
          onClick={() => setScale((s) => Math.max(0.85, +(s - 0.1).toFixed(2)))}
        >
          <Minus />
        </Button>
        <Slider
          min={0.85}
          max={1.8}
          step={0.05}
          value={[scale]}
          onValueChange={(v) => setScale(v[0] ?? 1)}
          aria-label="Caption size"
        />
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Larger type"
          onClick={() => setScale((s) => Math.min(1.8, +(s + 0.1).toFixed(2)))}
        >
          <Plus />
        </Button>
      </footer>
    </div>
  );
}
