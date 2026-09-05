const CACHE_NAME='f1-hub-v1.10.1';
const ASSETS=['./','./index.html','./manifest.json','./icon.svg','./icon-192.png','./icon-512.png','./styles.css?v=1.10.1','./app.js?v=1.10.1'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r&&r.ok){const copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy));}
    return r;
  }).catch(async()=>await caches.match(e.request)||await caches.match('./index.html')));
});
