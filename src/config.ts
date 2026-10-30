// Thông tin liên hệ của shop — ĐIỀN Ở ĐÂY khi có dữ liệu thật (mốc M4).
// Để trống thì web hiển thị "Đang cập nhật" và nút gửi đơn qua kênh đó bị khoá,
// khách vẫn sao chép được nội dung đơn hàng để gửi thủ công.
export const shop = {
  name: 'Hoang Lighting',
  // Số điện thoại nhận cuộc gọi, ví dụ '0901234567'
  phone: '',
  // Số Zalo nhận đơn (thường trùng số điện thoại), ví dụ '0901234567'
  zalo: '',
  // Email nhận bản sao đơn hàng
  email: '',
  // Endpoint Formspree để gửi đơn về email, ví dụ 'https://formspree.io/f/abcdwxyz'
  formspreeEndpoint: '',
  // Địa chỉ cửa hàng
  address: '',
}

export const hasZalo = shop.zalo.trim().length > 0
export const hasEmailOrder = shop.formspreeEndpoint.trim().length > 0

export const zaloLink = (message: string): string =>
  `https://zalo.me/${shop.zalo.trim()}?text=${encodeURIComponent(message)}`
