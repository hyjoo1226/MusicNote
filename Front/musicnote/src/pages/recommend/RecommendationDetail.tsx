import TopBar from "@/components/layout/TopBar";
import { useParams, useNavigate } from "react-router-dom";
import mascot from "@/assets/logo/mascot.webp";
import genreData from "@/assets/data/tmdb-genre-id.json";
import { useState, useEffect, useRef } from "react";
import "@/styles/RecommendationDetail.css";

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

export default function RecommendationDetail() {
  const { domain } = useParams();
  const titleText = `${domain} 추천`;
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState("");
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDraggedRecently, setIsDraggedRecently] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollStartY = useRef(0);
  const [isVerticalScrolling, setIsVerticalScrolling] = useState(false);
  const startY = useRef(0);

  const cardRef = useRef(null);
  const cardWidth = useRef(0);
  const animationRef = useRef<number | null>(null);
  const isDragging = useRef(false);

  const genreMap = new Map(genreData.genres.map((genre: Genre) => [genre.id, genre.name]));
  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (cardRef.current) {
      cardWidth.current = (cardRef.current as HTMLElement).offsetWidth;
    }
  }, [currentMovie]);

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

  // 스와이프 상태 초기화
  const resetSwipeState = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    isDragging.current = false;
    setSwiping(false);
    setDirection("");
    setOffsetX(0);

    if (cardRef.current) {
      (cardRef.current as HTMLElement).style.transition = "transform 0.3s ease";
      (cardRef.current as HTMLElement).style.transform = "translateX(0px)";

      setTimeout(() => {
        if (cardRef.current) {
          (cardRef.current as HTMLElement).style.transition = "";
        }
      }, 300);
    }
  };

  const updateCardPosition = (newOffset: number) => {
    const maxOffset = cardWidth.current * 0.2;
    const limitedOffset = Math.max(-maxOffset, Math.min(maxOffset, newOffset));

    if (newOffset > 10) {
      setDirection("right");
    } else if (newOffset < -10) {
      setDirection("left");
    } else {
      setDirection("");
    }

    if (cardRef.current) {
      (cardRef.current as HTMLElement).style.transform = `translateX(${limitedOffset}px)`;
    }

    setOffsetX(limitedOffset);
  };

  // 터치/마우스 이벤트 핸들러
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setStartX(e.touches[0].clientX);
    startY.current = e.touches[0].clientY;
    setIsVerticalScrolling(false);
    isDragging.current = true;
    setSwiping(true);
    setIsDraggedRecently(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY.current;

    // 처음 움직임이 감지될 때 방향 결정
    if (!isVerticalScrolling && (Math.abs(diffX) > 5 || Math.abs(diffY) > 5)) {
      // 세로 방향 움직임이 가로보다 큰 경우
      if (Math.abs(diffY) > Math.abs(diffX)) {
        setIsVerticalScrolling(true);
        return;
      }
    }

    // 세로 스크롤 중이면 가로 스와이프 처리 안함
    if (isVerticalScrolling) return;

    if (Math.abs(diffX) > 5) {
      setIsDraggedRecently(true);
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(() => {
      updateCardPosition(diffX);
    });
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;

    isDragging.current = false;
    setSwiping(false);
    setIsVerticalScrolling(false);

    if (!isVerticalScrolling) {
      if (direction === "right") {
        handleLike();
      } else if (direction === "left") {
        handleDislike();
      } else {
        resetSwipeState();
      }
    } else {
      resetSwipeState();
    }
  };

  // 마우스 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setStartX(e.clientX);
    startY.current = e.clientY;
    setIsVerticalScrolling(false);
    isDragging.current = true;
    setSwiping(true);
    setIsDraggedRecently(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    const diffX = currentX - startX;
    const diffY = currentY - startY.current;

    // 처음 움직임이 감지될 때 방향 결정
    if (!isVerticalScrolling && (Math.abs(diffX) > 5 || Math.abs(diffY) > 5)) {
      // 세로 방향 움직임이 가로보다 큰 경우
      if (Math.abs(diffY) > Math.abs(diffX)) {
        setIsVerticalScrolling(true);
        return;
      }
    }

    // 세로 스크롤 중이면 가로 스와이프 처리 안함
    if (isVerticalScrolling) return;

    if (Math.abs(diffX) > 5) {
      setIsDraggedRecently(true);
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(() => {
      updateCardPosition(diffX);
    });
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;

    isDragging.current = false;
    setSwiping(false);
    setIsVerticalScrolling(false);

    if (!isVerticalScrolling) {
      if (direction === "right") {
        handleLike();
      } else if (direction === "left") {
        handleDislike();
      } else {
        resetSwipeState();
      }
    } else {
      resetSwipeState();
    }
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      resetSwipeState();
    }
  };

  const handleLike = () => {
    if (!currentMovie) return;
    resetSwipeState();

    // 카드가 뒤집혀 있다면 다시 앞면으로 전환
    if (isFlipped) {
      setIsFlipped(false);
    }

    setTimeout(() => {
      goToNextMovie();
      // 스크롤 위치 초기화
      if (cardRef.current) {
        const backContent = (cardRef.current as HTMLElement).querySelector(".bg-level1");
        if (backContent) {
          (backContent as HTMLElement).scrollTop = 0;
        }
      }
    }, 300);
  };

  const handleDislike = () => {
    if (!currentMovie) return;
    resetSwipeState();

    // 카드가 뒤집혀 있다면 다시 앞면으로 전환
    if (isFlipped) {
      setIsFlipped(false);
    }

    setTimeout(() => {
      goToNextMovie();
      // 스크롤 위치 초기화
      if (cardRef.current) {
        const backContent = (cardRef.current as HTMLElement).querySelector(".bg-level1");
        if (backContent) {
          (backContent as HTMLElement).scrollTop = 0;
        }
      }
    }, 300);
  };

  const goToNextMovie = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(movies.length);
    }
  };

  const handleCardClick = () => {
    if (isAnimating || isDraggedRecently) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleBackContentMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    scrollStartY.current = e.clientY;
    setIsScrolling(false);
  };

  const handleBackContentMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Math.abs(e.clientY - scrollStartY.current) > 5) {
      setIsScrolling(true);
    }
  };

  const handleBackContentMouseUp = () => {
    if (!isScrolling) {
      handleCardClick();
    }
    setIsScrolling(false);
  };

  // 현재 영화가 바뀔 때마다 다음 영화 이미지 미리 로드
  useEffect(() => {
    const preloadImages = (startIdx: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const idx = startIdx + i;
        if (idx < movies.length) {
          const img = new Image();
          img.src = `https://image.tmdb.org/t/p/w500${movies[idx].poster_path}`;
        }
      }
    };
    if (movies.length > 0 && currentIndex < movies.length) {
      // 현재 영화 이후 3개 영화 이미지 미리 로드
      preloadImages(currentIndex + 1, 3);
    }
  }, [currentIndex, movies]);

  // useEffect를 추가하여 영화가 바뀔 때마다 스크롤 위치 초기화
  useEffect(() => {
    // 스크롤 위치 초기화
    if (cardRef.current) {
      const backContent = (cardRef.current as HTMLElement).querySelector(".bg-level1");
      if (backContent) {
        (backContent as HTMLElement).scrollTop = 0;
      }
    }
  }, [currentIndex, movies]);

  return (
    <div className="text-white w-full h-full flex flex-col items-center">
      <TopBar title={titleText} />
      <div className="recommendation-container bg-level2 rounded-2xl w-[calc(100%-20px)] xs:w-[calc(100%-40px)] p-4 h-[calc(100vh-140px)]">
        {currentMovie ? (
          <>
            <div
              ref={cardRef}
              className={`movie-card ${direction} relative cursor-pointer`}
              style={{
                transition: swiping ? "none" : "transform 0.3s ease",
                cursor: swiping ? "grabbing" : "grab",
                perspective: "1000px",
                transform: `translateX(${offsetX}px)`,
                userSelect: "none",
              }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onDragStart={(e) => e.preventDefault()}
              onClick={handleCardClick}
            >
              {direction && (
                <div
                  className={`direction-indicator ${direction}`}
                  style={{ pointerEvents: "none" }}
                >
                  {direction === "right" ? "좋아요" : "싫어요"}
                </div>
              )}
              <div
                className={`relative w-full h-[calc(100vh-240px)] transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : "rotate-y-0"}`}
                style={{ pointerEvents: isFlipped ? "auto" : "none" }}
              >
                {/* 앞면 */}
                <div
                  className={`absolute w-full h-full backface-hidden ${isFlipped ? "card-hidden" : "card-visible"}`}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
                    alt={currentMovie.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute flex flex-col justify-end bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black via-black/80 via-black/60 via-black/40 to-transparent h-[30%] rounded-b-lg">
                    <div className="flex flex-col gap-0">
                      <span className="text-light-gray text-sm font-light">
                        {getGenreNames(currentMovie.genre_ids).join(", ")}
                      </span>
                      <h3 className="text-white text-xl font-medium">{currentMovie.title}</h3>
                      <div className="flex items-center gap-2 text-light-gray text-sm">
                        <span>{currentMovie.release_date.split("-")[0]}</span>
                        <span>•</span>
                        <span>⭐ {currentMovie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 뒷면 */}
                <div
                  className={`absolute w-full h-full bg-level1 rounded-lg p-6 overflow-y-auto backface-hidden rotate-y-180 ${!isFlipped ? "card-hidden" : "card-visible"}`}
                  style={{ userSelect: "none" }}
                  onMouseDown={handleBackContentMouseDown}
                  onMouseMove={handleBackContentMouseMove}
                  onMouseUp={handleBackContentMouseUp}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-2xl font-bold">{currentMovie.title}</h3>
                    <div className="flex items-center gap-2 text-light-gray text-sm">
                      <span>{currentMovie.release_date.split("-")[0]}</span>
                      <span>•</span>
                      <span>⭐ {currentMovie.vote_average.toFixed(1)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getGenreNames(currentMovie.genre_ids).map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-level2 rounded-full text-sm text-light-gray"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                    <p className="text-light-gray text-base leading-relaxed">
                      {currentMovie.overview}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="swipe-buttons">
              <button className="swipe-button dislike-button" onClick={handleDislike}>
                👎 싫어요
              </button>
              <button className="swipe-button like-button" onClick={handleLike}>
                👍 좋아요
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full h-full items-center justify-center gap-4">
            <img
              src={mascot}
              alt="mascot"
              className="w-[200px] h-[200px] object-cover rounded-lg"
            />
            <h3 className="text-white text-2xl font-bold text-center">
              추천을 다봤짹.
              <br />
              보관함으로 갈짹?
            </h3>
            <button
              className="bg-main text-white text-lg font-bold px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => navigate(`/my-recommendation/${domain}`)}
            >
              보관함으로 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
