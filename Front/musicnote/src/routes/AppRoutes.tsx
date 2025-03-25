import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Analysis from "../pages/Analysis";
import Discover from "../pages/Discover";
import Recommendations from "../pages/Recommendations";
import MusicList from "../pages/MusicList";

export default function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/musiclist/:title/" element={<MusicList />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/recommendations" element={<Recommendations />} />
    </Routes>
  );
}
