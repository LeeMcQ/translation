import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button, r as cn, t as BrandMark } from "./button-BfwNXpAV.mjs";
import { a as normalizeCode, t as formatCode } from "./codes-DSoe9QJH.mjs";
import { c as Minus, s as Plus } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-tNruINeV.mjs";
import { n as useWakeLock, t as CaptionBoard } from "./wake-lock-txnbNpYH.mjs";
import { a as pollService, i as getServiceByCode } from "./service-api-B3XCw-cK.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listen._code-COhPV7tQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-11 w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow rounded-full bg-elevated",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full rounded-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-accent shadow-[var(--shadow-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" })]
	});
}
function ListenPage() {
	const { code: raw } = Route.useParams();
	const code = normalizeCode(raw);
	const [service, setService] = (0, import_react.useState)(null);
	const [lines, setLines] = (0, import_react.useState)([]);
	const [missing, setMissing] = (0, import_react.useState)(false);
	const [scale, setScale] = (0, import_react.useState)(1.15);
	const [showChrome, setShowChrome] = (0, import_react.useState)(true);
	useWakeLock(Boolean(service && service.status === "live"));
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		getServiceByCode({ data: {
			code,
			asListener: true
		} }).then((res) => {
			if (cancelled) return;
			if (!res.service) {
				setMissing(true);
				return;
			}
			setService(res.service);
			setLines(res.lines);
		});
		return () => {
			cancelled = true;
		};
	}, [code]);
	const sinceSeq = (0, import_react.useMemo)(() => lines.length ? lines[lines.length - 1].seq : 0, [lines]);
	(0, import_react.useEffect)(() => {
		if (!service || service.status !== "live") return;
		const tick = async () => {
			const res = await pollService({ data: {
				code,
				sinceSeq
			} });
			if (res.service) setService(res.service);
			if (res.lines.length) setLines((prev) => {
				const seen = new Set(prev.map((l) => l.id));
				const add = res.lines.filter((l) => !seen.has(l.id));
				return add.length ? [...prev, ...add] : prev;
			});
		};
		const id = window.setInterval(() => void tick(), 1400);
		return () => window.clearInterval(id);
	}, [
		code,
		service,
		sinceSeq
	]);
	if (missing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-8 font-display text-4xl",
				children: "Service not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-sm text-sm text-muted",
				children: "Check the six-character code on the foyer board. The host may not have started yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/join",
					children: "Try another code"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		onClick: () => setShowChrome((v) => !v),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: `flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 transition-opacity duration-150 ${showChrome ? "opacity-100" : "opacity-0"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [service?.status === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 text-xs tracking-[0.18em] text-live uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "woord-live-dot size-1.5 rounded-full bg-live" }), "Live"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-subtle",
						children: "Ended"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs tracking-widest text-muted",
						children: formatCode(code)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex flex-1 flex-col px-5 pb-4 sm:px-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptionBoard, {
					lines,
					scale,
					emptyLabel: service?.status === "ended" ? "This service has ended." : "Waiting for the pulpit."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: `flex items-center gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 transition-opacity duration-150 ${showChrome ? "opacity-100" : "pointer-events-none opacity-0"}`,
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon-sm",
						variant: "ghost",
						"aria-label": "Smaller type",
						onClick: () => setScale((s) => Math.max(.85, +(s - .1).toFixed(2))),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						min: .85,
						max: 1.8,
						step: .05,
						value: [scale],
						onValueChange: (v) => setScale(v[0] ?? 1),
						"aria-label": "Caption size"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon-sm",
						variant: "ghost",
						"aria-label": "Larger type",
						onClick: () => setScale((s) => Math.min(1.8, +(s + .1).toFixed(2))),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
					})
				]
			})
		]
	});
}
//#endregion
export { ListenPage as component };
