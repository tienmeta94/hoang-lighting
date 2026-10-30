import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from 'lucide-react'
import { categoryName, products } from '../data/products'
import { discountPercent, formatVND } from '../lib/format'
import { useCart } from '../store/cart'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { add } = useCart()
  const product = products.find((p) => p.slug === slug)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setQty(1)
    setAdded(false)
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-stone-900">Không tìm thấy sản phẩm</h1>
        <p className="mt-2 text-sm text-stone-500">
          Sản phẩm có thể đã ngừng bán hoặc đường dẫn chưa đúng.
        </p>
        <Link
          to="/san-pham"
          className="mt-6 inline-block rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          Xem tất cả sản phẩm
        </Link>
      </main>
    )
  }

  const discount = discountPercent(product.price, product.oldPrice)
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
  const relatedFilled =
    related.length >= 4
      ? related
      : [...related, ...products.filter((p) => p.category !== product.category && p.id !== product.id)].slice(0, 4)

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-1 text-sm text-stone-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-amber-600">Trang chủ</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/san-pham" className="hover:text-amber-600">Sản phẩm</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/san-pham?danh-muc=${product.category}`} className="hover:text-amber-600">
          {categoryName(product.category)}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="line-clamp-1 font-medium text-stone-800">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* Ảnh */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/70">
          <ProductImage category={product.category} name={product.name} large />
        </div>

        {/* Thông tin mua */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-amber-600">
            {categoryName(product.category)}
          </span>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight text-stone-900">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-stone-500">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-stone-800">{product.rating.toFixed(1)}</span>
            </span>
            <span>·</span>
            <span>Đã bán {product.sold}</span>
            <span>·</span>
            <span className="font-medium text-emerald-600">Còn hàng</span>
          </div>

          <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-extrabold text-red-600">{formatVND(product.price)}</span>
              {product.oldPrice && (
                <span className="text-base text-stone-400 line-through">{formatVND(product.oldPrice)}</span>
              )}
              {discount && (
                <span className="rounded bg-red-50 px-2 py-0.5 text-sm font-bold text-red-600">
                  Giảm {discount}%
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-stone-400">Giá đã gồm VAT · Thanh toán khi nhận hàng (COD)</p>
          </div>

          <p className="mt-4 leading-relaxed text-stone-600">{product.shortDesc}</p>

          {/* Số lượng + nút mua */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-white ring-1 ring-stone-300">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2.5 text-stone-600 transition hover:text-amber-600 disabled:opacity-40"
                disabled={qty <= 1}
                aria-label="Giảm số lượng"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(99, q + 1))}
                className="px-3 py-2.5 text-stone-600 transition hover:text-amber-600"
                aria-label="Tăng số lượng"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => {
                add(product.id, qty)
                setAdded(true)
              }}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold ring-1 transition ${
                added
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-300'
                  : 'bg-white text-stone-900 ring-stone-300 hover:ring-amber-400'
              }`}
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {added ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
            </button>
            <button
              onClick={() => {
                add(product.id, qty)
                navigate('/dat-hang')
              }}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 font-semibold text-stone-900 transition hover:bg-amber-300"
            >
              <Zap className="h-4 w-4" /> Mua ngay
            </button>
          </div>
          {added && (
            <p className="mt-2 text-xs text-stone-500">
              Đã lưu vào giỏ hàng trên máy của bạn.{' '}
              <Link to="/gio-hang" className="font-semibold text-amber-600 hover:text-amber-700">
                Xem giỏ hàng →
              </Link>
            </p>
          )}

          <ul className="mt-6 grid gap-2 text-sm text-stone-600 sm:grid-cols-3">
            <li className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 ring-1 ring-stone-200/70">
              <Truck className="h-4 w-4 shrink-0 text-amber-500" /> Giao toàn quốc 2–4 ngày
            </li>
            <li className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 ring-1 ring-stone-200/70">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-500" /> Bảo hành theo thông số dưới đây
            </li>
            <li className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 ring-1 ring-stone-200/70">
              <RotateCcw className="h-4 w-4 shrink-0 text-amber-500" /> Đổi trả trong 7 ngày
            </li>
          </ul>
        </div>
      </div>

      {/* Mô tả + thông số */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
          <h2 className="text-lg font-extrabold text-stone-900">Mô tả sản phẩm</h2>
          <p className="mt-3 leading-relaxed text-stone-600">{product.description}</p>
        </section>
        <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
          <h2 className="text-lg font-extrabold text-stone-900">Thông số kỹ thuật</h2>
          <dl className="mt-3 divide-y divide-stone-100">
            {product.specs.map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-4 py-2.5 text-sm">
                <dt className="shrink-0 text-stone-500">{s.label}</dt>
                <dd className="text-right font-medium text-stone-800">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* Liên quan */}
      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">Sản phẩm liên quan</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {relatedFilled.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
