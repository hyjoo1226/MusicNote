import genreData from "@/assets/data/tmdb-genre-id.json";
import { useState, useEffect } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  genre_ids: number[];
  is_liked: boolean;
  overview: string;
  vote_average: number;
}

interface Genre {
  id: number;
  name: string;
}

interface MovieDetail {
  runtime: number;
  credits: {
    cast: Array<{
      order?: number;
      name: string;
    }>;
    crew: Array<{
      job: string;
      name: string;
    }>;
  };
}

export default function RecommandModal({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const genreMap = new Map(genreData.genres.map((genre: Genre) => [genre.id, genre.name]));

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits&language=ko-KR`,
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZDhlOTlhZjcxZmQxMDQ2OTkwZjA1YzdlZDc1ZDFiMyIsIm5iZiI6MTczMTg5NzI3OS4xNDQsInN1YiI6IjY3M2FhN2JmM2M4MzFhMTMyOTUzY2M0OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UfKeIpOhTXLNJQzcYc8CNOEb7wWHhRU4wTk1sfC1PT0",
            },
          }
        );
        const data = await response.json();
        setMovieDetail(data);
      } catch (error) {
        console.error("영화 상세 정보를 가져오는데 실패했습니다:", error);
      }
    };

    fetchMovieDetail();
  }, [movie.id]);

  const getGenreNames = (genreIds: number[]) => {
    return genreIds.map((id) => genreMap.get(id) as string).filter(Boolean);
  };

  const getMainCast = () => {
    if (!movieDetail?.credits.cast) return "";
    const mainActors = movieDetail.credits.cast
      .filter((actor) => actor.order !== undefined && actor.order <= 1)
      .map((actor) => actor.name);
    return mainActors.join(", ");
  };

  const getDirector = () => {
    if (!movieDetail?.credits.crew) return "";
    const director = movieDetail.credits.crew.find((person) => person.job === "Director");
    return director?.name || "";
  };

  return (
    <div
      className="w-screen h-screen fixed top-0 left-0 z-50 flex items-end justify-center animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[560px] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col min-w-[296px] mx-3 xs:mx-5 max-h-[80vh] bg-level2 rounded-t-3xl p-3 xs:p-5 gap-5 overflow-y-auto">
          <div className="grid grid-cols-2">
            <div className="w-full h-auto">
              <img
                src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                alt={movie.title}
                className="max-h-[500px] w-auto rounded-lg object-cover"
              />
            </div>
            <div className="flex flex-col items-start pt-2 pl-2 xs:pt-4 xs:pl-4 gap-1">
              <span className="text-white text-xl xs:text-2xl font-medium">{movie.title}</span>
              {movie.vote_average > 0 && (
                <span className="text-light-gray text-base xs:text-[20px] font-light">
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
              )}
              {movie.release_date && (
                <span className="text-light-gray text-sm font-light">
                  개봉년도: {movie.release_date.split("-")[0]}
                </span>
              )}
              {getGenreNames(movie.genre_ids).length > 0 && (
                <span className="text-light-gray text-sm font-light">
                  {getGenreNames(movie.genre_ids).join("/")}
                </span>
              )}
              {movieDetail && (
                <>
                  {movieDetail.runtime > 0 && (
                    <span className="text-light-gray text-sm font-light">
                      러닝타임: {movieDetail.runtime}분
                    </span>
                  )}
                  {getDirector() && (
                    <span className="text-light-gray text-sm font-light">
                      감독: {getDirector()}
                    </span>
                  )}
                  {getMainCast() && (
                    <span className="text-light-gray text-sm font-light">
                      주연: {getMainCast()}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full items-start justify-center">
            <span className="flex text-white text-sm xs:text-base font-light break-keep leading-8 pb-5 sm:pb-0">
              {movie.overview.replace(".", ".\n")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
