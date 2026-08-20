var CACHE_NAME = 'salah-shell-v3';
var SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './adhan-makkah.mp3',
  './adhan-madinah.mp3',
  './adhan-alaqsa.mp3',
  './adhan-alafasy.mp3',
  './adhan-abdulbasit.mp3',
  './adhan-fajr.mp3',
  './classic-48073.mp3',
  './classic-phone-25660.mp3',
  './iphone-ringtone-47958.mp3'
];

self.addEventListener('install', function(event){
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(SHELL_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.filter(function(n){ return n !== CACHE_NAME; }).map(function(n){ return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event){
  var url = event.request.url;
  if(url.indexOf('api.aladhan.com') !== -1){
    return;
  }
  if(event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function(cached){
      var fetchPromise = fetch(event.request).then(function(networkResp){
        if(networkResp && networkResp.ok && event.request.url.indexOf(self.location.origin) === 0){
          var respClone = networkResp.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, respClone); });
        }
        return networkResp;
      }).catch(function(){ return cached; });
      return cached || fetchPromise;
    })
  );
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList){
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
