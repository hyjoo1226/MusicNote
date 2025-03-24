export default function UserTemperGraph({ scores }: { scores: number[] }) {
    const traits = [
        { name: "개방성", key: "openness" },
        { name: "성실성", key: "conscientiousness" },
        { name: "외향성", key: "extraversion" },
        { name: "우호성", key: "agreeableness" },
        { name: "신경성", key: "neuroticism" }
    ];
    
    return (
      <div className="p-4 bg-level2 rounded-lg w-full">
        <h1 className="text-xl text-white font-medium mb-2">음악이 말해주는 당신</h1>
        <div className="space-y-3">
          {traits.map((trait, index) => (
            <div key={trait.key} className="flex items-center justify-center gap-x-4 pl-4">
              <div className="flex-sm-3 flex-md-2 text-[16px] font-medium text-light-gray">{trait.name}</div>
              <div className={`flex-sm-2 flex-md-1 text-[16px] font-medium text-${trait.key}`}>
                {scores[index]}%
              </div>
              <div className="flex-8 bg-level3 rounded-full h-6 overflow-hidden">
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
  