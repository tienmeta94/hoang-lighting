import { useEffect } from 'react'

// Đặt tiêu đề tab trình duyệt theo từng trang (SEO cơ bản cho SPA).
export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title
  }, [title])
}
