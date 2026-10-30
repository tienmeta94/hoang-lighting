import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { products as fallbackProducts, type Product, type Spec } from '../data/products'
import { supabase } from '../lib/supabase'

export type ProductSource = 'supabase' | 'local'

interface ProductsContextValue {
  products: Product[]
  loading: boolean
  source: ProductSource
  refresh: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export interface ProductRow {
  id: string
  slug: string
  name: string
  category: Product['category']
  price: number
  old_price: number | null
  image: string
  short_desc: string
  description: string
  specs: Spec[] | null
  badge: Product['badge']
  featured: boolean
  rating: number
  sold: number
  visible: boolean
  sort: number
}

export const rowToProduct = (row: ProductRow): Product => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  category: row.category,
  price: row.price,
  oldPrice: row.old_price ?? undefined,
  image: row.image,
  shortDesc: row.short_desc,
  description: row.description,
  specs: Array.isArray(row.specs) ? row.specs : [],
  badge: row.badge ?? undefined,
  featured: row.featured || undefined,
  rating: Number(row.rating) || 0,
  sold: row.sold || 0,
})

export const productToRow = (p: Product, extra?: { visible?: boolean; sort?: number }) => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  category: p.category,
  price: p.price,
  old_price: p.oldPrice ?? null,
  image: p.image,
  short_desc: p.shortDesc,
  description: p.description,
  specs: p.specs,
  badge: p.badge ?? null,
  featured: Boolean(p.featured),
  rating: p.rating,
  sold: p.sold,
  visible: extra?.visible ?? true,
  sort: extra?.sort ?? 0,
})

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [source, setSource] = useState<ProductSource>('local')

  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('visible', true)
      .order('sort', { ascending: true })
      .order('sold', { ascending: false })
    if (error || !data) {
      // Không lấy được dữ liệu từ backend -> giữ dữ liệu local để web vẫn chạy.
      console.warn('Không tải được sản phẩm từ Supabase, dùng dữ liệu local.', error?.message)
      setSource('local')
      setProducts(fallbackProducts)
    } else {
      setProducts((data as ProductRow[]).map(rowToProduct))
      setSource('supabase')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ products, loading, source, refresh }),
    [products, loading, source, refresh],
  )
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts(): ProductsContextValue {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts phải dùng bên trong ProductsProvider')
  return ctx
}
