import { useState } from "react";
import { DayPicker, useDayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import "./Calendar.css";

// 일간, 주간, 월간 리포트
// 날짜 하드코딩
const dailyReports = [
  new Date(2025, 2, 8),
  new Date(2025, 2, 9),
  new Date(2025, 2, 11),
];
const weeklyReports = [
  { from: new Date(2025, 2, 17), to: new Date(2025, 2, 23) },
];
const monthlyReports = [
  { from: new Date(2025, 1, 1), to: new Date(2025, 1, 28) },
];

export default function Calendar() {
  // 선택 날짜
  const [selected, setSelected] = useState<Date>();
  // 리포트 주기
  const [reportCycle, setReportCycle] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");
  // 오늘 날짜
  const currentDate = new Date();

  // 리포트 주기 변경
  const getReportDays = () => {
    switch (reportCycle) {
      case "daily":
        return dailyReports;
      case "weekly":
        return weeklyReports;
      case "monthly":
        return monthlyReports;
      default:
        return [];
    }
  };

  function CustomHeader() {
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setReportCycle("daily")}
            className={reportCycle === "daily" ? "active" : ""}
          >
            일간
          </button>
          <button
            onClick={() => setReportCycle("weekly")}
            className={reportCycle === "weekly" ? "active" : ""}
          >
            주간
          </button>
          <button
            onClick={() => setReportCycle("monthly")}
            className={reportCycle === "monthly" ? "active" : ""}
          >
            월간
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        defaultMonth={currentDate}
        components={{ MonthCaption: CustomHeader }}
        modifiers={{
          report: getReportDays(),
        }}
        modifiersClassNames={{
          report: "report-day",
        }}
      />
    </div>
  );
}
