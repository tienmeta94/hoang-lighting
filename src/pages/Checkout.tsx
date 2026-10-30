import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCopy,
  Mail,
  MessageCircle,
  PartyPopper,
} from 'lucide-react'
import { formatVND } from '../lib/format'
import { hasEmailOrder, hasZalo, shippingFee, shop, zaloLink } from '../config'
import { useCart } from '../store/cart'
import { usePageTitle } from '../lib/usePageTitle'

interface Customer {
  name: string
  phone: string
  address: string
  note: string
}

type Stage = 'form' | 'ready' | 'done'

const buildOrderMessage = (
  code: string,
  customer: Customer,
  linesText: string,
  amounts: { subtotal: number; fee: number },
) =>
  [
    `ĐƠN HÀNG MỚI — ${shop.name}`,
    `Mã đơn: ${code}`,
    '——————————',
    linesText,
    '——————————',
    `Tạm tính: ${formatVND(amounts.subtotal)}`,
    `Phí giao hàng: ${amounts.fee === 0 ? 'Miễn phí' : formatVND(amounts.fee)}`,
    `Tổng cộng: ${formatVND(amounts.subtotal + amounts.fee)}`,
    `Họ tên: ${customer.name}`,
    `Số điện thoại: ${customer.phone}`,
    `Địa chỉ: ${customer.address}`,
    customer.note ? `Ghi chú: ${customer.note}` : '',
    'Thanh toán: COD khi nhận hàng',
  ]
    .filter(Boolean)
    .join('\n')

export default function Checkout() {
  usePageTitle('Đặt hàng | Hoang Lighting')
  const { lines, subtotal, count, clear } = useCart()
  const [stage, setStage] = useState<Stage>('form')
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '', address: '', note: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof Customer, string>>>({})
  const [orderCode, setOrderCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')

  const linesText = useMemo(
    () =>
      lines
        .map(
          ({ product, qty }) =>
            `• ${product.name} × ${qty} = ${formatVND(product.price * qty)}`,
        )
        .join('\n'),
    [lines],
  )
  const fee = shippingFee(subtotal)
  const orderMessage = useMemo(
    () => buildOrderMessage(orderCode, customer, linesText, { subtotal, fee }),
    [orderCode, customer, linesText, subtotal, fee],
  )

  if (lines.length === 0 && stage === 'form') {
    return (
      <main className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h1 className="text-2xl font-extrabold text-stone-900">Chưa có gì để đặt hàng</h1>
        <p className="mt-2 text-sm text-stone-500">
          Giỏ hàng của bạn đang trống. Hãy chọn vài mẫu đèn rồi quay lại đây nhé.
        </p>
        <Link
          to="/san-pham"
          className="mt-6 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          Xem sản phẩm
        </Link>
      </main>
    )
  }

  if (stage === 'done') {
    return (
      <main className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
          <PartyPopper className="h-8 w-8" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-stone-900">Đơn hàng {orderCode} đã được ghi nhận!</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-500">
          Cảm ơn bạn đã mua hàng. Shop sẽ gọi tới số{' '}
          <span className="font-semibold text-stone-700">{customer.phone}</span> để xác nhận đơn và
          báo phí giao hàng trước khi gửi. Vui lòng để ý điện thoại nhé.
        </p>
        <Link
          to="/san-pham"
          className="mt-6 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          Tiếp tục mua sắm
        </Link>
      </main>
    )
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof Customer, string>> = {}
    if (customer.name.trim().length < 2) next.name = 'Vui lòng nhập họ tên người nhận.'
    const phone = customer.phone.replace(/[\s.]/g, '')
    if (!/^0\d{9}$/.test(phone)) next.phone = 'Số điện thoại cần đủ 10 số và bắt đầu bằng 0.'
    if (customer.address.trim().length < 10)
      next.address = 'Vui lòng nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành).'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setOrderCode(`HL${Date.now().toString().slice(-8)}`)
    setStage('ready')
    window.scrollTo({ top: 0 })
  }

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const sendEmail = async () => {
    if (!hasEmailOrder) return
    setEmailState('sending')
    try {
      const res = await fetch(shop.formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Đơn hàng ${orderCode} — ${shop.name}`,
          ma_don: orderCode,
          khach_hang: customer.name,
          so_dien_thoai: customer.phone,
          dia_chi: customer.address,
          ghi_chu: customer.note,
          chi_tiet_don: linesText,
          phi_giao_hang: fee === 0 ? 'Miễn phí' : formatVND(fee),
          tong_cong: formatVND(subtotal + fee),
        }),
      })
      setEmailState(res.ok ? 'sent' : 'failed')
    } catch {
      setEmailState('failed')
    }
  }

  const finish = () => {
    clear()
    setStage('done')
    window.scrollTo({ top: 0 })
  }

  const field =
    'w-full rounded-xl bg-white px-3.5 py-2.5 text-sm ring-1 ring-stone-300 outline-none placeholder:text-stone-400 focus:ring-2 focus:ring-amber-400'
  const errorText = 'mt-1 text-xs font-medium text-red-600'

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/gio-hang" className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 hover:text-amber-700">
        <ArrowLeft className="h-4 w-4" /> Quay lại giỏ hàng
      </Link>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900">Đặt hàng</h1>

      {stage === 'ready' && (
        <section className="mt-6 rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-200">
          <h2 className="flex items-center gap-2 font-extrabold text-emerald-900">
            <CheckCircle2 className="h-5 w-5" /> Đơn {orderCode} đã sẵn sàng — chọn cách gửi cho shop:
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {hasZalo ? (
              <a
                href={zaloLink(orderMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                <MessageCircle className="h-4 w-4" /> Gửi đơn qua Zalo
              </a>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-500">
                <MessageCircle className="h-4 w-4" /> Gửi qua Zalo (shop chưa cập nhật số)
              </span>
            )}
            {hasEmailOrder ? (
              <button
                onClick={sendEmail}
                disabled={emailState === 'sending' || emailState === 'sent'}
                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
              >
                <Mail className="h-4 w-4" />
                {emailState === 'sending'
                  ? 'Đang gửi…'
                  : emailState === 'sent'
                    ? 'Đã gửi email cho shop'
                    : 'Gửi bản sao về email shop'}
              </button>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-stone-200 px-5 py-2.5 text-sm font-semibold text-stone-500">
                <Mail className="h-4 w-4" /> Gửi email (chưa cấu hình)
              </span>
            )}
            <button
              onClick={copyOrder}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 ring-1 ring-stone-300 transition hover:ring-amber-400"
            >
              <ClipboardCopy className="h-4 w-4" /> {copied ? 'Đã sao chép!' : 'Sao chép nội dung đơn'}
            </button>
          </div>
          {emailState === 'failed' && (
            <p className="mt-3 text-sm font-medium text-red-600">
              Gửi email không thành công — bạn dùng Zalo hoặc sao chép đơn để gửi thủ công giúp shop nhé.
            </p>
          )}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium text-emerald-800">
              Xem nội dung đơn sẽ gửi
            </summary>
            <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-white p-4 text-sm leading-relaxed text-stone-700 ring-1 ring-emerald-100">
              {orderMessage}
            </pre>
          </details>
          <button
            onClick={finish}
            className="mt-4 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Tôi đã gửi đơn xong
          </button>
        </section>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <form onSubmit={submit} noValidate className="h-fit rounded-3xl bg-white p-6 ring-1 ring-stone-200/70">
          <h2 className="font-extrabold text-stone-900">Thông tin nhận hàng</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="co-name" className="mb-1.5 block text-sm font-medium text-stone-700">
                Họ tên người nhận *
              </label>
              <input
                id="co-name"
                autoComplete="name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder="Ví dụ: Nguyễn Văn A"
                className={field}
              />
              {errors.name && <p className={errorText}>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="co-phone" className="mb-1.5 block text-sm font-medium text-stone-700">
                Số điện thoại *
              </label>
              <input
                id="co-phone"
                inputMode="tel"
                autoComplete="tel"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                placeholder="Ví dụ: 0901 234 567"
                className={field}
              />
              {errors.phone && <p className={errorText}>{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="co-address" className="mb-1.5 block text-sm font-medium text-stone-700">
                Địa chỉ nhận hàng *
              </label>
              <textarea
                id="co-address"
                rows={3}
                autoComplete="street-address"
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                className={field}
              />
              {errors.address && <p className={errorText}>{errors.address}</p>}
            </div>
            <div>
              <label htmlFor="co-note" className="mb-1.5 block text-sm font-medium text-stone-700">
                Ghi chú (không bắt buộc)
              </label>
              <input
                id="co-note"
                value={customer.note}
                onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
                placeholder="Giờ giao hàng mong muốn, yêu cầu riêng…"
                className={field}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-amber-400 px-6 py-3 font-semibold text-stone-900 transition hover:bg-amber-300"
          >
            Tạo đơn hàng
          </button>
          <p className="mt-2 text-center text-xs text-stone-400">
            Bấm "Tạo đơn hàng" để xem nội dung đơn và gửi cho shop qua Zalo/email. Chưa có khoản thanh
            toán nào bị trừ — bạn trả tiền khi nhận hàng.
          </p>
        </form>

        <aside className="h-fit rounded-3xl bg-white p-5 ring-1 ring-stone-200/70 lg:sticky lg:top-32">
          <h2 className="font-extrabold text-stone-900">Đơn của bạn ({count})</h2>
          <ul className="mt-3 space-y-2.5 text-sm">
            {lines.map(({ product, qty }) => (
              <li key={product.id} className="flex items-baseline justify-between gap-3">
                <span className="min-w-0">
                  <span className="line-clamp-1 font-medium text-stone-700">{product.name}</span>
                  <span className="text-xs text-stone-400">× {qty}</span>
                </span>
                <span className="shrink-0 font-semibold">{formatVND(product.price * qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-dashed border-stone-200 pt-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Tạm tính</span>
              <span className="font-semibold">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Phí giao hàng</span>
              <span className={fee === 0 ? 'font-semibold text-emerald-600' : 'font-semibold'}>
                {fee === 0 ? 'Miễn phí' : formatVND(fee)}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span className="font-bold text-stone-900">Tổng cộng</span>
              <span className="font-extrabold text-red-600">{formatVND(subtotal + fee)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
