import { useState } from 'react'
import { Lightbulb, Sparkles, Sun, Lamp, type LucideIcon } from 'lucide-react'
import type { CategorySlug } from '../data/products'

// Hiển thị ảnh sản phẩm. Nếu ảnh lỗi/không tải được thì tự quay về nền gradient + icon
// theo danh mục để giao diện không bao giờ vỡ.
const visuals: Record<CategorySlug, { icon: LucideIcon; classes: string }> = {
  solar: { icon: Sun, classes: 'from-amber-300 via-orange-200 to-yellow-50 text-orange-500' },
  led: { icon: Lightbulb, classes: 'from-yellow-200 via-amber-100 to-white text-amber-500' },
  'day-nhay': { icon: Sparkles, classes: 'from-indigo-400 via-purple-300 to-fuchsia-200 text-white' },
  'trang-tri': { icon: Lamp, classes: 'from-rose-200 via-orange-100 to-amber-50 text-rose-400' },
}

export default function ProductImage({
  category,
  name,
  image,
  large = false,
}: {
  category: CategorySlug
  name: string
  image?: string
  large?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const { icon: Icon, classes } = visuals[category]
  const aspect = large ? 'aspect-[4/3]' : 'aspect-square'

  if (image && !failed) {
    return (
      <div className={`relative w-full overflow-hidden bg-stone-100 ${aspect}`}>
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute bottom-2 right-2 rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
          Ảnh minh họa
        </span>
      </div>
    )
  }

  return (
    <div
      className={`relative flex w-full items-center justify-center bg-gradient-to-br ${classes} ${aspect}`}
      role="img"
      aria-label={name}
    >
      <Icon className={large ? 'h-28 w-28' : 'h-16 w-16'} strokeWidth={1.25} />
      <span className="absolute bottom-2 right-2 rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white">
        Ảnh mẫu
      </span>
    </div>
  )
}
