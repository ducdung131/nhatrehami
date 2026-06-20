// Service Worker for Push Notifications - Nhà Trẻ Hạ Mi

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle push events - this fires when a push notification arrives
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = {
      title: "Thông báo mới",
      body: event.data.text(),
      icon: "/icon.png",
    };
  }

  const options = {
    body: data.body || "Bạn có thông báo mới từ Nhà Trẻ Hạ Mi",
    icon: data.icon || "/icon.png",
    badge: "/icon.png",
    vibrate: [200, 100, 200],
    tag: data.tag || "hami-notification",
    renotify: true,
    data: {
      url: data.url || "/parent/notifications",
      announcementId: data.announcementId,
    },
    actions: [
      { action: "open", title: "Xem chi tiết" },
      { action: "close", title: "Đóng" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Nhà Trẻ Hạ Mi 🔔",
      options
    )
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const urlToOpen = event.notification.data?.url || "/parent/notifications";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing tab if found
        for (const client of clientList) {
          if (client.url.includes("/parent") && "focus" in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Otherwise open new tab
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
