addEventListener('fetch', event => {
  event.waitUntil(sleep(1));
  event.respondWith(fetch('https://example.com'));
});

function sleep(seconds) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}
