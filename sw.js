const CACHE_NAME = 'discurso-app-v1.2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './1000322334.png'
];

// Instala o Service Worker e guarda o layout básico no cache
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Limpa caches antigos quando houver atualizações
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia: Tenta sempre a Rede primeiro (essencial para atualizar a Planilha), se falhar usa o Cache
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
