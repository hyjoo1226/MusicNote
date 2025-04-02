export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    alert("이 브라우저는 알림을 지원하지 않습니다");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const showNotification = async (title: string, options: any) => {
  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    console.log("알림 권한이 없습니다");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  // 오프라인에서도 알림을 표시할 수 있도록 SW를 통해 알림 표시
  registration.showNotification(title, {
    body: options.body || "새로운 알림이 있습니다",
    icon: options.icon || "/pwa-192x192.png",
    ...options,
  });
};
