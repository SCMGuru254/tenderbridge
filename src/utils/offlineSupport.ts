import { useState, useEffect } from 'react';

// Offline detection
export const useOfflineDetection = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOffline;
};

// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Cache management
export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, any>;

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async set(key: string, value: any) {
    this.cache.set(key, value);
    if ('localStorage' in window) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }

  async get(key: string) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    if ('localStorage' in window) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsedValue = JSON.parse(value);
          this.cache.set(key, parsedValue);
          return parsedValue;
        }
      } catch (error) {
        console.error('Error reading from localStorage:', error);
      }
    }

    return null;
  }

  async remove(key: string) {
    this.cache.delete(key);
    if ('localStorage' in window) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    }
  }

  async clear() {
    this.cache.clear();
    if ('localStorage' in window) {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  }
}

// Offline data sync
export class OfflineSync {
  private static instance: OfflineSync;
  private queue: Array<{
    action: string;
    data: any;
    timestamp: number;
  }>;

  private constructor() {
    this.queue = [];
    this.loadQueue();
  }

  static getInstance(): OfflineSync {
    if (!OfflineSync.instance) {
      OfflineSync.instance = new OfflineSync();
    }
    return OfflineSync.instance;
  }

  private loadQueue() {
    if ('localStorage' in window) {
      try {
        const savedQueue = localStorage.getItem('offlineSyncQueue');
        if (savedQueue) {
          this.queue = JSON.parse(savedQueue);
        }
      } catch (error) {
        console.error('Error loading sync queue:', error);
      }
    }
  }

  private saveQueue() {
    if ('localStorage' in window) {
      try {
        localStorage.setItem('offlineSyncQueue', JSON.stringify(this.queue));
      } catch (error) {
        console.error('Error saving sync queue:', error);
      }
    }
  }

  async addToQueue(action: string, data: any) {
    this.queue.push({
      action,
      data,
      timestamp: Date.now()
    });
    this.saveQueue();
  }

  async processQueue() {
    if (!navigator.onLine) return;

    const queue = [...this.queue];
    this.queue = [];

    for (const item of queue) {
      try {
        // Implement your sync logic here
        console.log('Processing queue item:', item);
      } catch (error) {
        console.error('Error processing queue item:', error);
        this.queue.push(item);
      }
    }

    this.saveQueue();
  }
}

// Offline storage
export class OfflineStorage {
  private static instance: OfflineStorage;
  private db: IDBDatabase | null = null;

  private constructor() {
    this.initDB();
  }

  static getInstance(): OfflineStorage {
    if (!OfflineStorage.instance) {
      OfflineStorage.instance = new OfflineStorage();
    }
    return OfflineStorage.instance;
  }

  private async initDB() {
    if (!('indexedDB' in window)) return;

    try {
      this.db = await new Promise((resolve, reject) => {
        const request = indexedDB.open('offlineDB', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('jobs')) {
            db.createObjectStore('jobs', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('applications')) {
            db.createObjectStore('applications', { keyPath: 'id' });
          }
        };
      });
    } catch (error) {
      console.error('Error initializing IndexedDB:', error);
    }
  }

  async set(store: string, data: any) {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.put(data);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async get(store: string, key: string) {
    if (!this.db) return null;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(store, 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getAll(store: string) {
    if (!this.db) return [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(store, 'readonly');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async delete(store: string, key: string) {
    if (!this.db) return;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(store, 'readwrite');
      const objectStore = transaction.objectStore(store);
      const request = objectStore.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

// Offline notification
export const showOfflineNotification = () => {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('You are offline', {
          body: 'Some features may be limited while offline.',
          icon: '/icons/offline.png'
        });
      }
    });
  }
}; 