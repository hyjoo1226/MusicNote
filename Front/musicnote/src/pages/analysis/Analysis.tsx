import Chart from "./Chart";
import Calendar from "./Calendar";

export default function Analysis() {
  // 데이터 예시 하드코딩
  const bigFiveScore: {
    bigFive: "개방성" | "성실성" | "외향성" | "우호성" | "신경성";
    User: number;
  }[] = [
    { bigFive: "개방성", User: 100 },
    { bigFive: "신경성", User: 85 },
    { bigFive: "우호성", User: 86 },
    { bigFive: "외향성", User: 48 },
    { bigFive: "성실성", User: 70 },
  ];

  return (
    <div className="h-full w-full flex flex-col items-center overflow-y-auto">
      <div className="mt-4"></div>
      <div className="flex flex-col w-full mx-5 pb-[80px] justify-center items-center">
        <div className="flex flex-col w-full px-5 items-center justify-center">
          <div className="flex flex-col w-full items-center bg-level2 rounded-lg">
            <Chart bigFiveScore={bigFiveScore} />
            <button className="flex items-center justify-center w-[160px] h-[40px] mb-[8px] bg-main rounded-lg cursor-pointer">
              <span className="text-white text-base font-medium">
                자세히 보기
              </span>
            </button>
          </div>
        </div>
        <div className="w-[calc(100%-40px)] bg-level2 mt-2 p-2 rounded-lg">
          <Calendar />
        </div>
      </div>
    </div>
  );
}
