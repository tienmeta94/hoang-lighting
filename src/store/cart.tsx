import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { type Product } from '../data/products'
import { useProducts } from './products'

export interface CartLine {
  product: Product
  qty: number
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  add: (productId: string, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const STORAGE_KEY = 'hoang-lighting-cart-v1'

type StoredCart = Record<string, number>

// Giỏ lưu theo id sản phẩm; id có thể đến từ backend nên chỉ kiểm tra định dạng,
// việc khớp sản phẩm thật diễn ra khi tính lines theo danh mục hiện tại.
const loadCart = (): StoredCart => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const valid: StoredCart = {}
    for (const [id, qty] of Object.entries(parsed)) {
      if (typeof id === 'string' && id && typeof qty === 'number' && qty > 0) {
        valid[id] = Math.min(99, Math.floor(qty))
      }
    }
    return valid
  } catch {
    return {}
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts()
  const [items, setItems] = useState<StoredCart>(loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // localStorage không khả dụng (chế độ riêng tư…) — giỏ vẫn chạy trong phiên.
    }
  }, [items])

  const add = useCallback((productId: string, qty = 1) => {
    setItems((prev) => ({
      ...prev,
      [productId]: Math.min(99, (prev[productId] ?? 0) + qty),
    }))
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) {
        const next = { ...prev }
        delete next[productId]
        return next
      }
      return { ...prev, [productId]: Math.min(99, qty) }
    })
  }, [])

  const remove = useCallback((productId: string) => {
    setItems((prev) => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }, [])

  const clear = useCallback(() => setItems({}), [])

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = Object.entries(items)
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === id)
        return product ? { product, qty } : null
      })
      .filter((l): l is CartLine => l !== null)
    // Badge đếm theo số món đã thêm (kể cả khi danh mục đang tải), tổng tiền theo lines đã khớp.
    const count = Object.values(items).reduce((sum, q) => sum + q, 0)
    const subtotal = lines.reduce((sum, l) => sum + l.qty * l.product.price, 0)
    return { lines, count, subtotal, add, setQty, remove, clear }
  }, [items, products, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart phải dùng bên trong CartProvider')
  return ctx
}
