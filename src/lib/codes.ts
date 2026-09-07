const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeServiceCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

export function makeHostToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function makeHashtag(code: string): string {
  return `#Woord${code}`;
}

/** Accepts H4K2PM, h4k-2pm, #WoordH4K2PM, woord.h4k2pm */
export function normalizeCode(raw: string): string {
  const upper = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const stripped = upper.startsWith("WOORD") ? upper.slice(5) : upper;
  return stripped.slice(0, 6);
}

export function formatCode(code: string): string {
  const c = normalizeCode(code);
  if (c.length !== 6) return c;
  return `${c.slice(0, 3)} ${c.slice(3)}`;
}

export function hostStorageKey(code: string): string {
  return `woord-host-${normalizeCode(code)}`;
}

export function rememberHost(code: string, token: string) {
  try {
    sessionStorage.setItem(hostStorageKey(code), token);
  } catch {
    /* private mode */
  }
}

export function recallHostToken(code: string): string | null {
  try {
    return sessionStorage.getItem(hostStorageKey(code));
  } catch {
    return null;
  }
}
