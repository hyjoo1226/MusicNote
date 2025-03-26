import Chart from "./Chart";
import Calender from "./Calender";

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
    <div>
      <div className="flex flex-col w-full items-center justify-center">
        <div className="flex flex-col w-full items-center bg-level2 rounded-lg">
          <Chart bigFiveScore={bigFiveScore} />
          <button className="flex items-center justify-center w-[160px] h-[40px] mt-2 mb-[16px] bg-main rounded-lg cursor-pointer">
            <span className="text-white text-base font-medium">
              자세히 보기
            </span>
          </button>
        </div>
      </div>
      <div className="mt-5 w-[300px] h-[300px] bg-level2">
        <Calender />
      </div>
    </div>
  );
}
