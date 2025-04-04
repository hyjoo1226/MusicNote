import { useState } from "react";
// import { useEffect, useRef } from "react";
import TopBar from "../../components/layout/TopBar";
import SearchMusic from "../../features/discover/ChoiceMusicAnalysis/SearchMusic";
import SelectMusicList from "../../features/discover/ChoiceMusicAnalysis/SelectMusicList";
import { usePostData } from "../../hooks/useApi";

export default function ChoiceMusicAnalysis() {
  const [selectedTracks, setSelectedTracks] = useState<any[]>([]);
  const { mutate: postChoiceMusicData } = usePostData("/main/preferences");

  // 선택 곡 리스트 추가 핸들러
  const handleTrackSelect = (track: any) => {
    setSelectedTracks((prevTracks) => {
      const isTrackSelected = prevTracks.some((t) => t.id === track.id);
      if (isTrackSelected) {
        return prevTracks.filter((t) => t.id !== track.id);
      } else if (prevTracks.length < 20) {
        return [...prevTracks, track];
      }
      return prevTracks;
    });
  };
  // 선택 곡 리스트 제거 핸들러
  const handleTrackDelete = (trackId: string) => {
    setSelectedTracks((prevTracks) => prevTracks.filter((track) => track.id !== trackId));
  };

  // 분석하기 버튼 핸들러
  const handleAnalyze = (tracks: any[]) => {
    if (tracks.length === 0) {
      alert("분석할 곡을 선택해주세요!");
      return;
    }
    // request
    const musicList = tracks.map((track) => ({
      spotifyId: track.id,
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(", "),
      imageUrl: track.album?.images?.[0]?.url,
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
  };

  return (
    <div className="text-white w-full h-full">
      <TopBar title="MyPick 분석" />
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
