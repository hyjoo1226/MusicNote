import { useState, useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";
import SearchIcon from "../../../assets/icon/search-icon.svg?react";
import { Track } from "./ChoiceMusicAnalysis";

interface SearchMusicProps {
  onTrackSelect: (track: Track) => void;
  selectedTracks: Track[];
}

export default function SearchMusic({ onTrackSelect, selectedTracks }: SearchMusicProps) {
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [query, setQuery] = useState("");
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [debouncedQuery] = useDebounce(query, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spotify access_token
  const tokenData = JSON.parse(localStorage.getItem("spotify_token_data") || "{}");

  // 검색 디바운스
  useEffect(() => {
    if (!debouncedQuery.trim()) return;

    const url = new URL("https://api.spotify.com/v1/search");
    url.searchParams.append("q", debouncedQuery);
    url.searchParams.append("type", "track");
    url.searchParams.append("limit", "20");

    const fetchSearchData = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSearchResults(data.tracks.items);
        setIsResultsVisible(true); // 새로운 검색 시 결과창 자동 열림
      } catch (error) {
        console.error("Search failed:", error);
      }
    };

    fetchSearchData();
  }, [debouncedQuery, tokenData.access_token]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        isResultsVisible
      ) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isResultsVisible]);

  const handleTrackSelect = (track: any) => {
    onTrackSelect(track);
    setIsResultsVisible(false); // 트랙 선택 시 결과창 닫기
    inputRef.current?.blur(); // 인풋 포커스 해제
  };

  return (
    <div className="w-full px-5 relative" ref={containerRef}>
      <div className="w-full flex justify-between p-2 shadow-gray shadow-md text-white">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsResultsVisible(true)} // 인풋 클릭 시 결과창 열기
          placeholder="곡을 입력해주세요."
          className="flex-grow outline-none"
        />
        <SearchIcon className="flex-shrink-0" />
      </div>

      {isResultsVisible && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-100 mt-2 mx-[20px] bg-level3 rounded-lg shadow-xl max-h-[300px] overflow-y-auto">
          {searchResults.map((track) => (
            <div
              key={track.id}
              className={`p-3 cursor-pointer ${
                selectedTracks.some((t) => t.id === track.id) ? "bg-sub" : ""
              }`}
              onClick={() => handleTrackSelect(track)}
            >
              <div className="flex items-center gap-3">
                <img
                  src={track.album.images[0]?.url}
                  alt="album cover"
                  className="w-10 h-10 flex-shrink-0"
                />
                <div className="pt-1 min-w-0 overflow-hidden">
                  <p className="text-light-gray font-light text-sm truncate">
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </p>
                  <p className="truncate">{track.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
