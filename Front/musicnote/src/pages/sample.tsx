export default function Home() {
  return (
    <div className="p-6 flex flex-col gap-6">
      {/* 기본 배경색과 텍스트 색상 사용 */}
      <div className="bg-level2 p-4 rounded-lg">
        <span className="text-main text-4xl">기본 색상 사용</span>
      </div>

      {/* 성격 특성 배경과 텍스트 조합 */}
      <div className="bg-openness p-4 rounded-lg">
        <span className="text-[var(--color-sub)] text-2xl font-bold">
          개방성 배경에 연한 회색 텍스트
        </span>
      </div>

      {/* 투명도 조절 (color-mix 기능 활용) */}
      <div className="bg-level1 p-4 rounded-lg">
        <span className="text-main/75 text-2xl">투명도가 적용된 색상</span>
      </div>

      {/* 호버 효과 */}
      <div className="bg-[var(--color-sub)] hover:bg-[var(--color-main)] p-4 rounded-lg">
        <span className="text-gray text-xl">호버 시 색상 변경</span>
      </div>

      {/* 그라디언트 사용 */}
      <div className="bg-linear-to-t text-openness text-conscientiousness text-agreeableness text-neuroticism text-extraversion bg-conscientiousness bg-extraversion bg-openness bg-agreeableness bg-neuroticism bg-neuroticism from-main to-sub p-4 rounded-lg">
        <span className="text-white/100 font-bold text-2xl">그라디언트 배경</span>
      </div>

      {/* 테두리 */}
      <div className="bg-level2 border-2 border-main p-4 rounded-lg">
        <span className="text-extraversion text-xl">테두리와 그림자</span>
      </div>

      {/* 반응형 디자인 */}
      <div className="bg-level3 p-4 rounded-lg md:bg-conscientiousness lg:bg-agreeableness">
        <span className="text-white text-sm md:text-xl lg:text-2xl">반응형 배경 및 텍스트</span>
      </div>
    </div>
  );
}
