import { useNotificationStore } from "../stores/notificationStore";
import { useGetData } from "@/hooks/useApi";

export default function Notification() {
  const { notifications, connectionStatus, addNotification } = useNotificationStore();

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

  const { refetch: refetchDailyReport } = useGetData("dailyReport", "main/preferences", "default", {
    enabled: false,
  });

  const { refetch: refetchWeeklyReport } = useGetData("weeklyReport", "main/weekly", "default", {
    enabled: false,
  });

  const handleDailyButtonClick = () => {
    // 버튼 클릭 시 데이터 가져오기
    refetchDailyReport()
      .then((result) => {
        if (result.data) {
          // Get 요청 결과를 알림에 추가
          addNotification({
            id: Date.now().toString(),
            message: `일일 리포트 요청 결과: ${JSON.stringify(result.data)}`,
            timestamp: new Date().toISOString(),
          });
        }
      })
      .catch((error) => {
        // 오류가 발생하면 오류 메시지를 알림에 추가
        addNotification({
          id: Date.now().toString(),
          message: `Get 요청 오류: ${error.message}`,
          timestamp: new Date().toISOString(),
        });
      });
  };

  const handleWeeklyButtonClick = () => {
    // 버튼 클릭 시 데이터 가져오기
    refetchWeeklyReport()
      .then((result) => {
        if (result.data) {
          // Get 요청 결과를 알림에 추가
          addNotification({
            id: Date.now().toString(),
            message: `주간 리포트 요청 결과: ${JSON.stringify(result.data)}`,
            timestamp: new Date().toISOString(),
          });
        }
      })
      .catch((error) => {
        // 오류가 발생하면 오류 메시지를 알림에 추가
        addNotification({
          id: Date.now().toString(),
          message: `Get 요청 오류: ${error.message}`,
          timestamp: new Date().toISOString(),
        });
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
          <button
            onClick={handleDailyButtonClick}
            className="bg-main text-white px-4 py-2 rounded-md"
          >
            일일 리포트 요청 보내기
          </button>
          <button
            onClick={handleWeeklyButtonClick}
            className="bg-main text-white px-4 py-2 rounded-md"
          >
            주간 리포트 요청 보내기
          </button>

          <div className="w-full mt-4">
            {notifications.length === 0 ? (
              <div className="text-light-gray text-center py-8">새 알림이 없습니다</div>
            ) : (
              <ul className="space-y-3 w-full">
                {[...notifications]
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((notification, index) => (
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
