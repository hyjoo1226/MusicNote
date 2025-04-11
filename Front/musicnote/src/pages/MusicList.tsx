import TopBar from "../components/layout/TopBar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetData } from "../hooks/useApi";

export default function MusicList() {
  const { reportId } = useParams();
  const { data: musicList } = useGetData(
    `reportId-${reportId}`,
    `recommend/type/music?reportId=${reportId}`
  );
  const [musicListData, setMusicListData] = useState<any>([]);
  useEffect(() => {
    if (musicList) {
      setMusicListData(musicList.data.musicDtoList);
    }
    console.log(musicList);
  }, [musicList]);

  return (
    <div className="text-white w-full h-full">
      <TopBar title={"리포트에 쓰인 음악"} />
      <div className="mt-[20px] flex flex-col items-center justify-center bg-level2 rounded-3xl p-4 mx-[10px] xs:mx-5 border border-solid border-border">
        {musicListData?.map((item: any, index: number) => (
          <div
            key={index}
            className="recent-played-item flex flex-row items-center justify-center py-3 w-full border-b border-solid border-border transition-all duration-200 hover:-translate-y-1 hover:bg-level3 hover:rounded-lg"
          >
            <div className="flex flex-row items-center justify-start gap-x-4 px-1 py-1 rounded-lg w-full">
              <img src={item.imageUrl} alt={item.title} className="w-15 h-15 rounded-lg" />
              <div className="flex flex-col">
                <span className="text-light-gray text-base font-light">
                  {item.artist || "Unknown Artist"}
                </span>
                <span className="text-white text-[20px] font-medium">
                  {item.title || "Unknown Track"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
