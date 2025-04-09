export interface Movie {
  id: string;
  title: string;
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
  overview: string;
  is_liked: boolean;
}

export interface Music {
  id: string;
  track_name: string;
  artist_name: string;
  albumcover_path: string;
  release_date: string;
  duration_ms: number;
  is_liked: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  isbn: string;
  pubdate: string;
  publisher: string;
  description: string;
  is_liked: boolean;
}
