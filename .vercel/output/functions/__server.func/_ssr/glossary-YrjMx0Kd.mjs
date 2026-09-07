import { o as __toESM } from "../_runtime.mjs";
import { d as searchGlossary, n as GLOSSARY_CATEGORIES, t as GLOSSARY } from "./glossary-DX6QCLIT.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as SiteHeader, t as SiteFooter } from "./site-header-yLA9h0K6.mjs";
import { t as Input } from "./input-CR9xZWT9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/glossary-YrjMx0Kd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GlossaryPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	const results = (0, import_react.useMemo)(() => {
		const found = searchGlossary(q);
		if (cat === "All") return found;
		return found.filter((e) => e.category === cat);
	}, [q, cat]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-4xl flex-1 px-5 pb-16 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pt-4 text-xs tracking-[0.22em] text-muted uppercase",
						children: "Adventist lexicon"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-5xl tracking-tight sm:text-6xl",
						children: "Common pulpit words"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-sm leading-relaxed text-muted",
						children: "Woord keeps this dictionary beside the translator so Sabbath School, the three angels, and the sanctuary are rendered the way Adventists actually speak — including Cape Afrikaans, Kaaps, and South African English from the pulpit, not generic church English."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search Afrikaans, Kaaps, or English",
							"aria-label": "Search glossary"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: ["All", ...GLOSSARY_CATEGORIES].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCat(c),
							className: `h-9 rounded-full px-3 text-sm ${cat === c ? "bg-accent text-accent-fg" : "bg-elevated text-muted shadow-[var(--shadow-border)]"}`,
							children: c
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-xs text-subtle",
						children: [
							results.length,
							" of ",
							GLOSSARY.length,
							" terms"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 divide-y divide-border",
						children: results.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "grid grid-cols-[1fr_1fr] gap-4 py-3 sm:grid-cols-[1.1fr_1fr_8rem]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-fg",
									children: [e.af, e.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs text-subtle",
										children: e.note
									}) : null]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: e.en
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden text-xs text-subtle sm:block",
									children: e.category
								})
							]
						}, `${e.af}-${e.en}-${e.category}`))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { GlossaryPage as component };
