(() => {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', async () => {
    const registration = await navigator.serviceWorker.register('sw.js?v=2');
    const urls = [...document.querySelectorAll('video source[src]')].map(source => new URL(source.src, location.href).href);
    const worker = navigator.serviceWorker.controller || registration.active || registration.waiting || registration.installing;
    if (urls.length && worker) worker.postMessage({ type: 'CACHE_MEDIA', urls });
  });
})();
