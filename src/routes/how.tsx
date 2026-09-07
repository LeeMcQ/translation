import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how")({ component: HowPage });

function HowPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-16 sm:px-8">
        <p className="pt-4 text-xs tracking-[0.22em] text-muted uppercase">
          For deacons and hosts
        </p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">
          How a Sabbath service runs on Woord
        </h1>

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-3xl tracking-tight">1. One host phone</h2>
          <p className="text-sm leading-relaxed text-muted">
            Place a single phone near the pulpit — aisle-side of the first pew
            is enough. Open Woord, tap Host, and start listening. Chrome on
            Android hears Afrikaans most reliably. If the sanctuary is loud,
            the host can type a line instead.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-3xl tracking-tight">2. A code and a hashtag</h2>
          <p className="text-sm leading-relaxed text-muted">
            The moment the service starts, Woord issues a six-character code
            and a hashtag such as #WoordK7M2HP. Project the QR in the foyer,
            print it in the bulletin, or announce the hashtag after the
            opening hymn. English speakers type or scan it on their own phones.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-3xl tracking-tight">3. Quiet captions in the pew</h2>
          <p className="text-sm leading-relaxed text-muted">
            The pew view is dim on purpose — a bright screen in a dark
            sanctuary is a ministry problem. Afrikaans always stays on the
            board, small above the English. If English is still catching up,
            the Afrikaans itself is shown large. Type size is adjustable. The
            phone stays awake so nobody unlocks mid-sermon.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-3xl tracking-tight">Safe mode</h2>
          <p className="text-sm leading-relaxed text-muted">
            Safe mode is on by default. Each sentence is translated, then held
            for the host to read, edit, or discard before it reaches the pews.
            Switch to Live only when you trust the line. A wrong caption is
            worse than a late one.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-3xl tracking-tight">The Adventist lexicon — and Kaaps</h2>
          <p className="text-sm leading-relaxed text-muted">
            Live translation is not generic church English. Woord carries a
            dictionary of Seventh-day Adventist terms — heiligdom, laatreën,
            ondersoekende oordeel, Padfinders — plus Cape Afrikaans, Kaaps,
            and South African English the pulpit actually uses: lekker, eish,
            ja-nee, mos, nè, tannie, nou-nou. Foul language and slurs are
            stripped before anything reaches a pew.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-3xl tracking-tight">Scripture is not invented</h2>
          <p className="text-sm leading-relaxed text-muted">
            When the pulpit reads a passage, Woord does not machine-translate
            the verse. Afrikaans stays on the board and English speakers are
            pointed to the reference in their own Bible. Liturgy — Amen, Laat
            ons bid, the Aaronic blessing — is pinned, not guessed.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-3xl tracking-tight">What hears the pulpit</h2>
          <p className="text-sm leading-relaxed text-muted">
            On the host phone, Afrikaans is captured with on-device speech
            recognition so the sanctuary audio never has to leave the device
            as a live stream. When Gemini 3.5 Transcribe is configured, short
            audio is refined against the Adventist custom vocabulary. English
            is produced by Grok when a key is present; otherwise the liturgy
            list, Adventist glossary, and Kaaps lexicon fill the pew so
            English is never blank.
          </p>
        </section>

        <section className="mt-10 space-y-3">
          <h2 className="font-display text-3xl tracking-tight">Install it</h2>
          <p className="text-sm leading-relaxed text-muted">
            Woord is a progressive web app. On a phone, add it to the home
            screen so the host and the pews open without a browser chrome.
            No accounts. The code is the door.
          </p>
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/host">Host this Sabbath</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/glossary">Read the glossary</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
