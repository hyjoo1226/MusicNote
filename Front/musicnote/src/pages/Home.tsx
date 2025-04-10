import UserTemperGraph from "../components/UserTemperGraph";
import logo from "@/assets/logo/logo.png";
import shortLogo from "@/assets/logo/short-logo.png";
import DetailButton from "../components/buttons/DetailButton";
import { useGetData } from "../hooks/useApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotificationIcon from "@/assets/icon/notification.svg?react";
export default function Home() {
  const { data: today, isLoading } = useGetData("today", "recommend/home");
  const [wordOfToday, setWordOfToday] = useState("");
  const [todayScores, setTodayScores] = useState([0, 0, 0, 0, 0]);
  const [recentPlayedList, setRecentPlayedList] = useState([]);
  const [reportId, setReportId] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (today) {
      setWordOfToday(today.data.todayMessage);
      setTodayScores([
        today.data.typeDto.openness * 100,
        today.data.typeDto.conscientiousness * 100,
        today.data.typeDto.extraversion * 100,
        today.data.typeDto.agreeableness * 100,
        today.data.typeDto.neuroticism * 100,
      ]);
      setRecentPlayedList(today.data.musicDtoList);
      setReportId(today.data.reportId);
    }
  }, [today]);

  return (
    <div className="flex flex-col items-center justify-start h-[calc(var(--app-height)-80px)] w-full overflow-y-auto bg-level1 xs:p-6">
      {/* 로고 + 이름 */}
      <div className="flex flex-row w-full self-start justify-between items-center my-3 pr-6">
        <div className="flex flex-row items-center justify-center gap-x-2">
          <img src={logo} alt="logo" className="w-[54px] h-[54px] mb-3" />
          <img src={shortLogo} alt="short-logo" className="h-[54px] mb-3" />
        </div>
        <div
          className="flex flex-row items-center justify-center gap-x-2 cursor-pointer bg-level2 rounded-full w-10 h-10"
          onClick={() => navigate(`/notification`)}
        >
          <NotificationIcon />
        </div>
      </div>
      {/* 메인 페이지 */}
      <div className="flex flex-col min-h-[calc(var(--app-height)-210px)] h-auto px-4 gap-y-5 justify-evenly pb-[80px]">
        <div
          className="flex flex-col items-center justify-evenly w-full bg-level2 rounded-lg p-4 px-6 gap-y-2 cursor-pointer"
          onClick={() => navigate(`/analysis/report/daily/${reportId}`)}
        >
          <span className="text-white text-xl font-medium self-start">오늘의 한 마디</span>
          <div className="flex flex-row items-center justify-start gap-x-2">
            <div className="flex-shrink-0 w-[30px] h-[30px]">
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
            <span className="flex-1 text-light-gray text-[16px] font-medium whitespace-normal break-keep">
              {isLoading ? "로딩 중" : wordOfToday}
            </span>
          </div>
        </div>
        <div
          onClick={() => navigate(`/analysis/report/daily/${reportId}`)}
          className="cursor-pointer"
        >
          <UserTemperGraph scores={todayScores} />
        </div>
        <div className="flex flex-col items-center justify-center w-full bg-level2 rounded-lg p-4 gap-y-2">
          <div className="flex flex-row items-center justify-between w-full">
            <span className="text-white text-xl font-medium self-start">최근에 들은 음악</span>
            <DetailButton url={`/musiclist/${reportId}`} />
          </div>
          <div className="flex flex-col items-start justify-start w-full gap-y-3">
            {Array.isArray(recentPlayedList) &&
              recentPlayedList.slice(0, 6).map((item: any) => (
                <div
                  key={item.spotifyId}
                  className="recent-played-item flex flex-row items-center justify-start gap-x-2 w-full"
                >
                  <div className="flex flex-row items-center justify-start gap-x-4 px-4 py-1 rounded-lg w-full">
                    <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-lg" />
                    <div className="flex flex-col">
                      <span className="text-light-gray text-sm font-light">{item.artist}</span>
                      <span className="text-white text-sm font-medium text-[16px]">
                        {item.title}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
