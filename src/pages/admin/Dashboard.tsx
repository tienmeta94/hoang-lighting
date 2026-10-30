import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  DatabaseZap,
  ExternalLink,
  Eye,
  EyeOff,
  LogOut,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  Star,
  Store,
  Trash2,
} from 'lucide-react'
import { categories, products as sampleProducts, type CategorySlug } from '../../data/products'
import { formatVND } from '../../lib/format'
import { supabase } from '../../lib/supabase'
import { normalizeVi } from '../../lib/text'
import { useAdminSession } from '../../lib/useAdmin'
import { usePageTitle } from '../../lib/usePageTitle'
import { productToRow, rowToProduct, type ProductRowT } from './shared'
import { useProducts } from '../../store/products'
import NotConfigured from './NotConfigured'

type StatusFilter = 'all' | 'visible' | 'hidden'
type SortMode = 'default' | 'price-asc' | 'price-desc' | 'sold-desc' | 'rating-desc' | 'name-asc'

const badgeStyle: Record<string, string> = {
  hot: 'bg-red-500 text-white',
  new: 'bg-emerald-500 text-white',
  sale: 'bg-orange-500 text-white',
}
const badgeLabel: Record<string, string> = { hot: 'HOT', new: 'MỚI', sale: 'SALE' }

export default function AdminDashboard() {
  usePageTitle('Quản trị sản phẩm | Hoang Lighting')
  const { session, loading } = useAdminSession()
  const { refresh } = useProducts()
  const [rows, setRows] = useState<ProductRowT[]>([])
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | CategorySlug>('all')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [sortMode, setSortMode] = useState<SortMode>('default')

  const load = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort', { ascending: true })
      .order('name', { ascending: true })
    if (!error && data) setRows(data as ProductRowT[])
    setFetching(false)
  }, [])

  useEffect(() => {
    if (session) void load()
  }, [session, load])

  const stats = useMemo(
    () => ({
      total: rows.length,
      visible: rows.filter((r) => r.visible).length,
      featured: rows.filter((r) => r.featured).length,
      sold: rows.reduce((sum, r) => sum + (r.sold || 0), 0),
    }),
    [rows],
  )

  const filtered = useMemo(() => {
    const q = normalizeVi(query.trim())
    const list = rows.filter((r) => {
      if (category !== 'all' && r.category !== category) return false
      if (status === 'visible' && !r.visible) return false
      if (status === 'hidden' && r.visible) return false
      if (q && !normalizeVi(`${r.name} ${r.slug}`).includes(q)) return false
      return true
    })
    const sorted = [...list]
    switch (sortMode) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'sold-desc':
        sorted.sort((a, b) => (b.sold || 0) - (a.sold || 0))
        break
      case 'rating-desc':
        sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
        break
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'vi'))
        break
      default:
        break
    }
    return sorted
  }, [rows, query, category, status, sortMode])

  const hasFilter = query.trim() !== '' || category !== 'all' || status !== 'all' || sortMode !== 'default'
  const clearFilters = () => {
    setQuery('')
    setCategory('all')
    setStatus('all')
    setSortMode('default')
  }

  if (!supabase) return <NotConfigured />
  if (loading) return <p className="py-20 text-center text-stone-500">Đang kiểm tra phiên đăng nhập…</p>
  if (!session) return <Navigate to="/admin/login" replace />
  const sb = supabase

  const patchRow = async (row: ProductRowT, patch: Partial<ProductRowT>) => {
    const { error } = await sb.from('products').update(patch).eq('id', row.id)
    if (error) {
      setMessage(`Lỗi: ${error.message}`)
      return
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...patch } : r)))
    void refresh()
  }

  const removeRow = async (row: ProductRowT) => {
    const { error } = await sb.from('products').delete().eq('id', row.id)
    if (error) {
      setMessage(`Lỗi xoá: ${error.message}`)
      return
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id))
    setConfirmDeleteId(null)
    setMessage(`Đã xoá "${row.name}".`)
    void refresh()
  }

  const seedSamples = async () => {
    setSeeding(true)
    setMessage('')
    const payload = sampleProducts.map((p, i) => productToRow(p, { sort: i + 1 }))
    const { error } = await sb.from('products').upsert(payload, { onConflict: 'id' })
    setSeeding(false)
    if (error) {
      setMessage(`Nạp dữ liệu mẫu lỗi: ${error.message}`)
      return
    }
    setMessage(`Đã nạp/cập nhật ${payload.length} sản phẩm mẫu vào database.`)
    await load()
    void refresh()
  }

  const categoryLabel = (slug: CategorySlug) =>
    categories.find((c) => c.slug === slug)?.name ?? slug
  const categoryCount = (slug: CategorySlug) => rows.filter((r) => r.category === slug).length

  const statCards = [
    { icon: Package, label: 'Tổng sản phẩm', value: stats.total, sub: 'trong database' },
    { icon: Store, label: 'Đang bán', value: stats.visible, sub: `ẩn ${stats.total - stats.visible}` },
    { icon: Star, label: 'Nổi bật', value: stats.featured, sub: 'hiện ở trang chủ' },
    { icon: ShoppingBag, label: 'Tổng đã bán', value: stats.sold, sub: 'lượt bán ghi nhận' },
  ]

  const selectCls =
    'rounded-full bg-white px-3.5 py-2 text-sm font-medium text-stone-700 ring-1 ring-stone-300 outline-none transition hover:ring-amber-400 focus:ring-2 focus:ring-amber-400'

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">Quản trị sản phẩm</h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Đăng nhập: <span className="font-medium text-stone-700">{session.user.email}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-700 ring-1 ring-stone-300 transition hover:ring-amber-400"
          >
            <Eye className="h-4 w-4" /> Xem web
          </Link>
          <button
            onClick={() => void sb.auth.signOut()}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-stone-700 ring-1 ring-stone-300 transition hover:ring-red-300 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-3xl bg-white p-4 ring-1 ring-stone-200/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                {card.label}
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <card.icon className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="mt-1.5 text-3xl font-extrabold tracking-tight text-stone-900">
              {card.value.toLocaleString('vi-VN')}
            </div>
            <div className="mt-0.5 text-xs text-stone-400">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          to="/admin/san-pham/moi"
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-amber-300"
        >
          <Plus className="h-4 w-4" /> Thêm sản phẩm
        </Link>
        <button
          onClick={seedSamples}
          disabled={seeding}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 ring-1 ring-stone-300 transition hover:ring-amber-400 disabled:opacity-60"
        >
          <DatabaseZap className="h-4 w-4" />
          {seeding ? 'Đang nạp…' : `Nạp ${sampleProducts.length} sản phẩm mẫu`}
        </button>
        {message && (
          <p
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
              message.toLowerCase().includes('lỗi')
                ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {fetching ? (
        <p className="py-16 text-center text-stone-500">Đang tải danh sách sản phẩm…</p>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center ring-1 ring-stone-200/70">
          <h2 className="font-bold text-stone-800">Database chưa có sản phẩm nào</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">
            Bấm "Nạp sản phẩm mẫu" để đưa {sampleProducts.length} sản phẩm mẫu vào database, hoặc
            "Thêm sản phẩm" để nhập tay sản phẩm đầu tiên.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-56 flex-1 sm:max-w-xs">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo tên sản phẩm (không cần dấu)…"
                  className="w-full rounded-full bg-white py-2 pl-10 pr-4 text-sm ring-1 ring-stone-300 outline-none placeholder:text-stone-400 transition focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusFilter)}
                className={selectCls}
                aria-label="Lọc theo trạng thái"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="visible">Đang bán</option>
                <option value="hidden">Đang ẩn</option>
              </select>
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className={selectCls}
                aria-label="Sắp xếp"
              >
                <option value="default">Thứ tự hiển thị</option>
                <option value="sold-desc">Bán chạy nhất</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="name-asc">Tên A → Z</option>
              </select>
              {hasFilter && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-stone-500 ring-1 ring-stone-200 transition hover:text-stone-800 hover:ring-amber-400"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Xoá lọc
                </button>
              )}
              <span className="ml-auto text-sm text-stone-500">
                Đang xem <span className="font-semibold text-stone-800">{filtered.length}</span> /{' '}
                {rows.length} sản phẩm
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('all')}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  category === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-amber-400'
                }`}
              >
                Tất cả ({rows.length})
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    category === c.slug
                      ? 'bg-stone-900 text-white'
                      : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:ring-amber-400'
                  }`}
                >
                  {c.name} ({categoryCount(c.slug)})
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-3xl bg-white p-10 text-center ring-1 ring-stone-200/70">
              <h2 className="font-bold text-stone-800">Không có sản phẩm nào khớp bộ lọc</h2>
              <p className="mt-1 text-sm text-stone-500">
                Thử đổi từ khoá tìm kiếm hoặc{' '}
                <button onClick={clearFilters} className="font-semibold text-amber-600 underline">
                  xoá bộ lọc
                </button>{' '}
                để xem toàn bộ.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-3xl bg-white ring-1 ring-stone-200/70">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50/70 text-xs uppercase tracking-wide text-stone-400">
                    <th className="px-4 py-3">Sản phẩm</th>
                    <th className="px-4 py-3">Danh mục</th>
                    <th className="px-4 py-3">Giá bán</th>
                    <th className="px-4 py-3">Đã bán / ★</th>
                    <th className="px-4 py-3">Đang bán</th>
                    <th className="px-4 py-3">Nổi bật</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filtered.map((row) => {
                    const p = rowToProduct(row)
                    const discount =
                      p.oldPrice && p.oldPrice > p.price
                        ? Math.round((1 - p.price / p.oldPrice) * 100)
                        : 0
                    return (
                      <tr
                        key={row.id}
                        className={`transition hover:bg-amber-50/40 ${row.visible ? '' : 'opacity-55'}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={p.image}
                                alt=""
                                className="h-12 w-12 rounded-xl object-cover ring-1 ring-stone-100"
                                loading="lazy"
                              />
                              {p.badge && (
                                <span
                                  className={`absolute -left-1.5 -top-1.5 rounded-full px-1.5 py-px text-[9px] font-bold ${badgeStyle[p.badge]}`}
                                >
                                  {badgeLabel[p.badge]}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="line-clamp-1 font-semibold text-stone-800">{p.name}</div>
                              <div className="text-xs text-stone-400">
                                /{p.slug} · thứ tự {row.sort}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-stone-600">{categoryLabel(p.category)}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-stone-800">{formatVND(p.price)}</div>
                          {discount > 0 && (
                            <div className="text-xs text-stone-400">
                              <span className="line-through">{formatVND(p.oldPrice!)}</span>{' '}
                              <span className="font-semibold text-red-500">-{discount}%</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-stone-600">
                          <div>{p.sold.toLocaleString('vi-VN')} đã bán</div>
                          <div className="inline-flex items-center gap-1 text-xs text-stone-400">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {Number(p.rating).toFixed(1)}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => void patchRow(row, { visible: !row.visible })}
                            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                              row.visible
                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:ring-emerald-300'
                                : 'bg-stone-100 text-stone-500 ring-1 ring-stone-200 hover:ring-stone-300'
                            }`}
                          >
                            {row.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            {row.visible ? 'Đang bán' : 'Đã ẩn'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => void patchRow(row, { featured: !row.featured })}
                            aria-label="Bật/tắt nổi bật"
                            className={`rounded-full p-1.5 transition ${
                              row.featured ? 'text-amber-500' : 'text-stone-300 hover:text-amber-400'
                            }`}
                          >
                            <Star className={`h-5 w-5 ${row.featured ? 'fill-amber-400' : ''}`} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1.5">
                            {confirmDeleteId === row.id ? (
                              <>
                                <button
                                  onClick={() => void removeRow(row)}
                                  className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                                >
                                  Xoá hẳn
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-stone-500 ring-1 ring-stone-200"
                                >
                                  Huỷ
                                </button>
                              </>
                            ) : (
                              <>
                                <Link
                                  to={`/san-pham/${row.slug}`}
                                  aria-label="Xem trên web"
                                  title="Xem trên web"
                                  className="inline-flex items-center rounded-full p-2 text-stone-500 ring-1 ring-stone-200 transition hover:text-amber-600 hover:ring-amber-400"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                                <Link
                                  to={`/admin/san-pham/${row.id}`}
                                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-stone-700 ring-1 ring-stone-200 transition hover:ring-amber-400"
                                >
                                  <Pencil className="h-3.5 w-3.5" /> Sửa
                                </Link>
                                <button
                                  onClick={() => setConfirmDeleteId(row.id)}
                                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Xoá
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </main>
  )
}
