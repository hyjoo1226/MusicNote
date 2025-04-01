import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Chart from "../../features/analysis/Chart";
import Calendar from "../../features/analysis/Calendar";

export default function Analysis() {
  const navigate = useNavigate();
  const [bigFiveScore, setBigFiveScore] = useState<
    {
      bigFive: "개방성" | "성실성" | "외향성" | "우호성" | "신경성";
      User: number;
    }[]
  >([
    { bigFive: "개방성", User: 75 },
    { bigFive: "신경성", User: 59 },
    { bigFive: "우호성", User: 85 },
    { bigFive: "외향성", User: 39 },
    { bigFive: "성실성", User: 51 },
  ]);

  const handleReportClick = () => {
    navigate("/analysis/report");
  };

  const handleDateSelect = (date: Date) => {
    const newScores = bigFiveScore.map((score) => ({
      ...score,
      User: Math.floor(Math.random() * 101), // 0부터 100 사이 랜덤값
    }));
    setBigFiveScore(newScores);
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
        <Calendar onDateSelect={handleDateSelect} />
      </div>
      <div className="mt-4"></div>
    </div>
  );
}
