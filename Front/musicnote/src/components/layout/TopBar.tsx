import { useNavigate } from "react-router-dom";

export default function TopBar({ title }: { title: string }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-row mx-5 xs:mx-5 my-5 rounded-2xl px-3 py-1 items-center justify-center w-[calc(100%-40px)] xs:w-[calc(100%-40px)] h-[60px] bg-level2">
      <div className="relative flex items-center justify-center w-full h-full">
        <div
          className="absolute left-0 cursor-pointer xs:w-12 xs:h-12 w-10 h-10 flex items-center justify-center"
          onClick={handleBack}
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
      </div>
    </div>
  );
}
