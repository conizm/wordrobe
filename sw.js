// public/sw.js

const CACHE_NAME = 'wordrobe-v4-subdomain'; 
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
// 追加：通知タップ時の動作
// ==========================================
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  // ★ここで通知を閉じます（これが消えない原因でした）
  event.notification.close();

  // ★アプリを開く（またはフォーカスする）処理
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // 1. すでにアプリのタブが開いていたら、それを手前に持ってくる
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        // ドメインが一致するタブを探す
        if (client.url.includes('wordrobe.conizm.cc') && 'focus' in client) {
          return client.focus();
        }
      }
      // 2. 開いていなければ、新しく開く
      if (clients.openWindow) {
        return clients.openWindow('https://wordrobe.conizm.cc/');
      }
    })
  );
});