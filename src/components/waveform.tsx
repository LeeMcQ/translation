import { useEffect, useRef } from "react";

export function Waveform({ stream, active }: { stream: MediaStream | null; active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !stream || !active) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const audio = new AudioContext();
    const source = audio.createMediaStreamSource(stream);
    const analyser = audio.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    let raf = 0;
    const accent = getComputedStyle(canvas).getPropertyValue("--color-accent").trim() || "#d8d6cc";

    const draw = () => {
      analyser.getByteFrequencyData(data);
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const bars = 16;
      const gap = 4;
      const bw = (width - gap * (bars - 1)) / bars;
      for (let i = 0; i < bars; i += 1) {
        const v = data[i] ?? 0;
        const h = Math.max(3, (v / 255) * height);
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.35 + (v / 255) * 0.65;
        ctx.fillRect(i * (bw + gap), height - h, bw, h);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      void audio.close();
    };
  }, [stream, active]);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={36}
      className="h-9 w-40"
      aria-hidden
    />
  );
}
