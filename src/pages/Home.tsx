import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Headset,
  Lamp,
  Lightbulb,
  RefreshCcw,
  ShieldCheck,
  Sparkle,
  Sparkles,
  Star,
  Sun,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import { categories, type CategorySlug } from '../data/products'
import { useProducts } from '../store/products'
import { usePageTitle } from '../lib/usePageTitle'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'

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

const benefitItems = [
  'Miễn phí giao hàng cho đơn từ 500.000đ',
  'Bảo hành 6–24 tháng',
  'Lỗi 1 đổi 1 trong 30 ngày',
  'Đổi trả dễ dàng trong 7 ngày',
  'Thanh toán khi nhận hàng (COD)',
  'Tư vấn chọn đèn qua Zalo mỗi ngày',
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
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-amber-600 transition hover:text-amber-700"
        >
          Xem tất cả{' '}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}

export default function Home() {
  usePageTitle('Hoang Lighting — Đèn mặt trời, LED, đèn nháy & trang trí')
  const { products } = useProducts()
  const featuredProducts = products.filter((p) => p.featured)
  const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4)
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white">
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute -left-10 top-10 h-40 w-40 rounded-full bg-amber-400/15 blur-3xl"
        />
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute right-1/4 top-1/3 h-24 w-24 rounded-full bg-orange-300/15 blur-2xl"
          style={{ animationDelay: '1.6s' }}
        />
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute bottom-8 left-1/3 h-20 w-20 rounded-full bg-amber-200/10 blur-2xl"
          style={{ animationDelay: '3s' }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <span
              className="animate-fade-up inline-block rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30"
              style={{ animationDelay: '0ms' }}
            >
              Đèn mặt trời · LED · Đèn nháy · Trang trí
            </span>
            <h1
              className="animate-fade-up mt-4 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl"
              style={{ animationDelay: '90ms' }}
            >
              Thắp sáng không gian,
              <span className="text-amber-400"> tiết kiệm mỗi ngày</span>
            </h1>
            <p className="animate-fade-up mt-4 max-w-lg text-stone-300" style={{ animationDelay: '180ms' }}>
              Từ chiếc đèn trụ cổng tự sáng khi trời tối đến dây nháy lung linh cho góc sân vườn —
              Hoang Lighting giúp bạn chọn đúng đèn, đúng giá, bảo hành rõ ràng.
            </p>
            <div className="animate-fade-up mt-6 flex flex-wrap gap-3" style={{ animationDelay: '270ms' }}>
              <Link
                to="/san-pham"
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-stone-900 transition duration-300 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/25"
              >
                Xem sản phẩm <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/san-pham?danh-muc=solar"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white ring-1 ring-white/40 transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
              >
                <Sun className="h-4 w-4" /> Đèn năng lượng mặt trời
              </Link>
            </div>
            <dl
              className="animate-fade-up mt-10 grid max-w-md grid-cols-3 gap-4 text-center lg:text-left"
              style={{ animationDelay: '360ms' }}
            >
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
          <div className="animate-fade-up relative" style={{ animationDelay: '220ms' }}>
            <div aria-hidden className="animate-glow absolute -inset-8 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4">
              {featuredProducts.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className={`rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 transition duration-500 hover:-translate-y-1.5 hover:bg-white/10 ${i >= 2 ? 'hidden lg:block' : ''}`}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Thanh cam kết (tĩnh — bản chạy chữ trước đây bị phản ánh là rối mắt) */}
      <div className="bg-amber-400 py-3" aria-label="Cam kết của cửa hàng">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4">
          {benefitItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 text-sm font-semibold text-stone-900"
            >
              <Sparkle className="h-3.5 w-3.5 shrink-0 fill-stone-900" /> {item}
            </span>
          ))}
        </div>
      </div>

      {/* Danh mục */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <Reveal>
          <SectionTitle title="Mua theo nhu cầu" sub="Bốn nhóm đèn chính của cửa hàng" />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c, i) => {
            const Icon = categoryIcons[c.slug]
            return (
              <Reveal key={c.slug} delay={(i % 4) * 70} className="h-full">
                <Link
                  to={`/san-pham?danh-muc=${c.slug}`}
                  className="group block h-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <span
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl transition duration-300 group-hover:scale-110 ${categoryColors[c.slug]}`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-3 font-bold text-stone-800 transition group-hover:text-amber-600">{c.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-stone-500">{c.tagline}</p>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Nổi bật */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <Reveal>
          <SectionTitle title="Sản phẩm nổi bật" sub="Được chọn lọc bởi cửa hàng" linkTo="/san-pham" />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featuredProducts.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Bán chạy */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <Reveal>
          <SectionTitle title="Bán chạy nhất" sub="Khách hàng mua nhiều và đánh giá cao" linkTo="/san-pham" />
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {bestSellers.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Cam kết */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {commitments.map((c, i) => (
            <Reveal key={c.title} delay={(i % 4) * 70} className="h-full">
              <div className="flex h-full gap-3 rounded-2xl bg-white p-5 ring-1 ring-stone-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-stone-800">{c.title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-stone-500">{c.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Đánh giá */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <Reveal>
          <SectionTitle title="Khách hàng nói gì" sub="Đánh giá mẫu — sẽ thay bằng đánh giá thật" />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 80} className="h-full">
              <figure className="h-full rounded-2xl bg-white p-5 ring-1 ring-stone-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-stone-600">“{t.text}”</blockquote>
                <figcaption className="mt-3 text-sm font-semibold text-stone-800">{t.name}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-4 pt-14">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-stone-900 px-6 py-10 text-center text-white">
            <div
              aria-hidden
              className="animate-glow pointer-events-none absolute -top-16 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-amber-400/15 blur-3xl"
            />
            <div className="relative">
              <h2 className="text-2xl font-extrabold">Chưa biết chọn đèn nào?</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-stone-300">
                Nhắn Zalo cho cửa hàng, gửi ảnh không gian của bạn — chúng tôi gợi ý mẫu đèn phù hợp và
                báo giá trong ít phút. (Số Zalo sẽ cập nhật khi web ra mắt chính thức.)
              </p>
              <Link
                to="/lien-he"
                className="btn-shine mt-5 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 font-semibold text-stone-900 transition duration-300 hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/25"
              >
                Liên hệ tư vấn <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
