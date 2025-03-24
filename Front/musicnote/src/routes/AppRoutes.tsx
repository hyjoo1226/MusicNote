import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.tsx";
import Analysis from "../pages/Analysis.tsx";
import Discover from "../pages/Discover.tsx";
import Recommendations from "../pages/Recommendations.tsx";

export default function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/recommendations" element={<Recommendations />} />
    </Routes>
  );
}
