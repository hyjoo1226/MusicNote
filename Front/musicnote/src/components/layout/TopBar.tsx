import { useNavigate } from "react-router-dom";
import NotificationIcon from "@/assets/icon/notification.svg?react";
export default function TopBar({ title }: { title: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row mx-[10px] xs:mx-5 my-5 rounded-2xl px-3 py-1 items-center justify-center w-[calc(100%-20px)] xs:w-[calc(100%-40px)] h-[60px] bg-level2">
      <div className="flex items-center justify-between w-full h-[60px] px-3">
        <div
          className="flex items-center justify-center cursor-pointer w-10 h-10"
          onClick={() => navigate(-1)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.6667 19L4 12M4 12L10.6667 5M4 12L20 12"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="text-white text-xl xs:text-2xl font-bold mt-1">{title}</span>
        <div
          className="flex flex-row items-center justify-center gap-x-2 cursor-pointer"
          onClick={() => navigate(`/notification`)}
        >
          <NotificationIcon />
        </div>
      </div>
    </div>
  );
}
