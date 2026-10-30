import { Link } from 'react-router-dom'
import { Clock, Lightbulb, MapPin, MessageCircle, Phone } from 'lucide-react'
import { categories } from '../data/products'
import { shop } from '../config'

export default function Footer() {
  return (
    <footer className="mt-16 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400 text-stone-900">
              <Lightbulb className="h-5 w-5" />
            </span>
            <span className="text-base font-extrabold text-white">
              Hoang <span className="text-amber-400">Lighting</span>
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            Chuyên đèn năng lượng mặt trời, đèn LED, đèn nháy và đèn trang trí cho nhà ở, sân vườn,
            quán cà phê và homestay.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Danh mục</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/san-pham?danh-muc=${c.slug}`} className="transition hover:text-amber-400">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Hỗ trợ khách hàng</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/chinh-sach" className="transition hover:text-amber-400">
                Chính sách giao hàng
              </Link>
            </li>
            <li>
              <Link to="/chinh-sach" className="transition hover:text-amber-400">
                Đổi trả & bảo hành
              </Link>
            </li>
            <li>
              <Link to="/gioi-thieu" className="transition hover:text-amber-400">
                Giới thiệu cửa hàng
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Liên hệ</h4>
          <ul className="mt-3 space-y-2.5 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Địa chỉ: {shop.address || 'Đang cập nhật'}
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Hotline: {shop.phone || 'Đang cập nhật'}
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Zalo: {shop.zalo || 'Đang cập nhật'}
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Giờ mở cửa: 8:00 – 21:00 hằng ngày
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        © 2026 Hoang Lighting. Giá và thông tin trên web đang là dữ liệu mẫu trong giai đoạn xây dựng.
      </div>
    </footer>
  )
}
