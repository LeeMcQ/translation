import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn } from "./button-BfwNXpAV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wake-lock-txnbNpYH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SCRIPTURE_MARK = "we do not invent Scripture";
function CaptionBoard({ lines, pendingSource, pendingEnglish, scale = 1, emptyLabel = "Waiting for the pulpit." }) {
	const latest = lines[lines.length - 1];
	const previous = lines.slice(Math.max(0, lines.length - 6), -1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col justify-end gap-8",
		style: { fontSize: `${scale}rem` },
		children: [
			previous.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptionBlock, {
				source: line.sourceText,
				english: line.translatedText,
				dim: true
			}, line.id)),
			latest ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptionBlock, {
				source: latest.sourceText,
				english: latest.translatedText
			}, latest.id) : null,
			pendingSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptionBlock, {
				source: pendingSource,
				english: pendingEnglish ?? "",
				pending: true
			}) : null,
			!latest && !pendingSource ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-[1.35em] leading-snug text-subtle",
				children: emptyLabel
			}) : null
		]
	});
}
function splitEnglish(english) {
	if (!english.includes(SCRIPTURE_MARK)) return {
		caption: english,
		banner: null
	};
	const idx = english.lastIndexOf("Open ");
	if (idx > 0) return {
		caption: english.slice(0, idx).replace(/\s*·\s*$/, "").trim(),
		banner: english.slice(idx).trim()
	};
	return {
		caption: "",
		banner: english
	};
}
function CaptionBlock({ source, english, dim, pending }) {
	const { caption, banner } = splitEnglish(english);
	const same = caption.trim().toLowerCase() === source.trim().toLowerCase();
	const showEnglish = Boolean(caption) && !same;
	const afrikaansIsLead = !showEnglish;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("woord-rise max-w-3xl", dim && "opacity-55", pending && "opacity-70"),
		children: [
			afrikaansIsLead ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-[1.35em] leading-[1.25] tracking-tight text-fg",
				children: source
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[0.72em] leading-relaxed text-muted",
				children: source
			}),
			showEnglish ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-[1.35em] leading-[1.25] tracking-tight text-fg",
				children: caption
			}) : pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "woord-shimmer mt-2 font-display text-[1.05em] leading-snug",
				children: "Translating — Afrikaans stays on screen"
			}) : !banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-[0.72em] leading-relaxed text-subtle",
				children: "Afrikaans is the source of truth"
			}) : null,
			banner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-[0.78em] leading-relaxed text-muted italic",
				children: banner
			}) : null
		]
	});
}
/** Keep the pew phone awake during a live service. */
function useWakeLock(active) {
	(0, import_react.useEffect)(() => {
		if (!active || typeof navigator === "undefined") return;
		const lock = navigator.wakeLock;
		if (!lock) return;
		let sentinel = null;
		let cancelled = false;
		const request = async () => {
			try {
				sentinel = await lock.request("screen");
			} catch {}
		};
		request();
		const onVis = () => {
			if (document.visibilityState === "visible" && !cancelled) request();
		};
		document.addEventListener("visibilitychange", onVis);
		return () => {
			cancelled = true;
			document.removeEventListener("visibilitychange", onVis);
			sentinel?.release();
		};
	}, [active]);
}
//#endregion
export { useWakeLock as n, CaptionBoard as t };
