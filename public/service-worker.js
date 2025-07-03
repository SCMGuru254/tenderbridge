
// TenderBridge Service Worker
const CACHE_NAME = 'tenderbridge-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/lovable-uploads/03c0e1ef-197d-4e61-926e-c4b14f094c6a.png'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Add files one by one to avoid failures
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
            return Promise.resolve();
          }))
        );
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-http requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // For missing logo files, return a fallback or skip
        if (event.request.url.includes('logo192.png') || event.request.url.includes('logo512.png')) {
          return fetch('/lovable-uploads/03c0e1ef-197d-4e61-926e-c4b14f094c6a.png')
            .catch(() => new Response('', { status: 404 }));
        }
        
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // Return a basic response for failed requests
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/lovable-uploads/03c0e1ef-197d-4e61-926e-c4b14f094c6a.png',
      badge: '/favicon.ico',
      data: {
        url: data.url
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
