import { useState, useEffect, useRef } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useAuthStore } from "../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

export default function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const { accessToken } = useAuthStore();
  // 실제 배포 서버 주소
  const sseUrl = "https://j12a308.p.ssafy.io/api/notifications/sse/subscribe";

  useEffect(() => {
    // 토큰은 로컬 스토리지나 상태 관리 라이브러리에서 가져와야 함
    const token = accessToken || "";

    // EventSource 인스턴스 생성
    eventSourceRef.current = new EventSourcePolyfill(sseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    // 연결 성공 시
    eventSourceRef.current.onopen = () => {
      console.log("SSE 연결됨");
      setConnectionStatus("connected");
    };

    // 기본 메시지 처리
    eventSourceRef.current.onmessage = (event) => {
      console.log("기본 메시지:", event.data);
      try {
        const data = event.data;
        setNotifications((prev) => [...prev, data]);
      } catch (err) {
        console.error("알림 파싱 오류:", err);
      }
    };

    // 초기 연결 이벤트
    eventSourceRef.current.addEventListener("connect", function (event) {
      const e = event as unknown as { data: string };
      console.log("초기 연결 메시지:", e.data);
      try {
        const data = e.data;
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            message: data,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.error("연결 메시지 파싱 오류:", err);
      }
    });

    // 알림 이벤트
    eventSourceRef.current.addEventListener("notification", function (event) {
      const e = event as unknown as { data: string };
      console.log("알림 메시지:", e.data);
      try {
        // 메시지를 JSON으로 파싱하지 않고 직접 문자열로 사용
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            message: e.data,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (err) {
        console.error("알림 메시지 파싱 오류:", err);
      }
    });

    // 에러 처리
    eventSourceRef.current.onerror = (err) => {
      console.error("에러 발생:", err);
      setConnectionStatus("disconnected");
    };

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      eventSourceRef.current?.close();
    };
  }, [accessToken]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-500";
      case "disconnected":
        return "text-red-500";
      default:
        return "text-orange-500";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "연결됨";
      case "disconnected":
        return "끊어짐";
      default:
        return "연결 중...";
    }
  };

  // useQuery 훅 직접 사용하여 수동으로 데이터 가져오기
  const { data: Notification, refetch } = useQuery({
    queryKey: ["notification"],
    queryFn: () => apiClient.get("/main/preferences").then((res: any) => res.data),
    enabled: false, // 처음에는 자동 실행하지 않음
  });

  console.log(Notification);

  const handleButtonClick = () => {
    // 버튼 클릭 시 데이터 가져오기
    refetch()
      .then((result) => {
        if (result.data) {
          // Get 요청 결과를 알림에 추가
          setNotifications((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              message: `Get 요청 결과: ${JSON.stringify(result.data)}`,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      })
      .catch((error) => {
        // 오류가 발생하면 오류 메시지를 알림에 추가
        setNotifications((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            message: `Get 요청 오류: ${error.message}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      });
  };

  return (
    <div className="flex flex-col items-center justify-start h-[calc(100vh-80px)] w-full overflow-y-auto bg-level1 xs:p-6">
      {/* 로고 + 이름 */}
      <div className="flex flex-row self-start justify-start my-3 gap-x-1">
        <h1 className="text-white text-2xl font-medium self-center ml-2">알림</h1>
      </div>

      {/* 메인 페이지 */}
      <div className="flex flex-col min-h-[calc(100vh-210px)] h-auto px-4 gap-y-5 justify-start pb-[80px] w-full">
        <div className="flex flex-col items-center justify-evenly w-full bg-level2 rounded-lg p-4 px-6 gap-y-2">
          <div className="flex flex-row items-center justify-between w-full">
            <span className="text-white text-xl font-medium">알림 센터</span>
            <div id="status" className="flex items-center">
              <span className="text-light-gray mr-2">🔌 연결 상태:</span>
              <span className={getStatusColor()}>{getStatusText()}</span>
            </div>
          </div>
          <button onClick={handleButtonClick} className="bg-main text-white px-4 py-2 rounded-md">
            Get 요청 보내기
          </button>

          <div className="w-full mt-4">
            {notifications.length === 0 ? (
              <div className="text-light-gray text-center py-8">새 알림이 없습니다</div>
            ) : (
              <ul className="space-y-3 w-full">
                {notifications.map((notification, index) => (
                  <li
                    key={notification.id || index}
                    className="bg-level1 rounded-lg p-3 flex flex-col"
                  >
                    <div className="flex flex-row items-start">
                      <div className="flex-shrink-0 w-[30px] h-[30px] mr-2">
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 26 27"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.2181 16.9066V21.3835C15.2181 22.09 14.6503 22.6626 13.9499 22.6626H11.4135C10.7132 22.6626 10.1454 22.09 10.1454 21.3835V16.9066M19.0226 11.1505C19.0226 14.6827 16.1837 17.5462 12.6817 17.5462C9.17974 17.5462 6.34082 14.6827 6.34082 11.1505C6.34082 7.61835 9.17974 4.75494 12.6817 4.75494C16.1837 4.75494 19.0226 7.61835 19.0226 11.1505Z"
                            stroke="#FE365E"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-[16px] font-medium whitespace-normal break-keep">
                          {notification.message}
                        </p>
                        <small className="text-light-gray text-xs">
                          {new Date(notification.timestamp).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
