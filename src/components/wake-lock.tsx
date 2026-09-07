import { useEffect } from "react";

type Sentinel = { release: () => Promise<void> };

/** Keep the pew phone awake during a live service. */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || typeof navigator === "undefined") return;
    const lock = (
      navigator as Navigator & {
        wakeLock?: { request: (type: "screen") => Promise<Sentinel> };
      }
    ).wakeLock;
    if (!lock) return;

    let sentinel: Sentinel | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        sentinel = await lock.request("screen");
      } catch {
        /* unsupported or battery saver */
      }
    };

    void request();
    const onVis = () => {
      if (document.visibilityState === "visible" && !cancelled) void request();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
      void sentinel?.release();
    };
  }, [active]);
}
