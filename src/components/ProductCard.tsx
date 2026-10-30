import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ShoppingCart, Star } from 'lucide-react'
import type { Product } from '../data/products'
import { categoryName } from '../data/products'
import { discountPercent, formatVND } from '../lib/format'
import { useCart } from '../store/cart'
import ProductImage from './ProductImage'

const badgeStyle: Record<string, string> = {
  hot: 'bg-red-600 text-white',
  new: 'bg-emerald-600 text-white',
  sale: 'bg-amber-500 text-white',
}
const badgeText: Record<string, string> = { hot: 'Bán chạy', new: 'Mới', sale: 'Giảm giá' }

export default function ProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.oldPrice)
  const { add } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    add(product.id, 1)
    setJustAdded(true)
    window.setTimeout(() => setJustAdded(false), 1500)
  }
  return (
    <Link
      to={`/san-pham/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/70 transition hover:shadow-md"
    >
      <div className="relative overflow-hidden">
        <ProductImage category={product.category} name={product.name} />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {product.badge && (
            <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${badgeStyle[product.badge]}`}>
              {badgeText[product.badge]}
            </span>
          )}
          {discount && (
            <span className="rounded bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-red-600">
              −{discount}%
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[11px] font-medium uppercase tracking-wide text-stone-400">
          {categoryName(product.category)}
        </span>
        <h3 className="line-clamp-2 font-semibold leading-snug text-stone-800 group-hover:text-amber-600">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-stone-500">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-stone-700">{product.rating.toFixed(1)}</span>
          <span>· Đã bán {product.sold}</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <span className="text-lg font-bold text-red-600">{formatVND(product.price)}</span>
            {product.oldPrice && (
              <span className="ml-2 text-sm text-stone-400 line-through">{formatVND(product.oldPrice)}</span>
            )}
          </div>
          <button
            onClick={quickAdd}
            aria-label={`Thêm ${product.name} vào giỏ`}
            title="Thêm vào giỏ"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
              justAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-400 text-stone-900 hover:bg-amber-300'
            }`}
          >
            {justAdded ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </Link>
  )
}
