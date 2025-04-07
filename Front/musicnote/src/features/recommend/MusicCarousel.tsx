import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Music {
  id: string;
  duration_ms: number;
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

  const formatDuration = (durationMs: number) => {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}분 ${seconds}초`;
  };

  return (
    <>
      <Slider {...settings}>
        {musics.map((music) => (
          <div
            key={music.id}
            className="relative h-[calc(var(--app-height)-320px)] rounded-lg overflow-hidden"
          >
            <img
              src={`${music.albumcover_path}`}
              alt={music.track_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
              <div className="flex flex-col absolute bottom-0 left-0 right-0 p-8 pb-4 gap-y-2">
                <h2 className="flex gap-x-2 text-2xl font-medium text-white">
                  <span className="px-3 py-1 pt-[6px] bg-level3 text-white rounded-full text-sm">
                    {music.artist_name}
                  </span>
                  {music.track_name}
                </h2>
                <div className="flex items-center gap-4 text-white/90 mb-2 pl-4">
                  <span className="text-base text-light-gray">
                    {music.release_date.split("-")[0]}년 발매
                  </span>
                  <span className="flex items-center gap-1 text-light-gray">
                    {formatDuration(music.duration_ms)}
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
