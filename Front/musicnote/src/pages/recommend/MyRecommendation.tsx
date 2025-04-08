import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "@/components/layout/TopBar";
import recentPlayedList from "@/assets/data/recent-played-list.json";
import Mascot from "@/assets/logo/mascot.webp";
import { useGetData } from "@/hooks/useApi";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface Music {
  id: number;
  track_name: string;
  artist_name: string;
  albumcover_path: string;
  release_date: string;
  duration_ms: number;
}

interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  isbn: string;
  pubdate: string;
  publisher: string;
}

export default function MyRecommendation() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [music, setMusic] = useState<Music[]>([]);
  const [book, setBook] = useState<Book[]>([]);

  const navigate = useNavigate();
  const {
    data: likedMovies,
    isLoading: likedMoviesLoading,
    isError: likedMoviesError,
  } = useGetData("likedMovies", "recommend/like/movie");
  const {
    data: likedMusic,
    isLoading: likedMusicLoading,
    isError: likedMusicError,
  } = useGetData("likedMusic", "recommend/like/music");
  const {
    data: likedBook,
    isLoading: likedBookLoading,
    isError: likedBookError,
  } = useGetData("likedBook", "recommend/like/book");

  useEffect(() => {
    if (likedMovies) {
      setMovies(likedMovies.data.movies);
    }
    console.log(likedMovies);
  }, [likedMovies]);

  useEffect(() => {
    if (likedMusic) {
      setMusic(likedMusic.data.music);
    }
    console.log(likedMusic);
  }, [likedMusic]);

  useEffect(() => {
    if (likedBook) {
      setBook(likedBook.data.books);
    }
    console.log(likedBook);
  }, [likedBook]);

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
          {movies.length > 0 && (
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
                  <div key={movie.id} className={`${index >= 6 ? "hidden sm:block" : ""}`}>
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
          {recentPlayedList.items.length > 0 && (
            <button
              className="text-light-gray text-sm xs:text-base cursor-pointer"
              onClick={() => navigate("/recommendations/my/music")}
            >
              전체보기
            </button>
          )}
        </div>
        {recentPlayedList.items.length > 0 ? (
          <div className="content-box grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-2 bg-level2 rounded-sm m-1 p-2 min-h-[290px] sm:min-h-[146px] max-h-[435px] sm:max-h-[440px] h-[calc((100vw-60px)/3*5/3*2)] xs:h-[calc((100vw-75px)/3*5/3*2)] sm:h-[calc((100vw-75px)/3*5/4*2)] min-w-[280px] max-w-[535px] w-[calc(100vw-45px)] xs:w-[calc(100vw-65px)]">
            {recentPlayedList.items.map(
              (music, index) =>
                index < 8 && (
                  <div
                    key={music.track.id}
                    className={`bg-level3 w-full aspect-[2/3] rounded-sm text-center ${index >= 6 ? "hidden sm:block" : ""}`}
                  >
                    <img
                      src={music.track.album.images[0].url}
                      alt={music.track.name}
                      className="w-full aspect-[1/1] object-cover rounded-t-sm mb-1 xs:mb-2"
                    />
                    <div className="flex flex-col items-center justify-center h-2/5">
                      <span className="flex items-center justify-center text-sm overflow-hidden text-ellipsis line-clamp-2 h-[70%]">
                        {music.track.name}
                      </span>
                      <span className="text-xs text-light-gray text-ellipsis line-clamp-1 h-[30%]">
                        {music.track.artists[0].name}
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
          {book.length > 0 && (
            <span
              className="text-light-gray text-sm xs:text-base cursor-pointer"
              onClick={() => navigate("/recommendations/my/movie")}
            >
              전체보기
            </span>
          )}
        </div>
        {book.length > 0 ? (
          <div className="content-box grid grid-cols-3 sm:grid-cols-4 gap-x-2 gap-y-2 bg-level3 rounded-sm m-1 p-2 min-h-[290px] max-h-[435px] sm:min-h-[146px] h-[calc((100vw-60px)/3*5/3*2)] xs:h-[calc((100vw-75px)/3*5/3*2)] sm:h-[calc((100vw-75px)/3*5/2)] min-w-[280px] max-w-[535px] w-[calc(100vw-45px)] xs:w-[calc(100vw-65px)]">
            {book.map(
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
                onClick={() => navigate("/recommendations/detail/movie")}
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
