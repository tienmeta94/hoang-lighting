// Kết nối Supabase (backend quản trị sản phẩm).
// Điền Project URL và anon key của project Supabase vào đây (anon key là key
// CÔNG KHAI theo thiết kế của Supabase — nó vốn nằm trong code web cho mọi
// người thấy; quyền sửa dữ liệu được khoá bằng đăng nhập admin + RLS).
// Cũng có thể đặt qua biến môi trường VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
export const supabaseConfig = {
  url: 'https://luokelolcedycuvfzqeb.supabase.co',
  anonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1b2tlbG9sY2VkeWN1dmZ6cWViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMzMzI1NTgsImV4cCI6MjEwODkwODU1OH0.mXS-Bzy4HxEa7SOpWZpNVBOp39TiQBbFlOaQ1rS93IE',
}

// Thông tin liên hệ của shop.
// ⚠️ ĐANG LÀ DỮ LIỆU MẪU (mock theo yêu cầu triển khai M4) — thay bằng thông tin
// thật của shop tại đây trước khi chia sẻ link cho khách hàng thật.
export const shop = {
  name: 'Hoang Lighting',
  // Số điện thoại mẫu
  phone: '0901234567',
  // Số Zalo mẫu (trùng số điện thoại mẫu)
  zalo: '0901234567',
  // Email mẫu
  email: 'hotro@hoanglighting.vn',
  // Endpoint Formspree để gửi đơn về email — không mock được, tạo form thật tại
  // formspree.io rồi dán endpoint vào đây (ví dụ 'https://formspree.io/f/abcdwxyz').
  formspreeEndpoint: '',
  // Địa chỉ mẫu
  address: '123 Đường Ánh Sáng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  // Giờ mở cửa
  hours: '8:00 – 21:00 hằng ngày',
}

// Chính sách phí giao hàng (MẪU): miễn phí cho đơn từ 500.000đ,
// các đơn còn lại đồng giá 30.000đ.
export const FREE_SHIP_THRESHOLD = 500000
export const STANDARD_SHIP_FEE = 30000

export const shippingFee = (subtotal: number): number => {
  if (subtotal <= 0) return 0
  return subtotal >= FREE_SHIP_THRESHOLD ? 0 : STANDARD_SHIP_FEE
}

export const hasZalo = shop.zalo.trim().length > 0
export const hasEmailOrder = shop.formspreeEndpoint.trim().length > 0

export const zaloLink = (message: string): string =>
  `https://zalo.me/${shop.zalo.trim()}?text=${encodeURIComponent(message)}`

export const zaloChatLink = zaloLink(
  `Xin chào ${shop.name}, tôi muốn được tư vấn chọn đèn.`,
)
