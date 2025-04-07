import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

interface NotificationState {
  notifications: Notification[];
  connectionStatus: "connecting" | "connected" | "disconnected";
  addNotification: (notification: Notification) => void;
  setNotifications: (notifications: Notification[]) => void;
  setConnectionStatus: (status: "connecting" | "connected" | "disconnected") => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      connectionStatus: "connecting",

      addNotification: (notification: Notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),

      setNotifications: (notifications: Notification[]) => set({ notifications }),

      setConnectionStatus: (connectionStatus: "connecting" | "connected" | "disconnected") =>
        set({ connectionStatus }),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
