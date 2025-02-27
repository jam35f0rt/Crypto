const CACHE_NAME = 'crypto-tracker-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/config.js',
  '/js/utils.js',
  '/js/state.js',
  '/js/storage-service.js',
  '/js/api-service.js',
  '/js/chart-service.js',
  '/js/ui-service.js',
  '/js/crypto-manager.js',
  '/js/pwa-manager.js',
  '/js/app.js',
  'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Fetch event - serve from cache if available, otherwise fetch and cache
self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip caching for API requests
  if (event.request.url.includes('api.coinbase.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone response to cache and return
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // If network fails, serve fallback content for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
            
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

// Sync favorites when back online
async function syncFavorites() {
  const dbPromise = indexedDB.open('crypto-tracker-db', 1);
  
  dbPromise.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('offline-changes')) {
      db.createObjectStore('offline-changes', { keyPath: 'id' });
    }
  };
  
  try {
    const db = await new Promise((resolve, reject) => {
      dbPromise.onsuccess = e => resolve(e.target.result);
      dbPromise.onerror = e => reject(e);
    });
    
    const tx = db.transaction('offline-changes', 'readwrite');
    const store = tx.objectStore('offline-changes');
    
    const changes = await store.getAll();
    
    if (changes.length > 0) {
      // Process offline changes
      console.log('Syncing offline changes', changes);
      
      // Clear the store after processing
      store.clear();
    }
    
    return changes;
  } catch (error) {
    console.error('Error syncing favorites:', error);
    return [];
  }
}