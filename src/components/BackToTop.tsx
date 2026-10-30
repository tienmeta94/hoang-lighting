import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

// Nút "về đầu trang" nổi ở góc trái dưới, chỉ hiện sau khi cuộn xuống sâu.
export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Về đầu trang"
      className="fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-white text-stone-700 shadow-lg ring-1 ring-stone-200 transition hover:text-amber-600"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}
