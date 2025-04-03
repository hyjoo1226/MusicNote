import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import ChoiceMusicImage from "../../assets/img/choice-music-img2.png";
import LineChartImage from "../../assets/img/line-chart-img.png";

export default function DiscoverCarousel() {
  const navigate = useNavigate();
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // 드래그 상태 관리
  const [dragging, setDragging] = useState(false);
  const handleBeforeChange = useCallback(() => {
    setDragging(true);
  }, []);
  const handleAfterChange = useCallback(() => {
    setDragging(false);
  }, []);

  // 캐러셀 설정
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
    touchThreshold: 100,
    beforeChange: handleBeforeChange,
    afterChange: handleAfterChange,
  };

  // 슬라이드 클릭 핸들러
  const handleSlideClick = (e: any, path: string) => {
    if (dragging) {
      // 드래그 중일 경우 클릭 이벤트 차단
      e.stopPropagation();
      return;
    }
    // 드래그가 아닌 경우 네비게이션 실행
    handleNavigate(path);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md px-5 overflow-hidden">
        <Slider {...settings} className="p-5 bg-gradient-to-b from-black to-gray rounded-lg">
          {/* 첫 번째 슬라이드 */}
          <div
            onClick={(e) => handleSlideClick(e, "/discover/choice-music-analysis")}
            className="!block w-full h-full"
          >
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
          <div
            onClick={(e) => handleSlideClick(e, "/discover/line-chart")}
            className="!block w-full h-full"
          >
            <div className="h-full flex flex-col justify-between">
              <div className="h-[min(60vh,60vw)] min-h-[200px] max-h-[500px] w-full overflow-hidden mx-auto">
                <img
                  src={LineChartImage}
                  alt="Mascot"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="p-5 pt-4 flex-shrink-0">
                <h2 className="text-[20px] font-bold">성향 트렌드</h2>
                <p className="pt-2 text-[16px]">내 성향이 시간에 따라 어떻게 변했을까</p>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
}
