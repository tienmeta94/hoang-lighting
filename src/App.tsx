import { HashRouter, Outlet, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import { About, Contact, Policies } from './pages/StaticPages'
import Placeholder from './pages/Placeholder'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProductForm from './pages/admin/ProductForm'
import ZaloFloat from './components/ZaloFloat'
import ScrollToTop from './components/ScrollToTop'
import BackToTop from './components/BackToTop'
import { CartProvider } from './store/cart'
import { ProductsProvider, useProducts } from './store/products'

// Khung giao diện bán hàng (header/footer/nút nổi) — khu vực /admin dùng khung riêng tối giản.
function ShopLayout() {
  const { loading } = useProducts()
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          {loading ? (
            <div className="app-loading">
              <div className="spinner"></div>
              <div>Đang tải sản phẩm…</div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
        <Footer />
      </div>
      <BackToTop />
      <ZaloFloat />
    </>
  )
}

// HashRouter để chạy tốt trên GitHub Pages (không cần cấu hình server cho route con).
export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <HashRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<ShopLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/san-pham" element={<ProductList />} />
              <Route path="/san-pham/:slug" element={<ProductDetail />} />
              <Route path="/gio-hang" element={<Cart />} />
              <Route path="/dat-hang" element={<Checkout />} />
              <Route path="/gioi-thieu" element={<About />} />
              <Route path="/lien-he" element={<Contact />} />
              <Route path="/chinh-sach" element={<Policies />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/san-pham/:id" element={<AdminProductForm />} />
            <Route path="*" element={<Placeholder title="Không tìm thấy trang" milestone="" />} />
          </Routes>
        </HashRouter>
      </CartProvider>
    </ProductsProvider>
  )
}
