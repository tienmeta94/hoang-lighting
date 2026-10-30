// Bỏ dấu tiếng Việt để tìm kiếm không cần gõ dấu ("den pha" khớp "Đèn pha").
export const normalizeVi = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
