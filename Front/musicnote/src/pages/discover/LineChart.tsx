import { useState, useEffect, useRef } from "react";
import TopBar from "@/components/layout/TopBar";

interface LineDataType {
  id: number;
  name: string;
  values: number[];
  color: string;
}

const traitColors: Record<string, string> = {
  개방성: "var(--color-openness)",
  성실성: "var(--color-conscientiousness)",
  외향성: "var(--color-extraversion)",
  우호성: "var(--color-agreeableness)",
  신경성: "var(--color-neuroticism)",
};

export default function LineTrend() {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const [selectedLines, setSelectedLines] = useState<number[]>([]); // 여러 라인 선택 가능
  const [lineWidth, setLineWidth] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const lineContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateLineWidth = () => {
      if (lineContainerRef.current) {
        const containerWidth = lineContainerRef.current.clientWidth;
        const availableWidth = containerWidth - 40; // 좌우 패딩 20px씩
        const newWidth = Math.max(320, Math.min(600, availableWidth)); // 최소 320, 최대 600
        setLineWidth(newWidth);

        // 화면 너비가 430px 이하인지 체크
        setIsSmallScreen(window.innerWidth <= 430);
      }
    };

    updateLineWidth();
    window.addEventListener("resize", updateLineWidth);
    return () => window.removeEventListener("resize", updateLineWidth);
  }, []);

  const lineData: LineDataType[] = [
    { id: 1, name: "개방성", values: [65, 59, 80, 81, 56, 55, 40], color: traitColors["개방성"] },
    { id: 2, name: "성실성", values: [28, 48, 40, 19, 86, 27, 90], color: traitColors["성실성"] },
    { id: 3, name: "외향성", values: [80, 40, 32, 45, 78, 52, 63], color: traitColors["외향성"] },
    { id: 4, name: "우호성", values: [45, 70, 75, 38, 25, 60, 85], color: traitColors["우호성"] },
    { id: 5, name: "신경성", values: [20, 35, 60, 90, 50, 75, 30], color: traitColors["신경성"] },
  ];

  // 첫 번째 줄에 표시할 항목들 (개방성, 성실성, 외향성)
  const firstRowItems = lineData.filter((line) => line.id <= 3);
  // 두 번째 줄에 표시할 항목들 (우호성, 신경성)
  const secondRowItems = lineData.filter((line) => line.id > 3);

  const height = 400;
  const padding = 40;
  const lineContentWidth = lineWidth - padding * 2;
  const lineHeight = height - padding * 2;

  const xPoints = lineData[0].values.map(
    (_, i) => padding + i * (lineContentWidth / (lineData[0].values.length - 1))
  );

  // 범례 클릭 핸들러
  const handleLegendClick = (lineId: number) => {
    setSelectedLines((prev) => {
      // 이미 선택된 라인이면 제거
      if (prev.includes(lineId)) {
        return prev.filter((id) => id !== lineId);
      }
      // 아니면 추가
      else {
        return [...prev, lineId];
      }
    });
  };

  // 범례 아이템 렌더링 함수
  const renderLegendItem = (line: LineDataType) => {
    const isSelected = selectedLines.includes(line.id);
    const isActive = isSelected || (hoveredLine === line.id && !selectedLines.length);

    return (
      <div
        key={line.id}
        className="legend-item flex items-center gap-2 cursor-pointer"
        onMouseEnter={() => setHoveredLine(line.id)}
        onMouseLeave={() => setHoveredLine(null)}
        onClick={() => handleLegendClick(line.id)}
      >
        <div
          className="legend-color w-4 h-4 rounded-full"
          style={{
            backgroundColor: line.color,
            opacity: selectedLines.length === 0 || isActive ? 1 : 0.3,
          }}
        ></div>
        <span
          className="legend-name text-sm"
          style={{
            color: selectedLines.length === 0 || isActive ? line.color : "gray",
          }}
        >
          {line.name}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full items-center text-white">
      <TopBar title="성향 트렌드" />
      <div
        className="flex flex-col w-[calc(100vw-40px)] max-w-[560px] items-center p-2 bg-level2 line-container rounded-lg"
        ref={lineContainerRef}
      >
        <p className="pt-5 mb-4 text-center text-light-gray">
          성향을 클릭하면 자세한 점수를 확인할 수 있습니다.
        </p>

        {/* 범례 */}
        {isSmallScreen ? (
          // 작은 화면에서 두 줄로 표시
          <div className="line-legend flex flex-col gap-2 items-center">
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {firstRowItems.map(renderLegendItem)}
            </div>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {secondRowItems.map(renderLegendItem)}
            </div>
          </div>
        ) : (
          // 큰 화면에서 한 줄로 표시
          <div className="line-legend flex flex-wrap gap-4 justify-center items-center">
            {lineData.map(renderLegendItem)}
          </div>
        )}

        {/* 그래프 */}
        <div className="svg-container mt-6">
          <svg width={lineWidth} height={height}>
            {[0, 25, 50, 75, 100].map((tick) => (
              <line
                key={tick}
                x1={padding}
                y1={padding + lineHeight - (tick / 100) * lineHeight}
                x2={lineWidth - padding}
                y2={padding + lineHeight - (tick / 100) * lineHeight}
                stroke="#eee"
                strokeDasharray="5,5"
                opacity={0.3}
              />
            ))}

            {lineData.map((line) => {
              const yPoints = line.values.map(
                (val) => padding + lineHeight - (val / 100) * lineHeight
              );

              const isSelected = selectedLines.includes(line.id);
              const isHovered = hoveredLine === line.id;
              const isActive = isSelected || (isHovered && selectedLines.length === 0);

              const pathData = xPoints
                .map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${yPoints[i]}`)
                .join(" ");

              return (
                <g key={line.id}>
                  <path
                    d={pathData}
                    stroke={line.color}
                    strokeWidth={isActive ? 6 : 4}
                    fill="none"
                    strokeLinecap="round"
                    opacity={selectedLines.length === 0 || isActive ? 1 : 0.2}
                  />
                  {isSelected &&
                    xPoints.map((x, i) => (
                      <text
                        key={i}
                        x={x}
                        y={yPoints[i] - 20}
                        fill={line.color}
                        fontWeight="bold"
                        fontSize="12"
                        textAnchor="middle"
                      >
                        {line.values[i]}
                      </text>
                    ))}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
