import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/layout/TopBar";
import { useGetData } from "@/hooks/useApi";

export default function ChoiceMusicReports() {
  const navigate = useNavigate();
  const { data: choiceMusicData } = useGetData("ChoiceMusicData", "type/daily-report");
  const [choiceMusicReports, setChoiceMusicReports] = useState<any[]>([]);
  useEffect(() => {
    if (choiceMusicData) {
      setChoiceMusicReports(choiceMusicData.data.reverse());
    }
  }, [choiceMusicData]);

  // const queryKeys = reportIds.map((id) => `report-${id}`);
  // const queryUrls = reportIds.map((id) => `/type/daily-report/${id}`);

  // // 병렬 API 호출
  // const reportResults = useGetMultipleData(queryKeys, queryUrls);

  // // 로딩 상태 확인
  // const isLoading = reportResults.some((result) => result.isLoading);
  // const error = reportResults.find((result) => result.error)?.error;

  // if (isLoading) return <div className="text-white">로딩 중...</div>;
  // if (error) return <div className="text-red-500">오류 발생: {error.message}</div>;

  return (
    <div className="text-white w-full h-full">
      <TopBar title={"리포트 보관함"} />
      <div className="mt-[20px] flex flex-col items-center justify-center bg-level2 rounded-3xl p-4 mx-[10px] xs:mx-5">
        {choiceMusicReports.map((report) => {
          // 음악 리스트와 첫 번째 곡 정보 가져오기
          const musicList = report?.musicList || [];
          const firstTrack = musicList[0] || {}; // 첫 번째 트랙 또는 빈 객체
          const totalTracks = musicList.length;

          return (
            <div
              key={report.id}
              className="mb-4 cursor-pointer w-full border-b border-solid border-border"
              onClick={() => navigate(`/analysis/report/choice/${report.id}`)}
            >
              <div className="flex items-center space-x-4 p-3 hover:bg-level3 rounded-lg transition-colors">
                {/* 곡 이미지 */}
                {firstTrack.imageUrl ? (
                  <img
                    src={firstTrack.imageUrl}
                    alt={firstTrack.title || "음악 이미지"}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-gray-700 flex items-center justify-center">
                    <p className="text-sm text-gray-400">No Image</p>
                  </div>
                )}

                <div className="flex-1 text-base font-medium truncate">
                  {/* 아티스트 - 제목 */}
                  <p className="text-light-gray font-light text-[14px] truncate">
                    {firstTrack.artist || "Unknown Artist"}
                  </p>
                  <p className="truncate">{firstTrack.title || "Unknown Track"}</p>

                  {/* 곡 수와 시간 */}
                  <div className="mt-2 flex justify-end items-center text-xs text-light-gray">
                    <p className="mr-3">{`총 ${totalTracks}곡`}</p>

                    {/* 시간 표시 */}
                    <p>
                      {new Date(report.createdAt)
                        .toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .replace(/\. /g, ".")
                        .replace(/\.$/, "")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
