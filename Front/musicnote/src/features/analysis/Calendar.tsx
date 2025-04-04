import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { isWithinInterval, eachDayOfInterval, isSameDay } from "date-fns";
import { ko } from "date-fns/locale";
import "react-day-picker/style.css";
import "./Calendar.css";

// 일간, 주간, 월간 리포트
// 날짜 하드코딩
// const dailyReports = [
//   // new Date(2025, 2, 8),
//   // new Date(2025, 2, 9),
//   // new Date(2025, 2, 11),
//   { from: new Date(2025, 1, 1), to: new Date() },
// ];
const weeklyReports = [
  { from: new Date(2025, 1, 23), to: new Date(2025, 2, 1) },
  { from: new Date(2025, 2, 2), to: new Date(2025, 2, 8) },
  { from: new Date(2025, 2, 9), to: new Date(2025, 2, 15) },
  { from: new Date(2025, 2, 16), to: new Date(2025, 2, 22) },
];

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  reportCycle: "daily" | "weekly";
  onReportCycleChange: (cycle: "daily" | "weekly") => void;
  // dailyReports: { from: Date; to: Date }[];
  // weeklyReports: { from: Date; to: Date }[];
  enabledDays: Date[];
  onReportSelect?: (reportId: string) => void;
}

export default function Calendar({
  onDateSelect,
  reportCycle,
  onReportCycleChange,
  // dailyReports,
  // weeklyReports,
  enabledDays,
  onReportSelect,
}: CalendarProps) {
  // 선택 날짜
  const [selected, setSelected] = useState<Date>();
  // 리포트 주기
  // const [reportCycle, setReportCycle] = useState<"daily" | "weekly">("daily");

  const handleDateSelect = (date: Date | undefined) => {
    // 이미 선택된 날짜를 다시 클릭한 경우, 취소하지 않고 유지
    if (date === undefined && selected) {
      return;
    }

    setSelected(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  const getSelectedRangeDays = () => {
    if (!selected || reportCycle === "daily") return [];

    const ranges = weeklyReports;

    const targetRange = ranges.find((range) =>
      isWithinInterval(selected, { start: range.from, end: range.to })
    );

    return targetRange ? eachDayOfInterval({ start: targetRange.from, end: targetRange.to }) : [];
  };

  // 오늘 날짜
  const currentDate = new Date();

  // 활성화 날짜 확인 함수
  const isDayEnabled = (day: Date) => {
    return enabledDays.some((enabledDay) => isSameDay(enabledDay, day));
  };

  // 리포트 주기 변경
  const getReportDays = () => {
    switch (reportCycle) {
      case "daily":
        return enabledDays;
      case "weekly":
        return weeklyReports;
      default:
        return [];
    }
  };

  // 시작일만 반환하는 함수 (주간/월간 전용)
  const getReportStartDays = () => {
    if (reportCycle === "weekly") {
      return weeklyReports.map((range) => range.from);
    }
    return []; // 일간은 빈 배열 반환
  };

  // 종료일만 반환하는 함수 (주간/월간 전용)
  const getReportEndDays = () => {
    if (reportCycle === "weekly") {
      return weeklyReports.map((range) => range.to);
    }
    return []; // 일간은 빈 배열 반환
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-end text-white text-[12px] font-medium">
        <div className="flex w-[100px] m-2 bg-level1 rounded-full">
          <button
            onClick={() => onReportCycleChange("daily")}
            className={`flex flex-grow h-[25px] pt-[2px] justify-center items-center text-center rounded-full ${reportCycle === "daily" ? "bg-main" : ""}`}
          >
            일간
          </button>
          <button
            onClick={() => onReportCycleChange("weekly")}
            className={`flex flex-grow h-[25px] pt-[2px] justify-center items-center text-center rounded-full ${reportCycle === "weekly" ? "bg-main" : ""}`}
          >
            주간
          </button>
        </div>
      </div>
      <div className="flex justify-center text-white text-[12px]">
        <DayPicker
          classNames={{
            selected:
              reportCycle === "weekly"
                ? ""
                : reportCycle === "daily" && selected && enabledDays
                  ? "rounded-full bg-main text-white"
                  : "",
            // selected: `rounded-full bg-main`,
            today: `text-sub`,
            // nav_button: `test-sub bg-sub`,
            // outside: `bg-sub text-sub`,
            // today: `bg-sub rounded-full`,
          }}
          mode="single"
          // formatters={{
          //   formatCaption: (date) => format(date, "yyyy LLLL"),
          // }}
          showOutsideDays
          selected={selected}
          onSelect={handleDateSelect}
          startMonth={new Date(2025, 1)}
          endMonth={currentDate}
          defaultMonth={currentDate}
          fixedWeeks={true}
          captionLayout="dropdown-months"
          disabled={(day) => day > currentDate || !isDayEnabled(day)}
          locale={ko}
          modifiers={{
            report: getReportDays(),
            reportStart: getReportStartDays(),
            reportEnd: getReportEndDays(),
            selectedRange: getSelectedRangeDays(),
            notInReport: (day) => {
              switch (reportCycle) {
                case "daily":
                  return !enabledDays;
                case "weekly":
                  return !weeklyReports.some((report) =>
                    isWithinInterval(day, {
                      start: report.from,
                      end: report.to,
                    })
                  );
                default:
                  return false;
              }
            },
          }}
          modifiersClassNames={{
            report: reportCycle === "daily" ? "daily-report-day" : "report-day",
            reportStart: "report-start-day",
            reportEnd: "report-end-day",
            selectedRange: "selected-range",
            notInReport: "rdp-disabled",
          }}
        />
      </div>
    </div>
  );
}
