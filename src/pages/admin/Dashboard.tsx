import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  DatabaseZap,
  Eye,
  EyeOff,
  LogOut,
  Pencil,
  Plus,
  Star,
  Trash2,
} from 'lucide-react'
import { categories, products as sampleProducts, type CategorySlug } from '../../data/products'
import { formatVND } from '../../lib/format'
import { supabase } from '../../lib/supabase'
import { useAdminSession } from '../../lib/useAdmin'
import { usePageTitle } from '../../lib/usePageTitle'
import { productToRow, rowToProduct, type ProductRowT } from './shared'
import { useProducts } from '../../store/products'
import NotConfigured from './NotConfigured'

export default function AdminDashboard() {
  usePageTitle('Quản trị sản phẩm | Hoang Lighting')
  const { session, loading } = useAdminSession()
  const { refresh } = useProducts()
  const [rows, setRows] = useState<ProductRowT[]>([])
  const [fetching, setFetching] = useState(true)
  const [message, setMessage] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [seeding, setSeeding] = useState(false)

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

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-stone-900">Quản trị sản phẩm</h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Đăng nhập: <span className="font-medium text-stone-700">{session.user.email}</span> ·{' '}
            {rows.length} sản phẩm trong database
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

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          to="/admin/san-pham/moi"
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-amber-300"
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
        {message && <p className="text-sm font-medium text-stone-600">{message}</p>}
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
        <div className="mt-6 overflow-x-auto rounded-3xl bg-white ring-1 ring-stone-200/70">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-400">
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Danh mục</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Đang bán</th>
                <th className="px-4 py-3">Nổi bật</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map((row) => {
                const p = rowToProduct(row)
                return (
                  <tr key={row.id} className={row.visible ? '' : 'opacity-55'}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <div className="min-w-0">
                          <div className="line-clamp-1 font-semibold text-stone-800">{p.name}</div>
                          <div className="text-xs text-stone-400">/{p.slug} · Đã bán {p.sold}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-600">{categoryLabel(p.category)}</td>
                    <td className="px-4 py-3 font-semibold text-stone-800">{formatVND(p.price)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => void patchRow(row, { visible: !row.visible })}
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                          row.visible
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-stone-100 text-stone-500 ring-1 ring-stone-200'
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
                        className={`rounded-full p-1.5 ${
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
    </main>
  )
}
