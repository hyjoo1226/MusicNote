import { useState } from "react";
// import { useEffect, useRef } from "react";
import TopBar from "../../components/layout/TopBar";
import SearchMusic from "../../features/discover/ChoiceMusicAnalysis/SearchMusic";
import SelectMusicList from "../../features/discover/ChoiceMusicAnalysis/SelectMusicList";

export default function ChoiceMusicAnalysis() {
  const [selectedTracks, setSelectedTracks] = useState<any[]>([]);

  // 선택 곡 리스트 추가 핸들러
  const handleTrackSelect = (track: any) => {
    setSelectedTracks((prevTracks) => {
      const isTrackSelected = prevTracks.some((t) => t.id === track.id);
      if (isTrackSelected) {
        return prevTracks.filter((t) => t.id !== track.id);
      } else {
        return [...prevTracks, track];
      }
    });
  };
  // 선택 곡 리스트 제거 핸들러
  const handleTrackDelete = (trackId: string) => {
    setSelectedTracks((prevTracks) => prevTracks.filter((track) => track.id !== trackId));
  };

  // 분석하기 버튼 핸들러
  const handleAnalyze = (tracks: any[]) => {
    const trackIds = tracks.map((track) => track.id);
    console.log("분석할 트랙 ID:", trackIds);
    // 여기에 트랙 ID들을 서버로 보내는 로직 추가
  };

  return (
    <div className="text-white w-full h-full">
      <TopBar title="MyPick 분석" />
      <SearchMusic onTrackSelect={handleTrackSelect} selectedTracks={selectedTracks} />
      <SelectMusicList
        selectedTracks={selectedTracks}
        onTrackDelete={handleTrackDelete}
        onAnalyze={handleAnalyze}
      />
    </div>
  );
}
