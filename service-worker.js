const CACHE_NAME='f1-hub-v1.18.0';
const ASSETS=['./','./index.html','./manifest.json','./version.json','./icon.svg','./icon-192.png','./icon-512.png','./screenshot-standings.png','./screenshot-drivers.png','./styles.css?v=1.18.0','./quality-core.js?v=1.18.0','./car-development-core.js?v=1.18.0','./driver-career-core.js?v=1.18.0','./app.js?v=1.18.0','./tech-car-reference-clean2.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  if(u.pathname.endsWith('/version.json')){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match(e.request)));return;}
  const isDocument=e.request.mode==='navigate'||e.request.destination==='document';
  if(isDocument){
    e.respondWith(caches.match('./index.html').then(cached=>{const network=fetch(e.request).then(r=>{if(r&&r.ok)caches.open(CACHE_NAME).then(c=>c.put('./index.html',r.clone()));return r;}).catch(()=>null);return cached||network;}));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>{
    const network=fetch(e.request).then(r=>{if(r&&r.ok)caches.open(CACHE_NAME).then(c=>c.put(e.request,r.clone()));return r;}).catch(()=>null);
    return cached||network;
  }));
});
