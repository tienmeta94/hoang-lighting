import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { formatVND } from '../lib/format'
import { useCart } from '../store/cart'
import ProductImage from '../components/ProductImage'

export default function Cart() {
  const { lines, count, subtotal, setQty, remove, clear } = useCart()
  const [confirmingClear, setConfirmingClear] = useState(false)

  if (lines.length === 0) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-600">
          <ShoppingCart className="h-8 w-8" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-stone-900">Giỏ hàng đang trống</h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-500">
          Bạn chưa thêm sản phẩm nào. Lượn một vòng danh sách đèn, ưng mẫu nào bấm nút giỏ để thêm
          vào đây nhé.
        </p>
        <Link
          to="/san-pham"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          Xem sản phẩm <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
        Giỏ hàng <span className="text-lg font-semibold text-stone-400">({count} sản phẩm)</span>
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="space-y-3">
          {lines.map(({ product, qty }) => (
            <article
              key={product.id}
              className="flex gap-4 rounded-2xl bg-white p-3 ring-1 ring-stone-200/70"
            >
              <Link
                to={`/san-pham/${product.slug}`}
                className="w-24 shrink-0 overflow-hidden rounded-xl sm:w-28"
              >
                <ProductImage category={product.category} name={product.name} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    to={`/san-pham/${product.slug}`}
                    className="line-clamp-2 font-semibold leading-snug text-stone-800 hover:text-amber-600"
                  >
                    {product.name}
                  </Link>
                  <button
                    onClick={() => remove(product.id)}
                    aria-label={`Xoá ${product.name} khỏi giỏ`}
                    className="shrink-0 rounded-full p-1.5 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className="mt-0.5 text-sm text-stone-500">{formatVND(product.price)} / chiếc</span>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="inline-flex items-center rounded-full ring-1 ring-stone-300">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      className="px-2.5 py-1.5 text-stone-600 transition hover:text-amber-600"
                      aria-label="Giảm số lượng"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-7 text-center text-sm font-bold">{qty}</span>
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      className="px-2.5 py-1.5 text-stone-600 transition hover:text-amber-600"
                      aria-label="Tăng số lượng"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-bold text-stone-900">{formatVND(product.price * qty)}</span>
                </div>
              </div>
            </article>
          ))}

          <div className="flex items-center justify-between pt-1">
            <Link to="/san-pham" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
              ← Tiếp tục mua sắm
            </Link>
            {confirmingClear ? (
              <span className="inline-flex items-center gap-2 text-sm">
                <span className="text-stone-500">Xoá toàn bộ giỏ?</span>
                <button
                  onClick={() => {
                    clear()
                    setConfirmingClear(false)
                  }}
                  className="font-semibold text-red-600 hover:text-red-700"
                >
                  Xoá hết
                </button>
                <button
                  onClick={() => setConfirmingClear(false)}
                  className="font-semibold text-stone-600 hover:text-stone-800"
                >
                  Huỷ
                </button>
              </span>
            ) : (
              <button
                onClick={() => setConfirmingClear(true)}
                className="text-sm font-medium text-stone-400 transition hover:text-red-600"
              >
                Xoá giỏ hàng
              </button>
            )}
          </div>
        </section>

        <aside className="h-fit rounded-3xl bg-white p-5 ring-1 ring-stone-200/70 lg:sticky lg:top-32">
          <h2 className="font-extrabold text-stone-900">Tóm tắt đơn</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-500">Tạm tính ({count} sản phẩm)</dt>
              <dd className="font-semibold">{formatVND(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Phí giao hàng</dt>
              <dd className="text-right text-stone-600">Shop báo khi xác nhận đơn</dd>
            </div>
            <div className="flex justify-between border-t border-dashed border-stone-200 pt-3 text-base">
              <dt className="font-bold text-stone-900">Tổng cộng</dt>
              <dd className="font-extrabold text-red-600">{formatVND(subtotal)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs leading-relaxed text-stone-400">
            Thanh toán khi nhận hàng (COD). Shop sẽ gọi điện xác nhận đơn và báo phí giao hàng trước
            khi gửi.
          </p>
          <Link
            to="/dat-hang"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-stone-900 transition hover:bg-amber-300"
          >
            Tiến hành đặt hàng <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </main>
  )
}
