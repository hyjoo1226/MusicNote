import TopBar from "../components/layout/TopBar";
import genreData from "@/assets/data/tmdb-genre-id.json";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EmptyHeart from "@/assets/icon/empty-heart.svg?react";
import FilledHeart from "@/assets/icon/filled-heart.svg?react";
import RecommandModal from "@/components/layout/RecommandModal";

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

export default function MyRecommendationDetail() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { domain } = useParams();

  const genreMap = new Map(genreData.genres.map((genre: Genre) => [genre.id, genre.name]));
  const getGenreNames = (genreIds: number[]) => {
    return genreIds.map((id) => genreMap.get(id) as string).filter(Boolean);
  };

  const likeHandler = (id: number) => {
    setMovies(
      movies.map((movie) => (movie.id === id ? { ...movie, is_liked: !movie.is_liked } : movie))
    );
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
        setMovies(
          data.results.map((movie: Movie) => ({
            ...movie,
            is_liked: true,
          }))
        );
      } catch (error) {
        console.error("영화 데이터를 불러오는데 실패했습니다:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <div className="text-white w-full min-h-screen">
      <TopBar title={`${domain} 추천`} />
      <div className="mt-[20px] flex flex-col items-center justify-center bg-level2 rounded-3xl p-2 pb-0 mx-3 xs:mx-5 border border-solid border-border overflow-y-auto">
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
                src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                alt={movie.title}
                className="w-[60px] h-[60px] flex-shrink-0 rounded-lg object-cover"
              />
              <div className="flex flex-col w-full min-w-0 overflow-hidden">
                <span className="text-light-gray text-sm font-light truncate">
                  {getGenreNames(movie.genre_ids).join("/")}
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
                {movie.is_liked ? <FilledHeart /> : <EmptyHeart />}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-[20px]"></div>
      {isModalOpen && selectedMovie && (
        <RecommandModal movie={selectedMovie} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
