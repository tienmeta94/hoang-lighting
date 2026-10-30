import { MessageCircle } from 'lucide-react'
import { hasZalo, zaloChatLink } from '../config'

// Nút chat Zalo nổi ở góc phải dưới — chỉ hiện khi shop đã có số Zalo.
export default function ZaloFloat() {
  if (!hasZalo) return null
  return (
    <a
      href={zaloChatLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat Zalo với cửa hàng"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#0068ff] py-3 pl-4 pr-5 font-semibold text-white shadow-lg shadow-sky-600/30 transition hover:bg-[#0053cc]"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-30" />
        <MessageCircle className="relative h-6 w-6" />
      </span>
      <span className="hidden sm:inline">Chat Zalo</span>
    </a>
  )
}
