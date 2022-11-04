importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

if (workbox) {
  workbox.routing.registerRoute(
    ({ request }) => request.destination === "image",
    new workbox.strategies.CacheFirst()
  );
  workbox.routing.registerRoute(
    new RegExp("/css|/js/"),
    new workbox.strategies.CacheFirst()
  );
}

self.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log("New notification", data);
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.description,
      icon: data.icon,
    })
  );
});
