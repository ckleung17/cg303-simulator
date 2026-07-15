const CACHE = "cg303-fault-lab-v21";
const FILES = [
  "./", "index.html", "css/tokens.css", "css/base.css", "css/layout.css",
  "css/components/simulator.css", "js/app.js",
  "data/scenarios/radial-scenarios.js", "assets/svg/app-icon.svg",
  "assets/svg/symbols/brief.svg", "assets/svg/symbols/safety.svg",
  "assets/svg/symbols/test.svg", "assets/svg/symbols/diagnose.svg",
  "assets/svg/symbols/report.svg",
  "assets/svg/diagrams/simulator-workflow.svg",
  "output/pdf/CG303-Fault-Lab-Specification.pdf",
  "output/pdf/CG303-Fault-Lab-Operation-Manual.pdf"
];
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); return response;
  }).catch(() => caches.match(event.request)));
});
