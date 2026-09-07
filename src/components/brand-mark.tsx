import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const type =
    size === "lg"
      ? "text-4xl"
      : size === "sm"
        ? "text-xl"
        : "text-2xl";
  return (
    <Link
      to="/"
      className={cn("inline-flex items-baseline gap-2.5 text-fg no-underline", className)}
    >
      <span
        aria-hidden
        className="inline-block h-[0.85em] w-px bg-accent"
      />
      <span className={cn("font-display font-medium tracking-tight", type)}>Woord</span>
    </Link>
  );
}
