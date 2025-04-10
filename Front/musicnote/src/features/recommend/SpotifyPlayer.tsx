import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

// Spotify 타입 정의
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }
}

export default function SpotifyCustomPlayer({ trackId }: { trackId: string }) {
  const [player, setPlayer] = useState<Spotify.Player | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);

  // Spotify 토큰 - 실제 환경에서는 서버에서 가져와야 함
  const { spotifyAccessToken } = useAuthStore();

  useEffect(() => {
    if (!spotifyAccessToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "MusicNote Player",
        getOAuthToken: (cb: (token: string) => void) => {
          if (spotifyAccessToken) {
            cb(spotifyAccessToken);
          }
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);

        // 트랙 재생 (토큰이 있을 때)
        if (spotifyAccessToken && trackId) {
          fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${spotifyAccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uris: [`spotify:track:${trackId}`],
            }),
          });
        }
      });

      player.addListener("player_state_changed", (state: any) => {
        if (state) {
          setCurrentTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
        }
      });

      player.connect();
    };

    return () => {
      // 정리
      if (player) {
        player.disconnect();
      }
    };
  }, [trackId, spotifyAccessToken, player]);

  const togglePlay = () => {
    if (player) {
      player.togglePlay();
    }
  };

  return (
    <div className="spotify-player bg-black p-4 rounded-lg">
      {!spotifyAccessToken ? (
        <div className="flex justify-center items-center h-60">
          <p className="text-white">Spotify 로그인이 필요합니다</p>
        </div>
      ) : currentTrack ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            {currentTrack.album.images[0].url && (
              <img
                src={currentTrack.album.images[0].url}
                alt={currentTrack.name}
                className="w-16 h-16 rounded"
              />
            )}
            <div>
              <h3 className="text-white font-medium">{currentTrack.name}</h3>
              <p className="text-gray-400">{currentTrack.artists[0].name}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-green-500 text-white rounded-full p-3" onClick={togglePlay}>
              {isPlaying ? "일시정지" : "재생"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-60">
          <p className="text-white">로딩 중...</p>
        </div>
      )}
    </div>
  );
}
