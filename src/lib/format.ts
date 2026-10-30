export const formatVND = (value: number): string =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)

export const discountPercent = (price: number, oldPrice?: number): number | null => {
  if (!oldPrice || oldPrice <= price) return null
  return Math.round((1 - price / oldPrice) * 100)
}
