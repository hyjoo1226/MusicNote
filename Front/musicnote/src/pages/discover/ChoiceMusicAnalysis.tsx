import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchMusic from "../../features/discover/ChoiceMusicAnalysis/SearchMusic";
import SelectMusicList from "../../features/discover/ChoiceMusicAnalysis/SelectMusicList";
import { usePostData } from "../../hooks/useApi";

export interface Track {
  spotifyId: string;
  title: string;
  artist: string;
  imageUrl: string;
}

export default function ChoiceMusicAnalysis() {
  const navigate = useNavigate();

  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const { mutate: postChoiceMusicData } = usePostData("/main/daily");

  // 선택 곡 리스트 추가 핸들러
  const handleTrackSelect = (track: Track) => {
    setSelectedTracks((prevTracks) => {
      const isTrackSelected = prevTracks.some((t) => t.spotifyId === track.spotifyId);
      if (isTrackSelected) {
        return prevTracks.filter((t) => t.spotifyId !== track.spotifyId);
      } else if (prevTracks.length < 20) {
        return [...prevTracks, track];
      }
      return prevTracks;
    });
  };
  // 선택 곡 리스트 제거 핸들러
  const handleTrackDelete = (trackId: string) => {
    setSelectedTracks((prevTracks) => prevTracks.filter((track) => track.spotifyId !== trackId));
  };

  // 분석하기 버튼 핸들러
  const handleAnalyze = (tracks: Track[]) => {
    if (tracks.length === 0) {
      alert("분석할 곡을 선택해주세요!");
      return;
    }
    // request
    const musicList = tracks.map((track) => ({
      spotifyId: track.spotifyId,
      title: track.title,
      artist: track.artist,
      imageUrl: track.imageUrl,
    }));
    console.log(musicList);

    // POST API
    postChoiceMusicData(musicList, {
      onSuccess: (response) => {
        console.log("성공적으로 전송되었습니다:", response);
      },
      onError: (error) => {
        console.error("데이터 전송 실패:", error);
      },
    });
    navigate("/discover/choice-music-analysis/reports");
  };

  return (
    <div className="text-white w-full h-full">
      <div className="flex flex-row mx-[10px] xs:mx-5 my-5 rounded-2xl px-3 py-1 items-center justify-center w-[calc(100%-20px)] xs:w-[calc(100%-40px)] h-[60px] bg-level2">
        <div className="relative flex items-center justify-center w-full h-full">
          <div
            className="absolute left-0 cursor-pointer xs:w-12 xs:h-12 w-10 h-10 flex items-center justify-center"
            onClick={() => navigate(-1)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6667 19L4 12M4 12L10.6667 5M4 12L20 12"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-white text-xl xs:text-2xl font-bold mt-1">MY Pick 분석</span>
          <div className="absolute right-0 flex cursor-pointer">
            <div className="flex justify-end my-3 mr-3 gap-x-5 items-center">
              <div
                className="flex flex-col justify-center items-center text-center"
                onClick={() => navigate("/discover/choice-music-analysis/reports")}
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer"
                >
                  <path
                    d="M21.6001 6.30004L2.40066 6.29976L2.39941 6.3001M21.6001 6.30004L21.5994 19.6161C21.5994 20.8775 20.5575 21.9001 19.2721 21.9001H4.72669C3.44137 21.9001 2.39941 20.8775 2.39941 19.6161V6.3001M21.6001 6.30004L17.7509 2.45157C17.5258 2.22653 17.2206 2.1001 16.9024 2.1001H7.09647C6.77821 2.1001 6.47299 2.22653 6.24794 2.45157L2.39941 6.3001M15.5994 9.9001C15.5994 11.8883 13.9876 13.5001 11.9994 13.5001C10.0112 13.5001 8.39941 11.8883 8.39941 9.9001"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-end pr-10 text-gray-300 my-2">{selectedTracks.length} / 20</div>
      <SearchMusic onTrackSelect={handleTrackSelect} selectedTracks={selectedTracks} />
      <SelectMusicList
        selectedTracks={selectedTracks}
        onTrackDelete={handleTrackDelete}
        onAnalyze={handleAnalyze}
      />
    </div>
  );
}
