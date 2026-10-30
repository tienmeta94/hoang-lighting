import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RotateCcw, Search, SearchX } from 'lucide-react'
import { categories, products, type CategorySlug } from '../data/products'
import { formatVND } from '../lib/format'
import { normalizeVi } from '../lib/text'
import ProductCard from '../components/ProductCard'

interface PriceRange {
  id: string
  label: string
  test: (price: number) => boolean
}

const priceRanges: PriceRange[] = [
  { id: 'duoi-100', label: `Dưới ${formatVND(100000)}`, test: (p) => p < 100000 },
  { id: '100-200', label: `${formatVND(100000)} – ${formatVND(200000)}`, test: (p) => p >= 100000 && p < 200000 },
  { id: '200-500', label: `${formatVND(200000)} – ${formatVND(500000)}`, test: (p) => p >= 200000 && p < 500000 },
  { id: 'tren-500', label: `Trên ${formatVND(500000)}`, test: (p) => p >= 500000 },
]

const sortOptions = [
  { id: 'noi-bat', label: 'Nổi bật' },
  { id: 'ban-chay', label: 'Bán chạy nhất' },
  { id: 'gia-tang', label: 'Giá: thấp đến cao' },
  { id: 'gia-giam', label: 'Giá: cao đến thấp' },
  { id: 'danh-gia', label: 'Đánh giá cao' },
] as const

type SortId = (typeof sortOptions)[number]['id']

const isCategory = (v: string | null): v is CategorySlug =>
  v !== null && categories.some((c) => c.slug === v)

export default function ProductList() {
  const [params, setParams] = useSearchParams()

  const category = isCategory(params.get('danh-muc')) ? (params.get('danh-muc') as CategorySlug) : null
  const query = params.get('q') ?? ''
  const priceIds = (params.get('gia') ?? '').split(',').filter((id) => priceRanges.some((r) => r.id === id))
  const sortParam = params.get('sap-xep')
  const sort: SortId = sortOptions.some((o) => o.id === sortParam) ? (sortParam as SortId) : 'noi-bat'

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value === null || value === '') next.delete(key)
      else next.set(key, value)
    }
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = normalizeVi(query.trim())
    const list = products.filter((p) => {
      if (category && p.category !== category) return false
      if (priceIds.length > 0 && !priceRanges.some((r) => priceIds.includes(r.id) && r.test(p.price)))
        return false
      if (q && !normalizeVi(`${p.name} ${p.shortDesc}`).includes(q)) return false
      return true
    })
    const by: Record<SortId, (a: (typeof products)[number], b: (typeof products)[number]) => number> = {
      'noi-bat': (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.sold - a.sold,
      'ban-chay': (a, b) => b.sold - a.sold,
      'gia-tang': (a, b) => a.price - b.price,
      'gia-giam': (a, b) => b.price - a.price,
      'danh-gia': (a, b) => b.rating - a.rating,
    }
    return [...list].sort(by[sort])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, query, priceIds.join(','), sort])

  const hasFilters = category !== null || query !== '' || priceIds.length > 0
  const activeCategoryName = category ? categories.find((c) => c.slug === category)?.name : null

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
        {activeCategoryName ?? 'Tất cả sản phẩm'}
      </h1>
      <p className="mt-1 text-sm text-stone-500">
        Hiển thị {filtered.length} / {products.length} sản phẩm
        {hasFilters && ' theo bộ lọc hiện tại'}
      </p>

      {/* Thanh tìm kiếm + sắp xếp */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Tìm đèn… (gõ không dấu cũng được, ví dụ: den pha)"
            className="w-full rounded-full bg-white py-2.5 pl-10 pr-4 text-sm ring-1 ring-stone-300 outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-amber-400"
          />
        </label>
        <select
          value={sort}
          onChange={(e) => update({ 'sap-xep': e.target.value === 'noi-bat' ? null : e.target.value })}
          className="rounded-full bg-white px-4 py-2.5 text-sm ring-1 ring-stone-300 outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Sắp xếp sản phẩm"
        >
          {sortOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Bộ lọc */}
        <aside className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-700">Danh mục</h2>
            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:items-stretch">
              <button
                onClick={() => update({ 'danh-muc': null })}
                className={`rounded-full px-3.5 py-2 text-left text-sm font-medium transition lg:rounded-lg ${
                  category === null
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-amber-300'
                }`}
              >
                Tất cả
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => update({ 'danh-muc': category === c.slug ? null : c.slug })}
                  className={`rounded-full px-3.5 py-2 text-left text-sm font-medium transition lg:rounded-lg ${
                    category === c.slug
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-amber-300'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-700">Khoảng giá</h2>
            <div className="mt-3 space-y-2">
              {priceRanges.map((r) => {
                const checked = priceIds.includes(r.id)
                return (
                  <label
                    key={r.id}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg bg-white px-3 py-2 text-sm text-stone-700 ring-1 ring-stone-200 transition hover:ring-amber-300"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked ? priceIds.filter((id) => id !== r.id) : [...priceIds, r.id]
                        update({ gia: next.length ? next.join(',') : null })
                      }}
                      className="h-4 w-4 accent-amber-500"
                    />
                    {r.label}
                  </label>
                )
              })}
            </div>
          </div>
          {hasFilters && (
            <button
              onClick={() => setParams({}, { replace: true })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              <RotateCcw className="h-4 w-4" /> Xoá tất cả bộ lọc
            </button>
          )}
        </aside>

        {/* Lưới sản phẩm */}
        <section>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl bg-white px-6 py-16 text-center ring-1 ring-stone-200/70">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-400">
                <SearchX className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-stone-800">Không tìm thấy sản phẩm phù hợp</h2>
              <p className="mt-1 max-w-sm text-sm text-stone-500">
                Thử bỏ bớt khoảng giá, đổi danh mục hoặc tìm bằng từ khoá ngắn hơn.
              </p>
              <button
                onClick={() => setParams({}, { replace: true })}
                className="mt-5 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
