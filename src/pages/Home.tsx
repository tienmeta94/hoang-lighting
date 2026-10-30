import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Headset,
  Lamp,
  Lightbulb,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import { bestSellers, categories, featuredProducts, type CategorySlug } from '../data/products'
import { usePageTitle } from '../lib/usePageTitle'
import ProductCard from '../components/ProductCard'

const categoryIcons: Record<CategorySlug, LucideIcon> = {
  solar: Sun,
  led: Lightbulb,
  'day-nhay': Sparkles,
  'trang-tri': Lamp,
}
const categoryColors: Record<CategorySlug, string> = {
  solar: 'bg-orange-100 text-orange-500',
  led: 'bg-amber-100 text-amber-500',
  'day-nhay': 'bg-indigo-100 text-indigo-500',
  'trang-tri': 'bg-rose-100 text-rose-500',
}

const commitments = [
  { icon: Truck, title: 'Giao hàng toàn quốc', text: 'Đóng gói chống vỡ, giao nhanh 2–4 ngày' },
  { icon: ShieldCheck, title: 'Bảo hành rõ ràng', text: '6–24 tháng tuỳ sản phẩm, lỗi 1 đổi 1 trong 30 ngày' },
  { icon: RefreshCcw, title: 'Đổi trả dễ dàng', text: 'Đổi trả trong 7 ngày nếu không vừa ý' },
  { icon: Headset, title: 'Tư vấn tận tâm', text: 'Tư vấn chọn đèn theo nhu cầu qua Zalo mỗi ngày' },
]

const testimonials = [
  {
    name: 'Chị Lan — Hà Nội',
    text: 'Đèn trụ cổng solar sáng hơn mình tưởng, lắp 10 phút là xong, tối tự bật rất tiện.',
    stars: 5,
  },
  {
    name: 'Anh Tuấn — Chủ quán cà phê, Đà Nẵng',
    text: 'Mua 20 bộ dây nháy trang trí sân quán, khách khen đẹp, chụp ảnh lên hình rất lung linh.',
    stars: 5,
  },
  {
    name: 'Chị Mai — TP. Hồ Chí Minh',
    text: 'Đèn bàn gốm nhìn sang, shop gói hàng kỹ, giao nhanh. Sẽ quay lại mua thêm đèn thả.',
    stars: 5,
  },
]

function SectionTitle({ title, sub, linkTo }: { title: string; sub?: string; linkTo?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">{title}</h2>
        {sub && <p className="mt-1 text-sm text-stone-500">{sub}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700"
        >
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  usePageTitle('Hoang Lighting — Đèn mặt trời, LED, đèn nháy & trang trí')
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="inline-block rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30">
              Đèn mặt trời · LED · Đèn nháy · Trang trí
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              Thắp sáng không gian,
              <span className="text-amber-400"> tiết kiệm mỗi ngày</span>
            </h1>
            <p className="mt-4 max-w-lg text-stone-300">
              Từ chiếc đèn trụ cổng tự sáng khi trời tối đến dây nháy lung linh cho góc sân vườn —
              Hoang Lighting giúp bạn chọn đúng đèn, đúng giá, bảo hành rõ ràng.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/san-pham"
                className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-stone-900 transition hover:bg-amber-300"
              >
                Xem sản phẩm <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/san-pham?danh-muc=solar"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white ring-1 ring-white/40 transition hover:bg-white/10"
              >
                <Sun className="h-4 w-4" /> Đèn năng lượng mặt trời
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <dt className="sr-only">Sản phẩm</dt>
                <dd className="text-2xl font-extrabold text-amber-400">120+</dd>
                <dd className="text-xs text-stone-400">mẫu đèn</dd>
              </div>
              <div>
                <dd className="text-2xl font-extrabold text-amber-400">4.8/5</dd>
                <dd className="text-xs text-stone-400">đánh giá khách hàng</dd>
              </div>
              <div>
                <dd className="text-2xl font-extrabold text-amber-400">63</dd>
                <dd className="text-xs text-stone-400">tỉnh thành giao hàng</dd>
              </div>
            </dl>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {featuredProducts.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className={`rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 ${i >= 2 ? 'hidden lg:block' : ''}`}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Danh mục */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <SectionTitle title="Mua theo nhu cầu" sub="Bốn nhóm đèn chính của cửa hàng" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => {
            const Icon = categoryIcons[c.slug]
            return (
              <Link
                key={c.slug}
                to={`/san-pham?danh-muc=${c.slug}`}
                className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70 transition hover:shadow-md"
              >
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${categoryColors[c.slug]}`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-3 font-bold text-stone-800 group-hover:text-amber-600">{c.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone-500">{c.tagline}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Nổi bật */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <SectionTitle title="Sản phẩm nổi bật" sub="Được chọn lọc bởi cửa hàng" linkTo="/san-pham" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Bán chạy */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <SectionTitle title="Bán chạy nhất" sub="Khách hàng mua nhiều và đánh giá cao" linkTo="/san-pham" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Cam kết */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((c) => (
            <div key={c.title} className="flex gap-3 rounded-2xl bg-white p-5 ring-1 ring-stone-200/70">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <c.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-stone-800">{c.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-stone-500">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Đánh giá */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <SectionTitle title="Khách hàng nói gì" sub="Đánh giá mẫu — sẽ thay bằng đánh giá thật" />
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl bg-white p-5 ring-1 ring-stone-200/70">
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-stone-600">“{t.text}”</blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-stone-800">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="rounded-3xl bg-stone-900 px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-extrabold">Chưa biết chọn đèn nào?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-stone-300">
            Nhắn Zalo cho cửa hàng, gửi ảnh không gian của bạn — chúng tôi gợi ý mẫu đèn phù hợp và
            báo giá trong ít phút. (Số Zalo sẽ cập nhật khi web ra mắt chính thức.)
          </p>
          <Link
            to="/lien-he"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-stone-900 transition hover:bg-amber-300"
          >
            Liên hệ tư vấn <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
