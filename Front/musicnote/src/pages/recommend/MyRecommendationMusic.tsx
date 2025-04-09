import TopBar from "@/components/layout/TopBar";
import { useEffect, useState } from "react";
import EmptyHeart from "@/assets/icon/empty-heart.svg?react";
import FilledHeart from "@/assets/icon/filled-heart.svg?react";
import { Music } from "@/features/recommend/recommendType";
import { useGetData, usePostData, useDeleteData } from "@/hooks/useApi";

export default function MyRecommendationMusic() {
  const [musics, setMusics] = useState<Music[]>([]);
  // const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);

  const { data: likedMusics, refetch: refetchLikedMusics } = useGetData(
    "likedMusics",
    "recommend/like/music"
  );
  const {
    mutate: likeMusic,
    isError: isLikeMusicError,
    error: likeMusicError,
  } = usePostData("recommend/like/music");

  const {
    mutate: deleteLikedMusic,
    isError: isDeleteLikedMusicError,
    error: deleteLikedMusicError,
  } = useDeleteData("recommend/like/music");

  const likeHandler = (id: string) => {
    setIsLikeProcessing(true);
    const foundMusic = musics.find((music: Music) => music.id === id);

    // 영화가 존재하고 is_liked가 true인 경우 좋아요 취소
    if (foundMusic && foundMusic.is_liked === true) {
      deleteLikedMusic({
        recommendMusicId: id,
      });
    } else {
      // 그렇지 않으면 좋아요 추가
      likeMusic({
        recommendMusicId: id,
      });
    }
    setMusics(
      musics.map((music) => (music.id === id ? { ...music, is_liked: !music.is_liked } : music))
    );
    setIsLikeProcessing(false);
  };

  useEffect(() => {
    if (isLikeMusicError) {
      console.log(likeMusicError);
    }
  }, [isLikeMusicError, likeMusicError]);

  useEffect(() => {
    if (isDeleteLikedMusicError) {
      console.log(deleteLikedMusicError);
    }
  }, [isDeleteLikedMusicError, deleteLikedMusicError]);

  useEffect(() => {
    if (likedMusics) {
      const musicsWithLiked = likedMusics.data.musics.map((music: Music) => ({
        ...music,
        is_liked: true,
      }));
      setMusics(musicsWithLiked.reverse());
    }
    if (!isUpdated) {
      setIsUpdated(true);
      refetchLikedMusics();
    }
  }, [likedMusics, refetchLikedMusics, isUpdated]);

  // const handleMusicClick = (music: Music) => {
  //   setSelectedMusic(music);
  //   setIsModalOpen(true);
  // };

  return (
    <div className="text-white w-full h-full">
      <TopBar title={"음악 추천 보관함"} />
      <div className="mt-[20px] flex flex-col items-center justify-center bg-level2 rounded-3xl p-2 pb-0 mx-3 xs:mx-5 border border-solid border-border min-h-[calc(100vh-120px)] overflow-y-auto">
        {musics.map((music: Music, index: number) => (
          <div
            key={index}
            className="flex items-center justify-center py-3 w-full border-b border-solid border-border transition-all duration-200 hover:-translate-y-1 hover:bg-level3 hover:rounded-lg"
          >
            <div
              className="flex items-center justify-start gap-x-4 px-3 py-1 rounded-lg w-full"
              // onClick={() => handleMusicClick(music)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={music.albumcover_path}
                alt={music.track_name}
                className="w-[60px] h-[60px] flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-col w-full min-w-0 overflow-hidden">
                <span className="text-light-gray text-sm font-light truncate">
                  {music.artist_name}
                </span>
                <span className="text-white text-base font-medium line-clamp-2">
                  {music.track_name}
                </span>
              </div>
              <div
                className="flex w-10 flex-shrink-0 items-center justify-center hover:translate-y-[-5px] transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  likeHandler(music.id);
                }}
              >
                <div className={`${isLikeProcessing ? "opacity-50 pointer-events-none" : ""}`}>
                  {music.is_liked ? <FilledHeart /> : <EmptyHeart />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
