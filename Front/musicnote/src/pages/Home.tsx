import UserTemperGraph from "../components/UserTemperGraph";
import logo from "@/assets/logo/logo.png";
import shortLogo from "@/assets/logo/short-logo.png";
import recentPlayedList from "../assets/data/recent-played-list.json";
import { useNavigate } from "react-router-dom";
// import { useGetData } from "../hooks/useApi";

export default function Home() {
  const wordOfToday =
    "오늘은 외향성이 높으시네요. 사람들과 어울리면서 많은 에너지를 얻기를 바라요!";
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center min-h-screen w-full overflow-y-auto bg-level1 md:p-6">
      {/* 로고 + 이름 */}
      <div className="flex flex-row self-start justify-start my-3">
        <img src={logo} alt="logo" className="w-[54px] h-[54px] mb-3" />
        <img src={shortLogo} alt="short-logo" className="h-[54px] mb-3" />
      </div>
      {/* 메인 페이지 */}
      <div className="flex flex-col px-4 gap-y-5 justify-between pb-[82px]">
        <div className="flex flex-col items-center justify-center w-full bg-level2 rounded-lg p-4 px-6 gap-y-2">
          <span className="text-white text-xl font-medium self-start">
            오늘의 한 마디
          </span>
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
              {wordOfToday}
            </span>
          </div>
        </div>
        <UserTemperGraph scores={[75, 59, 85, 39, 51]} />
        <div className="flex flex-col items-center justify-center w-full bg-level2 rounded-lg p-4 gap-y-2">
          <span className="text-white text-xl font-medium self-start">
            최근에 들은 음악
          </span>
          <div 
            className="flex flex-col md:flex-row md:flex-wrap items-start justify-start w-full gap-y-3 md:gap-x-2"
            onClick={() => navigate("/musiclist/최근에-들은-음악")}
            >
            {Array.isArray(recentPlayedList.items) &&
              recentPlayedList.items
                .slice(0, 6)
                .map((item: any, index: number) => (
                  <div
                    key={index}
                    className="recent-played-item flex flex-row items-center justify-start gap-x-2 w-full"
                  >
                    <div className="flex flex-row items-center justify-start gap-x-4 px-4 py-1 rounded-lg w-full">
                      <img
                        src={item.track?.album.images[2].url}
                        alt={item.track?.name}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div className="flex flex-col">
                        <span className="text-light-gray text-sm font-light">
                          {item.track?.artists[0].name || "Unknown Artist"}
                        </span>
                        <span className="text-white text-sm font-medium text-[16px]">
                          {item.track?.name || "Unknown Track"}
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
