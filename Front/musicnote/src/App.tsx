import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";
import NavBar from "./components/layout/NavBar.tsx";
import { useEffect, useRef, useCallback } from "react";
import "./styles/Global.css";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useAuthStore } from "./stores/authStore";
import { useNotificationStore, Notification } from "./stores/notificationStore";

// ServiceWorker sync API 타입 확장
declare global {
  interface ServiceWorkerRegistration {
    sync: {
      register(tag: string): Promise<void>;
    };
  }

  interface Window {
    SyncManager: any;
  }
}

function App() {
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const { accessToken, spotifyAccessToken } = useAuthStore();
  const { setConnectionStatus, addNotification } = useNotificationStore();

  const sseUrl = "https://j12a308.p.ssafy.io/api/notifications/sse/subscribe";

  // SSE 연결 설정 함수
  const setupSSEConnection = useCallback(() => {
    // 토큰이 없으면 연결하지 않음
    if (!accessToken || !navigator.onLine) {
      setConnectionStatus("disconnected");
      return;
    }

    // 기존 연결 종료
    eventSourceRef.current?.close();

    // EventSource 인스턴스 생성
    eventSourceRef.current = new EventSourcePolyfill(sseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Spotify-Access-Token": spotifyAccessToken ?? "",
      },
      withCredentials: true,
    });

    // 연결 성공 시
    eventSourceRef.current.onopen = () => {
      setConnectionStatus("connected");
    };

    // 기본 메시지 처리
    eventSourceRef.current.onmessage = (event) => {
      console.log("기본 메시지:", event.data);
      try {
        const data = event.data;
        const notification: Notification = {
          id: Date.now().toString(),
          message: data,
          timestamp: new Date().toISOString(),
        };
        addNotification(notification);

        // 오프라인 상태일 경우 IndexedDB에 저장
        if (!navigator.onLine && "serviceWorker" in navigator) {
          navigator.serviceWorker.ready.then(() => {
            saveNotificationToIndexedDB(notification);
          });
        }
      } catch (err) {
        console.error("알림 파싱 오류:", err);
      }
    };

    // 초기 연결 이벤트
    eventSourceRef.current.addEventListener("connect", function (event) {
      const e = event as unknown as { data: string };
      try {
        const data = e.data;
        // "SSE 연결 완료" 메시지는 저장하지 않음
        if (data !== "SSE 연결 완료") {
          const notification: Notification = {
            id: Date.now().toString(),
            message: data,
            timestamp: new Date().toISOString(),
          };
          addNotification(notification);
        }
      } catch (err) {
        console.error("연결 메시지 파싱 오류:", err);
      }
    });

    eventSourceRef.current.addEventListener("ping", function (event) {
      const e = event as unknown as { data: string };
      console.log("ping 메시지:", e.data);
      try {
        const notification: Notification = {
          id: Date.now().toString(),
          message: e.data,
          timestamp: new Date().toISOString(),
        };
        addNotification(notification);
      } catch (err) {
        console.error("ping 메시지 파싱 오류:", err);
      }
    });

    // 알림 이벤트
    eventSourceRef.current.addEventListener("notification", function (event) {
      const e = event as unknown as { data: string };
      console.log("알림 메시지:", e.data);
      try {
        // "SSE 연결 완료" 메시지는 저장하지 않음
        if (e.data !== "SSE 연결 완료") {
          // 메시지를 JSON으로 파싱하지 않고 직접 문자열로 사용
          const notification: Notification = {
            id: Date.now().toString(),
            message: e.data,
            timestamp: new Date().toISOString(),
          };
          addNotification(notification);
        }
      } catch (err) {
        console.error("알림 메시지 파싱 오류:", err);
      }
    });

    // 에러 처리
    eventSourceRef.current.onerror = (err) => {
      console.error("에러 발생:", err);
      setConnectionStatus("disconnected");

      // 연결 실패 시 일정 시간 후 재시도
      setTimeout(() => {
        if (navigator.onLine) {
          setupSSEConnection();
        }
      }, 5000); // 5초 후 재시도
    };
  }, [accessToken, spotifyAccessToken, sseUrl, addNotification, setConnectionStatus]);

  useEffect(() => {
    // PWA standalone 모드 감지
    const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches;

    // document 루트에 CSS 변수 설정
    if (isInStandaloneMode) {
      document.documentElement.style.setProperty("--app-height", "100lvh");
    } else {
      document.documentElement.style.setProperty("--app-height", "100svh");
    }

    // display-mode 변경 감지
    const mql = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.style.setProperty("--app-height", e.matches ? "100lvh" : "100svh");
    };

    mql.addEventListener("change", handleChange);

    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, []);

  // 오프라인 상태 감지 및 처리
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      if (navigator.onLine) {
        // 온라인 상태가 되면 서비스 워커에게 동기화 요청
        if ("serviceWorker" in navigator && "SyncManager" in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register("notification-sync").catch((err: Error) => {
              console.error("백그라운드 동기화 등록 실패:", err);
            });
          });
        }

        // SSE 연결 시도
        setupSSEConnection();
        setConnectionStatus("connecting");
      } else {
        // 오프라인 상태가 되면 SSE 연결 종료
        eventSourceRef.current?.close();
        setConnectionStatus("disconnected");
      }
    };

    // 온라인/오프라인 상태 변경 이벤트 리스너 등록
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    // 서비스 워커에서 메시지 수신 처리
    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "OFFLINE_NOTIFICATION") {
        // 서비스 워커에서 수신한 오프라인 알림 처리
        addNotification(event.data.notification);
      }
    };

    // 서비스 워커 메시지 리스너 등록
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", handleServiceWorkerMessage);
    }

    // 초기 상태 확인
    handleOnlineStatusChange();

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handleServiceWorkerMessage);
      }

      // 컴포넌트 언마운트 시 연결 종료
      eventSourceRef.current?.close();
    };
  }, [accessToken, addNotification, setConnectionStatus, setupSSEConnection]);

  // IndexedDB에 알림 저장 (오프라인 상태용)
  const saveNotificationToIndexedDB = async (notification: Notification) => {
    if (!("indexedDB" in window)) return;

    try {
      const request = indexedDB.open("notification-store", 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("notifications")) {
          db.createObjectStore("notifications", { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(["notifications"], "readwrite");
        const store = transaction.objectStore("notifications");
        store.add(notification);
      };
    } catch (error) {
      console.error("알림 저장 중 오류 발생:", error);
    }
  };

  return (
    <Router>
      <NavBar />
      <AppRoutes />
    </Router>
  );
}

export default App;
