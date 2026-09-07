import { Link, useRouterState } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/how", label: "How it works" },
  { to: "/glossary", label: "Glossary" },
] as const;

export function SiteHeader({ quiet = false }: { quiet?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header
      className={cn(
        "flex items-center justify-between gap-4 px-5 py-4 sm:px-8",
        quiet && "border-b border-border",
      )}
    >
      <BrandMark size="sm" />
      <nav className="flex items-center gap-1 sm:gap-2">
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "hidden h-11 items-center px-3 text-sm text-muted hover:text-fg sm:inline-flex",
              pathname === item.to && "text-fg",
            )}
          >
            {item.label}
          </Link>
        ))}
        {!quiet && (
          <Button asChild size="sm" variant="outline">
            <Link to="/host">Host</Link>
          </Button>
        )}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-5 py-10 text-center text-xs text-subtle sm:px-8">
      Woord · Afrikaans pulpit, English pew · Seventh-day Adventist live translation
    </footer>
  );
}
