import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Banknote,
  Clock,
  Lamp,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Truck,
} from 'lucide-react'
import { categories } from '../data/products'
import { FREE_SHIP_THRESHOLD, STANDARD_SHIP_FEE, shop, zaloChatLink } from '../config'
import { formatVND } from '../lib/format'
import { usePageTitle } from '../lib/usePageTitle'

const categoryIcons = { solar: Sun, led: Lightbulb, 'day-nhay': Sparkles, 'trang-tri': Lamp }

export function About() {
  usePageTitle('Giới thiệu | Hoang Lighting')
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
        Về Hoang <span className="text-amber-500">Lighting</span>
      </h1>
      <div className="mt-4 max-w-3xl space-y-4 leading-relaxed text-stone-600">
        <p>
          Hoang Lighting là cửa hàng chuyên các dòng đèn cho nhà ở và không gian kinh doanh: đèn
          năng lượng mặt trời cho sân vườn và cổng ngõ, đèn LED chiếu sáng tiết kiệm điện, đèn nháy
          trang trí lễ Tết và quán cà phê, cùng đèn trang trí cho nội thất.
        </p>
        <p>
          Chúng tôi chọn hàng theo ba tiêu chí: <strong className="text-stone-800">sáng đúng nhu cầu</strong>,{' '}
          <strong className="text-stone-800">bền theo thời gian</strong> và{' '}
          <strong className="text-stone-800">bảo hành rõ ràng</strong>. Mỗi sản phẩm trên web đều ghi
          đầy đủ thông số kỹ thuật và thời gian bảo hành để bạn so sánh trước khi mua, không mua theo
          cảm tính.
        </p>
        <p className="text-sm text-stone-400">
          (Đoạn giới thiệu đang dùng nội dung mẫu — sẽ thay bằng câu chuyện và hình ảnh thật của cửa
          hàng trước khi ra mắt chính thức.)
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: PackageCheck, title: 'Kiểm hàng trước khi thanh toán', text: 'Mở hộp kiểm tra đúng mẫu, đúng số lượng rồi mới trả tiền (COD).' },
          { icon: ShieldCheck, title: 'Bảo hành minh bạch', text: 'Thời gian bảo hành ghi ngay trên trang sản phẩm, từ 3 đến 24 tháng.' },
          { icon: MessageCircle, title: 'Tư vấn theo không gian thật', text: 'Gửi ảnh sân/phòng của bạn qua Zalo, shop gợi ý mẫu và số lượng phù hợp.' },
        ].map((v) => (
          <div key={v.title} className="rounded-2xl bg-white p-5 ring-1 ring-stone-200/70">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <v.icon className="h-5 w-5" />
            </span>
            <h2 className="mt-3 font-bold text-stone-800">{v.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-stone-500">{v.text}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-extrabold text-stone-900">Bốn nhóm hàng chính</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((c) => {
          const Icon = categoryIcons[c.slug]
          return (
            <Link
              key={c.slug}
              to={`/san-pham?danh-muc=${c.slug}`}
              className="group rounded-2xl bg-white p-5 ring-1 ring-stone-200/70 transition hover:shadow-md"
            >
              <Icon className="h-7 w-7 text-amber-500" />
              <h3 className="mt-2 font-bold text-stone-800 group-hover:text-amber-600">{c.name}</h3>
              <p className="mt-1 text-sm text-stone-500">{c.tagline}</p>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

export function Contact() {
  usePageTitle('Liên hệ | Hoang Lighting')
  const items = [
    { icon: MapPin, label: 'Địa chỉ cửa hàng', value: shop.address || 'Đang cập nhật' },
    { icon: Phone, label: 'Hotline', value: shop.phone || 'Đang cập nhật' },
    { icon: MessageCircle, label: 'Zalo', value: shop.zalo || 'Đang cập nhật' },
    { icon: Mail, label: 'Email', value: shop.email || 'Đang cập nhật' },
    { icon: Clock, label: 'Giờ mở cửa', value: shop.hours },
  ]
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Liên hệ với chúng tôi</h1>
      <p className="mt-2 max-w-2xl text-stone-500">
        Cần tư vấn chọn đèn, hỏi giá sỉ cho quán/homestay, hay hỗ trợ bảo hành — cứ nhắn Zalo, shop
        trả lời trong giờ mở cửa.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.label} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <it.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wide text-stone-400">
                  {it.label}
                </span>
                <span className="mt-0.5 block font-medium text-stone-800">{it.value}</span>
              </span>
            </li>
          ))}
          <li>
            <a
              href={zaloChatLink}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#0068ff] px-6 py-3 font-semibold text-white transition hover:bg-[#0053cc]"
            >
              <MessageCircle className="h-5 w-5" /> Nhắn Zalo ngay <ArrowRight className="h-4 w-4" />
            </a>
          </li>
        </ul>
        <div className="flex min-h-64 items-center justify-center rounded-3xl bg-gradient-to-br from-stone-100 to-amber-50 p-8 text-center ring-1 ring-stone-200/70">
          <p className="max-w-xs text-sm leading-relaxed text-stone-500">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-amber-500" />
            Bản đồ Google Maps sẽ được nhúng tại đây khi địa chỉ cửa hàng chính thức được cập nhật.
          </p>
        </div>
      </div>
    </main>
  )
}

export function Policies() {
  usePageTitle('Chính sách bán hàng | Hoang Lighting')
  const sections = [
    {
      icon: Truck,
      title: 'Giao hàng',
      lines: [
        'Giao hàng toàn quốc qua đơn vị vận chuyển, thời gian dự kiến 2–4 ngày làm việc tuỳ khu vực.',
        `Phí giao hàng: miễn phí cho đơn từ ${formatVND(FREE_SHIP_THRESHOLD)}; đơn nhỏ hơn áp dụng phí ${formatVND(STANDARD_SHIP_FEE)}/đơn (chính sách mẫu).`,
        'Khách được kiểm tra hàng trước khi thanh toán. Nếu kiện hàng móp méo/vỡ do vận chuyển, vui lòng chụp ảnh và liên hệ shop ngay khi nhận.',
      ],
    },
    {
      icon: Banknote,
      title: 'Thanh toán',
      lines: [
        'Thanh toán khi nhận hàng (COD) áp dụng cho mọi đơn.',
        'Đơn giá trị lớn hoặc đơn sỉ có thể chuyển khoản trước theo hướng dẫn khi shop gọi xác nhận.',
        'Web không thu thập thông tin thẻ/ngân hàng của khách hàng.',
      ],
    },
    {
      icon: RefreshCcw,
      title: 'Đổi trả',
      lines: [
        'Đổi trả trong 7 ngày kể từ ngày nhận nếu sản phẩm còn nguyên vẹn, chưa lắp đặt và còn đủ phụ kiện.',
        'Sản phẩm lỗi kỹ thuật trong 30 ngày đầu được 1 đổi 1 cùng mẫu.',
        'Không áp dụng đổi trả với hàng đã cắt dây/lắp đặt cố định, trừ trường hợp lỗi của nhà sản xuất.',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Bảo hành',
      lines: [
        'Thời gian bảo hành của từng sản phẩm được ghi trong mục Thông số kỹ thuật (3–24 tháng tuỳ loại).',
        'Quy trình: liên hệ Zalo/hotline → gửi video hoặc ảnh mô tả lỗi → shop hướng dẫn gửi hàng → sửa chữa hoặc đổi mới theo điều kiện bảo hành.',
        'Bảo hành không áp dụng cho hư hỏng do nước vào vượt chuẩn IP công bố, rơi vỡ, hoặc đấu nối sai điện áp.',
      ],
    },
  ]
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Chính sách bán hàng</h1>
      <p className="mt-2 max-w-2xl text-stone-500">
        Các chính sách dưới đây đang là bản mẫu áp dụng cho giai đoạn đầu — nội dung chính thức sẽ
        được cửa hàng xác nhận trước khi bán hàng rộng rãi.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {sections.map((s) => (
          <section key={s.title} className="rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
            <h2 className="flex items-center gap-2 font-extrabold text-stone-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <s.icon className="h-5 w-5" />
              </span>
              {s.title}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-stone-600">
              {s.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
