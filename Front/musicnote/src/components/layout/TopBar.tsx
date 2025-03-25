import { useNavigate } from "react-router-dom";

export default function TopBar({ title }: { title: string }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };


  return (
    <div className="flex flex-row mx-5 xs:mx-10 my-5 rounded-2xl px-3 py-1 items-center justify-center w-[calc(100%-40px)] xs:w-[calc(100%-80px)] h-[60px] bg-level2">
      <div className="relative flex items-center justify-center w-full h-full">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="cursor-pointer absolute left-5" onClick={handleBack} xmlns="http://www.w3.org/2000/svg">
          <path d="M10.6667 19L4 12M4 12L10.6667 5M4 12L20 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span className="text-white text-center text-xl xs:text-2xl font-bold flex items-center">{title}</span>
      </div>
    </div>
  );
}
