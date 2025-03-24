import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.tsx";
import NavBar from "./components/layout/NavBar.tsx";
import "./styles/Global.css";
function App() {
  return (
    <Router>
      <NavBar />
      <AppRoutes />
    </Router>
  );
}

export default App;
