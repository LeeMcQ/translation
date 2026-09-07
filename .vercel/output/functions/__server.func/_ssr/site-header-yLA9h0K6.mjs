import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button, r as cn, t as BrandMark } from "./button-BfwNXpAV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-header-yLA9h0K6.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [{
	to: "/how",
	label: "How it works"
}, {
	to: "/glossary",
	label: "Glossary"
}];
function SiteHeader({ quiet = false }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("flex items-center justify-between gap-4 px-5 py-4 sm:px-8", quiet && "border-b border-border"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "flex items-center gap-1 sm:gap-2",
			children: [NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: item.to,
				className: cn("hidden h-11 items-center px-3 text-sm text-muted hover:text-fg sm:inline-flex", pathname === item.to && "text-fg"),
				children: item.label
			}, item.to)), !quiet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				size: "sm",
				variant: "outline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/host",
					children: "Host"
				})
			})]
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "px-5 py-10 text-center text-xs text-subtle sm:px-8",
		children: "Woord · Afrikaans pulpit, English pew · Seventh-day Adventist live translation"
	});
}
//#endregion
export { SiteHeader as n, SiteFooter as t };
