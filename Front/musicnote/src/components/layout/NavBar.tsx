import { NavLink, useLocation } from "react-router-dom";

import HomeIcon from "../../assets/icon/home-icon.svg?react";
import ReportIcon from "../../assets/icon/report-icon.svg?react";
import PreferenceIcon from "../../assets/icon/preference-icon.svg?react";
import RecommendIcon from "../../assets/icon/recommend-icon.svg?react";

export default function NavBar() {
  // const location = useLocation();

  // // Navbar 안보이는 경로 추가
  // const hiddenPaths = [];
  // // const hiddenPaths = ["/analysis"];

  // if (hiddenPaths.includes(location.pathname)) {
  //   return null;
  // }

  return (
    <div className="fixed bottom-0 w-full max-w-[600px] h-[80px] bg-level1 z-10">
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
                <HomeIcon
                  className="mb-[6px]"
                  stroke={isActive ? "text-main" : "text-gray"}
                />
                홈
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
                <ReportIcon
                  className="mb-[6px]"
                  stroke={isActive ? "text-main" : "text-gray"}
                />
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
                <RecommendIcon
                  className="mb-[6px]"
                  stroke={isActive ? "text-main" : "text-gray"}
                />
                추천컨텐츠
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
