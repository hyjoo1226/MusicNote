import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetData } from "@/hooks/useApi";

// 상세 리포트 하드코딩
// const traitMapping = {
//   openness: "개방성",
//   conscientiousness: "성실성",
//   extraversion: "외향성",
//   agreeableness: "우호성",
//   neuroticism: "신경성",
// };

// const report = {
//   summary:
//     "이번 주 추천된 관심 키워드는 'information, physical, theories, research, apply'입니다. 해당 주제에 대한 탐색을 권장합니다.",
//   trends: {
//     openness: "개방성은 일주일 내내 등락을 반복하며 불안정한 패턴을 보였습니다.",
//     conscientiousness: "성실성은 일주일 내내 등락을 반복하며 불안정한 패턴을 보였습니다.",
//     extraversion: "외향성은 일주일 내내 등락을 반복하며 불안정한 패턴을 보였습니다.",
//     agreeableness: "우호성은 일주일 내내 등락을 반복하며 불안정한 패턴을 보였습니다.",
//     neuroticism: "신경성은 일주일 내내 등락을 반복하며 불안정한 패턴을 보였습니다.",
//   },
//   top_growth: "openness",
//   top_decline: "neuroticism",
//   top_fluctuation: "neuroticism",
// };

export default function WeeklyReport() {
  const { reportId } = useParams();
  const { data: report, isLoading } = useGetData(
    `weekly-${reportId}`,
    `/recommend/type?reportdId=${reportId}`
  );

  useEffect(() => {
    if (report) {
      console.log(report);
    }
  }, [report]);
  return (
    <div className="text-white h-auto p-2 xs:p-4 bg-level2 rounded-lg w-full">
      {isLoading && <div>Loading...</div> ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-xl text-white font-medium mb-2">상세 리포트</h1>
          <div className="text-[16px]">
            {/* 주목할 성향  - 가장 많이 상승, 하락 */}
            <p className="ml-1">1. 주목할 성향</p>
            <p className="text-light-gray ml-3 mt-1">가장 많이 상승 - {report.top_growth}</p>
            <p className="text-light-gray ml-3 mt-1">가장 많이 하락 - {report.top_decline}</p>
            <p className="ml-1 mt-1">2. 요약</p>
            <p className="text-light-gray ml-3 mt-1">{report.summary}</p>
            <p className="ml-1 mt-1">3. 트렌드 분석</p>
            {Object.entries(report.trends).map(([key]) => (
              <p key={key} className="text-light-gray ml-3 mt-1">
                {key}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
