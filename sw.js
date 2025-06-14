    // service-worker.js
    const CACHE_NAME = 'drivin-cache-v1';
    const urlsToCache = [
      '/Arq.K-DRIVE.html', // O seu ficheiro HTML principal
      '/', // A raiz do seu site
      '/manifest.json',
      // Inclua todos os seus ícones aqui
      '/icons/icon-72x72.png',
      '/icons/icon-96x96.png',
      '/icons/icon-128x128.png',
      '/icons/icon-144x144.png',
      '/icons/icon-152x152.png',
      '/icons/icon-192x192.png',
      '/icons/icon-384x384.png',
      '/icons/icon-512x512.png',
      // Se você tiver outros arquivos CSS, JS, ou imagens, adicione-os aqui:
      // Ex: '/style.css',
      // Ex: '/script.js',
      // Ex: '/images/background.jpg',
    ];

    // Instalação do Service Worker - Cacheia os ativos da "app shell"
    self.addEventListener('install', (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME)
          .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
          })
      );
    });

    // Ativação do Service Worker - Limpa caches antigos
    self.addEventListener('activate', (event) => {
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== CACHE_NAME) {
                console.log('Deleting old cache:', cacheName);
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });

    // Interceção de Requisições - Serve do cache ou da rede
    self.addEventListener('fetch', (event) => {
      event.respondWith(
        caches.match(event.request)
          .then((response) => {
            // Se encontrar no cache, retorna a versão em cache
            if (response) {
              return response;
            }
            // Caso contrário, busca na rede
            return fetch(event.request).catch(() => {
              // Se a busca na rede falhar (offline), pode retornar uma página offline personalizada
              return new Response('<h1>Você está offline!</h1><p>Não foi possível carregar o conteúdo.</p>', {
                headers: { 'Content-Type': 'text/html' }
              });
            });
          })
      );
    });
    