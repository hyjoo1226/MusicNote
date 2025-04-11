import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Notification {
  id: string;
  message: string;
  url?: string;
  timestamp: string;
  read?: boolean;
}

interface NotificationState {
  notifications: Notification[];
  connectionStatus: "connecting" | "connected" | "disconnected";
  readNotifications: string[]; // 이미 확인한 알림 ID 목록
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  setConnectionStatus: (status: "connecting" | "connected" | "disconnected") => void;
  markAsRead: (id: string) => void; // 알림을 읽음으로 표시하는 함수
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      connectionStatus: "connecting",
      readNotifications: [],

      addNotification: (notification: Notification) =>
        set((state) => {
          // 이미 확인한 알림인 경우 읽음 상태로 표시
          if (state.readNotifications.includes(notification.id)) {
            notification.read = true;
          }

          // 이미 같은 ID의 알림이 있는지 확인
          const existingNotification = state.notifications.find((n) => n.id === notification.id);
          if (existingNotification) {
            // 이미 존재하는 알림이라면 추가하지 않음
            return { notifications: state.notifications };
          }

          return {
            notifications: [...state.notifications, notification],
          };
        }),

      setNotifications: (notifications: Notification[]) => set({ notifications }),

      setConnectionStatus: (connectionStatus: "connecting" | "connected" | "disconnected") =>
        set({ connectionStatus }),

      markAsRead: (id: string) =>
        set((state) => {
          // 알림 읽음 상태 업데이트
          const updatedNotifications = state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          );

          // 읽음 목록에 ID 추가
          return {
            notifications: updatedNotifications,
            readNotifications: [...state.readNotifications, id],
          };
        }),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        readNotifications: state.readNotifications,
      }),
    }
  )
);
