import { o as __toESM } from "../_runtime.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Button, r as cn } from "./button-BfwNXpAV.mjs";
import { n as SiteHeader } from "./site-header-yLA9h0K6.mjs";
import { t as Input } from "./input-CR9xZWT9.mjs";
import { o as rememberHost, t as formatCode } from "./codes-DSoe9QJH.mjs";
import { a as Shield, d as Hash, f as Copy, i as Square, l as Mic, n as Type, p as Check, t as Zap, u as MicOff } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$3 } from "./router-tNruINeV.mjs";
import { n as useWakeLock, t as CaptionBoard } from "./wake-lock-txnbNpYH.mjs";
import { t as DEMO_SERMON } from "./demo-sermon-C6cUqIJo.mjs";
import { n as endService, o as previewUtterance, r as getEngines, s as publishUtterance, t as createService } from "./service-api-B3XCw-cK.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/host-wpkR2Ddm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function QrPanel({ value, size = 220, label }) {
	const [src, setSrc] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import_lib.toDataURL(value, {
			width: size * 2,
			margin: 1,
			color: {
				dark: "#121410",
				light: "#f2efe6"
			},
			errorCorrectionLevel: "M"
		}).then((url) => {
			if (!cancelled) setSrc(url);
		}).catch(() => {
			if (!cancelled) setSrc(null);
		});
		return () => {
			cancelled = true;
		};
	}, [value, size]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "flex flex-col items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg bg-fg p-3",
			style: {
				width: size + 24,
				height: size + 24
			},
			children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: label ?? "Join QR code",
				width: size,
				height: size,
				className: "block size-full"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-accent/40" })
		}), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
			className: "text-xs text-muted",
			children: label
		}) : null]
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-sm font-medium text-muted", className),
		...props
	});
}
function Waveform({ stream, active }) {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas || !stream || !active) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const audio = new AudioContext();
		const source = audio.createMediaStreamSource(stream);
		const analyser = audio.createAnalyser();
		analyser.fftSize = 64;
		source.connect(analyser);
		const data = new Uint8Array(analyser.frequencyBinCount);
		let raf = 0;
		const accent = getComputedStyle(canvas).getPropertyValue("--color-accent").trim() || "#d8d6cc";
		const draw = () => {
			analyser.getByteFrequencyData(data);
			const { width, height } = canvas;
			ctx.clearRect(0, 0, width, height);
			const bars = 16;
			const gap = 4;
			const bw = (width - 60) / bars;
			for (let i = 0; i < bars; i += 1) {
				const v = data[i] ?? 0;
				const h = Math.max(3, v / 255 * height);
				ctx.fillStyle = accent;
				ctx.globalAlpha = .35 + v / 255 * .65;
				ctx.fillRect(i * (bw + gap), height - h, bw, h);
			}
			ctx.globalAlpha = 1;
			raf = requestAnimationFrame(draw);
		};
		draw();
		return () => {
			cancelAnimationFrame(raf);
			audio.close();
		};
	}, [stream, active]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		width: 220,
		height: 36,
		className: "h-9 w-40",
		"aria-hidden": true
	});
}
function getCtor() {
	if (typeof window === "undefined") return null;
	const w = window;
	return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}
function speechSupported() {
	return getCtor() !== null;
}
function createAfrikaansListener(handlers) {
	const Ctor = getCtor();
	if (!Ctor) return {
		supported: false,
		start: () => handlers.onError("Speech recognition is not available in this browser."),
		stop: () => void 0
	};
	let recog = null;
	let running = false;
	let buffer = "";
	let silenceTimer = null;
	const SILENCE_MS = 1400;
	const flush = () => {
		const text = buffer.trim();
		buffer = "";
		if (text) handlers.onFinal(text);
	};
	const armSilence = () => {
		if (silenceTimer) window.clearTimeout(silenceTimer);
		silenceTimer = window.setTimeout(() => {
			flush();
		}, SILENCE_MS);
	};
	const attach = () => {
		const r = new Ctor();
		r.lang = "af-ZA";
		r.continuous = true;
		r.interimResults = true;
		r.maxAlternatives = 1;
		r.onresult = (ev) => {
			let interim = "";
			for (let i = ev.resultIndex; i < ev.results.length; i += 1) {
				const piece = ev.results[i][0]?.transcript ?? "";
				if (ev.results[i].isFinal) {
					buffer = `${buffer} ${piece}`.trim();
					armSilence();
				} else interim += piece;
			}
			const live = `${buffer} ${interim}`.trim();
			if (live) handlers.onInterim(live);
		};
		r.onerror = (ev) => {
			if (ev.error === "no-speech" || ev.error === "aborted") return;
			if (ev.error === "not-allowed") {
				running = false;
				handlers.onError("Microphone permission was denied.");
				handlers.onStop?.();
				return;
			}
			handlers.onError(`Microphone error: ${ev.error}`);
		};
		r.onend = () => {
			if (!running) {
				handlers.onStop?.();
				return;
			}
			try {
				r.start();
			} catch {
				window.setTimeout(() => {
					if (running) try {
						r.start();
					} catch {}
				}, 240);
			}
		};
		recog = r;
	};
	return {
		supported: true,
		start: () => {
			if (running) return;
			attach();
			running = true;
			buffer = "";
			try {
				recog?.start();
				handlers.onStart?.();
			} catch (err) {
				running = false;
				handlers.onError(err instanceof Error ? err.message : "Could not start the microphone.");
			}
		},
		stop: () => {
			running = false;
			if (silenceTimer) window.clearTimeout(silenceTimer);
			flush();
			try {
				recog?.abort();
			} catch {}
			recog = null;
			handlers.onStop?.();
		}
	};
}
function HostPage() {
	const { demo } = Route$3.useSearch();
	const [phase, setPhase] = (0, import_react.useState)("setup");
	const [title, setTitle] = (0, import_react.useState)("Sabbath service");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [service, setService] = (0, import_react.useState)(null);
	const [hostToken, setHostToken] = (0, import_react.useState)("");
	const [lines, setLines] = (0, import_react.useState)([]);
	const [interim, setInterim] = (0, import_react.useState)("");
	const [listening, setListening] = (0, import_react.useState)(false);
	const [typed, setTyped] = (0, import_react.useState)("");
	const [engines, setEngines] = (0, import_react.useState)({
		gemini: false,
		grokTranslate: false,
		localBackup: true
	});
	const [stream, setStream] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [safeMode, setSafeMode] = (0, import_react.useState)(true);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [draftBusy, setDraftBusy] = (0, import_react.useState)(false);
	const [queued, setQueued] = (0, import_react.useState)(0);
	const demoTimer = (0, import_react.useRef)(null);
	const listener = (0, import_react.useRef)(null);
	const queueRef = (0, import_react.useRef)([]);
	const serviceRef = (0, import_react.useRef)(null);
	useWakeLock(phase === "live");
	(0, import_react.useEffect)(() => {
		getEngines().then(setEngines);
	}, []);
	(0, import_react.useEffect)(() => {
		return () => {
			listener.current?.stop();
			if (demoTimer.current) window.clearTimeout(demoTimer.current);
			stream?.getTracks().forEach((t) => t.stop());
		};
	}, []);
	const joinUrl = (0, import_react.useMemo)(() => {
		if (!service || typeof window === "undefined") return "";
		return `${window.location.origin}/listen/${service.code}`;
	}, [service]);
	async function begin(asDemo) {
		setBusy(true);
		try {
			const created = await createService({ data: { title: asDemo ? "Sample Sabbath service" : title } });
			rememberHost(created.service.code, created.hostToken);
			setService(created.service);
			setHostToken(created.hostToken);
			serviceRef.current = {
				code: created.service.code,
				token: created.hostToken
			};
			setPhase("live");
			if (asDemo) {
				setSafeMode(false);
				runDemo(created.service.code, created.hostToken);
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not start the service.");
		} finally {
			setBusy(false);
		}
	}
	function runDemo(code, token) {
		let i = 0;
		const step = async () => {
			const beat = DEMO_SERMON[i];
			if (!beat) return;
			setInterim(beat.af);
			try {
				const res = await publishUtterance({ data: {
					code,
					hostToken: token,
					text: beat.af,
					english: beat.en
				} });
				if (res.ok && !res.duplicate) setLines((prev) => [...prev, res.line]);
			} catch {}
			setInterim("");
			i += 1;
			if (i < DEMO_SERMON.length) demoTimer.current = window.setTimeout(() => void step(), beat.afterMs);
		};
		step();
	}
	async function startMic() {
		if (!speechSupported()) {
			toast.error("Afrikaans dictation needs Chrome on this host phone. You can still type lines.");
			return;
		}
		try {
			const media = await navigator.mediaDevices.getUserMedia({ audio: true });
			setStream(media);
		} catch {
			toast.error("Microphone permission was denied.");
			return;
		}
		listener.current = createAfrikaansListener({
			onInterim: setInterim,
			onFinal: (text) => {
				setInterim("");
				enqueueOrPublish(text);
			},
			onError: (msg) => toast.error(msg),
			onStart: () => setListening(true),
			onStop: () => setListening(false)
		});
		listener.current.start();
	}
	function stopMic() {
		listener.current?.stop();
		stream?.getTracks().forEach((t) => t.stop());
		setStream(null);
		setListening(false);
	}
	async function loadDraft(text) {
		const creds = serviceRef.current;
		if (!creds) return;
		setDraftBusy(true);
		setInterim(text);
		try {
			const res = await previewUtterance({ data: {
				code: creds.code,
				hostToken: creds.token,
				text
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			setDraft({
				source: res.source,
				english: res.english,
				engine: res.engine,
				filtered: res.filtered
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not prepare that line.");
		} finally {
			setDraftBusy(false);
			setInterim("");
		}
	}
	async function enqueueOrPublish(text, english) {
		if (!safeMode || english) {
			await publish(text, english);
			return;
		}
		if (draft || draftBusy) {
			queueRef.current.push(text);
			setQueued(queueRef.current.length);
			return;
		}
		await loadDraft(text);
	}
	async function confirmDraft() {
		if (!draft) return;
		const next = { ...draft };
		setDraft(null);
		await publish(next.source, next.english);
		const queuedLine = queueRef.current.shift();
		setQueued(queueRef.current.length);
		if (queuedLine) loadDraft(queuedLine);
	}
	function discardDraft() {
		setDraft(null);
		const queuedLine = queueRef.current.shift();
		setQueued(queueRef.current.length);
		if (queuedLine) loadDraft(queuedLine);
	}
	async function publish(text, english) {
		if (!service || !hostToken) return;
		setInterim(text);
		try {
			const res = await publishUtterance({ data: {
				code: service.code,
				hostToken,
				text,
				english
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			if (!res.duplicate) setLines((prev) => [...prev, res.line]);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not publish that line.");
		} finally {
			setInterim("");
		}
	}
	async function copy(kind, value) {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(kind);
			toast.success("Copied");
			window.setTimeout(() => setCopied(null), 1600);
		} catch {
			toast.error("Could not copy");
		}
	}
	async function finish() {
		if (!service) return;
		stopMic();
		if (demoTimer.current) window.clearTimeout(demoTimer.current);
		await endService({ data: {
			code: service.code,
			hostToken
		} });
		setService((s) => s ? {
			...s,
			status: "ended"
		} : s);
		toast.success("Service ended");
	}
	if (phase === "setup") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { quiet: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.22em] text-muted uppercase",
					children: "Host console"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-5xl tracking-tight",
					children: "Begin the service"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: "Place this phone near the pulpit. A code and hashtag will appear for English speakers to join. Safe mode is on by default — you approve each line before the pews see it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "title",
						children: "Service name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "title",
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Sabbath service"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "xl",
							disabled: busy,
							onClick: () => void begin(false),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), "Start listening"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "xl",
							variant: "outline",
							disabled: busy,
							onClick: () => void begin(true),
							children: "Play a sample sermon"
						}),
						demo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Sample mode streams a short Adventist pulpit reading so you can open the pew view on another phone."
						}) : null
					]
				})
			]
		})]
	});
	if (!service) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { quiet: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid w-full max-w-6xl flex-1 gap-8 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex min-h-[28rem] flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2 text-xs tracking-[0.18em] text-live uppercase",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "woord-live-dot size-1.5 rounded-full bg-live" }), service.status === "live" ? "Live" : "Ended"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-subtle",
								children: service.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-subtle",
								children: [
									engines.gemini ? "Gemini Transcribe" : "On-device Afrikaans",
									" · ",
									engines.grokTranslate ? "English by Grok" : "English by liturgy · lexicon"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSafeMode((v) => !v),
								className: "inline-flex h-11 items-center gap-1.5 rounded-full bg-elevated px-3 text-xs text-muted shadow-[var(--shadow-border)] hover:text-fg",
								children: [safeMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "size-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5" }), safeMode ? "Safe · approve each line" : "Live · send as spoken"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CaptionBoard, {
						lines,
						pendingSource: interim,
						pendingEnglish: draftBusy ? "" : void 0
					}),
					draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 rounded-xl bg-elevated p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs tracking-[0.18em] text-subtle uppercase",
								children: ["Review before the pews", queued ? ` · ${queued} waiting` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted",
								children: draft.source
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: draft.english,
								onChange: (e) => setDraft({
									...draft,
									english: e.target.value
								}),
								rows: 3,
								"aria-label": "English caption",
								className: "mt-3 w-full resize-y rounded-md bg-bg px-3 py-2 text-sm leading-relaxed text-fg shadow-[var(--shadow-border)] placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-subtle",
								children: [
									draft.engine,
									draft.filtered ? " · language held" : "",
									" · Afrikaans stays on the pew board"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => void confirmDraft(),
									children: "Send to pews"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: discardDraft,
									children: "Discard"
								})]
							})
						]
					}) : draftBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-subtle",
						children: "Preparing English…"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 border-t border-border pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [
								listening ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "danger",
									onClick: stopMic,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, {}), "Stop mic"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => void startMic(),
									disabled: service.status !== "live",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {}), "Listen"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waveform, {
									stream,
									active: listening
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									onClick: () => void finish(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5 fill-current" }), "End"]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								if (!typed.trim()) return;
								enqueueOrPublish(typed.trim());
								setTyped("");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: typed,
								onChange: (e) => setTyped(e.target.value),
								placeholder: "Type a line if the mic is quiet",
								"aria-label": "Type a pulpit line"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "outline",
								size: "icon",
								"aria-label": "Publish typed line",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, {})
							})]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col items-center gap-5 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] lg:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-subtle uppercase",
						children: "Join this service"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-4xl tracking-[0.16em] text-fg",
						children: formatCode(service.code)
					}),
					joinUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrPanel, {
						value: joinUrl,
						size: 180,
						label: "Scan to open English captions"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyRow, {
								icon: copied === "code" ? Check : Copy,
								label: formatCode(service.code),
								onClick: () => void copy("code", service.code)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyRow, {
								icon: copied === "hash" ? Check : Hash,
								label: service.hashtag,
								onClick: () => void copy("hash", service.hashtag)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyRow, {
								icon: copied === "link" ? Check : Copy,
								label: "Copy pew link",
								onClick: () => void copy("link", joinUrl)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						className: "w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: `/listen/${service.code}`,
							target: "_blank",
							rel: "noreferrer",
							children: "Open pew view"
						})
					})
				]
			})]
		})]
	});
}
function CopyRow({ icon: Icon, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex h-11 w-full items-center justify-between rounded-md bg-elevated px-3 text-left text-sm text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate font-mono",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-muted" })]
	});
}
//#endregion
export { HostPage as component };
