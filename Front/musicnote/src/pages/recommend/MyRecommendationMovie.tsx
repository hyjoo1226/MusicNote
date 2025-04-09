import TopBar from "@/components/layout/TopBar";
import { useEffect, useState } from "react";
import EmptyHeart from "@/assets/icon/empty-heart.svg?react";
import FilledHeart from "@/assets/icon/filled-heart.svg?react";
import RecommandModalMovie from "@/features/recommend/RecommandModalMovie";
import { Movie } from "@/features/recommend/recommendType";
import { useGetData, usePostData, useDeleteData } from "@/hooks/useApi";

export default function MyRecommendationMovie() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);

  const { data: likedMovies, refetch: refetchLikedMovies } = useGetData(
    "likedMovies",
    "recommend/like/movie"
  );

  const {
    mutate: likeMovie,
    isError: isLikeMovieError,
    error: likeMovieError,
  } = usePostData("recommend/like/movie");

  const {
    mutate: deleteLikedMovie,
    isError: isDeleteLikedMovieError,
    error: deleteLikedMovieError,
  } = useDeleteData("recommend/like/movie");

  const likeHandler = (id: string) => {
    setIsLikeProcessing(true);
    const foundMovie = movies.find((movie: Movie) => movie.id === id);

    // 영화가 존재하고 is_liked가 true인 경우 좋아요 취소
    if (foundMovie && foundMovie.is_liked === true) {
      deleteLikedMovie({
        recommendMovieId: id,
      });
    } else {
      // 그렇지 않으면 좋아요 추가
      likeMovie({
        recommendMovieId: id,
      });
    }
    setMovies(
      movies.map((movie) => (movie.id === id ? { ...movie, is_liked: !movie.is_liked } : movie))
    );
    setIsLikeProcessing(false);
  };

  useEffect(() => {
    if (isLikeMovieError) {
      console.log(likeMovieError);
    }
  }, [isLikeMovieError, likeMovieError]);

  useEffect(() => {
    if (isDeleteLikedMovieError) {
      console.log(deleteLikedMovieError);
    }
  }, [isDeleteLikedMovieError, deleteLikedMovieError]);

  useEffect(() => {
    if (likedMovies) {
      const moviesWithLiked = likedMovies.data.movies.map((movie: Movie) => ({
        ...movie,
        is_liked: true,
      }));
      setMovies(moviesWithLiked.reverse());
    }
    if (!isUpdated) {
      setIsUpdated(true);
      refetchLikedMovies();
    }
  }, [likedMovies, refetchLikedMovies, isUpdated]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <div className="text-white w-full h-full">
      <TopBar title={"영화 추천 보관함"} />
      <div className="mt-[20px] flex flex-col items-center justify-center bg-level2 rounded-3xl p-2 pb-0 mx-3 xs:mx-5 border border-solid border-border min-h-[calc(100vh-120px)] overflow-y-auto">
        {movies.map((movie: Movie, index: number) => (
          <div
            key={index}
            className="flex items-center justify-center py-3 w-full border-b border-solid border-border transition-all duration-200 hover:-translate-y-1 hover:bg-level3 hover:rounded-lg"
          >
            <div
              className="flex items-center justify-start gap-x-4 px-3 py-1 rounded-lg w-full"
              onClick={() => handleMovieClick(movie)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="w-[60px] h-[60px] flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-col w-full min-w-0 overflow-hidden">
                <span className="text-light-gray text-sm font-light truncate">
                  {movie.genres.join("/")}
                </span>
                <span className="text-white text-base font-medium line-clamp-2">{movie.title}</span>
              </div>
              <div
                className="flex w-10 flex-shrink-0 items-center justify-center hover:translate-y-[-5px] transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  likeHandler(movie.id);
                }}
              >
                <div className={`${isLikeProcessing ? "opacity-50 pointer-events-none" : ""}`}>
                  {movie.is_liked ? <FilledHeart /> : <EmptyHeart />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-[20px]"></div>
      {isModalOpen && selectedMovie && (
        <RecommandModalMovie movie={selectedMovie} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
