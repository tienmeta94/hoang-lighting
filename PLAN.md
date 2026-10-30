# Kế hoạch xây dựng web Hoang Lighting — giới thiệu & bán đèn online

> Trạng thái: BẢN KẾ HOẠCH, chờ duyệt trước khi code.
> Repo: tienmeta94/hoang-lighting — sản phẩm: đèn năng lượng mặt trời, đèn LED, đèn nháy, đèn trang trí.

## 1. Mục tiêu

- Web giới thiệu hàng hoá + bán hàng cho cửa hàng đèn: khách xem sản phẩm, lọc theo loại/giá, cho vào giỏ và đặt hàng được ngay trên điện thoại.
- Ưu tiên giai đoạn đầu: **có web chạy thật, có link live, đặt hàng được** — chưa làm thanh toán online và trang quản trị phức tạp.

## 2. Quyết định kỹ thuật (đề xuất, có thể đổi khi duyệt)

| Hạng mục | Đề xuất | Lý do |
|---|---|---|
| Frontend | React + Vite + TypeScript, Tailwind CSS | Đúng stack quen thuộc, build tĩnh nhẹ, tải nhanh trên mobile |
| Dữ liệu sản phẩm | File `src/data/products.ts` trong repo (giai đoạn 1) | Chưa cần backend; sửa file này là cập nhật sản phẩm; sau này đông sản phẩm mới chuyển CMS |
| Ảnh sản phẩm | Ảnh thật của shop (giai đoạn đầu dùng ảnh mẫu tạm, thay dần) | Ảnh quyết định tỉ lệ mua của mặt hàng đèn — không dùng ảnh minh hoạ lâu dài |
| Hosting | GitHub Pages, deploy tự động bằng GitHub Actions mỗi lần push `main` | Miễn phí, gắn thẳng với repo này, có link live ngay; gắn tên miền riêng sau |
| Nhận đơn hàng | Giỏ hàng → form đặt hàng → gửi đơn qua **Zalo** (tin nhắn soạn sẵn có sẵn danh sách giỏ) + bản sao qua email (Formspree) | Khách VN quen chốt đơn qua Zalo và COD; chưa cần cổng thanh toán |
| Thanh toán | COD là chính ở giai đoạn 1; VNPay/MoMo để giai đoạn 3 | Cổng thanh toán cần giấy tờ + API key của shop, không chặn tiến độ ra mắt |

## 3. Cấu trúc trang (giai đoạn 1 — MVP)

1. **Trang chủ:** banner (ảnh đèn trang trí buổi tối + khẩu hiệu + nút "Xem sản phẩm"), 4 ô danh mục, sản phẩm nổi bật, sản phẩm bán chạy, khối cam kết (bảo hành, giao hàng, đổi trả), đánh giá khách hàng, footer có liên hệ.
2. **Trang danh sách sản phẩm:** lọc theo danh mục (mặt trời / LED / đèn nháy / trang trí), lọc khoảng giá, tìm theo tên, sắp xếp giá tăng/giảm, bán chạy.
3. **Trang chi tiết sản phẩm:** thư viện ảnh, giá + giá gốc (nếu khuyến mãi), thông số kỹ thuật, mô tả, số lượng, nút "Thêm vào giỏ" và "Mua ngay", sản phẩm liên quan.
4. **Giỏ hàng:** thêm/bớt/xoá sản phẩm, tính tổng, lưu trong `localStorage` (tắt mở lại không mất giỏ).
5. **Đặt hàng:** form tên, số điện thoại, địa chỉ, ghi chú → bấm đặt là mở Zalo với tin nhắn đơn hàng soạn sẵn + gửi 1 bản về email shop.
6. **Trang tĩnh:** Giới thiệu, Chính sách (giao hàng/đổi trả/bảo hành), Liên hệ.

## 4. Danh mục & dữ liệu sản phẩm

4 danh mục khởi điểm:
- `solar` — Đèn năng lượng mặt trời (đèn sân vườn, đèn trụ cổng, đèn pha solar…)
- `led` — Đèn LED (bóng LED, LED dây, đèn downlight, đèn pha LED…)
- `day-nhay` — Đèn nháy (dây nháy trang trí, nháy Tết/lễ, đèn sao băng…)
- `trang-tri` — Đèn trang trí (đèn thả, đèn bàn, đèn tường, đèn lồng…)

Mỗi sản phẩm có các trường: `id, slug, name, category, price, oldPrice?, images[], shortDesc, description, specs (công suất, nguồn điện/pin, chống nước IP, thời lượng sáng, bảo hành), badge? (bán chạy / mới / giảm giá), featured?`

Dữ liệu mẫu giai đoạn code khung: 12 sản phẩm mẫu (3 sản phẩm mỗi danh mục) với giá và thông số tham khảo — **chỉ để dựng giao diện, thay bằng sản phẩm thật trước khi bán**.

Thông số riêng theo loại (hiển thị ở trang chi tiết):
- Đèn mặt trời: dung lượng pin, tấm pin, thời gian sạc/sáng, chống nước.
- Đèn LED: công suất (W), nhiệt độ màu (K), quang thông (lm), tuổi thọ.
- Đèn nháy: chiều dài dây, số bóng, số chế độ nháy, nguồn điện.
- Đèn trang trí: chất liệu, kích thước, loại bóng/đui, phong cách.

## 5. Lộ trình thực hiện

| Mốc | Việc | Đầu ra |
|---|---|---|
| M1 — Khung + deploy | Khởi tạo project Vite/React/TS + Tailwind, layout (header/footer), trang chủ với dữ liệu mẫu, GitHub Actions deploy GitHub Pages | Link web live chạy được |
| M2 — Mua sắm | Trang danh sách + lọc/tìm/sắp xếp, trang chi tiết, sản phẩm liên quan | Khách duyệt và xem được toàn bộ hàng |
| M3 — Bán hàng | Giỏ hàng (localStorage), form đặt hàng, gửi đơn qua Zalo + email | Đặt hàng được thật |
| M4 — Hoàn thiện | Nhập sản phẩm thật (tên/giá/ảnh/thông số), responsive, SEO cơ bản (title/meta/Open Graph/sitemap), nút chat Zalo nổi | Sẵn sàng chia sẻ link bán hàng |
| M5 — Nâng cấp (sau) | Thanh toán VNPay/MoMo, trang quản trị/CMS, quản lý đơn hàng, voucher, đo lường (GA) | Chỉ làm khi đã có đơn thật và thấy cần |

Mỗi mốc xong sẽ push lên `main`, web tự deploy; bạn xem link live và góp ý trước khi qua mốc tiếp theo.

## 6. Việc cần bạn cung cấp (không chặn M1–M3, cần trước M4)

1. Tên thương hiệu + logo (nếu chưa có, dùng chữ "Hoang Lighting" tạm).
2. Số điện thoại / link Zalo nhận đơn, địa chỉ shop, giờ làm việc.
3. Danh sách sản phẩm thật: tên, giá bán (và giá gốc nếu có giảm), ảnh, thông số chính, thời gian bảo hành.
4. Chính sách: phí giao hàng, khu vực giao, đổi trả trong bao lâu.
5. (Tuỳ chọn) Tên miền riêng nếu muốn dùng thay cho địa chỉ `*.github.io`.

## 7. Chưa làm trong kế hoạch này

- Thanh toán online, tài khoản khách hàng, đăng nhập — để M5.
- Ứng dụng mobile — web responsive là đủ ở giai đoạn đầu.
- Đa ngôn ngữ — chỉ tiếng Việt.
