import { useRef, useState } from "react";
import { normalizeCode } from "@/lib/codes";
import { cn } from "@/lib/utils";

export function CodeEntry({
  onSubmit,
  disabled,
}: {
  onSubmit: (code: string) => void;
  disabled?: boolean;
}) {
  const [chars, setChars] = useState<string[]>(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const commit = (next: string[]) => {
    setChars(next);
    const joined = next.join("");
    if (joined.length === 6) onSubmit(joined);
  };

  const applyRaw = (raw: string, from = 0) => {
    const clean = normalizeCode(raw);
    if (!clean) return;
    const next = [...chars];
    for (let i = 0; i < clean.length && from + i < 6; i += 1) {
      next[from + i] = clean[i] ?? "";
    }
    commit(next);
    const focusAt = Math.min(from + clean.length, 5);
    refs.current[focusAt]?.focus();
  };

  return (
    <div className="flex justify-center gap-2">
      {chars.map((ch, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={ch}
          disabled={disabled}
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          maxLength={1}
          aria-label={`Code digit ${i + 1}`}
          className={cn(
            "h-14 w-11 rounded-md bg-elevated text-center font-mono text-xl tracking-widest text-fg shadow-[var(--shadow-border)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            i === 3 && "ml-2",
          )}
          onChange={(e) => applyRaw(e.target.value, i)}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !chars[i] && i > 0) {
              refs.current[i - 1]?.focus();
            }
            if (e.key === "Enter") {
              const joined = chars.join("");
              if (joined.length === 6) onSubmit(joined);
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            applyRaw(e.clipboardData.getData("text"), 0);
          }}
        />
      ))}
    </div>
  );
}
