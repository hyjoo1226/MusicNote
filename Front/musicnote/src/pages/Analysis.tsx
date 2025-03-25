import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

// radar chart 커스텀 라벨링 Tyoe
interface CustomTickProps {
  payload: {
    value: string;
    coordinate: number;
  };
  cx: number;
  cy: number;
  x: number;
  y: number;
}

// big5 알파벳 매핑
const factorToLetter: Record<string, string> = {
  개방성: "O",
  성실성: "C",
  외향성: "E",
  우호성: "A",
  신경성: "N",
};

export default function Analysis() {
  // 데이터 예시 하드코딩
  const data = [
    { bigFive: "개방성", User: 100 },
    { bigFive: "신경성", User: 85 },
    { bigFive: "우호성", User: 86 },
    { bigFive: "외향성", User: 48 },
    { bigFive: "성실성", User: 70 },
  ];

  const topFactorLetters = [...data]
    .sort((a, b) => b.User - a.User)
    .slice(0, 3)
    .map((item) => factorToLetter[item.bigFive]);
  console.log(topFactorLetters);

  // radar chart 커스텀 라벨링 함수
  const renderCustomAxisLabel = ({
    payload,
    cx,
    cy,
    x,
    y,
  }: CustomTickProps) => {
    const radiusOffset = 20; // 축에서 떨어진 거리

    const newX = cx + (x - cx) * ((90 + radiusOffset) / 90); // 좌표계산
    const newY = cy + (y - cy) * ((90 + radiusOffset) / 90);

    return (
      <g>
        {/* 항목 이름 */}
        <text
          x={newX}
          y={newY}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={12}
          fontFamily="var(--font-medium)"
        >
          {payload.value}
        </text>
        {/* 점수 */}
        <text
          x={newX}
          y={newY + 20}
          textAnchor="middle"
          fill="#F78888"
          fontSize={12}
          fontFamily="var(--font-medium)"
        >
          {data.find((item) => item.bigFive === payload.value)?.User}점
        </text>
      </g>
    );
  };

  return (
    <div>
      <RadarChart
        outerRadius={90}
        width={730}
        height={300}
        data={data}
        margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
      >
        <PolarGrid gridType="polygon" radialLines={false} polarRadius={[90]} />

        {/* 커스텀 라벨 적용 */}
        <PolarAngleAxis
          dataKey="bigFive"
          tick={(props) => renderCustomAxisLabel(props)}
        />

        <Radar
          name="성향점수"
          dataKey="User"
          fill="#F78888"
          // stroke="#ffffff"
          fillOpacity={0.8}
        />
        {/* 상위 3요인 표시 */}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#ffffff"
          fontSize={24}
          fontFamily="var(--font-bold)"
        >
          {topFactorLetters.join("")}
        </text>
      </RadarChart>
    </div>
  );
}
