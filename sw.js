const CACHE = 'oblaka-zemlya-static-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(key => key.startsWith('oblaka-zemlya-') && key !== CACHE).map(key => caches.delete(key)));
  await self.clients.claim();
})()));

async function cachedRangeResponse(request) {
  const cached = await caches.match(request.url);
  if (!cached) return fetch(request);
  const match = request.headers.get('range').match(/bytes=(\d*)-(\d*)/);
  if (!match) return fetch(request);
  const bytes = await cached.arrayBuffer();
  const size = bytes.byteLength;
  const start = match[1] ? Number(match[1]) : 0;
  const end = Math.min(match[2] ? Number(match[2]) : size - 1, size - 1);
  if (start > end || start >= size) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  return new Response(bytes.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'video/mp4',
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
    },
  });
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.headers.has('range')) {
    event.respondWith(cachedRangeResponse(request));
    return;
  }

  // HTML is network-first so edits appear at the same URL.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
        return response;
      } catch (_) {
        return (await caches.match(request)) || Response.error();
      }
    })());
    return;
  }

  // Static media is cache-first; it is available immediately after returning to the site.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type !== 'CACHE_MEDIA') return;
  const urls = (event.data.urls || []).filter(url => new URL(url).origin === self.location.origin);
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(urls.map(async url => {
      if (await cache.match(url)) return;
      const response = await fetch(url);
      if (response.ok) await cache.put(url, response);
    }));
  })());
});
