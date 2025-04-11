import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Mascot from "../assets/logo/mascot.webp";

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.isNotFound) {
      navigate(location.pathname, {
        state: { isNotFound: true },
        replace: true,
      });
    }
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="flex flex-col w-full h-full p-5 justify-center items-center text-white gap-4">
      <img src={Mascot} alt="마스코트" className="w-100" />
      <h1 className="text-[36px] font-bold text-main">404 Not Found</h1>
      <span className="text-[20px]">페이지를 찾을 수 없습니다.</span>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/home")}
          className="w-[120px] h-[40px] mt-5 bg-main hover:bg-sub rounded-lg cursor-pointer"
        >
          홈으로
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-[120px] h-[40px] mt-5 bg-main hover:bg-sub rounded-lg cursor-pointer"
        >
          이전 페이지
        </button>
      </div>
    </div>
  );
}
