export default function UserTemperGraph({ scores }: { scores: number[] }) {
    const traits = [
        { name: "개방성", key: "openness" },
        { name: "성실성", key: "conscientiousness" },
        { name: "외향성", key: "extraversion" },
        { name: "우호성", key: "agreeableness" },
        { name: "신경성", key: "neuroticism" }
    ];
    
    return (
      <div className="p-2 xs:p-4 bg-level2 rounded-lg w-full">
        <h1 className="text-xl text-white font-medium mb-2">음악이 말해주는 당신</h1>
        <div className="space-y-3">
          {traits.map((trait, index) => (
            <div key={trait.key} className="flex items-center justify-between gap-x-2 pl-2 xs:gap-x-4 xs:pl-4">
              <div className="width-[30px] xs:width-[50px] text-[12px] xs:text-[16px] font-medium text-light-gray">{trait.name}</div>
              <div className={`width-[20px] xs:width-[30px] text-[12px] xs:text-[16px] font-medium text-${trait.key}`}>
                {scores[index]}%
              </div>
              <div className="flex-5 xs:flex-9 bg-level3 rounded-full h-6 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 bg-${trait.key}`}
                  style={{
                    width: `${scores[index]}%`
                  }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
}
  