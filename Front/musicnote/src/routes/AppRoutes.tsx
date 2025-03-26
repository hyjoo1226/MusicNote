import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Analysis from "../pages/Analysis";
import Discover from "../pages/Discover";
import Recommendations from "../pages/Recommendations";
import Login from "../pages/Login";
import MusicList from "../pages/MusicList";
import RecommendationDetail from "../pages/RecommendationDetail";
import MyRecommendationDetail from "../pages/MyRecommendationDetail";

export default function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/musiclist/:title/" element={<MusicList />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/recommendation-detail/:domain" element={<RecommendationDetail />} />
      <Route path="/my-recommendation/:domain" element={<MyRecommendationDetail />} />
    </Routes>
  );
}
