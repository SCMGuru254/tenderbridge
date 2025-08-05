// Service Worker for SupplyChain_KE PWA
const CACHE_NAME = 'supplychain-ke-v1.0.0';
const DYNAMIC_CACHE = 'supplychain-ke-dynamic-v1.0.0';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/jobs',
  '/companies',
  '/discussions',
  '/auth',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/apple-touch-icon.png'
];

// API routes to cache
const API_CACHE_PATTERNS = [
  /\/api\/jobs/,
  /\/api\/companies/,
  /\/api\/discussions/,
  /\/rest\/v1\/scraped_jobs/,
  /\/rest\/v1\/companies/,
  /\/rest\/v1\/discussions/
];

// Network-first strategies for these patterns
const NETWORK_FIRST_PATTERNS = [
  /\/auth/,
  /\/api\/auth/,
  /\/rest\/v1\/profiles/,
  /\/rest\/v1\/job_applications/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName !== CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE
            )
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Network-first strategy for auth and user-specific data
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first strategy for static assets
  if (STATIC_ASSETS.includes(url.pathname) || 
      request.destination === 'image' ||
      request.destination === 'style' ||
      request.destination === 'script') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale-while-revalidate for API data
  if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Default strategy for other requests
  event.respondWith(networkFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log('[SW] Cached new resource:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first strategy failed:', error);
    
    // Try to return cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      console.log('[SW] Cached dynamic resource:', request.url);
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      console.log('[SW] Updated cache:', request.url);
    }
    return networkResponse;
  }).catch((error) => {
    console.log('[SW] Network update failed:', error);
  });
  
  if (cachedResponse) {
    console.log('[SW] Serving stale content:', request.url);
    return cachedResponse;
  }
  
  return fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'job-application') {
    event.waitUntil(syncJobApplications());
  }
  
  if (event.tag === 'profile-update') {
    event.waitUntil(syncProfileUpdates());
  }
});

async function syncJobApplications() {
  try {
    console.log('[SW] Syncing offline job applications...');
    
    // Get offline job applications from IndexedDB
    const applications = await getOfflineApplications();
    
    for (const application of applications) {
      try {
        const response = await fetch('/api/job-applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(application.data)
        });
        
        if (response.ok) {
          await removeOfflineApplication(application.id);
          console.log('[SW] Job application synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync job application:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

async function syncProfileUpdates() {
  try {
    console.log('[SW] Syncing offline profile updates...');
    
    // Get offline profile updates from IndexedDB
    const updates = await getOfflineProfileUpdates();
    
    for (const update of updates) {
      try {
        const response = await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(update.data)
        });
        
        if (response.ok) {
          await removeOfflineProfileUpdate(update.id);
          console.log('[SW] Profile update synced successfully');
        }
      } catch (error) {
        console.error('[SW] Failed to sync profile update:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Profile sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'New job opportunities available!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Jobs',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = data;
  }
  
  event.waitUntil(
    self.registration.showNotification('SupplyChain_KE', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/jobs')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Utility functions for IndexedDB operations
async function getOfflineApplications() {
  // This would integrate with IndexedDB to store offline data
  return [];
}

async function removeOfflineApplication(id) {
  // Remove from IndexedDB
}

async function getOfflineProfileUpdates() {
  // This would integrate with IndexedDB to store offline data
  return [];
}

async function removeOfflineProfileUpdate(id) {
  // Remove from IndexedDB
}

// Cache cleanup on quota exceeded
self.addEventListener('quotaexceeded', (event) => {
  console.log('[SW] Storage quota exceeded, cleaning up...');
  
  event.waitUntil(
    caches.open(DYNAMIC_CACHE)
      .then((cache) => {
        return cache.keys().then((requests) => {
          // Remove oldest 20% of cached items
          const itemsToDelete = Math.floor(requests.length * 0.2);
          const promises = requests
            .slice(0, itemsToDelete)
            .map(request => cache.delete(request));
          
          return Promise.all(promises);
        });
      })
  );
});

console.log('[SW] Service worker script loaded');