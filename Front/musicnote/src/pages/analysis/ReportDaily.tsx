import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { domToJpeg } from "modern-screenshot";
import UserTemperGraph from "../../components/UserTemperGraph";
import DailyReport from "../../features/analysis/DailyReport";
import NoteIcon from "../../assets/icon/note-icon.svg?react";
import ShareIcon from "../../assets/icon/share-icon.svg?react";
import { useGetData } from "@/hooks/useApi";

interface ReportData {
  lowScore: string;
  lowText: string;
  summary: string;
  topScore: string;
  topText: string;
}

export default function ReportDaily() {
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();
  const reportRef = useRef<HTMLDivElement>(null);
  const [report, setReport] = useState<ReportData | null>(null);
  const { data: reportData } = useGetData(
    `report-${reportId}`,
    `/recommend/type?reportId=${reportId}`
  );

  useEffect(() => {
    if (reportData) {
      setReport(reportData.data);
    }
  }, [reportData]);

  // top bar
  const handleBack = () => {
    navigate(-1);
  };
  // 음악 리스트 아이콘 핸들러
  const handleMusicListClick = () => {
    navigate("/musiclist/리포트에-사용된-음악");
  };
  // web share API
  // 지원 안하는 브라우저의 경우 클립보드 복사
  const [isCopied, setIsCopied] = useState(false);
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
        document.body.removeChild(textArea);
      }
      // alert("링크가 복사되었습니다");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      // alert("링크 복사에 실패했습니다");
    }
  };
  // 공유 아이콘 핸들러
  const handleShare = async () => {
    if (!reportRef.current) return;

    try {
      let tempDataUrl = "";
      let blob;
      const MIN_SIZE = 1024 * 400; // 400KB in bytes

      // 리포트 내용을 이미지로 캡처
      do {
        await new Promise((resolve) => setTimeout(resolve, 500));

        tempDataUrl = await domToJpeg(reportRef.current, {
          backgroundColor: "#19171b",
          quality: 1,
          scale: 3,
          style: {
            transform: "scale(0.9)",
            transformOrigin: "center center",
            width: "100%",
            height: "100%",
          },
        });

        // blob으로 변환하여 크기 체크
        const response = await fetch(tempDataUrl);
        blob = await response.blob();
        console.log("Generated image size:", blob.size, "bytes");
      } while (blob.size < MIN_SIZE);

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
      console.error("공유 실패:", error);
      copyToClipboard(window.location.href);
    }
  };

  // const [title, setTitle] = useState("일일");

  return (
    <div className="text-white w-full h-[calc(100vh-80px)]">
      <div className="flex flex-row mx-[10px] xs:mx-5 my-5 rounded-2xl px-3 py-1 items-center justify-center w-[calc(100%-20px)] xs:w-[calc(100%-40px)] h-[60px] bg-level2">
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
      <div className="flex flex-col px-[10px] xs:px-5 gap-y-5 justify-between pb-[82px]">
        <div ref={reportRef} className="flex flex-col gap-y-5">
          <UserTemperGraph scores={[75, 59, 85, 39, 51]} />
          <DailyReport
            lowScore={report?.lowScore || ""}
            lowText={report?.lowText || ""}
            summary={report?.summary || ""}
            topScore={report?.topScore || ""}
            topText={report?.topText || ""}
          />
        </div>
      </div>
      {isCopied && <span className="text-sm text-green-500">복사 완료!</span>}
    </div>
  );
}
