import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, Mic, QrCode } from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { DEMO_SERMON } from "@/lib/demo-sermon";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-5 pb-16 sm:px-8">
        <Hero />
        <LivePreview />
        <Steps />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="grid gap-10 pt-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:pt-14">
      <div>
        <p className="text-xs tracking-[0.22em] text-muted uppercase">
          Sabbath live translation
        </p>
        <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-tight text-fg sm:text-7xl">
          The pulpit in Afrikaans.
          <span className="mt-2 block italic text-muted">The pew in English.</span>
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
          The host phone listens to the service. English speakers scan a code
          and read the live translation — quietly, in the dark, without missing
          the Word. Afrikaans never leaves the board.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="xl">
            <Link to="/host">
              Host this Sabbath
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline">
            <Link to="/join">Join a service</Link>
          </Button>
        </div>
      </div>
      <aside className="rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)] sm:p-8">
        <p className="text-xs tracking-[0.18em] text-subtle uppercase">On the host phone</p>
        <p className="mt-4 font-mono text-4xl tracking-[0.18em] text-fg">K7M 2HP</p>
        <p className="mt-2 text-sm text-muted">#WoordK7M2HP</p>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Project the code in the foyer, print it in the bulletin, or let
          visitors scan the QR from the last pew.
        </p>
      </aside>
    </section>
  );
}

function LivePreview() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const beat = DEMO_SERMON[i];
    const t = window.setTimeout(
      () => setI((n) => (n + 1) % DEMO_SERMON.length),
      beat?.afterMs ?? 4000,
    );
    return () => window.clearTimeout(t);
  }, [i]);
  const line = DEMO_SERMON[i];

  return (
    <section className="rounded-2xl bg-surface px-5 py-8 shadow-[var(--shadow-border)] sm:px-10 sm:py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs tracking-[0.18em] text-live uppercase">
          <span className="woord-live-dot size-1.5 rounded-full bg-live" />
          Sample pulpit
        </div>
        <Button asChild size="sm" variant="ghost">
          <Link to="/host" search={{ demo: true }}>
            Play full sample
          </Link>
        </Button>
      </div>
      <p className="text-sm leading-relaxed text-muted">{line.af}</p>
      <p className="mt-3 font-display text-3xl leading-snug tracking-tight text-fg sm:text-4xl">
        {line.en}
      </p>
    </section>
  );
}

function Steps() {
  const items = [
    {
      icon: Mic,
      title: "Host listens",
      body: "One phone at the front captures the Afrikaans pulpit. On-device dictation, the Adventist glossary, and Cape slang — then you approve the English.",
    },
    {
      icon: QrCode,
      title: "Share the code",
      body: "A six-character code and hashtag appear the moment the service starts. Visitors scan or type it.",
    },
    {
      icon: BookOpen,
      title: "Pews read along",
      body: "English captions fill a dim, large-type board. Afrikaans stays visible. Scripture is never invented. Foul language never prints.",
    },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <article key={item.title} className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <item.icon className="size-5 text-muted" strokeWidth={1.5} />
          <h2 className="mt-4 font-display text-2xl tracking-tight">{item.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
        </article>
      ))}
    </section>
  );
}
