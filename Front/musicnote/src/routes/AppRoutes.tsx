import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Analysis from "../pages/analysis/Analysis";
import ReportDaily from "../pages/analysis/ReportDaily";
import ReportWeekly from "../pages/analysis/ReportWeekly";
import Discover from "../pages/discover/Discover";
import ChoiceMusicAnalysis from "../pages/discover/ChoiceMusicAnalysis";
import LineChart from "../pages/discover/LineChart";
import Recommendations from "../pages/recommend/Recommendations";
import Login from "../pages/Login";
import MusicList from "../pages/MusicList";
import RecommendationDetail from "../pages/recommend/RecommendationDetail";
import MyRecommendationDetail from "../pages/recommend/MyRecommendationDetail";
import MyRecommendation from "../pages/recommend/MyRecommendation";
import NotFound from "../components/NotFound";
import Notification from "../pages/Notification";

export default function AppRoutes(): React.ReactElement {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/musiclist/:title/" element={<MusicList />} />
      <Route path="/analysis" element={<Analysis />} />
      <Route path="/analysis/report/daily/:reportId" element={<ReportDaily />} />
      <Route path="/analysis/report/weekly/:reportId" element={<ReportWeekly />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/discover/choice-music-analysis" element={<ChoiceMusicAnalysis />} />
      <Route path="/discover/line-chart" element={<LineChart />} />
      <Route path="/recommendations" element={<Recommendations />} />
      <Route path="/recommendations/detail/:domain" element={<RecommendationDetail />} />
      <Route path="/recommendations/my" element={<MyRecommendation />} />
      <Route path="/recommendations/my/:domain" element={<MyRecommendationDetail />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
