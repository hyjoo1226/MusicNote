import { useState, useEffect } from "react";

export default function UserTemperGraph({ scores }: { scores: number[] }) {
  const traits = [
    { name: "개방성", key: "openness" },
    { name: "성실성", key: "conscientiousness" },
    { name: "외향성", key: "extraversion" },
    { name: "우호성", key: "agreeableness" },
    { name: "신경성", key: "neuroticism" },
  ];

  const [animatedScores, setAnimatedScores] = useState(scores);

  // 이징 함수: 처음에는 느리게, 중간에는 빠르게, 끝에는 다시 느리게
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  useEffect(() => {
    // 점수가 0에서 목표값까지 천천히 차오르는 애니메이션 효과
    const animationDuration = 1000; // 애니메이션 총 시간 (ms)
    const steps = 100; // 총 스텝 수
    const stepDuration = animationDuration / steps; // 각 스텝당 시간

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;

      if (currentStep <= steps) {
        // 이징 함수 적용: 0에서 1 사이의 진행도에 이징 적용
        const progress = easeInOutCubic(currentStep / steps);

        const newScores = scores.map((score) => Math.round(score * progress));
        setAnimatedScores(newScores);
      } else {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [scores]);

  return (
    <div className="p-2 xs:p-4 bg-level2 rounded-lg w-full">
      <h1 className="text-xl text-white font-medium mb-2">음악이 말해주는 당신</h1>
      <div className="space-y-3">
        {traits.map((trait, index) => (
          <div
            key={trait.key}
            className="flex items-center justify-between gap-x-2 pl-2 xs:gap-x-4 xs:pl-4"
          >
            <div className="w-[36px] xs:w-[48px] text-xs xs:text-base font-medium text-light-gray">
              {trait.name}
            </div>
            <div
              className={`w-[32px] xs:w-[40px] text-xs xs:text-base font-medium text-${trait.key}`}
            >
              {animatedScores[index]}%
            </div>
            <div className="flex-5 xs:flex-9 bg-level3 rounded-full h-6 overflow-hidden">
              <div
                style={{ width: `${animatedScores[index]}%` }}
                className={`h-full rounded-full bg-${trait.key}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
