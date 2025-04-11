import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";
import NavBar from "./components/layout/NavBar.tsx";
import NotificationPopup from "./components/NotificationPopup.tsx";
import { useEffect, useRef, useCallback } from "react";
import "./styles/Global.css";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useAuthStore } from "./stores/authStore";
import { useNotificationStore, Notification } from "./stores/notificationStore";

// ServiceWorker sync API 타입 확장 - PWA 관련 코드 주석 처리
/*
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
*/

function App() {
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const { accessToken, spotifyAccessToken } = useAuthStore();
  const { setConnectionStatus, addNotification } = useNotificationStore();
  const lastPingRef = useRef<number | null>(null);

  const sseUrl = "https://j12a308.p.ssafy.io/api/notifications/sse/subscribe";

  // SSE 연결 설정 함수
  const setupSSEConnection = useCallback(() => {
    // 기존 연결이 있으면 먼저 닫기
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // 토큰이 없으면 연결하지 않음
    if (!accessToken || !navigator.onLine) {
      setConnectionStatus("disconnected");
      return;
    }

    // EventSource 인스턴스 생성
    eventSourceRef.current = new EventSourcePolyfill(sseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Spotify-Access-Token": spotifyAccessToken ?? "",
      },
      withCredentials: true,
      heartbeatTimeout: 120000, // 120초로 타임아웃 설정 증가
    });

    // 연결 성공 시
    eventSourceRef.current.onopen = () => {
      setConnectionStatus("connected");
    };

    // 기본 메시지 처리
    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = event.data;
        const notification: Notification = {
          id: Date.now().toString(),
          message: data,
          timestamp: new Date().toISOString(),
        };
        addNotification(notification);

        // 오프라인 상태일 경우 IndexedDB에 저장 - PWA 관련 코드 주석 처리
        /*
        if (!navigator.onLine && "serviceWorker" in navigator) {
          navigator.serviceWorker.ready.then(() => {
            saveNotificationToIndexedDB(notification);
          });
        }
        */
      } catch (err) {
        console.error("알림 파싱 오류:", err);
      }
    };

    // // 초기 연결 이벤트
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

    eventSourceRef.current.addEventListener("ping", function (event: any) {
      if (event.data !== "keep-alive") {
        try {
          const notification: Notification = {
            id: Date.now().toString(),
            message: event.data,
            timestamp: new Date().toISOString(),
          };
          addNotification(notification);
        } catch (err) {
          console.error("ping 메시지 파싱 오류:", err);
        }
      }

      // ping 메시지가 오면 마지막 ping 시간 업데이트
      lastPingRef.current = Date.now();
    });

    // 알림 이벤트
    eventSourceRef.current.addEventListener("notification", function (event) {
      const e = event as unknown as { data: string };
      try {
        // "SSE 연결 완료" 메시지는 저장하지 않음
        if (e.data !== "SSE 연결 완료") {
          // JSON 메시지 파싱
          const notificationData = JSON.parse(e.data);
          let url = "";
          let displayMessage = "";
          const reportId = notificationData.message;

          // 알림 타입에 따라 다른 URL과 메시지 설정
          if (notificationData.type === "자동 요청") {
            url = `/analysis/report/daily/${reportId}`;
            displayMessage = "일일 리포트가 도착했어요!";
          } else if (notificationData.type === "수동 요청") {
            url = `/analysis/report/choice/${reportId}`;
            displayMessage = "수동 분석 리포트가 도착했어요!";
          } else if (notificationData.type === "주간 요청") {
            url = `/analysis/report/weekly/${reportId}`;
            displayMessage = "주간 리포트가 도착했어요!";
          } else {
            // 타입이 없거나 알 수 없는 경우 원본 메시지 사용
            displayMessage =
              typeof notificationData === "object" && notificationData?.type
                ? notificationData.type
                : e.data;
          }

          // 이미 같은 내용의 알림이 존재하는지 확인하기 위한 고유 ID 생성
          // reportId가 있는 경우 이를 ID로 활용, 없으면 메시지 내용 기반 ID 생성
          const notificationId = reportId
            ? `${notificationData.type}-${reportId}`
            : Date.now().toString();

          const notification: Notification = {
            id: notificationId,
            message: displayMessage,
            url: url,
            timestamp: new Date().toISOString(),
          };
          addNotification(notification);
        }
      } catch (err) {
        console.error("알림 메시지 파싱 오류:", err);
        // 파싱 오류 시 원본 메시지 그대로 표시
        const notification: Notification = {
          id: Date.now().toString(),
          message: e.data,
          timestamp: new Date().toISOString(),
        };
        addNotification(notification);
      }
    });

    // 에러 처리
    eventSourceRef.current.onerror = (err) => {
      console.error("SSE 에러 발생:", err);
      setConnectionStatus("disconnected");

      // 연결이 닫혔는지 확인
      if (eventSourceRef.current && eventSourceRef.current.readyState === 2) {
        // 연결 종료된 경우에만 재연결 시도
        eventSourceRef.current.close();
        eventSourceRef.current = null;

        // 재연결 시도 (즉시 시도 + 백오프 전략)
        if (navigator.onLine && accessToken) {
          console.log("SSE 즉시 재연결 시도");
          setTimeout(() => setupSSEConnection(), 1000);
        }
      }
    };
  }, [accessToken, spotifyAccessToken, sseUrl, addNotification, setConnectionStatus]);

  // PWA standalone 모드 감지 - 주석 처리
  /*
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
  */

  // Service Worker 업데이트 - PWA 관련 코드 주석 처리
  /*
  useEffect(() => {
    // Service Worker 업데이트 확인 및 적용
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update();
      });

      // 로그인/로그아웃 시 캐시 비우기
      navigator.serviceWorker.ready.then((reg) => {
        reg.active?.postMessage({
          type: "CLEAR_AUTH_CACHE",
        });
      });
    }
  }, [accessToken]);
  */

  // 오프라인 상태 감지 및 처리 - PWA 관련 코드 주석 처리하고 필수 코드만 유지
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      if (navigator.onLine) {
        // 온라인 상태가 되면 서비스 워커에게 동기화 요청 - PWA 관련 코드 주석 처리
        /*
        if ("serviceWorker" in navigator && "SyncManager" in window) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.sync.register("notification-sync").catch((err: Error) => {
              console.error("백그라운드 동기화 등록 실패:", err);
            });
          });
        }
        */

        // SSE 연결 시도
        setupSSEConnection();
        setConnectionStatus("connecting");
      } else {
        // 오프라인 상태가 되면 SSE 연결 종료
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        setConnectionStatus("disconnected");
      }
    };

    // 온라인/오프라인 상태 변경 이벤트 리스너 등록
    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    // 서비스 워커에서 메시지 수신 처리 - PWA 관련 코드 주석 처리
    /*
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
    */

    // 초기 상태 확인
    handleOnlineStatusChange();

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);

      // 서비스 워커 메시지 리스너 제거 - PWA 관련 코드 주석 처리
      /*
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener("message", handleServiceWorkerMessage);
      }
      */

      // 컴포넌트 언마운트 시 연결 종료
      eventSourceRef.current?.close();
    };
  }, [accessToken, addNotification, setConnectionStatus, setupSSEConnection]);

  // 페이지 이동 시에도 SSE 연결 유지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && navigator.onLine && accessToken) {
        // 페이지가 보이면 SSE 연결 상태 확인 후 필요시 재연결
        if (!eventSourceRef.current || eventSourceRef.current.readyState === 2) {
          setupSSEConnection();
        }
      } else if (document.visibilityState === "hidden") {
        // 선택적: 페이지가 숨겨질 때 연결 종료 (배터리/자원 절약)
        // eventSourceRef.current?.close();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // ping 타임아웃 확인을 위한 간격 설정 (30초마다)
    const pingCheckInterval = setInterval(() => {
      // 마지막 ping 이후 2분 이상 경과했고 연결 상태가 connected인 경우
      const now = Date.now();
      if (lastPingRef.current && now - lastPingRef.current > 120000) {
        console.log("Ping 타임아웃, 재연결 시도...");
        // 연결이 끊긴 것으로 판단하고 재연결
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }

        if (navigator.onLine && accessToken) {
          setupSSEConnection();
        }
      }
    }, 30000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(pingCheckInterval);
    };
  }, [accessToken, setupSSEConnection]);

  // IndexedDB에 알림 저장 (오프라인 상태용) - PWA 관련 코드 주석 처리
  /*
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
  */

  return (
    <Router>
      <NavBar />
      <NotificationPopup />
      <AppRoutes />
    </Router>
  );
}

export default App;
