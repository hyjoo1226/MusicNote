import logo from "@/assets/logo/logo.png";
import logoRec from "@/assets/logo/logo-rec.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import genreData from "@/assets/data/tmdb-genre-id.json";
import MovieCarousel from "@/components/MovieCarousel";

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface Genre {
  id: number;
  name: string;
}

export default function Recommendations() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<"영화" | "음악" | "활동">("영화");
  const genreMap = new Map(genreData.genres.map((genre: Genre) => [genre.id, genre.name]));

  const getGenreNames = (genreIds: number[]) => {
    return genreIds.map((id) => genreMap.get(id) as string).filter(Boolean);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const url =
        "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-Kr&page=1&sort_by=popularity.desc";
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZDhlOTlhZjcxZmQxMDQ2OTkwZjA1YzdlZDc1ZDFiMyIsIm5iZiI6MTczMTg5NzI3OS4xNDQsInN1YiI6IjY3M2FhN2JmM2M4MzFhMTMyOTUzY2M0OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UfKeIpOhTXLNJQzcYc8CNOEb7wWHhRU4wTk1sfC1PT0",
        },
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error("영화 데이터를 불러오는데 실패했습니다:", error);
      }
    };

    fetchMovies();
  }, []);

  const renderContent = () => {
    switch (selectedDomain) {
      case "영화":
        return (
          <div className="w-full px-2 rounded-lg overflow-hidden">
            <MovieCarousel movies={movies} getGenreNames={getGenreNames} />
          </div>
        );
      case "음악":
        return (
          <div className="w-full px-2 mb-8 text-white text-center">
            음악 추천 컴포넌트가 들어갈 자리입니다
          </div>
        );
      case "활동":
        return (
          <div className="w-full px-2 mb-8 text-white text-center">
            활동 추천 컴포넌트가 들어갈 자리입니다
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full overflow-y-auto bg-level1 p-2 xs:p-6 mb-[10px]">
      <div className="flex flex-row w-full justify-between items-center">
        <div className="flex self-start justify-start mt-3 mb-1 gap-x-1">
          <img src={logo} alt="logo" className="w-[54px] h-[54px] mb-3" />
          <img src={logoRec} alt="logo-rec" className="h-[54px] mb-3" />
        </div>
        <div className="flex justify-end my-3 mr-3 gap-x-5 items-center">
          <div
            className="flex flex-col justify-center items-center text-center"
            onClick={() => navigate("/my-recommendation")}
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
            <span className="text-white text-xs font-bold rounded-full">보관함</span>
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
            <span className="text-white font-bold text-base">영화</span>
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
            <span className="text-white font-bold text-base">음악</span>
          </div>

          <div
            className={`bg-level2 py-1 flex flex-col items-center justify-center cursor-pointer rounded-tr-lg transition-all ${
              selectedDomain === "활동" ? "bg-main" : "hover:bg-level3 border-b border-border"
            }`}
            onClick={() => setSelectedDomain("활동")}
          >
            <span className="text-xl xs:text-2xl">🎮</span>
            <span className="text-white font-bold text-base">활동</span>
          </div>
        </div>
        {/* <DetailButton url={`/recommendations/${selectedDomain}`} /> */}
      </div>
      <div className="w-full bg-level2 flex flex-col p-2 justify-between items-center rounded-b-lg">
        {renderContent()}
        <button
          className="bg-main w-[200px] text-white text-xl font-bold p-2 rounded-full"
          onClick={() => navigate(`/recommendations/${selectedDomain}`)}
        >
          {selectedDomain} 추천 더보기
        </button>
      </div>
    </div>
  );
}
