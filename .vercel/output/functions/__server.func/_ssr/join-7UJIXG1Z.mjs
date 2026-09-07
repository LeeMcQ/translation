import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Button, r as cn } from "./button-BfwNXpAV.mjs";
import { n as SiteHeader } from "./site-header-yLA9h0K6.mjs";
import { t as Input } from "./input-CR9xZWT9.mjs";
import { a as normalizeCode } from "./codes-DSoe9QJH.mjs";
import { d as Hash, m as Camera } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as getServiceByCode } from "./service-api-B3XCw-cK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join-7UJIXG1Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CodeEntry({ onSubmit, disabled }) {
	const [chars, setChars] = (0, import_react.useState)([
		"",
		"",
		"",
		"",
		"",
		""
	]);
	const refs = (0, import_react.useRef)([]);
	const commit = (next) => {
		setChars(next);
		const joined = next.join("");
		if (joined.length === 6) onSubmit(joined);
	};
	const applyRaw = (raw, from = 0) => {
		const clean = normalizeCode(raw);
		if (!clean) return;
		const next = [...chars];
		for (let i = 0; i < clean.length && from + i < 6; i += 1) next[from + i] = clean[i] ?? "";
		commit(next);
		const focusAt = Math.min(from + clean.length, 5);
		refs.current[focusAt]?.focus();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center gap-2",
		children: chars.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			ref: (el) => {
				refs.current[i] = el;
			},
			value: ch,
			disabled,
			inputMode: "text",
			autoComplete: "off",
			autoCapitalize: "characters",
			maxLength: 1,
			"aria-label": `Code digit ${i + 1}`,
			className: cn("h-14 w-11 rounded-md bg-elevated text-center font-mono text-xl tracking-widest text-fg shadow-[var(--shadow-border)]", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", i === 3 && "ml-2"),
			onChange: (e) => applyRaw(e.target.value, i),
			onKeyDown: (e) => {
				if (e.key === "Backspace" && !chars[i] && i > 0) refs.current[i - 1]?.focus();
				if (e.key === "Enter") {
					const joined = chars.join("");
					if (joined.length === 6) onSubmit(joined);
				}
			},
			onPaste: (e) => {
				e.preventDefault();
				applyRaw(e.clipboardData.getData("text"), 0);
			}
		}, i))
	});
}
function JoinPage() {
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [hash, setHash] = (0, import_react.useState)("");
	const [scanning, setScanning] = (0, import_react.useState)(false);
	async function go(raw) {
		const code = normalizeCode(raw);
		if (code.length < 6) {
			toast.error("Enter the six-character code from the host.");
			return;
		}
		setBusy(true);
		try {
			const res = await getServiceByCode({ data: { code } });
			if (!res.service) {
				toast.error("No live service uses that code.");
				return;
			}
			await navigate({
				to: "/listen/$code",
				params: { code: res.service.code }
			});
		} finally {
			setBusy(false);
		}
	}
	async function scan() {
		const BD = window.BarcodeDetector;
		if (!BD) {
			toast.error("QR scanning needs Chrome or Edge. Type the code instead.");
			return;
		}
		setScanning(true);
		let stream = null;
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
			const video = document.createElement("video");
			video.srcObject = stream;
			video.setAttribute("playsinline", "true");
			await video.play();
			const detector = new BD({ formats: ["qr_code"] });
			const deadline = Date.now() + 2e4;
			while (Date.now() < deadline) {
				const bitmap = await createImageBitmap(video);
				const codes = await detector.detect(bitmap);
				bitmap.close();
				const raw = codes[0]?.rawValue;
				if (raw) {
					const match = raw.match(/listen\/([A-Z0-9]{6})/i) ?? raw.match(/([A-Z0-9]{6})/i);
					if (match?.[1]) {
						await go(match[1]);
						return;
					}
				}
				await new Promise((r) => setTimeout(r, 250));
			}
			toast.error("No QR found. Type the code.");
		} catch {
			toast.error("Camera is unavailable.");
		} finally {
			stream?.getTracks().forEach((t) => t.stop());
			setScanning(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { quiet: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted uppercase",
					children: "English pew"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-5xl tracking-tight",
					children: "Join the service"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: "Enter the code on the foyer board, or the hashtag announced when the service began."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeEntry, {
						onSubmit: (c) => void go(c),
						disabled: busy
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 space-y-2",
					onSubmit: (e) => {
						e.preventDefault();
						go(hash);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs text-muted",
						htmlFor: "hash",
						children: "Or paste the hashtag"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "hash",
							value: hash,
							onChange: (e) => setHash(e.target.value),
							placeholder: "#WoordK7M2HP"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "outline",
							size: "icon",
							"aria-label": "Join with hashtag",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, {})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-6",
					variant: "ghost",
					disabled: scanning,
					onClick: () => void scan(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {}), scanning ? "Scanning…" : "Scan QR"]
				})
			]
		})]
	});
}
//#endregion
export { JoinPage as component };
