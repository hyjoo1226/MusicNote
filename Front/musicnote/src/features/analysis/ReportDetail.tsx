// 상세 리포트 하드코딩
const report = {
  top_score: "neuroticism",
  top_text: "감정 기복이 있으며 불안이나 걱정이 잦을 수 있습니다.",
  low_score: "openness",
  low_text: "새로운 경험보다는 익숙한 것을 선호하는 경향이 있습니다.",
  summary:
    "감정 기복이 있으며 불안이나 걱정이 잦을 수 있습니다. 반면, 새로운 경험보다는 익숙한 것을 선호하는 경향이 있습니다. 따라서 전체적으로 neuroticism 성향이 두드러지며, openness 성향은 낮은 편으로 보입니다.",
};

export default function ReportDetail() {
  return (
    <div className="text-white h-auto p-2 xs:p-4 bg-level2 rounded-lg w-full">
      <h1 className="text-xl text-white font-medium mb-2">상세 리포트</h1>
      <div className="text-[16px]">
        <p className="ml-1">1. 높은 점수 분석</p>
        <p className="text-light-gray ml-3 mt-1">
          {report.top_score} - {report.top_text}
        </p>
        <p className="ml-1 mt-1">2. 낮은 점수 분석</p>
        <p className="text-light-gray ml-3 mt-1">
          {report.low_score} - {report.low_text}
        </p>
        <p className="ml-1 mt-1">3. 종합 분석</p>
        <p className="text-light-gray ml-3 mt-1">{report.summary}</p>
      </div>
    </div>
  );
}
