import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button } from "./button-BfwNXpAV.mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-header-yLA9h0K6.mjs";
import { g as ArrowRight, h as BookOpen, l as Mic, o as QrCode } from "../_libs/lucide-react.mjs";
import { t as DEMO_SERMON } from "./demo-sermon-C6cUqIJo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BhDk-jrU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-5 pb-16 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LivePreview, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Steps, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-10 pt-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:pt-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.22em] text-muted uppercase",
				children: "Sabbath live translation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-5 font-display text-5xl leading-[0.95] tracking-tight text-fg sm:text-7xl",
				children: ["The pulpit in Afrikaans.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-2 block italic text-muted",
					children: "The pew in English."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-md text-base leading-relaxed text-muted",
				children: "The host phone listens to the service. English speakers scan a code and read the live translation — quietly, in the dark, without missing the Word. Afrikaans never leaves the board."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-3 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/host",
						children: ["Host this Sabbath", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "xl",
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/join",
						children: "Join a service"
					})
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)] sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.18em] text-subtle uppercase",
					children: "On the host phone"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 font-mono text-4xl tracking-[0.18em] text-fg",
					children: "K7M 2HP"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "#WoordK7M2HP"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm leading-relaxed text-muted",
					children: "Project the code in the foyer, print it in the bulletin, or let visitors scan the QR from the last pew."
				})
			]
		})]
	});
}
function LivePreview() {
	const [i, setI] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const beat = DEMO_SERMON[i];
		const t = window.setTimeout(() => setI((n) => (n + 1) % DEMO_SERMON.length), beat?.afterMs ?? 4e3);
		return () => window.clearTimeout(t);
	}, [i]);
	const line = DEMO_SERMON[i];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-surface px-5 py-8 shadow-[var(--shadow-border)] sm:px-10 sm:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs tracking-[0.18em] text-live uppercase",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "woord-live-dot size-1.5 rounded-full bg-live" }), "Sample pulpit"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "sm",
					variant: "ghost",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/host",
						search: { demo: true },
						children: "Play full sample"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: line.af
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-3xl leading-snug tracking-tight text-fg sm:text-4xl",
				children: line.en
			})
		]
	});
}
function Steps() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "grid gap-4 sm:grid-cols-3",
		children: [
			{
				icon: Mic,
				title: "Host listens",
				body: "One phone at the front captures the Afrikaans pulpit. On-device dictation, the Adventist glossary, and Cape slang — then you approve the English."
			},
			{
				icon: QrCode,
				title: "Share the code",
				body: "A six-character code and hashtag appear the moment the service starts. Visitors scan or type it."
			},
			{
				icon: BookOpen,
				title: "Pews read along",
				body: "English captions fill a dim, large-type board. Afrikaans stays visible. Scripture is never invented. Foul language never prints."
			}
		].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
					className: "size-5 text-muted",
					strokeWidth: 1.5
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-2xl tracking-tight",
					children: item.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-muted",
					children: item.body
				})
			]
		}, item.title))
	});
}
//#endregion
export { Home as component };
