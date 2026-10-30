import { Link, NavLink } from 'react-router-dom'
import { Lightbulb, Phone, ShoppingCart, Truck } from 'lucide-react'
import { shop } from '../config'
import { useCart } from '../store/cart'

const navItems = [
  { to: '/', label: 'Trang chủ' },
  { to: '/san-pham', label: 'Sản phẩm' },
  { to: '/gioi-thieu', label: 'Giới thiệu' },
  { to: '/lien-he', label: 'Liên hệ' },
]

export default function Header() {
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <div className="bg-stone-900 text-stone-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5 text-amber-400" />
            Giao hàng toàn quốc · Thanh toán khi nhận hàng (COD)
          </span>
          <span className="hidden items-center gap-1.5 sm:inline-flex">
            <Phone className="h-3.5 w-3.5 text-amber-400" />
            Hotline/Zalo: <span className="font-semibold text-white">{shop.phone || 'Đang cập nhật'}</span>
          </span>
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-900">
              <Lightbulb className="h-6 w-6" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-stone-900">
                Hoang <span className="text-amber-500">Lighting</span>
              </span>
              <span className="block text-[11px] text-stone-500">Đèn đẹp cho mọi không gian</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition hover:text-amber-600 ${
                    isActive ? 'text-amber-600' : 'text-stone-700'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/gio-hang"
            className="relative inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[11px] font-bold text-stone-900">
              {count}
            </span>
          </Link>
        </div>
        <nav className="flex items-center justify-center gap-6 border-t border-stone-100 py-2 md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-amber-600' : 'text-stone-700'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
