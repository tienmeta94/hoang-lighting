import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// SPA không tự cuộn lên đầu khi đổi route như web truyền thống — component này
// theo dõi pathname và nhảy về đầu trang ngay (không hiệu ứng trượt) mỗi lần đổi trang.
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}
