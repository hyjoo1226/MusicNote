import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toJpeg } from "html-to-image";
import * as htmlToImage from "html-to-image";
import UserTemperGraph from "../../components/UserTemperGraph";
import ReportDetail from "../../features/analysis/ReportDetail";
import NoteIcon from "../../assets/icon/note-icon.svg?react";
import ShareIcon from "../../assets/icon/share-icon.svg?react";

export default function Report() {
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const [fontCSS, setFontCSS] = useState<string>("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // top bar
  const handleBack = () => {
    navigate(-1);
  };

  // 음악 리스트 아이콘 핸들러
  const handleMusicListClick = () => {
    navigate("/musiclist/리포트에-사용된-음악");
  };

  // 클립보드 복사 함수
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // 구형 브라우저 대응
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
    }
  };

  // 폰트 로딩 함수
  const loadFonts = async () => {
    if (!reportRef.current) return "";

    try {
      const css = await htmlToImage.getFontEmbedCSS(reportRef.current);
      return css;
    } catch (error) {
      console.error("폰트 로딩 실패:", error);
      return "";
    }
  };

  // 컴포넌트 마운트 시 폰트 로딩
  useEffect(() => {
    const initFonts = async () => {
      const css = await loadFonts();
      setFontCSS(css);
      setFontsLoaded(true);
    };

    initFonts();
  }, []);

  // 공유 아이콘 핸들러
  const handleShare = async () => {
    if (!reportRef.current) return;

    setIsSharing(true);

    try {
      // 폰트가 아직 로드되지 않았다면 로드
      let embeddedFontCSS = fontCSS;
      if (!fontsLoaded) {
        embeddedFontCSS = await loadFonts();
        setFontCSS(embeddedFontCSS);
        setFontsLoaded(true);

        // 폰트 로딩 후 약간의 시간을 줌
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const dataUrl = await toJpeg(reportRef.current, {
        backgroundColor: "#19171b",
        pixelRatio: 2,
        preferredFontFormat: "woff2",
        fontEmbedCSS: embeddedFontCSS,
        style: {
          transform: "scale(0.9)",
          transformOrigin: "center center",
          width: "100%",
          height: "100%",
        },
      });

      // base64 이미지를 Blob으로 변환
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // File 객체 생성
      const file = new File([blob], "my-report.jpeg", { type: "image/jpeg" });

      const shareData = {
        title: "일일 리포트",
        text: "나의 성향 리포트를 확인해보세요!",
        files: [file],
      };

      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        console.log("공유 성공");
      } else {
        // 파일 공유를 지원하지 않는 경우 URL 복사
        copyToClipboard(window.location.href);
      }
    } catch (error) {
      console.error("이미지 생성 실패", error);
      copyToClipboard(window.location.href);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="text-white w-full h-[calc(100vh-80px)]">
      <div className="flex flex-row mx-2 xs:mx-5 my-5 rounded-2xl px-3 py-1 items-center justify-center w-[calc(100%-20px)] xs:w-[calc(100%-40px)] h-[60px] bg-level2">
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
          <span className="text-white text-xl xs:text-2xl font-bold mt-1">일일 리포트</span>
          <div className="absolute right-0 flex cursor-pointer">
            <NoteIcon onClick={handleMusicListClick} className="mr-3" />
            <ShareIcon onClick={handleShare} />
          </div>
        </div>
      </div>
      <div className="flex flex-col px-5 gap-y-5 justify-between pb-[82px]">
        <div ref={reportRef} className="flex flex-col gap-y-5">
          <UserTemperGraph scores={[75, 59, 85, 39, 51]} />
          <ReportDetail />
        </div>
      </div>
      {isCopied && <span className="text-sm text-green-500">복사 완료!</span>}
      {isSharing && <span className="text-sm text-blue-500">이미지 생성 중...</span>}
    </div>
  );
}
