import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QrPanel({
  value,
  size = 220,
  label,
}: {
  value: string;
  size?: number;
  label?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: { dark: "#121410", light: "#f2efe6" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  return (
    <figure className="flex flex-col items-center gap-3">
      <div
        className="rounded-lg bg-fg p-3"
        style={{ width: size + 24, height: size + 24 }}
      >
        {src ? (
          <img
            src={src}
            alt={label ?? "Join QR code"}
            width={size}
            height={size}
            className="block size-full"
          />
        ) : (
          <div className="size-full bg-accent/40" />
        )}
      </div>
      {label ? <figcaption className="text-xs text-muted">{label}</figcaption> : null}
    </figure>
  );
}
