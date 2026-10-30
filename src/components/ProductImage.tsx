import { Lightbulb, Sparkles, Sun, Lamp, type LucideIcon } from 'lucide-react'
import type { CategorySlug } from '../data/products'

// Ảnh giữ chỗ theo danh mục trong giai đoạn dữ liệu mẫu.
// Khi có ảnh thật (M4), thay component này bằng <img> trỏ tới file ảnh sản phẩm.
const visuals: Record<CategorySlug, { icon: LucideIcon; classes: string }> = {
  solar: { icon: Sun, classes: 'from-amber-300 via-orange-200 to-yellow-50 text-orange-500' },
  led: { icon: Lightbulb, classes: 'from-yellow-200 via-amber-100 to-white text-amber-500' },
  'day-nhay': { icon: Sparkles, classes: 'from-indigo-400 via-purple-300 to-fuchsia-200 text-white' },
  'trang-tri': { icon: Lamp, classes: 'from-rose-200 via-orange-100 to-amber-50 text-rose-400' },
}

export default function ProductImage({
  category,
  name,
  large = false,
}: {
  category: CategorySlug
  name: string
  large?: boolean
}) {
  const { icon: Icon, classes } = visuals[category]
  return (
    <div
      className={`relative flex w-full items-center justify-center bg-gradient-to-br ${classes} ${
        large ? 'aspect-[4/3]' : 'aspect-square'
      }`}
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
