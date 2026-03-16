import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import NhapHang from "./pages/NhapHang";
import DichVu from "./pages/DichVu";
import ThanhToan from "./pages/ThanhToan";
import BanHang from "./pages/BanHang";
import Khac from "./pages/Khac";
import AiAssistant from "./components/AiAssistant";

function App() {
  return (
    <Router>
      <div className="app-container">
        <AiAssistant />
        
        <main className="content-area">
          <Routes>
            <Route path="/" element={<NhapHang />} />
            <Route path="/dich-vu" element={<DichVu />} />
            <Route path="/thanh-toan" element={<ThanhToan />} />
            <Route path="/ban-hang" element={<BanHang />} />
            <Route path="/khac" element={<Khac />} />
          </Routes>
        </main>
        
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
