import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Chart from "../../features/analysis/Chart";
import Calendar from "../../features/analysis/Calendar";
import { ChartType } from "../../features/analysis/AnalysisType";
import { eachDayOfInterval } from "date-fns";
import { useGetData } from "@/hooks/useApi";

interface ReportsData {
  data: {
    responseTypeWithReportIds: {
      cratedAt: string;
      typeDto: {
        openness: number;
        conscientiousness: number;
        extraVersion: number;
        agreeableness: number;
        neuroticism: number;
      };
      reportId: string;
    }[];
  };
}

// Big 5 한글 매핑
export default function Analysis() {
  const navigate = useNavigate();
  const [reportCycle, setReportCycle] = useState<"daily" | "weekly">("daily");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const [targetMonth, setTargetMonth] = useState(new Date());
  const [year, setYear] = useState(targetMonth.getFullYear());
  const [month, setMonth] = useState(targetMonth.getMonth() + 1);

  useEffect(() => {
    setYear(targetMonth.getFullYear());
    setMonth(targetMonth.getMonth() + 1);
  }, [targetMonth]);

  const {
    data: dailyReportsData,
    // isLoading: dailyReportsLoading,
    // isError: dailyReportsError,
  } = useGetData(
    `dailyReportsData-${year}-${month}`, // key
    `/recommend/type/daily?year=${year}&month=${month}` // url
  );

  useEffect(() => {
    console.log(dailyReportsData);
  }, [dailyReportsData]);

  // 주간 리포트 데이터 가져오기
  // const {
  //   data: weeklyReportsData,
  //   isLoading: weeklyReportsLoading,
  //   isError: weeklyReportsError,
  // } = useGetData(
  //   `weeklyReportsData-${year}-${month}`, // key
  //   `/recommend/type/weekly?year=${year}&month=${month}` // url
  // );

  // 주간 리포트
  // const [weeklyReportsData, setWeeklyReportsData] = useState({
  //   data: {
  //     "2025-03-08": {
  //       reportId: "week1",
  //       type: {
  //         openness: 23,
  //         conscientiousness: 17,
  //         extraversion: 73,
  //         agreeableness: 58,
  //         neuroticism: 23,
  //       },
  //     },
  //     "2025-03-15": {
  //       reportId: "week2",
  //       type: {
  //         openness: 23,
  //         conscientiousness: 17,
  //         extraversion: 73,
  //         agreeableness: 58,
  //         neuroticism: 23,
  //       },
  //     },
  //     "2025-03-22": {
  //       reportId: "week3",
  //       type: {
  //         openness: 23,
  //         conscientiousness: 17,
  //         extraversion: 73,
  //         agreeableness: 58,
  //         neuroticism: 23,
  //       },
  //     },
  //   },
  // });

  const [bigFiveScore, setBigFiveScore] = useState<
    {
      bigFive: "개방성" | "성실성" | "외향성" | "우호성" | "신경성";
      User: number;
    }[]
  >(() => {
    // 일간 리포트가 있을 경우 최신순 정렬
    if (dailyReportsData?.data?.responseTypeWithReportIds?.length > 0) {
      const sorted = [...dailyReportsData.data.responseTypeWithReportIds].sort(
        (a, b) => new Date(b.cratedAt).getTime() - new Date(a.cratedAt).getTime()
      );
      const latestReport = sorted[0];
      return [
        { bigFive: "개방성", User: Math.round(latestReport.typeDto.openness * 100) },
        { bigFive: "성실성", User: Math.round(latestReport.typeDto.conscientiousness * 100) },
        { bigFive: "외향성", User: Math.round(latestReport.typeDto.extraVersion * 100) },
        { bigFive: "우호성", User: Math.round(latestReport.typeDto.agreeableness * 100) },
        { bigFive: "신경성", User: Math.round(latestReport.typeDto.neuroticism * 100) },
      ];
    }
    // 기본값
    return [
      {
        bigFive: "개방성",
        User: Math.round(
          dailyReportsData?.data?.responseTypeWithReportIds[0].typeDto.openness * 100
        ),
      },
      {
        bigFive: "성실성",
        User: Math.round(
          dailyReportsData?.data?.responseTypeWithReportIds[0].typeDto.conscientiousness * 100
        ),
      },
      {
        bigFive: "외향성",
        User: Math.round(
          dailyReportsData?.data?.responseTypeWithReportIds[0].typeDto.extraVersion * 100
        ),
      },
      {
        bigFive: "우호성",
        User: Math.round(
          dailyReportsData?.data?.responseTypeWithReportIds[0].typeDto.agreeableness * 100
        ),
      },
      {
        bigFive: "신경성",
        User: Math.round(
          dailyReportsData?.data?.responseTypeWithReportIds[0].typeDto.neuroticism * 100
        ),
      },
    ];
  });

  const handleReportClick = () => {
    navigate(`/analysis/report/${reportCycle}/${selectedReportId}`);
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
      if (!dailyReportsData?.data?.responseTypeWithReportIds) return [];

      return dailyReportsData.data.responseTypeWithReportIds.flatMap((report: any) => {
        const date = new Date(report.cratedAt);
        return eachDayOfInterval({ start: date, end: date });
      });
    } else {
      if (!weeklyReportsData?.data?.responseTypeWithReportIds) return [];

      return weeklyReportsData.data.responseTypeWithReportIds.flatMap((report: any) => {
        const date = new Date(report.cratedAt);
        // 주간 기간은 해당 날짜부터 7일간으로 가정
        const endDate = new Date(date);
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
      if (!dailyReportsData?.data?.responseTypeWithReportIds) return;

      const selectedReport = dailyReportsData.data.responseTypeWithReportIds.find(
        (report: any) => formatDateToString(new Date(report.cratedAt)) === dateString
      );

      if (selectedReport) {
        setSelectedReportId(selectedReport.reportId);
        // API 형식에서 차트 형식으로 변환
        const newScores: ChartType = [
          {
            bigFive: "개방성",
            User: Math.round(selectedReport.typeDto.openness * 100),
          },
          {
            bigFive: "성실성",
            User: Math.round(selectedReport.typeDto.conscientiousness * 100),
          },
          {
            bigFive: "외향성",
            User: Math.round(selectedReport.typeDto.extraVersion * 100),
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
      if (!weeklyReportsData?.data?.responseTypeWithReportIds) return;

      // 주간 리포트는 해당 날짜가 포함된 주의 리포트를 찾음
      const selectedReport = weeklyReportsData.data.responseTypeWithReportIds.find(
        (report: any) => {
          const reportDate = new Date(report.cratedAt);
          const weekEndDate = new Date(reportDate);
          const weekStartDate = new Date(reportDate);
          weekStartDate.setDate(weekEndDate.getDate() - 6);

          return date >= weekStartDate && date <= weekEndDate;
        }
      );

      if (selectedReport) {
        setSelectedReportId(selectedReport.reportId);
        // 주간 리포트 형식에서 차트 형식으로 변환
        const newScores: ChartType = [
          { bigFive: "개방성", User: Math.round(selectedReport.typeDto.openness * 100) },
          { bigFive: "성실성", User: Math.round(selectedReport.typeDto.conscientiousness * 100) },
          { bigFive: "외향성", User: Math.round(selectedReport.typeDto.extraVersion * 100) },
          { bigFive: "우호성", User: Math.round(selectedReport.typeDto.agreeableness * 100) },
          { bigFive: "신경성", User: Math.round(selectedReport.typeDto.neuroticism * 100) },
        ];
        setBigFiveScore(newScores);
      } else {
        console.log(`선택한 날짜에 해당하는 주간 리포트가 없습니다.`);
      }
    }
  };

  // 보고서 주기 변경 핸들러 추가
  const handleReportCycleChange = (cycle: "daily" | "weekly") => {
    setReportCycle(cycle);

    if (cycle === "daily") {
      // 최신 일간 리포트 찾기
      if (!dailyReportsData?.data?.responseTypeWithReportIds?.length) return;

      const sorted = [...dailyReportsData.data.responseTypeWithReportIds].sort(
        (a, b) => new Date(b.cratedAt).getTime() - new Date(a.cratedAt).getTime()
      );

      if (sorted.length > 0) {
        const latest = sorted[0];
        const newScores: ChartType = [
          { bigFive: "개방성", User: Math.round(latest.typeDto.openness * 100) },
          { bigFive: "성실성", User: Math.round(latest.typeDto.conscientiousness * 100) },
          { bigFive: "외향성", User: Math.round(latest.typeDto.extraVersion * 100) },
          { bigFive: "우호성", User: Math.round(latest.typeDto.agreeableness * 100) },
          { bigFive: "신경성", User: Math.round(latest.typeDto.neuroticism * 100) },
        ];
        setBigFiveScore(newScores);
        setSelectedReportId(latest.reportId);
      }
    } else {
      // 최신 주간 리포트 찾기
      if (!weeklyReportsData?.data?.responseTypeWithReportIds?.length) return;

      const sorted = [...weeklyReportsData.data.responseTypeWithReportIds].sort(
        (a, b) => new Date(b.cratedAt).getTime() - new Date(a.cratedAt).getTime()
      );

      if (sorted.length > 0) {
        const latest = sorted[0];
        const newScores: ChartType = [
          { bigFive: "개방성", User: Math.round(latest.typeDto.openness * 100) },
          { bigFive: "성실성", User: Math.round(latest.typeDto.conscientiousness * 100) },
          { bigFive: "외향성", User: Math.round(latest.typeDto.extraVersion * 100) },
          { bigFive: "우호성", User: Math.round(latest.typeDto.agreeableness * 100) },
          { bigFive: "신경성", User: Math.round(latest.typeDto.neuroticism * 100) },
        ];
        setBigFiveScore(newScores);
        setSelectedReportId(latest.reportId);
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
          onMonthChange={(date: Date) => setTargetMonth(date)}
        />
      </div>
      <div className="mt-4"></div>
    </div>
  );
}
