import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import ChoiceMusicImage from "../../assets/img/choice-music-img.png";
import Mascot from "../../assets/logo/mascot.webp";

export default function DiscoverCarousel() {
  const navigate = useNavigate();
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
  };

  const handleClick = () => {
    navigate("/discover/choice-music-analysis");
  };

  return (
    <div className="w-full h-full px-5 overflow-hidden">
      <Slider {...settings} className="p-5 bg-gradient-to-b from-black to-gray rounded-lg">
        <div onClick={handleClick} className="!block w-full h-full">
          <div className="h-full flex flex-col justify-between">
            <div className="h-[min(60vh,60vw)] min-h-[200px] max-h-[500px] w-full overflow-hidden mx-auto">
              <img
                src={ChoiceMusicImage}
                alt="MY Pick 분석 이미지"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div className="p-5 pt-4 flex-shrink-0">
              <h2 className="text-[20px] font-bold">My Pick 분석</h2>
              <p className="pt-2 text-[16px]">내가 직접 선택한 음악으로 성향 분석을?</p>
            </div>
          </div>
        </div>
        <div className="!block w-full h-full">
          <div className="h-full flex flex-col justify-between">
            <div className="h-[min(60vh,60vw)] min-h-[200px] max-h-[500px] w-full overflow-hidden mx-auto">
              <img src={Mascot} alt="Mascot" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="p-5 pt-4 flex-shrink-0">
              <h2 className="text-[20px] font-bold">라인 그래프</h2>
              <p className="pt-2 text-[16px]">내 성향이 시간에 따라 어떻게 변했을까</p>
            </div>
          </div>
        </div>
      </Slider>
    </div>
  );
}
