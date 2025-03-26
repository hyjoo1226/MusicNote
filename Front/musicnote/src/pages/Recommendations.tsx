import logo from "@/assets/logo/logo.png";
import logoRec from "@/assets/logo/logo-rec.png";
import { useEffect, useState } from "react";
import genreData from "@/assets/data/tmdb-genre-id.json";
import MovieCarousel from "@/components/MovieCarousel";
import DetailButton from "@/components/buttons/DetailButton";

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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<'영화' | '음악' | '활동'>('영화');
  const genreMap = new Map(genreData.genres.map((genre: Genre) => [genre.id, genre.name]));

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

  const renderContent = () => {
    switch (selectedDomain) {
      case '영화':
        return (
          <div className="w-full px-2 rounded-lg overflow-hidden">
            <MovieCarousel movies={movies} getGenreNames={getGenreNames} />
          </div>
        );
      case '음악':
        return (
          <div className="w-full px-2 mb-8 text-white text-center">
            음악 추천 컴포넌트가 들어갈 자리입니다
          </div>
        );
      case '활동':
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
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer">
            <path d="M21.6001 6.30004L2.40066 6.29976L2.39941 6.3001M21.6001 6.30004L21.5994 19.6161C21.5994 20.8775 20.5575 21.9001 19.2721 21.9001H4.72669C3.44137 21.9001 2.39941 20.8775 2.39941 19.6161V6.3001M21.6001 6.30004L17.7509 2.45157C17.5258 2.22653 17.2206 2.1001 16.9024 2.1001H7.09647C6.77821 2.1001 6.47299 2.22653 6.24794 2.45157L2.39941 6.3001M15.5994 9.9001C15.5994 11.8883 13.9876 13.5001 11.9994 13.5001C10.0112 13.5001 8.39941 11.8883 8.39941 9.9001" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.6763 2.31627C11.2488 0.561243 8.75121 0.561243 8.3237 2.31627C8.25987 2.57999 8.13468 2.82492 7.95831 3.03112C7.78194 3.23732 7.55938 3.39897 7.30874 3.50291C7.0581 3.60684 6.78646 3.65014 6.51592 3.62927C6.24538 3.60839 5.9836 3.52394 5.75187 3.38279C4.20832 2.44227 2.44201 4.20855 3.38254 5.75207C3.99006 6.74884 3.45117 8.04936 2.31713 8.32499C0.560955 8.75137 0.560955 11.25 2.31713 11.6753C2.58093 11.7392 2.8259 11.8645 3.03211 12.041C3.23831 12.2175 3.39991 12.4402 3.50375 12.691C3.6076 12.9418 3.65074 13.2135 3.62968 13.4841C3.60862 13.7547 3.52394 14.0165 3.38254 14.2482C2.44201 15.7917 4.20832 17.558 5.75187 16.6175C5.98356 16.4761 6.24536 16.3914 6.51597 16.3704C6.78658 16.3493 7.05834 16.3924 7.30912 16.4963C7.5599 16.6001 7.7826 16.7617 7.95911 16.9679C8.13561 17.1741 8.26091 17.4191 8.32482 17.6829C8.75121 19.439 11.2499 19.439 11.6752 17.6829C11.7393 17.4192 11.8647 17.1744 12.0413 16.9684C12.2178 16.7623 12.4405 16.6008 12.6912 16.497C12.9419 16.3932 13.2135 16.35 13.4841 16.3709C13.7546 16.3919 14.0164 16.4764 14.2481 16.6175C15.7917 17.558 17.558 15.7917 16.6175 14.2482C16.4763 14.0165 16.3918 13.7547 16.3709 13.4842C16.35 13.2136 16.3932 12.942 16.497 12.6913C16.6008 12.4406 16.7623 12.2179 16.9683 12.0414C17.1744 11.8648 17.4192 11.7394 17.6829 11.6753C19.439 11.2489 19.439 8.75025 17.6829 8.32499C17.4191 8.26108 17.1741 8.13578 16.9679 7.95928C16.7617 7.78278 16.6001 7.56007 16.4962 7.3093C16.3924 7.05853 16.3493 6.78677 16.3703 6.51617C16.3914 6.24556 16.4761 5.98376 16.6175 5.75207C17.558 4.20855 15.7917 2.44227 14.2481 3.38279C14.0164 3.52418 13.7546 3.60886 13.484 3.62992C13.2134 3.65098 12.9417 3.60784 12.6909 3.504C12.4401 3.40016 12.2174 3.23856 12.0409 3.03236C11.8644 2.82616 11.7391 2.58119 11.6752 2.3174L11.6763 2.31627Z" stroke="white" strokeWidth="1.5"/>
            <path d="M12 10C12 11.1046 11.1046 12 10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10Z" stroke="white" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>

      <div className="w-full flex flex-row pr-2 justify-between items-center">
        <div className="w-full flex flex-row grid grid-cols-4">
          <div 
            className={`bg-level2 py-1 flex flex-col items-center justify-center cursor-pointer rounded-tl-lg transition-all ${
              selectedDomain === '영화' ? 'bg-main' : 'hover:bg-level3 border-r border-b border-border '
            }`}
            onClick={() => setSelectedDomain('영화')}
          >
            <span className="text-xl xs:text-2xl">🎬</span>
            <span className="text-white font-bold text-base">영화</span>
          </div>
          
          <div 
            className={`bg-level2 py-1 flex flex-col items-center justify-center cursor-pointer transition-all ${
              selectedDomain === '음악' ? 'bg-main' : 'hover:bg-level3 border-r border-b border-border '
            }`}
            onClick={() => setSelectedDomain('음악')}
          >
            <span className="text-light-gray text-xl xs:text-2xl">♬</span>
            <span className="text-white font-bold text-base">음악</span>
          </div>

          <div 
            className={`bg-level2 py-1 flex flex-col items-center justify-center cursor-pointer rounded-tr-lg transition-all ${
              selectedDomain === '활동' ? 'bg-main' : 'hover:bg-level3 border-b border-border'
            }`}
            onClick={() => setSelectedDomain('활동')}
          >
            <span className="text-xl xs:text-2xl">🎮</span>
            <span className="text-white font-bold text-base">활동</span>
          </div>
        </div>
        <DetailButton url={`/recommendationlist/${selectedDomain}`}/>
      </div>
      <div className="w-full bg-level2 flex flex-row p-2 justify-between items-center rounded-b-lg">
        {renderContent()}
      </div>
    </div>
  );
}
