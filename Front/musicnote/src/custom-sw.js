import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";
import { cacheNames } from "workbox-core";

// 서비스 워커 설치 시 precache 실행
precacheAndRoute(self.__WB_MANIFEST);

// 백그라운드 동기화를 위한 큐 설정
const bgSyncPlugin = new BackgroundSyncPlugin("notification-queue", {
  maxRetentionTime: 24 * 60 * 7, // 7일 (분 단위)
});

// API 요청 캐싱 전략 설정
registerRoute(
  ({ url }) => url.pathname.includes("/api/notifications"),
  new CacheFirst({
    cacheName: "notifications-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7일간 캐싱
      }),
      bgSyncPlugin,
    ],
  })
);

// SSE 연결 캐싱 전략
registerRoute(
  new RegExp("https://j12a308\\.p\\.ssafy\\.io/api/notifications/sse/subscribe"),
  new StaleWhileRevalidate({
    cacheName: "sse-connection-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 2, // 2시간
      }),
    ],
  })
);

// 일반 API 요청 캐싱 전략
registerRoute(
  new RegExp("https://j12a308\\.p\\.ssafy\\.io/api/"),
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24, // 24시간
      }),
    ],
    networkTimeoutSeconds: 10,
  })
);

// 로컬 애셋 캐싱 전략
registerRoute(
  ({ request, url }) => url.origin === self.location.origin,
  new StaleWhileRevalidate({
    cacheName: "local-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30일
      }),
    ],
  })
);

// 알림 동기화를 위한 리스너 설정
self.addEventListener("sync", (event) => {
  if (event.tag === "notification-sync") {
    event.waitUntil(syncNotifications());
  }
});

// 오프라인 상태에서 온라인 상태로 변경될 때 알림 동기화
async function syncNotifications() {
  try {
    // IndexedDB에서 오프라인 알림 가져오기
    const db = await openNotificationDB();
    const offlineNotifications = await getOfflineNotifications(db);

    if (offlineNotifications.length > 0) {
      // 오프라인 알림 처리
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          offlineNotifications.forEach((notification) => {
            client.postMessage({
              type: "OFFLINE_NOTIFICATION",
              notification,
            });
          });
        });
      });

      // 처리된 알림 삭제
      await clearOfflineNotifications(db);
    }
  } catch (error) {
    console.error("알림 동기화 중 오류 발생:", error);
  }
}

// IndexedDB 관련 유틸리티 함수
function openNotificationDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("notification-store", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("notifications")) {
        db.createObjectStore("notifications", { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

function getOfflineNotifications(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["notifications"], "readonly");
    const store = transaction.objectStore("notifications");
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function clearOfflineNotifications(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["notifications"], "readwrite");
    const store = transaction.objectStore("notifications");
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// 푸시 알림 수신 처리
self.addEventListener("push", (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();

    // 푸시 알림 표시
    const options = {
      body: data.message || "새로운 알림이 있습니다.",
      icon: "/favicon-assets/pwa-192x192.png",
      badge: "/favicon-assets/pwa-maskable-192x192.png",
      data: { url: data.url || "/" },
    };

    event.waitUntil(self.registration.showNotification("MusicNote", options));

    // 오프라인 상태일 경우 IndexedDB에 저장
    if (!navigator.onLine) {
      saveNotificationToIndexedDB(data);
    }
  } catch (error) {
    console.error("푸시 알림 처리 중 오류 발생:", error);
  }
});

// 알림 클릭 처리
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // 알림 클릭 시 해당 URL로 이동
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  } else {
    event.waitUntil(clients.openWindow("/"));
  }
});

// IndexedDB에 알림 저장
async function saveNotificationToIndexedDB(notification) {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction(["notifications"], "readwrite");
    const store = transaction.objectStore("notifications");

    // 고유 ID 생성
    const notificationWithId = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    store.add(notificationWithId);
  } catch (error) {
    console.error("알림 저장 중 오류 발생:", error);
  }
}
