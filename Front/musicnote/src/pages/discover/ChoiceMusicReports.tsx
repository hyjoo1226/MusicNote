import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "@/stores/notificationStore";
import TopBar from "@/components/layout/TopBar";

export default function ChoiceMusicReports() {
  const navigate = useNavigate();
  const notificationStore = useNotificationStore();

  // 수동 요청 & 최신 날짜 순으로 정렬
  const filteredNotifications = notificationStore.notifications
    .filter((notification) => {
      try {
        const messageObject = JSON.parse(notification.message); // `message` 파싱
        return messageObject.type === "수동 요청"; // 타입이 "수동 요청"인 것만 필터링
      } catch (error) {
        console.error("Error parsing message:", error);
        return false; // 파싱 실패 시 제외
      }
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="text-white w-full h-full">
      <TopBar title={"리포트 보관함"} />
      <div className="h-[calc(100vh-100px)] mt-[20px] flex flex-col items-center justify-center bg-level2 rounded-3xl p-4 mx-[10px] xs:mx-5 border border-solid border-border">
        {filteredNotifications.map((notification) => {
          try {
            // `message`를 JSON으로 파싱
            const messageObject = JSON.parse(notification.message);
            return (
              <div
                key={notification.id}
                className="mb-4"
                onClick={() => navigate(`/analysis/report/choice/${messageObject.message}`)} // message 값을 경로에 추가
              >
                <p>분석 리포트: {new Date(notification.timestamp).toLocaleString()}</p>
              </div>
            );
          } catch (error) {
            console.error("Error parsing message in map:", error);
            return null; // 파싱 실패 시 아무것도 렌더링하지 않음
          }
        })}
      </div>
    </div>
  );
}
