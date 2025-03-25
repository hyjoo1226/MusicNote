import { RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { ChartProps, CustomTickProps } from "./AnalysisType";

// big5 알파벳 매핑
const factorToLetter: Record<string, string> = {
  개방성: "O",
  성실성: "C",
  외향성: "E",
  우호성: "A",
  신경성: "N",
};
// big5 색상 매핑
const traitColors: Record<string, string> = {
  개방성: "var(--color-openness)",
  성실성: "var(--color-conscientiousness)",
  외향성: "var(--color-extraversion)",
  우호성: "var(--color-agreeableness)",
  신경성: "var(--color-neuroticism)",
};

export default function Chart({ bigFiveScore }: ChartProps) {
  // 상위 3요인
  const topFactorLetters = [...bigFiveScore]
    .sort((a, b) => b.User - a.User)
    .slice(0, 3)
    .map((item) => factorToLetter[item.bigFive]);

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
          fill={traitColors[payload.value]}
          fontSize={12}
          fontFamily="var(--font-medium)"
        >
          {bigFiveScore.find((item) => item.bigFive === payload.value)?.User}점
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
        data={bigFiveScore}
        margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
      >
        <PolarGrid
          gridType="polygon"
          radialLines={true}
          polarAngles={[90, 162, 234, 306, 378]}
          polarRadius={[10, 50, 90]}
          opacity={0.4}
        />

        {/* 커스텀 라벨 적용 */}
        <PolarAngleAxis
          dataKey="bigFive"
          tick={(props) => renderCustomAxisLabel(props)}
        />

        <Radar
          name="성향점수"
          dataKey="User"
          fill="#F78888"
          stroke="#F78888"
          strokeWidth={4}
          fillOpacity={0}
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
