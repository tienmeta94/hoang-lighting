import { Link } from 'react-router-dom'
import { Hammer } from 'lucide-react'

export default function Placeholder({
  title,
  milestone,
}: {
  title: string
  milestone: string
}) {
  return (
    <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
        <Hammer className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-2xl font-extrabold text-stone-900">{title}</h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-500">
        {milestone
          ? `Trang này thuộc ${milestone} trong kế hoạch xây dựng web và sẽ được hoàn thiện ở bước tiếp theo.`
          : 'Đường dẫn này không tồn tại hoặc đã thay đổi. Bạn quay lại trang chủ để tiếp tục xem đèn nhé.'}
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
      >
        Về trang chủ
      </Link>
    </main>
  )
}
