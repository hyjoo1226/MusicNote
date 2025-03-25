import TopBar from "../components/layout/TopBar";
import { useParams } from "react-router-dom";
import genreData from "@/assets/data/tmdb-genre-id.json";
import { useState, useEffect, useRef } from "react";
import '@/styles/RecommendationList.css';

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

  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('');
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [dislikedMovies, setDislikedMovies] = useState<number[]>([]);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDraggedRecently, setIsDraggedRecently] = useState(false);

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
    return genreIds.map(id => genreMap.get(id) as string).filter(Boolean);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      const url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=ko-Kr&page=1&sort_by=popularity.desc';
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZDhlOTlhZjcxZmQxMDQ2OTkwZjA1YzdlZDc1ZDFiMyIsIm5iZiI6MTczMTg5NzI3OS4xNDQsInN1YiI6IjY3M2FhN2JmM2M4MzFhMTMyOTUzY2M0OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UfKeIpOhTXLNJQzcYc8CNOEb7wWHhRU4wTk1sfC1PT0'
        }
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('영화 데이터를 불러오는데 실패했습니다:', error);
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
    setDirection('');
    setOffsetX(0);
    
    if (cardRef.current) {
      (cardRef.current as HTMLElement).style.transition = 'transform 0.3s ease';
      (cardRef.current as HTMLElement).style.transform = 'translateX(0px)';
      
      setTimeout(() => {
        if (cardRef.current) {
          (cardRef.current as HTMLElement).style.transition = '';
        }
      }, 300);
    }
  };

  const updateCardPosition = (newOffset: number) => {
    const maxOffset = cardWidth.current * 0.05;
    const limitedOffset = Math.max(-maxOffset, Math.min(maxOffset, newOffset));
    
    if (newOffset > 10) {
      setDirection('right');
    } else if (newOffset < -10) {
      setDirection('left');
    } else {
      setDirection('');
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
    isDragging.current = true;
    setSwiping(true);
    setIsDraggedRecently(false);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 5) {
      setIsDraggedRecently(true);
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(() => {
      updateCardPosition(diff);
    });
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    setSwiping(false);
    
    if (direction === 'right') {
      handleLike();
    } else if (direction === 'left') {
      handleDislike();
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
    isDragging.current = true;
    setSwiping(true);
    setIsDraggedRecently(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    
    const currentX = e.clientX;
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 5) {
      setIsDraggedRecently(true);
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    animationRef.current = requestAnimationFrame(() => {
      updateCardPosition(diff);
    });
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    setSwiping(false);
    
    if (direction === 'right') {
      handleLike();
    } else if (direction === 'left') {
      handleDislike();
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
    setLikedMovies(prev => [...prev, currentMovie.id]);
    setTimeout(() => {
      goToNextMovie();
    }, 300);
  };

  const handleDislike = () => {
    if (!currentMovie) return;
    resetSwipeState();
    setDislikedMovies(prev => [...prev, currentMovie.id]);
    setTimeout(() => {
      goToNextMovie();
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

  return (
    <div className="text-white w-full h-full flex flex-col items-center">
      <TopBar title={titleText} />
      <div className="recommendation-container bg-level2 rounded-2xl w-[calc(100%-40px)] xs:w-[calc(100%-80px)] p-4">
        {currentMovie ? (
          <>
            <div
              ref={cardRef}
              className={`movie-card ${direction} relative cursor-pointer`}
              style={{
                transition: swiping ? 'none' : 'transform 0.3s ease',
                cursor: swiping ? 'grabbing' : 'grab',
                perspective: '1000px',
                transform: `translateX(${offsetX}px)`,
                userSelect: 'none',
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
                  style={{ pointerEvents: 'none' }}
                >
                  {direction === 'right' ? '좋아요' : '싫어요'}
                </div>
              )}
              <div 
                className={`relative w-full h-[70vh] transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : 'rotate-y-0'}`}
                style={{ pointerEvents: 'none' }}
              >
                {/* 앞면 */}
                <div className={`absolute w-full h-full backface-hidden ${isFlipped ? 'card-hidden' : 'card-visible'}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
                    alt={currentMovie.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black via-black/80 via-black/60 via-black/40 to-transparent h-[30%] rounded-b-lg">
                    <div className="flex flex-col gap-1">
                      <span className="text-light-gray text-sm font-light">
                        {getGenreNames(currentMovie.genre_ids).join(', ')}
                      </span>
                      <h3 className="text-white text-xl font-medium">
                        {currentMovie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-light-gray text-sm">
                        <span>{currentMovie.release_date.split('-')[0]}</span>
                        <span>•</span>
                        <span>⭐ {currentMovie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 뒷면 */}
                <div className={`absolute w-full h-full bg-level1 rounded-lg p-6 overflow-y-auto backface-hidden rotate-y-180 ${!isFlipped ? 'card-hidden' : 'card-visible'}`}>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-white text-2xl font-bold">{currentMovie.title}</h3>
                    <div className="flex items-center gap-2 text-light-gray text-sm">
                      <span>{currentMovie.release_date.split('-')[0]}</span>
                      <span>•</span>
                      <span>⭐ {currentMovie.vote_average.toFixed(1)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getGenreNames(currentMovie.genre_ids).map((genre, index) => (
                        <span key={index} className="px-3 py-1 bg-level2 rounded-full text-sm text-light-gray">
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
          <div className="grid grid-cols-2 gap-4">
            {/* 좋아요 목록 */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">좋아요한 영화</h3>
              <div className="h-[600px] overflow-y-auto pr-2">
                {likedMovies.map(movieId => {
                  const movie = movies.find(m => m.id === movieId);
                  if (!movie) return null;
                  return (
                    <div key={movie.id} className="flex items-center gap-3 p-2 bg-level1 rounded-lg mb-2">
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{movie.title}</span>
                        <span className="text-sm text-light-gray">
                          {movie.release_date.split('-')[0]} • ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 싫어요 목록 */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold">싫어요한 영화</h3>
              <div className="h-[600px] overflow-y-auto pr-2">
                {dislikedMovies.map(movieId => {
                  const movie = movies.find(m => m.id === movieId);
                  if (!movie) return null;
                  return (
                    <div key={movie.id} className="flex items-center gap-3 p-2 bg-level1 rounded-lg mb-2">
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{movie.title}</span>
                        <span className="text-sm text-light-gray">
                          {movie.release_date.split('-')[0]} • ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
