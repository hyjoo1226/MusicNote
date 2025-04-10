import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";

import HomeIcon from "../../assets/icon/home-icon.svg?react";
import ReportIcon from "../../assets/icon/report-icon.svg?react";
import PreferenceIcon from "../../assets/icon/preference-icon.svg?react";
import RecommendIcon from "../../assets/icon/recommend-icon.svg?react";

export default function NavBar() {
  const location = useLocation();

  // 정확히 일치해야 하는 경로들
  const exactHiddenPaths = [
    "/",
    "/discover/choice-music-analysis",
    "/discover/choice-music-analysis/reports",
    "/callback",
  ];

  // 특정 경로로 시작하는 모든 페이지를 숨길 경로들
  const patternHiddenPaths = [
    "/musiclist",
    "/choice-musiclist",
    "/analysis/report/choice",
    "/recommendationlist",
    "/recommendations/detail",
    "/recommendations/my",
  ];

  // NotFound 페이지
  const isNotFoundPage = location.state?.isNotFound === true;

  const shouldShowNavBar = !(
    exactHiddenPaths.includes(location.pathname) ||
    patternHiddenPaths.some((path) => location.pathname.startsWith(path + "/")) ||
    isNotFoundPage
  );

  useEffect(() => {
    // NavBar가 보이는 경우에만 패딩 클래스 추가
    if (shouldShowNavBar) {
      document.getElementById("root")?.classList.add("has-navbar");
    } else {
      document.getElementById("root")?.classList.remove("has-navbar");
    }

    // 컴포넌트 언마운트 시 클래스 제거
    return () => {
      document.getElementById("root")?.classList.remove("has-navbar");
    };
  }, [shouldShowNavBar]);

  if (!shouldShowNavBar) {
    return null;
  }

  return (
    <div className="navbar fixed bottom-0 w-full min-w-[320px] max-w-[600px] h-[80px] bg-level1 z-10">
      <ul className="flex justify-evenly py-[16px] w-full text-[12px] font-medium">
        <li className="flex-1">
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? "text-main" : "text-gray"}`
            }
            to={"/home"}
          >
            {({ isActive }) => (
              <>
                <HomeIcon className="mb-[6px]" stroke={isActive ? "text-main" : "text-gray"} />홈
              </>
            )}
          </NavLink>
        </li>
        <li className="flex-1">
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? "text-main" : "text-gray"}`
            }
            to={"/analysis"}
          >
            {({ isActive }) => (
              <>
                <ReportIcon className="mb-[6px]" stroke={isActive ? "text-main" : "text-gray"} />
                성향분석
              </>
            )}
          </NavLink>
        </li>
        <li className="flex-1">
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? "text-main" : "text-gray"}`
            }
            to={"/discover"}
          >
            {({ isActive }) => (
              <>
                <PreferenceIcon
                  className="mb-[6px]"
                  stroke={isActive ? "text-main" : "text-gray"}
                />
                취향플러스
              </>
            )}
          </NavLink>
        </li>
        <li className="flex-1">
          <NavLink
            className={({ isActive }) =>
              `flex flex-col items-center ${isActive ? "text-main" : "text-gray"}`
            }
            to={"/recommendations"}
          >
            {({ isActive }) => (
              <>
                <RecommendIcon className="mb-[6px]" stroke={isActive ? "text-main" : "text-gray"} />
                추천컨텐츠
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
