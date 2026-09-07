import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Hash } from "lucide-react";
import { toast } from "sonner";
import { CodeEntry } from "@/components/code-entry";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeCode } from "@/lib/codes";
import { getServiceByCode } from "@/lib/service-api";

export const Route = createFileRoute("/join")({ component: JoinPage });

function JoinPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [hash, setHash] = useState("");
  const [scanning, setScanning] = useState(false);

  async function go(raw: string) {
    const code = normalizeCode(raw);
    if (code.length < 6) {
      toast.error("Enter the six-character code from the host.");
      return;
    }
    setBusy(true);
    try {
      const res = await getServiceByCode({ data: { code } });
      if (!res.service) {
        toast.error("No live service uses that code.");
        return;
      }
      await navigate({ to: "/listen/$code", params: { code: res.service.code } });
    } finally {
      setBusy(false);
    }
  }

  async function scan() {
    const BD = (window as unknown as { BarcodeDetector?: new (opts: { formats: string[] }) => {
      detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string }>>;
    } }).BarcodeDetector;
    if (!BD) {
      toast.error("QR scanning needs Chrome or Edge. Type the code instead.");
      return;
    }
    setScanning(true);
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.setAttribute("playsinline", "true");
      await video.play();
      const detector = new BD({ formats: ["qr_code"] });
      const deadline = Date.now() + 20000;
      while (Date.now() < deadline) {
        const bitmap = await createImageBitmap(video);
        const codes = await detector.detect(bitmap);
        bitmap.close();
        const raw = codes[0]?.rawValue;
        if (raw) {
          const match = raw.match(/listen\/([A-Z0-9]{6})/i) ?? raw.match(/([A-Z0-9]{6})/i);
          if (match?.[1]) {
            await go(match[1]);
            return;
          }
        }
        await new Promise((r) => setTimeout(r, 250));
      }
      toast.error("No QR found. Type the code.");
    } catch {
      toast.error("Camera is unavailable.");
    } finally {
      stream?.getTracks().forEach((t) => t.stop());
      setScanning(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader quiet />
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
        <p className="text-xs tracking-[0.22em] text-muted uppercase">English pew</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight">Join the service</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enter the code on the foyer board, or the hashtag announced when the
          service began.
        </p>
        <div className="mt-10">
          <CodeEntry onSubmit={(c) => void go(c)} disabled={busy} />
        </div>
        <form
          className="mt-8 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            void go(hash);
          }}
        >
          <label className="text-xs text-muted" htmlFor="hash">
            Or paste the hashtag
          </label>
          <div className="flex gap-2">
            <Input
              id="hash"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="#WoordK7M2HP"
            />
            <Button type="submit" variant="outline" size="icon" aria-label="Join with hashtag">
              <Hash />
            </Button>
          </div>
        </form>
        <Button
          className="mt-6"
          variant="ghost"
          disabled={scanning}
          onClick={() => void scan()}
        >
          <Camera />
          {scanning ? "Scanning…" : "Scan QR"}
        </Button>
      </main>
    </div>
  );
}
