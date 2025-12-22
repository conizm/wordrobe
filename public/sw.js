
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCqoqNq7N-x5Wr6TsJkyCU0J6o-Mj1Ir8g",
  authDomain: "conizm-01.firebaseapp.com",
  projectId: "conizm-01",
  storageBucket: "conizm-01.firebasestorage.app",
  messagingSenderId: "180210157068",
  appId: "1:180210157068:web:e03a373dd3f818cdee1029",
});

// バックグラウンドでのメッセージ受信を有効化
const messaging = firebase.messaging();

// ==========================================
// 2. キャッシュの設定 (PWA用)
// ==========================================
const CACHE_NAME = 'wordrobe-v5-fixed'; // バージョンを上げました
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/images/wordrobe-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Firebaseの通信などはキャッシュしないように除外
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

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

// ==========================================
// 3. 通知タップ時の動作 (さっき追加したやつ)
// ==========================================
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url.includes('wordrobe.conizm.cc') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('https://wordrobe.conizm.cc/');
      }
    })
  );
});