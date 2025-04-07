import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Music {
  id: string;
  popularity: number;
  track_name: string;
  artist_name: string;
  albumcover_path: string;
  release_date: string;
}

interface MusicCarouselProps {
  musics: Music[];
}

export default function MusicCarousel({ musics }: MusicCarouselProps) {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
    pauseOnDotsHover: true,
    arrows: false,
    focusOnSelect: false,
    accessibility: true,
    swipeToSlide: true,
  };

  return (
    <>
      <Slider {...settings}>
        {musics.map((music) => (
          <div key={music.id} className="relative h-[calc(97vh-280px)] rounded-lg overflow-hidden">
            <img
              src={`${music.albumcover_path}`}
              alt={music.track_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 pb-4">
                <h2 className="text-2xl font-medium text-white">{music.track_name}</h2>
                <div className="flex items-center gap-4 text-white/90 mb-2">
                  <span className="text-xl text-light-gray">
                    {music.release_date.split("-")[0]}
                  </span>
                  <span className="flex items-center gap-1 text-light-gray">
                    <svg
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {music.popularity.toFixed(1)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-level3 text-white rounded-full text-sm">
                    {music.artist_name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
}
