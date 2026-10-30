import { HashRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
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

// Khung shimmer hiển thị trong lúc chờ dữ liệu sản phẩm từ backend.
function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10" aria-label="Đang tải sản phẩm">
      <div className="h-44 animate-pulse rounded-3xl bg-stone-200/80" />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl bg-white p-3 ring-1 ring-stone-200/60">
            <div className="aspect-square rounded-xl bg-stone-200/80" />
            <div className="mt-3 h-3.5 w-4/5 rounded bg-stone-200/80" />
            <div className="mt-2 h-3.5 w-3/5 rounded bg-stone-200/80" />
            <div className="mt-3 h-5 w-2/5 rounded bg-amber-200/80" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Khung giao diện bán hàng (header/footer/nút nổi) — khu vực /admin dùng khung riêng tối giản.
function ShopLayout() {
  const { loading } = useProducts()
  const location = useLocation()
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          {loading ? (
            <ShopSkeleton />
          ) : (
            <div key={location.pathname} className="page-enter">
              <Outlet />
            </div>
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
