import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { products, type Product } from '../data/products'

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

const loadCart = (): StoredCart => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const valid: StoredCart = {}
    for (const [id, qty] of Object.entries(parsed)) {
      if (products.some((p) => p.id === id) && typeof qty === 'number' && qty > 0) {
        valid[id] = Math.min(99, Math.floor(qty))
      }
    }
    return valid
  } catch {
    return {}
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
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
    const count = lines.reduce((sum, l) => sum + l.qty, 0)
    const subtotal = lines.reduce((sum, l) => sum + l.qty * l.product.price, 0)
    return { lines, count, subtotal, add, setQty, remove, clear }
  }, [items, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart phải dùng bên trong CartProvider')
  return ctx
}
