import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Analysis from "../pages/analysis/Analysis";
import Report from "../pages/analysis/Report";
import Discover from "../pages/discover/Discover";
import ChoiceMusicAnalysis from "../pages/discover/ChoiceMusicAnalysis";
import LineChart from "../pages/discover/LineChart";
import Recommendations from "../pages/recommend/Recommendations";
import Login from "../pages/Login";
import MusicList from "../pages/MusicList";
import MyRecommendation from "../pages/recommend/MyRecommendation";
import NotFound from "../components/NotFound";
import Notification from "../pages/Notification";
import RecommendationMovie from "../pages/recommend/RecommendationMovie";
import RecommendationMusic from "../pages/recommend/RecommendationMusic";
import RecommendationBook from "../pages/recommend/RecommendationBook";
import MyRecommendationDetail from "../pages/recommend/MyRecommendationDetail";

export default function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/musiclist/:title/" element={<MusicList />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/analysis/report" element={<Report />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/discover/choice-music-analysis" element={<ChoiceMusicAnalysis />} />
      <Route path="/discover/line-chart" element={<LineChart />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/recommendations/detail/movie" element={<RecommendationMovie />} />
      <Route path="/recommendations/detail/music" element={<RecommendationMusic />} />
      <Route path="/recommendations/detail/book" element={<RecommendationBook />} />
      <Route path="/recommendations/my" element={<MyRecommendation />} />
      <Route path="/recommendations/my/movie" element={<MyRecommendationDetail />} />
      <Route path="/recommendations/my/music" element={<MyRecommendationDetail />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
