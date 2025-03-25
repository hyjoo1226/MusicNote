import { useNavigate } from "react-router-dom";

export default function DetailButton({ url }: { url: string }) {
  const navigate = useNavigate();

  return (
    <button className="flex items-center justify-center w-[65px] h-[30px] bg-main rounded-2xl cursor-pointer" onClick={() => navigate(url)}>
      <span className="text-white text-base font-bold">더보기</span>
    </button>
  );
}
