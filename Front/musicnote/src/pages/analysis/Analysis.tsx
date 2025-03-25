import Chart from "./Chart";

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
      <div className="bg-level2">
        <Chart bigFiveScore={bigFiveScore} />
      </div>
    </div>
  );
}
