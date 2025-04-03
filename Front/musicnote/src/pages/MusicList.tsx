import TopBar from "../components/layout/TopBar";
import recentPlayedList from "../assets/data/recent-played-list.json";
import { useParams } from "react-router-dom";

export default function MusicList() {
  let { title } = useParams();
  title = title?.replace(/-/g, " ");

  return (
    <div className="text-white w-full h-full">
      <TopBar title={title || "Unknown Title"} />
      <div className="mt-[20px] flex flex-col items-center justify-center bg-level2 rounded-3xl p-4 mx-[10px] xs:mx-5 border border-solid border-border">
        {recentPlayedList.items.map((item, index) => (
          <div
            key={index}
            className="recent-played-item flex flex-row items-center justify-center py-3 w-full border-b border-solid border-border transition-all duration-200 hover:-translate-y-1 hover:bg-level3 hover:rounded-lg"
          >
            <div className="flex flex-row items-center justify-start gap-x-4 px-1 py-1 rounded-lg w-full">
              <img
                src={item.track?.album.images[1].url}
                alt={item.track?.name}
                className="w-15 h-15 rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-light-gray text-base font-light">
                  {item.track?.artists[0].name || "Unknown Artist"}
                </span>
                <span className="text-white text-[20px] font-medium">
                  {item.track?.name || "Unknown Track"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
