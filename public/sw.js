const CACHE = 'vl-correcoes-v2'
const ASSETS = ['/', '/index.html']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  // Só interceptar GET same-origin. Chamadas às APIs de IA (OpenRouter, Gemini,
  // Claude, OpenAI) e qualquer POST passam directo — o SW não pode mascarar
  // erros de rede dessas chamadas com respostas 503 sintéticas.
  if (e.request.method !== 'GET') return
  if (new URL(e.request.url).origin !== self.location.origin) return

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(CACHE).then((c) => c.put(e.request, clone))
        }
        return res
      })
      .catch(() => caches.match(e.request).then((cached) => cached ?? new Response('Offline', { status: 503 })))
  )
})
