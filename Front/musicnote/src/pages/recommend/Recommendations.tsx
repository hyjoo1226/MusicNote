import logo from "@/assets/logo/logo.png";
import logoRec from "@/assets/logo/logo-rec.png";
import mascot from "@/assets/logo/mascot.webp";
import { usePostData } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCarousel from "@/features/recommend/MovieCarousel";
import MusicCarousel from "@/features/recommend/MusicCarousel";
import BookCarousel from "@/features/recommend/BookCarousel";

interface Movie {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres: string[];
  credits: {
    name: string;
    role: string;
  }[];
  runtime: number;
  adult: boolean;
  popularity: number;
}

interface Music {
  id: string;
  duration_ms: number;
  track_name: string;
  artist_name: string;
  albumcover_path: string;
  release_date: string;
}

interface Book {
  author: string;
  description: string;
  id: string;
  image: string;
  isbn: string;
  pubdate: string;
  publisher: string;
  title: string;
}

export default function Recommendations() {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState<"영화" | "음악" | "책">("영화");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [musics, setMusics] = useState<Music[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  const {
    mutateAsync: getMovieRecommendations,
    isLoading: movieRecommendationsLoading,
    error: movieRecommendationsError,
  } = usePostData("/recommend/movie");
  const {
    mutateAsync: getMusicRecommendations,
    isLoading: musicRecommendationsLoading,
    error: musicRecommendationsError,
  } = usePostData("/recommend/music");
  const {
    mutateAsync: getBookRecommendations,
    isLoading: bookRecommendationsLoading,
    error: bookRecommendationsError,
  } = usePostData("/recommend/book");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getMovieRecommendations({});
        if (response.status === 200) {
          setMovies(response.data.movies);
        }
      } catch (error) {
        console.error("영화 데이터를 불러오는데 실패했습니다:", error);
      }
    };

    const fetchMusic = async () => {
      try {
        const response = await getMusicRecommendations({});
        if (response.status === 200) {
          setMusics(response.data.musics);
        }
      } catch (error) {
        console.error("음악 데이터를 불러오는데 실패했습니다:", error);
      }
    };
    const fetchBook = async () => {
      try {
        const response = await getBookRecommendations({});
        if (response.status === 200) {
          setBooks(response.data.books);
        }
      } catch (error) {
        console.error("책 데이터를 불러오는데 실패했습니다:", error);
      }
    };
    fetchMovies();
    fetchMusic();
    fetchBook();
  }, [getMovieRecommendations, getMusicRecommendations, getBookRecommendations]);

  const renderContent = () => {
    switch (selectedDomain) {
      case "영화":
        return (
          <div className="w-full px-2 rounded-lg overflow-visible items-center justify-center">
            {movieRecommendationsLoading && (
              <div className="flex flex-col w-full h-full items-center justify-center gap-4 p-4">
                <img
                  src={mascot}
                  alt="mascot"
                  className="w-[calc(min(30vw,30vh))] h-[calc(min(30vw,30vh))] object-cover rounded-lg animate-bounce overflow-visible"
                />
                <h3 className="text-white text-2xl font-bold text-center">영화를 찾고 있짹!</h3>
              </div>
            )}
            {movieRecommendationsError && (
              <div className="text-white">Error: {movieRecommendationsError.message}</div>
            )}
            {movies.length > 0 && (
              <>
                <MovieCarousel movies={movies} />
                <button
                  className="flex bg-main w-[200px] text-white text-xl p-2 pt-3 items-center justify-center text-center mx-auto rounded-xl"
                  onClick={() => navigate("/recommendations/detail/movie")}
                >
                  영화 추천 더보기
                </button>
              </>
            )}
          </div>
        );
      case "음악":
        return (
          <div className="w-full px-2 rounded-lg overflow-visible items-center justify-center">
            {musicRecommendationsLoading && (
              <div className="flex flex-col w-full h-full items-center justify-center gap-4 p-4">
                <img
                  src={mascot}
                  alt="mascot"
                  className="w-[calc(min(30vw,30vh))] h-[calc(min(30vw,30vh))] object-cover rounded-lg animate-bounce overflow-visible"
                />
                <h3 className="te xt-white text-2xl font-bold text-center">음악을 찾고 있짹!</h3>
              </div>
            )}
            {musicRecommendationsError && (
              <div className="text-white">Error: {musicRecommendationsError.message}</div>
            )}
            {musics.length > 0 && (
              <>
                <MusicCarousel musics={musics} />
                <button
                  className="flex bg-main w-[200px] text-white text-xl p-2 pt-3 items-center justify-center text-center mx-auto rounded-xl"
                  onClick={() => navigate("/recommendations/detail/music")}
                >
                  음악 추천 더보기
                </button>
              </>
            )}
          </div>
        );
      case "책":
        return (
          <div className="w-full px-2 rounded-lg overflow-visible items-center justify-center">
            {bookRecommendationsLoading && (
              <div className="flex flex-col w-full h-full items-center justify-center gap-4 p-4">
                <img
                  src={mascot}
                  alt="mascot"
                  className="w-[calc(min(30vw,30vh))] h-[calc(min(30vw,30vh))] object-cover rounded-lg animate-bounce overflow-visible"
                />
                <h3 className="te xt-white text-2xl font-bold text-center">책을 찾고 있짹!</h3>
              </div>
            )}
            {bookRecommendationsError && (
              <div className="text-white">Error: {bookRecommendationsError.message}</div>
            )}
            {books.length > 0 && (
              <>
                <BookCarousel books={books} />
                <button
                  className="flex bg-main w-[200px] text-white text-xl p-2 pt-3 items-center justify-center text-center mx-auto rounded-xl"
                  onClick={() => navigate("/recommendations/detail/book")}
                >
                  책 추천 더보기
                </button>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center w-full overflow-y-auto bg-level1 px-2 xs:px-4">
      <div className="flex flex-row w-full justify-between items-center">
        <div className="flex self-start justify-start mt-3 mb-1 gap-x-1">
          <img src={logo} alt="logo" className="w-[54px] h-[54px] mb-3" />
          <img src={logoRec} alt="logo-rec" className="h-[54px] mb-3" />
        </div>
        <div className="flex justify-end my-3 mr-3 gap-x-5 items-center">
          <div
            className="flex flex-col justify-center items-center text-center"
            onClick={() => navigate("/recommendations/my")}
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
            <span className="text-white text-xs pt-[2px] rounded-full">보관함</span>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row pr-2 justify-between items-center">
        <div className="w-full flex flex-row grid grid-cols-4">
          <div
            className={`bg-level2 py-1 flex flex-col items-center justify-center cursor-pointer rounded-tl-lg transition-all ${
              selectedDomain === "영화"
                ? "bg-main"
                : "hover:bg-level3 border-r border-b border-border "
            }`}
            onClick={() => setSelectedDomain("영화")}
          >
            <span className="text-xl xs:text-2xl">🎬</span>
            <span className="text-white  text-base">영화</span>
          </div>

          <div
            className={`bg-level2 py-1 flex flex-col items-center justify-center cursor-pointer transition-all ${
              selectedDomain === "음악"
                ? "bg-main"
                : "hover:bg-level3 border-r border-b border-border "
            }`}
            onClick={() => setSelectedDomain("음악")}
          >
            <span className="text-light-gray text-xl xs:text-2xl">♬</span>
            <span className="text-white  text-base">음악</span>
          </div>

          <div
            className={`bg-level2 py-1 flex flex-col items-center justify-center cursor-pointer rounded-tr-lg transition-all ${
              selectedDomain === "책" ? "bg-main" : "hover:bg-level3 border-b border-border"
            }`}
            onClick={() => setSelectedDomain("책")}
          >
            <span className="text-xl xs:text-2xl">📚</span>
            <span className="text-white  text-base">책</span>
          </div>
        </div>
      </div>
      <div className="w-full bg-level2 flex flex-col justify-evenly items-center rounded-tr-lg rounded-b-lg h-[calc(100dvh-230px)]">
        {renderContent()}
      </div>
    </div>
  );
}
