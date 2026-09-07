//#region node_modules/.nitro/vite/services/ssr/assets/codes-DSoe9QJH.js
var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeServiceCode() {
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(6));
	return Array.from(bytes, (b) => ALPHABET[b % 32]).join("");
}
function makeHostToken() {
	const bytes = crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(24));
	return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
function makeHashtag(code) {
	return `#Woord${code}`;
}
/** Accepts H4K2PM, h4k-2pm, #WoordH4K2PM, woord.h4k2pm */
function normalizeCode(raw) {
	const upper = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
	return (upper.startsWith("WOORD") ? upper.slice(5) : upper).slice(0, 6);
}
function formatCode(code) {
	const c = normalizeCode(code);
	if (c.length !== 6) return c;
	return `${c.slice(0, 3)} ${c.slice(3)}`;
}
function hostStorageKey(code) {
	return `woord-host-${normalizeCode(code)}`;
}
function rememberHost(code, token) {
	try {
		sessionStorage.setItem(hostStorageKey(code), token);
	} catch {}
}
//#endregion
export { normalizeCode as a, makeServiceCode as i, makeHashtag as n, rememberHost as o, makeHostToken as r, formatCode as t };
