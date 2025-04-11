import { useNotificationStore } from "../stores/notificationStore";
import { useGetData } from "@/hooks/useApi";
import { useNavigate } from "react-router-dom";

export default function Notification() {
  const { notifications, addNotification } = useNotificationStore();
  const navigate = useNavigate();

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
          if (result.data.status === 200) {
            addNotification({
              id: Date.now().toString(),
              message: "일일 리포트 요청 성공!",
              timestamp: new Date().toISOString(),
            });
          }
        }
      })
      .catch(() => {
        // 오류가 발생하면 오류 메시지를 알림에 추가
        addNotification({
          id: Date.now().toString(),
          message: `일일 리포트 요청 실패`,
          timestamp: new Date().toISOString(),
        });
      });
  };

  const handleWeeklyButtonClick = () => {
    // 버튼 클릭 시 데이터 가져오기
    refetchWeeklyReport()
      .then((result) => {
        if (result.data.status === 200) {
          // Get 요청 결과를 알림에 추가
          addNotification({
            id: Date.now().toString(),
            message: "주간 리포트 요청 성공!",
            timestamp: new Date().toISOString(),
          });
        }
      })
      .catch(() => {
        // 오류가 발생하면 오류 메시지를 알림에 추가
        addNotification({
          id: Date.now().toString(),
          message: `주간 리포트 요청 실패`,
          timestamp: new Date().toISOString(),
        });
      });
  };

  // 시간 형식 변환 함수 추가
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const pastDate = new Date(timestamp);
    const diffMs = now.getTime() - pastDate.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) {
      return "방금 전";
    } else if (diffHour < 1) {
      return `${diffMin}분 전`;
    } else if (diffDay < 1) {
      return `${diffHour}시간 전`;
    } else if (diffDay < 7) {
      return `${diffDay}일 전`;
    } else {
      const year = pastDate.getFullYear();
      const month = pastDate.getMonth() + 1;
      const day = pastDate.getDate();
      return `${year}. ${month}. ${day}`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-[var(--app-height)] w-full overflow-y-auto bg-level1 xs:p-6">
      <div className="flex flex-row xs:mx-5 my-5 rounded-2xl px-3 py-1 items-center justify-center w-[calc(100%-30px)] h-[60px] bg-level2">
        <div className="relative flex items-center justify-center w-full h-[60px]">
          <div
            className="absolute left-0 cursor-pointer xs:w-12 xs:h-12 w-10 h-10 flex items-center justify-center"
            onClick={() => navigate(-1)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6667 19L4 12M4 12L10.6667 5M4 12L20 12"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-white text-xl xs:text-2xl font-bold mt-1">알림 센터</span>
        </div>
      </div>

      {/* 메인 페이지 */}
      <div className="flex flex-col min-h-[calc(100vh-210px)] h-auto px-4 gap-y-5 justify-start pb-[80px] w-full">
        <div className="flex flex-col items-center justify-evenly w-full bg-level2 rounded-lg p-4 px-6 gap-y-2">
          <div className="flex flex-row items-center justify-evenly w-full">
            <button
              onClick={handleDailyButtonClick}
              className="flex w-5/12 items-center justify-center bg-main text-white text-sm sm:text-base py-2 rounded-md"
            >
              일일 리포트
            </button>
            <button
              onClick={handleWeeklyButtonClick}
              className="flex w-5/12 items-center justify-center bg-main text-white text-sm sm:text-base py-2 rounded-md"
            >
              주간 리포트
            </button>
          </div>
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
                      className={`bg-level1 rounded-lg p-3 flex flex-col ${notification.url ? "cursor-pointer hover:bg-level3" : ""}`}
                      onClick={() => {
                        if (notification.url) {
                          navigate(notification.url);
                        }
                      }}
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
                            {formatTimeAgo(notification.timestamp)}
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
