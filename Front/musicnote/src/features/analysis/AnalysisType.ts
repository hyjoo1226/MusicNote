export interface ChartProps {
  bigFiveScore: ChartType;
}

export type ChartType = {
  bigFive: "개방성" | "성실성" | "외향성" | "우호성" | "신경성";
  User: number;
}[];

// radar chart 커스텀 라벨링 Tyoe
export interface CustomTickProps {
  payload: {
    value: "개방성" | "성실성" | "외향성" | "우호성" | "신경성";
    coordinate: number;
  };
  cx: number;
  cy: number;
  x: number;
  y: number;
}
