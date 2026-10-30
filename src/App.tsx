import { HashRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { About, Contact, Policies } from './pages/StaticPages'
import Placeholder from './pages/Placeholder'
import ZaloFloat from './components/ZaloFloat'
import ScrollToTop from './components/ScrollToTop'
import BackToTop from './components/BackToTop'
import { CartProvider } from './store/cart'

// HashRouter để chạy tốt trên GitHub Pages (không cần cấu hình server cho route con).
export default function App() {
  return (
    <CartProvider>
    <HashRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/san-pham" element={<ProductList />} />
            <Route path="/san-pham/:slug" element={<ProductDetail />} />
            <Route path="/gio-hang" element={<Cart />} />
            <Route path="/dat-hang" element={<Checkout />} />
            <Route path="/gioi-thieu" element={<About />} />
            <Route path="/lien-he" element={<Contact />} />
            <Route path="/chinh-sach" element={<Policies />} />
            <Route path="*" element={<Placeholder title="Không tìm thấy trang" milestone="" />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <BackToTop />
      <ZaloFloat />
    </HashRouter>
    </CartProvider>
  )
}
