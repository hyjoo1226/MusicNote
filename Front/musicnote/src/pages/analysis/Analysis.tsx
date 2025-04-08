import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Chart from "../../features/analysis/Chart";
import Calendar from "../../features/analysis/Calendar";
import { ChartType } from "../../features/analysis/AnalysisType";
import { eachDayOfInterval } from "date-fns";
import { useGetData } from "@/hooks/useApi";

// 주간리포트 데이터 예시 하드코딩
// 주간은 한 달 기준 전체 제공(마지막 날짜가 해당 월에 포함되게)
// const weeklyReportsData = {
//   userId: "1",
//   createdAt: "2025-04-07T01:22:48.142Z",
//   trends: {
//     openness: "개방성은 일주일간 큰 변화 없이 안정적인 수준을 유지했습니다.",
//     conscientiousness: "성실성은 일주일간 큰 변화 없이 안정적인 수준을 유지했습니다.",
//     extraversion: "외향성은 일주일간 큰 변화 없이 안정적인 수준을 유지했습니다.",
//     agreeableness: "우호성은 일주일간 큰 변화 없이 안정적인 수준을 유지했습니다.",
//     neuroticism: "신경성은 일주일간 큰 변화 없이 안정적인 수준을 유지했습니다.",
//   },
//   summary:
//     "이번 주 추천된 관심 키워드는 '기계, 주차, 차량, 공공의, 자동차'입니다. 해당 주제에 대한 탐색을 권장합니다.",
//   top_growth: "openness",
//   top_decline: "openness",
//   top_fluctuation: "openness",
//   details: [
//     {
//       createdAt: "2025-04-05T01:22:48.142Z",
//       openness: 0.324496,
//       conscientiousness: 0.48983,
//       extraversion: 0.740454,
//       agreeableness: 0.410705,
//       neuroticism: 0.813998,
//     },
//     {
//       createdAt: "2025-04-04T01:20:00.000Z",
//       openness: 0.300201,
//       conscientiousness: 0.50231,
//       extraversion: 0.731289,
//       agreeableness: 0.418732,
//       neuroticism: 0.801832,
//     },
//     {
//       createdAt: "2025-04-03T01:18:00.000Z",
//       openness: 0.310012,
//       conscientiousness: 0.497654,
//       extraversion: 0.728954,
//       agreeableness: 0.415001,
//       neuroticism: 0.808345,
//     },
//     {
//       createdAt: "2025-04-02T01:15:00.000Z",
//       openness: 0.327894,
//       conscientiousness: 0.491123,
//       extraversion: 0.735567,
//       agreeableness: 0.412789,
//       neuroticism: 0.805678,
//     },
//     {
//       createdAt: "2025-04-01T01:12:00.000Z",
//       openness: 0.322456,
//       conscientiousness: 0.488777,
//       extraversion: 0.738901,
//       agreeableness: 0.409876,
//       neuroticism: 0.810342,
//     },
//     {
//       createdAt: "2025-03-31T01:12:00.000Z",
//       openness: null,
//       conscientiousness: null,
//       extraversion: null,
//       agreeableness: null,
//       neuroticism: null,
//     },
//     {
//       createdAt: "2025-03-30T01:12:00.000Z",
//       openness: null,
//       conscientiousness: null,
//       extraversion: null,
//       agreeableness: null,
//       neuroticism: null,
//     },
//   ],
// };

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

  const { data: dailyReportsData } = useGetData(
    `dailyReportsData-${year}-${month}`, // key
    `/recommend/type/daily?year=${year}&month=${month}` // url
  );

  const { data: weeklyReportsData } = useGetData(
    `weeklyReportsData-${year}-${month}`, // key
    `type/weekly-report?year=${year}&month=${month}` // url
  );

  useEffect(() => {
    if (weeklyReportsData?.data) {
      // 주간 리포트 데이터를 일요일 기준으로 정렬
      const sortedReports = [...weeklyReportsData.data].sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      // 각 리포트의 details를 일요일 기준으로 정렬
      sortedReports.forEach((report: any) => {
        report.details.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA.getTime() - dateB.getTime();
        });
      });

      console.log("정렬된 주간 리포트:", sortedReports);
    }
  }, [weeklyReportsData]);

  // big5 초기 점수
  const [bigFiveScore, setBigFiveScore] = useState<ChartType>([
    { bigFive: "개방성", User: 0 },
    { bigFive: "성실성", User: 0 },
    { bigFive: "외향성", User: 0 },
    { bigFive: "우호성", User: 0 },
    { bigFive: "신경성", User: 0 },
  ]);
  useEffect(() => {
    if (dailyReportsData?.data?.responseTypeWithReportIds?.length > 0) {
      const sorted = [...dailyReportsData.data.responseTypeWithReportIds].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const latestReport = sorted[0];

      setBigFiveScore([
        { bigFive: "개방성", User: Math.round(latestReport.typeDto.openness * 100) },
        { bigFive: "성실성", User: Math.round(latestReport.typeDto.conscientiousness * 100) },
        { bigFive: "외향성", User: Math.round(latestReport.typeDto.extraversion * 100) },
        { bigFive: "우호성", User: Math.round(latestReport.typeDto.agreeableness * 100) },
        { bigFive: "신경성", User: Math.round(latestReport.typeDto.neuroticism * 100) },
      ]);
    }
  }, [dailyReportsData]);

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
        const date = new Date(report.createdAt);
        return eachDayOfInterval({ start: date, end: date });
      });
    } else {
      if (!weeklyReportsData?.data) return [];
      return weeklyReportsData.data.map((report: any) => {
        const date = new Date(report.createdAt);
        // 주간 기간을 일요일부터 토요일까지로 고정
        const endDate = new Date(date);
        const startDate = new Date(endDate);

        // 선택한 날짜가 속한 주의 일요일과 토요일 찾기
        const dayOfWeek = endDate.getDay(); // 0: 일요일, 6: 토요일
        startDate.setDate(endDate.getDate() - dayOfWeek); // 일요일로 설정
        endDate.setDate(startDate.getDate() + 6); // 토요일로 설정

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
        (report: any) => formatDateToString(new Date(report.createdAt)) === dateString
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
      if (!weeklyReportsData?.data) return;

      // 선택한 날짜가 속한 주의 일요일 찾기
      const selectedDate = new Date(date);
      const dayOfWeek = selectedDate.getDay();
      const sunday = new Date(selectedDate);
      sunday.setDate(selectedDate.getDate() - dayOfWeek);
      const sundayString = formatDateToString(sunday);

      // 해당 일요일에 해당하는 주간 리포트 찾기
      const selectedReport = weeklyReportsData.data.find((report: any) => {
        const reportDate = new Date(report.createdAt);
        const reportSunday = new Date(reportDate);
        reportSunday.setDate(reportDate.getDate() - reportDate.getDay());
        return formatDateToString(reportSunday) === sundayString;
      });

      if (selectedReport) {
        setSelectedReportId(selectedReport.id);
        // 주간 리포트의 평균값 계산
        const avgScores = selectedReport.details.reduce(
          (acc: any, detail: any) => {
            acc.openness += detail.openness;
            acc.conscientiousness += detail.conscientiousness;
            acc.extraversion += detail.extraversion;
            acc.agreeableness += detail.agreeableness;
            acc.neuroticism += detail.neuroticism;
            return acc;
          },
          {
            openness: 0,
            conscientiousness: 0,
            extraversion: 0,
            agreeableness: 0,
            neuroticism: 0,
          }
        );

        const count = selectedReport.details.length;
        const newScores: ChartType = [
          { bigFive: "개방성", User: Math.round((avgScores.openness / count) * 100) },
          { bigFive: "성실성", User: Math.round((avgScores.conscientiousness / count) * 100) },
          { bigFive: "외향성", User: Math.round((avgScores.extraversion / count) * 100) },
          { bigFive: "우호성", User: Math.round((avgScores.agreeableness / count) * 100) },
          { bigFive: "신경성", User: Math.round((avgScores.neuroticism / count) * 100) },
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
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      if (sorted.length > 0) {
        const latest = sorted[0];
        const newScores: ChartType = [
          { bigFive: "개방성", User: Math.round(latest.typeDto.openness * 100) },
          { bigFive: "성실성", User: Math.round(latest.typeDto.conscientiousness * 100) },
          { bigFive: "외향성", User: Math.round(latest.typeDto.extraversion * 100) },
          { bigFive: "우호성", User: Math.round(latest.typeDto.agreeableness * 100) },
          { bigFive: "신경성", User: Math.round(latest.typeDto.neuroticism * 100) },
        ];
        setBigFiveScore(newScores);
        setSelectedReportId(latest.reportId);
      }
    } else {
      // 최신 주간 리포트 찾기
      // if (!weeklyReportsData?.data?.responseTypeWithReportIds?.length) return;

      // const sorted = [...weeklyReportsData.data.responseTypeWithReportIds].sort(
      //   (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      // );

      // if (sorted.length > 0) {
      //   const latest = sorted[0];
      //   const newScores: ChartType = [
      //     { bigFive: "개방성", User: Math.round(latest.typeDto.openness * 100) },
      //     { bigFive: "성실성", User: Math.round(latest.typeDto.conscientiousness * 100) },
      //     { bigFive: "외향성", User: Math.round(latest.typeDto.extraversion * 100) },
      //     { bigFive: "우호성", User: Math.round(latest.typeDto.agreeableness * 100) },
      //     { bigFive: "신경성", User: Math.round(latest.typeDto.neuroticism * 100) },
      //   ];
      //   setBigFiveScore(newScores);
      //   setSelectedReportId(latest.reportId);
      // }
      return;
    }
  };

  // useEffect(() => {
  //   console.log("selectedReportId가 변경되었습니다:", selectedReportId);
  // }, [selectedReportId]);

  // 초기 selectedReportId 설정
  useEffect(() => {
    if (reportCycle === "daily") {
      // 일간 리포트 최신 ID 설정
      if (dailyReportsData?.data?.responseTypeWithReportIds?.length > 0) {
        const sorted = [...dailyReportsData.data.responseTypeWithReportIds].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSelectedReportId(sorted[0].reportId);
      }
    } else {
      // 주간 리포트 최신 ID 설정 (주간 리포트 API 사용 시 활성화)
      // if (weeklyReportsData?.data?.responseTypeWithReportIds?.length > 0) {
      //   const sorted = [...weeklyReportsData.data.responseTypeWithReportIds].sort(
      //     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      //   );
      //   setSelectedReportId(sorted[0].reportId);
      // }
      return;
    }
    // }, [dailyReportsData, weeklyReportsData, reportCycle]);
  }, [dailyReportsData, reportCycle]);

  return (
    <div className="h-full w-full flex flex-col max-w-[480px] justify-evenly items-center overflow-y-auto">
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
