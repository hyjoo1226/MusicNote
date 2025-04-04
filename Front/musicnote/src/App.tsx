import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";
import NavBar from "./components/layout/NavBar.tsx";
import { useEffect } from "react";
import "./styles/Global.css";

function App() {
  useEffect(() => {
    // PWA standalone 모드 감지
    const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches;

    // document 루트에 CSS 변수 설정
    if (isInStandaloneMode) {
      document.documentElement.style.setProperty("--app-height", "100lvh");
    } else {
      document.documentElement.style.setProperty("--app-height", "100svh");
    }

    // display-mode 변경 감지
    const mql = window.matchMedia("(display-mode: standalone)");
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.style.setProperty("--app-height", e.matches ? "100lvh" : "100svh");
    };

    mql.addEventListener("change", handleChange);

    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <Router>
      <NavBar />
      <AppRoutes />
    </Router>
  );
}

export default App;
