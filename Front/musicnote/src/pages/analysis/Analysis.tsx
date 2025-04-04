import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Chart from "../../features/analysis/Chart";
import Calendar from "../../features/analysis/Calendar";
import { ChartType } from "../../features/analysis/AnalysisType";
import { eachDayOfInterval } from "date-fns";

// Big 5 한글 매핑
const traitMapping = {
  openness: "개방성",
  conscientiousness: "성실성",
  extraversion: "외향성",
  agreeableness: "우호성",
  neuroticism: "신경성",
};

export default function Analysis() {
  const navigate = useNavigate();
  const [reportCycle, setReportCycle] = useState<"daily" | "weekly">("daily");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // 더미 데이터: 일간 리포트
  const [dailyReportsData, setDailyReportsData] = useState({
    data: [
      {
        createdAt: "2025-03-03T13:33:55.502",
        reportId: "1234asd",
        typeDto: {
          openness: 0.23,
          conscientiousness: 0.17,
          extraversion: 0.73,
          agreeableness: 0.58,
          neuroticism: 0.23,
        },
      },
      {
        createdAt: "2025-03-05T13:33:55.502",
        reportId: "5678qwe",
        typeDto: {
          openness: 0.453,
          conscientiousness: 0.627,
          extraversion: 0.313,
          agreeableness: 0.773,
          neuroticism: 0.193,
        },
      },
      {
        createdAt: "2025-03-10T13:33:55.502",
        reportId: "9101xyz",
        typeDto: {
          openness: 0.683,
          conscientiousness: 0.423,
          extraversion: 0.513,
          agreeableness: 0.333,
          neuroticism: 0.653,
        },
      },
      {
        createdAt: "2025-04-04",
        reportId: "9101xyq",
        typeDto: {
          openness: 0.2,
          conscientiousness: 0.3,
          extraversion: 0.51,
          agreeableness: 0.33,
          neuroticism: 0.65,
        },
      },
    ],
  });
  // 주간 리포트
  const [weeklyReportsData, setWeeklyReportsData] = useState({
    data: {
      "2025-03-08": {
        reportId: "week1",
        type: {
          openness: 23,
          conscientiousness: 17,
          extraversion: 73,
          agreeableness: 58,
          neuroticism: 23,
        },
      },
      "2025-03-15": {
        reportId: "week2",
        type: {
          openness: 23,
          conscientiousness: 17,
          extraversion: 73,
          agreeableness: 58,
          neuroticism: 23,
        },
      },
      "2025-03-22": {
        reportId: "week3",
        type: {
          openness: 23,
          conscientiousness: 17,
          extraversion: 73,
          agreeableness: 58,
          neuroticism: 23,
        },
      },
    },
  });

  const [bigFiveScore, setBigFiveScore] = useState<
    {
      bigFive: "개방성" | "성실성" | "외향성" | "우호성" | "신경성";
      User: number;
    }[]
  >(() => {
    // 일간 리포트가 있을 경우 최신순 정렬
    if (dailyReportsData.data.length > 0) {
      const sorted = [...dailyReportsData.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const latestReport = sorted[0];
      return [
        { bigFive: "개방성", User: Math.round(latestReport.typeDto.openness * 100) },
        { bigFive: "성실성", User: Math.round(latestReport.typeDto.conscientiousness * 100) },
        { bigFive: "외향성", User: Math.round(latestReport.typeDto.extraversion * 100) },
        { bigFive: "우호성", User: Math.round(latestReport.typeDto.agreeableness * 100) },
        { bigFive: "신경성", User: Math.round(latestReport.typeDto.neuroticism * 100) },
      ];
    }
    // 기본값
    return [
      { bigFive: "개방성", User: 0 },
      { bigFive: "신경성", User: 0 },
      { bigFive: "우호성", User: 0 },
      { bigFive: "외향성", User: 0 },
      { bigFive: "성실성", User: 0 },
    ];
  });

  const handleReportClick = () => {
    navigate(`/analysis/report/${reportCycle}`);
    // navigate(`/analysis/report/${selectedReportId}`);
  };

  // Date 객체를 YYYY-MM-DD 형식으로 변환
  const formatDateToString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 리포트 데이터 기반 활성화 날짜 계산
  const getEnabledDays = () => {
    if (reportCycle === "daily") {
      return dailyReportsData.data.flatMap((report) => {
        const date = new Date(report.createdAt);
        return eachDayOfInterval({ start: date, end: date });
      });
    } else {
      return Object.keys(weeklyReportsData.data).flatMap((dateStr) => {
        const endDate = new Date(dateStr);
        const startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 6);
        return eachDayOfInterval({ start: startDate, end: endDate });
      });
    }
  };

  // 날짜 선택 핸들러 - API 응답 데이터 포맷에 맞게 수정
  const handleDateSelect = (date: Date) => {
    if (!date) return;

    const dateString = formatDateToString(date); // YYYY-MM-DD 형식

    if (reportCycle === "daily") {
      // 일간 리포트 데이터 찾기
      const selectedReport = dailyReportsData.data.find(
        (report) => formatDateToString(new Date(report.createdAt)) === dateString
      );

      if (selectedReport) {
        setSelectedReportId(selectedReport.reportId);
        // if (selectedReportId) {
        //   console.log(selectedReportId);
        // }
        // API 형식에서 차트 형식으로 변환
        const newScores: ChartType = [
          {
            bigFive: "개방성",
            User: Math.round(selectedReport.typeDto.openness * 100), // ✨ 0.45 → 45점 변환
          },
          {
            bigFive: "성실성",
            User: Math.round(selectedReport.typeDto.conscientiousness * 100),
          },
          {
            bigFive: "외향성",
            User: Math.round(selectedReport.typeDto.extraversion * 100),
          },
          {
            bigFive: "우호성",
            User: Math.round(selectedReport.typeDto.agreeableness * 100),
          },
          {
            bigFive: "신경성",
            User: Math.round(selectedReport.typeDto.neuroticism * 100),
          },
        ];
        setBigFiveScore(newScores);
      } else {
        console.log(`${dateString}에 해당하는 일간 리포트가 없습니다.`);
      }
    } else {
      // 주간 리포트 데이터 찾기
      // 주간 리포트는 주 마지막 날짜(토요일)로 저장됨
      const weekEndDate = new Date(date);
      const day = weekEndDate.getDay();
      const diff = day === 6 ? 0 : 6 - day; // 토요일(6)까지의 차이
      weekEndDate.setDate(weekEndDate.getDate() + diff);

      const weekEndDateString = formatDateToString(weekEndDate);

      if (weeklyReportsData.data[weekEndDateString]) {
        const reportData = weeklyReportsData.data[weekEndDateString].temper;
        setSelectedReportId(weeklyReportsData.data[weekEndDateString].reportId);
        // 주간 리포트 형식에서 차트 형식으로 변환
        const newScores = [
          { bigFive: "개방성", User: reportData.O },
          { bigFive: "성실성", User: reportData.C },
          { bigFive: "외향성", User: reportData.E },
          { bigFive: "우호성", User: reportData.A },
          { bigFive: "신경성", User: reportData.N },
        ];
        setBigFiveScore(newScores);
      } else {
        console.log(`${weekEndDateString}에 해당하는 주간 리포트가 없습니다.`);
      }
    }
  };

  // 보고서 주기 변경 핸들러 추가
  const handleReportCycleChange = (cycle: "daily" | "weekly") => {
    setReportCycle(cycle);

    if (cycle === "daily") {
      // 최신 일간 리포트 찾기
      const sorted = [...dailyReportsData.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      if (sorted.length > 0) {
        const latest = sorted[0];
        const newScores: ChartType = [
          { bigFive: "개방성", User: latest.typeDto.openness * 100 },
          { bigFive: "성실성", User: latest.typeDto.conscientiousness * 100 },
          { bigFive: "외향성", User: latest.typeDto.extraversion * 100 },
          { bigFive: "우호성", User: latest.typeDto.agreeableness * 100 },
          { bigFive: "신경성", User: latest.typeDto.neuroticism * 100 },
        ];
        setBigFiveScore(newScores);
      }
    } else {
      // 최신 주간 리포트 찾기
      const weeklyDates = Object.keys(weeklyReportsData.data);
      if (weeklyDates.length > 0) {
        const sortedDates = weeklyDates.sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );
        const latestDate = sortedDates[0];
        const reportData = weeklyReportsData.data[latestDate].temper;
        const newScores = [
          { bigFive: "개방성", User: reportData.O },
          { bigFive: "성실성", User: reportData.C },
          { bigFive: "외향성", User: reportData.E },
          { bigFive: "우호성", User: reportData.A },
          { bigFive: "신경성", User: reportData.N },
        ];
        setBigFiveScore(newScores);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col max-w-[480px] pb-[80px] justify-evenly items-center overflow-y-auto">
      <div className="mt-4"></div>
      <div className="flex flex-col w-[calc(100%-40px)] items-center bg-level2 rounded-lg pb-2">
        <Chart bigFiveScore={bigFiveScore} />
        <button
          onClick={handleReportClick}
          className="flex items-center justify-center w-[160px] h-[40px] mb-[8px] bg-main rounded-lg cursor-pointer"
        >
          <span className="text-white text-base font-medium">자세히 보기</span>
        </button>
      </div>
      <div className="w-[calc(100%-40px)] bg-level2 mt-2 p-2 rounded-lg">
        <Calendar
          onDateSelect={handleDateSelect}
          reportCycle={reportCycle}
          onReportCycleChange={handleReportCycleChange}
          enabledDays={getEnabledDays()}
          onReportSelect={(reportId) => setSelectedReportId(reportId)}
        />
      </div>
      <div className="mt-4"></div>
    </div>
  );
}
