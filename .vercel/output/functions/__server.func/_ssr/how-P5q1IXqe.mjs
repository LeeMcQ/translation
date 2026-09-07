import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./button-BfwNXpAV.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-header-yLA9h0K6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/how-P5q1IXqe.js
var import_jsx_runtime = require_jsx_runtime();
function HowPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-2xl flex-1 px-5 pb-16 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pt-4 text-xs tracking-[0.22em] text-muted uppercase",
						children: "For deacons and hosts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-5xl tracking-tight sm:text-6xl",
						children: "How a Sabbath service runs on Woord"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl tracking-tight",
							children: "1. One host phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "Place a single phone near the pulpit — aisle-side of the first pew is enough. Open Woord, tap Host, and start listening. Chrome on Android hears Afrikaans most reliably. If the sanctuary is loud, the host can type a line instead."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl tracking-tight",
							children: "2. A code and a hashtag"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "The moment the service starts, Woord issues a six-character code and a hashtag such as #WoordK7M2HP. Project the QR in the foyer, print it in the bulletin, or announce the hashtag after the opening hymn. English speakers type or scan it on their own phones."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl tracking-tight",
							children: "3. Quiet captions in the pew"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "The pew view is dim on purpose — a bright screen in a dark sanctuary is a ministry problem. Afrikaans always stays on the board, small above the English. If English is still catching up, the Afrikaans itself is shown large. Type size is adjustable. The phone stays awake so nobody unlocks mid-sermon."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl tracking-tight",
							children: "Safe mode"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "Safe mode is on by default. Each sentence is translated, then held for the host to read, edit, or discard before it reaches the pews. Switch to Live only when you trust the line. A wrong caption is worse than a late one."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl tracking-tight",
							children: "The Adventist lexicon — and Kaaps"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "Live translation is not generic church English. Woord carries a dictionary of Seventh-day Adventist terms — heiligdom, laatreën, ondersoekende oordeel, Padfinders — plus Cape Afrikaans, Kaaps, and South African English the pulpit actually uses: lekker, eish, ja-nee, mos, nè, tannie, nou-nou. Foul language and slurs are stripped before anything reaches a pew."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl tracking-tight",
							children: "Scripture is not invented"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "When the pulpit reads a passage, Woord does not machine-translate the verse. Afrikaans stays on the board and English speakers are pointed to the reference in their own Bible. Liturgy — Amen, Laat ons bid, the Aaronic blessing — is pinned, not guessed."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl tracking-tight",
							children: "What hears the pulpit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "On the host phone, Afrikaans is captured with on-device speech recognition so the sanctuary audio never has to leave the device as a live stream. When Gemini 3.5 Transcribe is configured, short audio is refined against the Adventist custom vocabulary. English is produced by Grok when a key is present; otherwise the liturgy list, Adventist glossary, and Kaaps lexicon fill the pew so English is never blank."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl tracking-tight",
							children: "Install it"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "Woord is a progressive web app. On a phone, add it to the home screen so the host and the pews open without a browser chrome. No accounts. The code is the door."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 flex flex-col gap-3 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/host",
								children: "Host this Sabbath"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/glossary",
								children: "Read the glossary"
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { HowPage as component };
