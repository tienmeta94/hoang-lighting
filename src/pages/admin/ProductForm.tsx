import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { categories, type Badge, type CategorySlug, type Spec } from '../../data/products'
import { normalizeVi } from '../../lib/text'
import { supabase } from '../../lib/supabase'
import { useAdminSession } from '../../lib/useAdmin'
import { usePageTitle } from '../../lib/usePageTitle'
import { useProducts } from '../../store/products'
import NotConfigured from './NotConfigured'

interface FormState {
  name: string
  slug: string
  category: CategorySlug
  price: string
  oldPrice: string
  image: string
  shortDesc: string
  description: string
  badge: '' | Badge
  featured: boolean
  visible: boolean
  rating: string
  sold: string
  sort: string
}

const emptyForm: FormState = {
  name: '',
  slug: '',
  category: 'solar',
  price: '',
  oldPrice: '',
  image: '',
  shortDesc: '',
  description: '',
  badge: '',
  featured: false,
  visible: true,
  rating: '4.5',
  sold: '0',
  sort: '0',
}

const slugify = (name: string) =>
  normalizeVi(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default function AdminProductForm() {
  const { id } = useParams()
  const isNew = !id || id === 'moi'
  usePageTitle(isNew ? 'Thêm sản phẩm | Hoang Lighting' : 'Sửa sản phẩm | Hoang Lighting')
  const { session, loading } = useAdminSession()
  const { refresh } = useProducts()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(emptyForm)
  const [specs, setSpecs] = useState<Spec[]>([{ label: 'Bảo hành', value: '12 tháng' }])
  const [fetching, setFetching] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isNew || !supabase || !session) return
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error: err }) => {
        if (err || !data) {
          setError('Không tìm thấy sản phẩm này trong database.')
        } else {
          setForm({
            name: data.name,
            slug: data.slug,
            category: data.category,
            price: String(data.price),
            oldPrice: data.old_price ? String(data.old_price) : '',
            image: data.image,
            shortDesc: data.short_desc,
            description: data.description,
            badge: data.badge ?? '',
            featured: data.featured,
            visible: data.visible,
            rating: String(data.rating),
            sold: String(data.sold),
            sort: String(data.sort),
          })
          setSpecs(Array.isArray(data.specs) && data.specs.length ? data.specs : [])
        }
        setFetching(false)
      })
  }, [id, isNew, session])

  if (!supabase) return <NotConfigured />
  if (loading) return <p className="py-20 text-center text-stone-500">Đang kiểm tra phiên đăng nhập…</p>
  if (!session) return <Navigate to="/admin/login" replace />
  if (fetching) return <p className="py-20 text-center text-stone-500">Đang tải sản phẩm…</p>

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const uploadImage = async (file: File) => {
    if (!supabase) return
    setUploading(true)
    setError('')
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const path = `${Date.now()}-${safeName}`
    const { error: upErr } = await supabase.storage.from('product-images').upload(path, file)
    if (upErr) {
      setUploading(false)
      setError(
        `Tải ảnh lỗi: ${upErr.message}. Kiểm tra bucket "product-images" đã được tạo trong schema.sql chưa.`,
      )
      return
    }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    set('image', data.publicUrl)
    setUploading(false)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    const price = Number(form.price)
    if (form.name.trim().length < 3) return setError('Tên sản phẩm cần ít nhất 3 ký tự.')
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug))
      return setError('Slug chỉ gồm chữ thường, số và dấu gạch ngang (ví dụ: den-pha-solar-200w).')
    if (!Number.isFinite(price) || price <= 0) return setError('Giá bán phải là số lớn hơn 0.')
    const oldPrice = form.oldPrice ? Number(form.oldPrice) : null
    if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice <= price))
      return setError('Giá gốc (nếu có) phải lớn hơn giá bán.')

    setSaving(true)
    setError('')
    const productId = isNew ? `p-${Date.now().toString(36)}` : (id as string)
    const row = {
      id: productId,
      slug: form.slug,
      name: form.name.trim(),
      category: form.category,
      price,
      old_price: oldPrice,
      image: form.image.trim(),
      short_desc: form.shortDesc.trim(),
      description: form.description.trim(),
      specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      badge: form.badge || null,
      featured: form.featured,
      visible: form.visible,
      rating: Math.min(5, Math.max(0, Number(form.rating) || 0)),
      sold: Math.max(0, Math.floor(Number(form.sold) || 0)),
      sort: Math.floor(Number(form.sort) || 0),
      updated_at: new Date().toISOString(),
    }
    const { error: err } = await supabase.from('products').upsert(row, { onConflict: 'id' })
    setSaving(false)
    if (err) {
      setError(
        err.message.includes('duplicate') || err.code === '23505'
          ? 'Slug này đã được dùng cho sản phẩm khác — hãy đổi slug.'
          : `Lưu lỗi: ${err.message}`,
      )
      return
    }
    void refresh()
    navigate('/admin', { replace: true })
  }

  const field =
    'w-full rounded-xl bg-white px-3.5 py-2.5 text-sm ring-1 ring-stone-300 outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-amber-400'
  const label = 'mb-1.5 block text-sm font-medium text-stone-700'

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700">
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-stone-900">
        {isNew ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}
      </h1>

      <form onSubmit={save} className="mt-6 space-y-6">
        <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
          <h2 className="font-extrabold text-stone-900">Thông tin cơ bản</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label} htmlFor="f-name">Tên sản phẩm *</label>
              <input
                id="f-name"
                value={form.name}
                onChange={(e) => {
                  set('name', e.target.value)
                  if (isNew) set('slug', slugify(e.target.value))
                }}
                placeholder="Ví dụ: Đèn pha LED năng lượng mặt trời 200W"
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="f-slug">Slug (đường dẫn) *</label>
              <input
                id="f-slug"
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="den-pha-led-nang-luong-mat-troi-200w"
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="f-cat">Danh mục *</label>
              <select
                id="f-cat"
                value={form.category}
                onChange={(e) => set('category', e.target.value as CategorySlug)}
                className={field}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="f-price">Giá bán (VNĐ) *</label>
              <input
                id="f-price"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => set('price', e.target.value.replace(/[^\d]/g, ''))}
                placeholder="549000"
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="f-old">Giá gốc (để trống nếu không giảm)</label>
              <input
                id="f-old"
                inputMode="numeric"
                value={form.oldPrice}
                onChange={(e) => set('oldPrice', e.target.value.replace(/[^\d]/g, ''))}
                placeholder="790000"
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="f-badge">Nhãn</label>
              <select
                id="f-badge"
                value={form.badge}
                onChange={(e) => set('badge', e.target.value as FormState['badge'])}
                className={field}
              >
                <option value="">Không nhãn</option>
                <option value="hot">Bán chạy</option>
                <option value="new">Mới</option>
                <option value="sale">Giảm giá</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="f-sort">Thứ tự sắp xếp (nhỏ hiện trước)</label>
              <input
                id="f-sort"
                inputMode="numeric"
                value={form.sort}
                onChange={(e) => set('sort', e.target.value.replace(/[^\d-]/g, ''))}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="f-rating">Đánh giá (0–5)</label>
              <input
                id="f-rating"
                inputMode="decimal"
                value={form.rating}
                onChange={(e) => set('rating', e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="f-sold">Số đã bán</label>
              <input
                id="f-sold"
                inputMode="numeric"
                value={form.sold}
                onChange={(e) => set('sold', e.target.value.replace(/[^\d]/g, ''))}
                className={field}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-5 text-sm font-medium text-stone-700">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => set('visible', e.target.checked)}
                className="h-4 w-4 accent-amber-500"
              />
              Đang bán (hiện trên web)
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="h-4 w-4 accent-amber-500"
              />
              Sản phẩm nổi bật (hiện mục nổi bật ở trang chủ)
            </label>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
          <h2 className="font-extrabold text-stone-900">Ảnh sản phẩm</h2>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            {form.image ? (
              <img
                src={form.image}
                alt="Xem trước ảnh sản phẩm"
                className="h-36 w-36 shrink-0 rounded-2xl object-cover ring-1 ring-stone-200"
              />
            ) : (
              <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-sm text-stone-400 ring-1 ring-stone-200">
                Chưa có ảnh
              </div>
            )}
            <div className="flex-1 space-y-3">
              <div>
                <label className={label} htmlFor="f-image">Link ảnh (URL)</label>
                <input
                  id="f-image"
                  value={form.image}
                  onChange={(e) => set('image', e.target.value)}
                  placeholder="https://…"
                  className={field}
                />
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700">
                <ImagePlus className="h-4 w-4" />
                {uploading ? 'Đang tải ảnh…' : 'Hoặc tải ảnh từ máy lên'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) void uploadImage(file)
                  }}
                />
              </label>
              <p className="text-xs text-stone-400">
                Ảnh tải lên được lưu trong Supabase Storage (bucket product-images) và tự điền link.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
          <h2 className="font-extrabold text-stone-900">Mô tả</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className={label} htmlFor="f-short">Mô tả ngắn (1 câu, hiện ở trang chi tiết)</label>
              <input
                id="f-short"
                value={form.shortDesc}
                onChange={(e) => set('shortDesc', e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label className={label} htmlFor="f-desc">Mô tả đầy đủ</label>
              <textarea
                id="f-desc"
                rows={4}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className={field}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-stone-900">Thông số kỹ thuật</h2>
            <button
              type="button"
              onClick={() => setSpecs((s) => [...s, { label: '', value: '' }])}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-amber-600 ring-1 ring-amber-200 transition hover:bg-amber-50"
            >
              <Plus className="h-4 w-4" /> Thêm dòng
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {specs.map((spec, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={spec.label}
                  onChange={(e) =>
                    setSpecs((s) => s.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))
                  }
                  placeholder="Tên thông số (vd: Công suất)"
                  className={field}
                />
                <input
                  value={spec.value}
                  onChange={(e) =>
                    setSpecs((s) => s.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
                  }
                  placeholder="Giá trị (vd: 200W)"
                  className={field}
                />
                <button
                  type="button"
                  onClick={() => setSpecs((s) => s.filter((_, j) => j !== i))}
                  aria-label="Xoá dòng thông số"
                  className="shrink-0 rounded-xl px-3 text-stone-400 ring-1 ring-stone-200 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {specs.length === 0 && (
              <p className="text-sm text-stone-400">Chưa có thông số nào — bấm "Thêm dòng" để bổ sung.</p>
            )}
          </div>
        </section>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-100">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-stone-900 transition hover:bg-amber-300 disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> {saving ? 'Đang lưu…' : 'Lưu sản phẩm'}
          </button>
          <Link
            to="/admin"
            className="inline-flex items-center rounded-full px-6 py-3 font-semibold text-stone-600 ring-1 ring-stone-300 transition hover:bg-stone-50"
          >
            Huỷ
          </Link>
        </div>
      </form>
    </main>
  )
}
