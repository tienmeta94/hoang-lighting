import { HashRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Placeholder from './pages/Placeholder'

// HashRouter để chạy tốt trên GitHub Pages (không cần cấu hình server cho route con).
export default function App() {
  return (
    <HashRouter>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/san-pham"
              element={<Placeholder title="Danh sách sản phẩm" milestone="mốc M2" />}
            />
            <Route
              path="/san-pham/:slug"
              element={<Placeholder title="Chi tiết sản phẩm" milestone="mốc M2" />}
            />
            <Route path="/gio-hang" element={<Placeholder title="Giỏ hàng" milestone="mốc M3" />} />
            <Route path="/dat-hang" element={<Placeholder title="Đặt hàng" milestone="mốc M3" />} />
            <Route
              path="/gioi-thieu"
              element={<Placeholder title="Giới thiệu Hoang Lighting" milestone="mốc M4" />}
            />
            <Route path="/lien-he" element={<Placeholder title="Liên hệ" milestone="mốc M4" />} />
            <Route
              path="/chinh-sach"
              element={<Placeholder title="Chính sách bán hàng" milestone="mốc M4" />}
            />
            <Route path="*" element={<Placeholder title="Không tìm thấy trang" milestone="" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </HashRouter>
  )
}
