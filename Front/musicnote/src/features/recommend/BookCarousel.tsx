import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Book {
  author: string;
  description: string;
  id: string;
  image: string;
  isbn: string;
  pubdate: string;
  publisher: string;
  title: string;
}

interface BookCarouselProps {
  books: Book[];
}

export default function BookCarousel({ books }: BookCarouselProps) {
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
        {books.map((book) => (
          <div key={book.id} className="relative h-[calc(97vh-280px)] rounded-lg overflow-hidden">
            <img src={`${book.image}`} alt={book.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 pb-4">
                <h2 className="text-2xl font-medium text-white text-start line-clamp-2">
                  {book.title}
                </h2>
                <div className="flex items-center gap-4 text-white/90 mb-2">
                  <span className="text-xl text-light-gray">{book.pubdate.split("-")[0]}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-level3 text-white rounded-full text-sm">
                    {book.author}
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
