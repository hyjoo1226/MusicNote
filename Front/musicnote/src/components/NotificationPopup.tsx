import { useNotificationStore, Notification } from "../stores/notificationStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/NotificationPopup.css";

interface NotificationWithDisplay extends Notification {
  display: boolean;
  timeoutId?: number;
}

const NotificationPopup = () => {
  const { notifications, markAsRead } = useNotificationStore();
  const navigate = useNavigate();
  const [displayNotifications, setDisplayNotifications] = useState<NotificationWithDisplay[]>([]);

  // 새 알림이 추가되면 처리
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotifications = [...notifications]
        .filter((notification) => !notification.read) // 읽지 않은 알림만 필터링
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      // 이미 표시 중인 알림을 제외하고 새 알림만 처리
      const newNotifications = latestNotifications.filter(
        (notification) =>
          !displayNotifications.some((dispNotif) => dispNotif.id === notification.id)
      );

      if (newNotifications.length > 0) {
        const updatedNotifications = [
          ...displayNotifications,
          ...newNotifications.map((notification) => ({
            ...notification,
            display: true,
          })),
        ];

        setDisplayNotifications(updatedNotifications as NotificationWithDisplay[]);

        // 각 새 알림에 대해 5초 후 사라지도록 타이머 설정
        newNotifications.forEach((notification) => {
          const timeoutId = window.setTimeout(() => {
            dismissNotification(notification.id);
          }, 5000);

          // 타이머 ID 저장
          setDisplayNotifications((prev) =>
            prev.map((n) => (n.id === notification.id ? { ...n, timeoutId } : n))
          );
        });
      }
    }
  }, [notifications]);

  // 알림 삭제 함수
  const dismissNotification = (id: string) => {
    // 알림을 읽음으로 표시
    markAsRead(id);

    setDisplayNotifications((prev) => {
      // 먼저 해당 알림의 타이머가 있으면 제거
      const notification = prev.find((n) => n.id === id);
      if (notification?.timeoutId) {
        window.clearTimeout(notification.timeoutId);
      }

      // 알림 사라지게 표시
      return prev.map((n) => (n.id === id ? { ...n, display: false } : n));
    });

    // 애니메이션 후 완전히 제거
    setTimeout(() => {
      setDisplayNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 300);
  };

  // 알림 클릭 시 해당 URL로 이동
  const handleNotificationClick = (notification: NotificationWithDisplay) => {
    if (notification.url) {
      navigate(notification.url);
    }
    dismissNotification(notification.id);
  };

  if (displayNotifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-popup-container">
      {displayNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification-item ${notification.display ? "show" : "hide"}`}
          onClick={() => handleNotificationClick(notification)}
        >
          <p>{notification.message}</p>
          <button
            className="notification-close"
            onClick={(e) => {
              e.stopPropagation();
              dismissNotification(notification.id);
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationPopup;
