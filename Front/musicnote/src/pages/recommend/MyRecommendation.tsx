import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/layout/TopBar";
import Mascot from "@/assets/logo/mascot.webp";
import { useGetData } from "@/hooks/useApi";
import { Movie, Music, Book } from "@/features/recommend/recommendType";

export default function MyRecommendation() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [musics, setMusics] = useState<Music[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  const [isMovieUpdated, setIsMovieUpdated] = useState(false);
  const [isMusicUpdated, setIsMusicUpdated] = useState(false);
  const [isBookUpdated, setIsBookUpdated] = useState(false);

  const navigate = useNavigate();
  const {
    data: likedMovies,
    isError: likedMoviesError,
    refetch: refetchLikedMovies,
  } = useGetData("likedMovies", "recommend/like/movie");
  const {
    data: likedMusic,
    isError: likedMusicError,
    refetch: refetchLikedMusic,
  } = useGetData("likedMusic", "recommend/like/music");
  const {
    data: likedBook,
    isError: likedBookError,
    refetch: refetchLikedBook,
  } = useGetData("likedBook", "recommend/like/book");

  useEffect(() => {
    if (likedMovies) {
      setMovies(likedMovies.data.movies.reverse());
    }
    if (!isMovieUpdated) {
      setIsMovieUpdated(true);
      refetchLikedMovies();
    }
  }, [likedMovies, refetchLikedMovies, isMovieUpdated]);

  useEffect(() => {
    if (likedMusic) {
      setMusics(likedMusic.data.musics.reverse());
    }
    if (!isMusicUpdated) {
      setIsMusicUpdated(true);
      refetchLikedMusic();
    }
  }, [likedMusic, refetchLikedMusic, isMusicUpdated]);

  useEffect(() => {
    if (likedBook) {
      setBooks(likedBook.data.books.reverse());
    }
    if (!isBookUpdated) {
      setIsBookUpdated(true);
      refetchLikedBook();
    }
  }, [likedBook, refetchLikedBook, isBookUpdated]);

  useEffect(() => {
    if (likedMoviesError || likedMusicError || likedBookError) {
      console.log(likedMoviesError, likedMusicError, likedBookError);
    }
  }, [likedMoviesError, likedMusicError, likedBookError]);

  return (
    <div className="text-white w-full h-full max-h-full flex flex-col items-center overflow-y-auto">
      <TopBar title="추천 보관함" />
      <div className="flex flex-col items-center justify-center w-auto mx-3 xs:mx-5 mb-3 xs:mb-5 p-2 pb-0 bg-level2 rounded-md">
        <div className="flex flex-row items-end justify-between w-full px-2">
          <h3 className="text-xl h-[26px] xs:h-[30px] xs:text-2xl font-bold">영화</h3>
          {movies?.length > 0 && (
            <span
              className="text-light-gray text-sm xs:text-base cursor-pointer"
              onClick={() => navigate("/recommendations/my/movie")}
            >
              전체보기
            </span>
          )}
        </div>
        {movies.length > 0 ? (
          <div className="content-box grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-2 bg-level3 rounded-sm m-1 p-2 min-h-[290px] max-h-[435px] sm:min-h-[146px] h-[calc((100vw-60px)/3*5/3*2)] xs:h-[calc((100vw-75px)/3*5/3*2)] sm:h-[calc((100vw-75px)/3*5/2)] min-w-[280px] max-w-[535px] w-[calc(100vw-45px)] xs:w-[calc(100vw-65px)]">
            {movies.map(
              (movie, index) =>
                index < 8 && (
                  <div key={index} className={`${index >= 6 ? "hidden sm:block" : ""}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full aspect-[3/5] object-cover rounded-sm"
                    />
                  </div>
                )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-2 gap-y-2  m-1 p-2 items-center justify-center min-h-[290px] max-h-[420px] sm:min-h-[146px] h-[calc((100vw-60px)/3*5/3*2)] xs:h-[calc((100vw-75px)/3*5/3*2)] sm:h-[calc((100vw-75px)/3*5/2)] min-w-[300px] max-w-[535px] w-[calc(100vw-45px)] xs:w-[calc(100vw-65px)]">
            <img
              src={Mascot}
              alt="mascot"
              className="w-full sm:w-4/5 aspect-[1/1] object-cover rounded-sm"
            />
            <div className="grid grid-cols-1 gap-y-4 items-center justify-center">
              <span className="text-light-gray text-sm xs:text-base sm:text-sm md:text-base">
                좋아요 누른
                <br /> 영화가 없짹.
                <br /> 영화 추천 받으러
                <br /> 가보겠짹?
              </span>
              <button
                className="bg-main w-auto text-white text-sm xs:text-base sm:text-sm md:text-base mx-2 px-2 py-1 rounded-xl"
                onClick={() => navigate("/recommendations/detail/movie")}
              >
                영화 추천
                <br />
                받으러 가기
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center w-auto mx-3 xs:mx-5 mb-3 xs:mb-5 p-2 bg-level2 rounded-sm">
        <div className="flex flex-row items-end justify-between w-full px-2">
          <h3 className="text-xl h-[26px] xs:h-[30px] xs:text-2xl font-bold">음악</h3>
          {musics.length > 0 && (
            <button
              className="text-light-gray text-sm xs:text-base cursor-pointer"
              onClick={() => navigate("/recommendations/my/music")}
            >
              전체보기
            </button>
          )}
        </div>
        {musics.length > 0 ? (
          <div className="content-box grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-2 bg-level2 rounded-sm m-1 p-2 min-h-[290px] sm:min-h-[146px] max-h-[435px] sm:max-h-[440px] h-[calc((100vw-60px)/3*5/3*2)] xs:h-[calc((100vw-75px)/3*5/3*2)] sm:h-[calc((100vw-75px)/3*5/4*2)] min-w-[280px] max-w-[535px] w-[calc(100vw-45px)] xs:w-[calc(100vw-65px)]">
            {musics.map(
              (music, index) =>
                index < 8 && (
                  <div
                    key={music.id}
                    className={`bg-level3 w-full aspect-[2/3] rounded-sm text-center ${index >= 6 ? "hidden sm:block" : ""}`}
                  >
                    <img
                      src={music.albumcover_path}
                      alt={music.track_name}
                      className="w-full aspect-[1/1] object-cover rounded-t-sm mb-1 xs:mb-2"
                    />
                    <div className="flex flex-col w-full items-center justify-center h-2/5">
                      <span className="flex items-center justify-center text-sm line-clamp-2 h-[70%]">
                        {music.track_name}
                      </span>
                      <span className="text-xs text-light-gray line-clamp-1 h-[30%]">
                        {music.artist_name}
                      </span>
                    </div>
                  </div>
                )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-2 gap-y-2  m-1 p-2 items-center justify-center min-h-[290px] max-h-[420px] sm:min-h-[146px] h-[calc((100vw-60px)/3*5/3*2)] xs:h-[calc((100vw-75px)/3*5/3*2)] sm:h-[calc((100vw-75px)/3*5/2)] min-w-[280px] max-w-[535px] w-[calc(100vw-45px)] xs:w-[calc(100vw-65px)]">
            <img
              src={Mascot}
              alt="mascot"
              className="w-full sm:w-4/5 aspect-[1/1] object-cover rounded-sm"
            />
            <div className="grid grid-cols-1 gap-y-4 items-center justify-center">
              <span className="text-light-gray text-sm xs:text-base sm:text-sm md:text-base">
                좋아요 누른
                <br /> 음악이 없짹.
                <br /> 음악 추천 받으러
                <br /> 가보겠짹?
              </span>
              <button
                className="bg-main w-auto text-white text-sm xs:text-base sm:text-sm md:text-base mx-2 px-2 py-1 rounded-xl"
                onClick={() => navigate("/recommendations/detail/music")}
              >
                음악 추천
                <br />
                받으러 가기
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center justify-center w-auto mx-3 xs:mx-5 mb-3 xs:mb-5 p-2 pb-0 bg-level2 rounded-md">
        <div className="flex flex-row items-end justify-between w-full px-2">
          <h3 className="text-xl h-[26px] xs:h-[30px] xs:text-2xl font-bold">책</h3>
          {books.length > 0 && (
            <span
              className="text-light-gray text-sm xs:text-base cursor-pointer"
              onClick={() => navigate("/recommendations/my/book")}
            >
              전체보기
            </span>
          )}
        </div>
        {books.length > 0 ? (
          <div className="content-box grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-2 bg-level3 rounded-sm m-1 p-2 min-h-[290px] max-h-[435px] sm:min-h-[146px] h-[calc((100vw-60px)/3*5/3*2)] xs:h-[calc((100vw-75px)/3*5/3*2)] sm:h-[calc((100vw-75px)/3*5/2)] min-w-[280px] max-w-[535px] w-[calc(100vw-45px)] xs:w-[calc(100vw-65px)]">
            {books.map(
              (book, index) =>
                index < 8 && (
                  <div key={book.isbn} className={`${index >= 6 ? "hidden sm:block" : ""}`}>
                    <img src={book.image} className="w-full aspect-[3/5] object-cover rounded-sm" />
                  </div>
                )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-2 gap-y-2  m-1 p-2 items-center justify-center min-h-[290px] max-h-[420px] sm:min-h-[146px] h-[calc((100vw-60px)/3*5/3*2)] xs:h-[calc((100vw-75px)/3*5/3*2)] sm:h-[calc((100vw-75px)/3*5/2)] min-w-[300px] max-w-[535px] w-[calc(100vw-45px)] xs:w-[calc(100vw-65px)]">
            <img
              src={Mascot}
              alt="mascot"
              className="w-full sm:w-4/5 aspect-[1/1] object-cover rounded-sm"
            />
            <div className="grid grid-cols-1 gap-y-4 items-center justify-center">
              <span className="text-light-gray text-sm xs:text-base sm:text-sm md:text-base">
                좋아요 누른
                <br /> 책이 없짹.
                <br /> 책 추천 받으러
                <br /> 가보겠짹?
              </span>
              <button
                className="bg-main w-auto text-white text-sm xs:text-base sm:text-sm md:text-base mx-2 px-2 py-1 rounded-xl"
                onClick={() => navigate("/recommendations/detail/book")}
              >
                책 추천
                <br />
                받으러 가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
