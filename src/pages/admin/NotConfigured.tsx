import { DatabaseZap } from 'lucide-react'

// Hiện khi web chưa được nối với Supabase (chưa điền URL + anon key trong src/config.ts).
export default function NotConfigured() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-600">
        <DatabaseZap className="h-8 w-8" />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold text-stone-900">Chưa kết nối Supabase</h1>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-500">
        Trang quản trị cần backend Supabase để hoạt động. Hãy tạo project Supabase miễn phí, chạy
        file <code className="rounded bg-stone-100 px-1.5 py-0.5">supabase/schema.sql</code> trong
        repo, rồi điền Project URL và anon key vào{' '}
        <code className="rounded bg-stone-100 px-1.5 py-0.5">src/config.ts</code>. Xem hướng dẫn
        từng bước trong file{' '}
        <code className="rounded bg-stone-100 px-1.5 py-0.5">docs/HUONG-DAN-SUPABASE.md</code> của
        repo.
      </p>
      <p className="mt-3 text-sm text-stone-400">
        Trong lúc chưa kết nối, phần bán hàng vẫn chạy bình thường bằng dữ liệu mẫu tích hợp sẵn.
      </p>
    </main>
  )
}
