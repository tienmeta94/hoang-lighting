import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Lightbulb, LockKeyhole } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAdminSession } from '../../lib/useAdmin'
import { usePageTitle } from '../../lib/usePageTitle'
import NotConfigured from './NotConfigured'

export default function AdminLogin() {
  usePageTitle('Đăng nhập quản trị | Hoang Lighting')
  const { session, loading } = useAdminSession()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!supabase) return <NotConfigured />
  if (loading) return <p className="py-20 text-center text-stone-500">Đang kiểm tra phiên đăng nhập…</p>
  if (session) return <Navigate to="/admin" replace />
  const sb = supabase

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await sb.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (err) {
      setError('Đăng nhập không thành công. Kiểm tra lại email/mật khẩu admin đã tạo trong Supabase.')
      return
    }
    navigate('/admin', { replace: true })
  }

  const field =
    'w-full rounded-xl bg-white px-3.5 py-2.5 text-sm ring-1 ring-stone-300 outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-amber-400'

  return (
    <main className="mx-auto flex max-w-md flex-col px-4 py-16">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200/70">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-stone-900">
            <Lightbulb className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-extrabold leading-tight text-stone-900">Quản trị Hoang Lighting</h1>
            <p className="text-xs text-stone-500">Đăng nhập để quản lý sản phẩm đăng bán</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-stone-700">
              Email admin
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hoanglighting.vn"
              className={field}
              required
            />
          </div>
          <div>
            <label htmlFor="admin-pass" className="mb-1.5 block text-sm font-medium text-stone-700">
              Mật khẩu
            </label>
            <input
              id="admin-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              required
            />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
          >
            <LockKeyhole className="h-4 w-4" />
            {submitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>
        </form>
        <p className="mt-4 text-center text-xs leading-relaxed text-stone-400">
          Tài khoản admin được tạo trong Supabase (mục Authentication → Users). Trang này không lưu
          mật khẩu của bạn.
        </p>
      </div>
    </main>
  )
}
