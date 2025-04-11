import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetData } from "@/hooks/useApi";

interface WeeklyReportProps {
  onCalculate?: (scores: number[]) => void;
}

// big5 한글 매핑
const traitMapping: Record<string, string> = {
  openness: "개방성",
  conscientiousness: "성실성",
  extraversion: "외향성",
  agreeableness: "우호성",
  neuroticism: "신경성",
};

export default function WeeklyReport({ onCalculate }: WeeklyReportProps) {
  const { reportId } = useParams();
  const { data: apiResponse, isLoading } = useGetData(
    `weekly-${reportId}`,
    `/type/weekly-report/${reportId}`
  );

  // API 응답에서 실제 report 데이터 추출
  const report = apiResponse?.data;

  // 일주일 평균 점수 계산
  useEffect(() => {
    if (report?.details && report.details.length > 0) {
      const traits = [
        "openness",
        "conscientiousness",
        "extraversion",
        "agreeableness",
        "neuroticism",
      ];
      const sums: Record<string, number> = {};
      const validCounts: Record<string, number> = {};

      // 각 특성별로 모든 details 데이터의 합 계산
      report.details.forEach((detail: any) => {
        traits.forEach((trait) => {
          if (detail[trait] !== null && detail[trait] !== undefined) {
            sums[trait] = (sums[trait] || 0) + detail[trait];
            validCounts[trait] = (validCounts[trait] || 0) + 1;
          }
        });
      });

      // 평균 계산
      const averages: Record<string, number> = {};
      traits.forEach((trait) => {
        if (validCounts[trait] > 0) {
          // 소수점 둘째 자리까지 반올림하여 백분율로 표시
          averages[trait] = Math.round((sums[trait] / validCounts[trait]) * 100);
        } else {
          averages[trait] = 0;
        }
      });

      const scoreArray = [
        averages.openness,
        averages.conscientiousness,
        averages.extraversion,
        averages.agreeableness,
        averages.neuroticism,
      ];
      onCalculate?.(scoreArray);
    }
  }, [report]);

  return (
    <div className="text-white h-auto p-2 xs:p-4 bg-level2 rounded-lg w-full">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1 className="text-xl text-white font-medium mb-2">상세 리포트</h1>
          <div className="text-[16px]">
            <p className="ml-1">1. 주목할 성향</p>
            <p className="text-light-gray ml-3 mt-1">
              가장 많이 상승한 성향{" - "}
              {report?.topGrowth ? traitMapping[report.topGrowth] || report.topGrowth : ""}
            </p>
            <p className="text-light-gray ml-3 mt-1">
              가장 많이 하락한 성향{" - "}
              {report?.topDecline ? traitMapping[report.topDecline] || report.topDecline : ""}
            </p>
            <p className="ml-1 mt-1">2. 요약</p>
            <p className="text-light-gray ml-3 mt-1">{report?.summary || ""}</p>
            <p className="ml-1 mt-1">3. 트렌드 분석</p>
            {report?.trends &&
              Object.entries(report.trends).map(([key, value]) => (
                <p key={key} className="text-light-gray ml-3 mt-1">
                  {/* {traitMapping[key] || key}: {value as string} */}
                  {value as string}
                </p>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
