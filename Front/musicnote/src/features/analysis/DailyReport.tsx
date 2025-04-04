import { useState, useEffect } from "react";

// 상세 리포트 하드코딩
interface ReportData {
  lowScore: string;
  lowText: string;
  summary: string;
  topScore: string;
  topText: string;
}

export default function DailyReport({ lowScore, lowText, summary, topScore, topText }: ReportData) {
  const [report, setReport] = useState<ReportData>({
    lowScore: "",
    lowText: "",
    summary: "",
    topScore: "",
    topText: "",
  });
  useEffect(() => {
    if (lowScore || lowText || summary || topScore || topText) {
      setReport({ lowScore, lowText, summary, topScore, topText });
    }
  }, [lowScore, lowText, summary, topScore, topText]);

  return (
    <div className="text-white h-auto p-2 xs:p-4 bg-level2 rounded-lg w-full">
      <h1 className="text-xl text-white font-medium mb-2">상세 리포트</h1>
      <div className="text-[16px]">
        <p className="ml-1">1. 높은 점수 분석</p>
        <p className="text-light-gray ml-3 mt-1">
          {report?.topScore} - {report?.topText}
        </p>
        <p className="ml-1 mt-1">2. 낮은 점수 분석</p>
        <p className="text-light-gray ml-3 mt-1">
          {report?.lowScore} - {report?.lowText}
        </p>
        <p className="ml-1 mt-1">3. 종합 분석</p>
        <p className="text-light-gray ml-3 mt-1">{report?.summary}</p>
      </div>
    </div>
  );
}
