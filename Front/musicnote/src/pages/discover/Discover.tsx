import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import ChoiceMusicAnalysis from "./ChoiceMusicAnalysis";

export default function Discover() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/discover/choice-music-analysis");
  };
  return (
    <div className="text-white h-full w-full">
      {/* <Slider>
    
      </Slider> */}
      {/* <ChoiceMusicAnalysis /> */}
      <button onClick={handleClick} className="text-white">
        분석하기
      </button>
    </div>
  );
}
