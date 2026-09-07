const CACHE = "woord-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./js/app.js",
  "./js/glossary.js",
  "./js/phrases.js",
  "./js/scripture.js",
  "./js/translate.js",
  "./js/speech.js",
  "./js/room.js",
  "./js/demo-sermon.js",
  "./js/slang.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
