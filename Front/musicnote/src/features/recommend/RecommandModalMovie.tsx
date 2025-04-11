import { Movie } from "./recommendType";

export default function RecommandModalMovie({
  movie,
  onClose,
}: {
  movie: Movie;
  onClose: () => void;
}) {
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
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
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
              {movie.genres.length > 0 && (
                <span className="text-light-gray text-sm font-light">{movie.genres.join("/")}</span>
              )}
              {movie.runtime > 0 && (
                <span className="text-light-gray text-sm font-light">
                  러닝타임: {movie.runtime}분
                </span>
              )}
              {movie.credits.map(
                (credit) =>
                  credit.role === "director" &&
                  credit.name !== "" && (
                    <span className="text-light-gray text-sm font-light">감독: {credit.name}</span>
                  )
              )}
              {/* 주연 배우들 표시 */}
              {movie.credits.some(
                (credit) => credit.role === "actor1" || credit.role === "actor2"
              ) && (
                <span className="text-light-gray text-sm font-light">
                  주연:{" "}
                  {movie.credits
                    .filter((credit) => credit.role === "actor1" || credit.role === "actor2")
                    .map((credit) => credit.name)
                    .join(", ")}
                </span>
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
