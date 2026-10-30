# Hướng dẫn kết nối Supabase cho Hoang Lighting

Làm lần lượt 5 bước này (khoảng 5–10 phút). Sau bước 5, báo lại cho Muse để được nối dây và kiểm tra cuối.

## Bước 1 — Tạo project Supabase
1. Vào https://supabase.com → **Start your project** → đăng nhập bằng **GitHub**.
2. **New project**: đặt tên `hoang-lighting`, tự đặt một **Database password** (lưu lại trong ghi chú của bạn — mật khẩu này chỉ bạn giữ), chọn Region **Singapore (Southeast Asia)** cho gần Việt Nam.
3. Bấm **Create new project** và chờ khoảng 1–2 phút.

## Bước 2 — Lấy Project URL và anon key
1. Trong project, vào **Project Settings** (biểu tượng bánh răng) → **API**.
2. Ghi lại hai giá trị:
   - **Project URL**: dạng `https://xxxxxxxx.supabase.co`
   - **anon / public key**: chuỗi dài bắt đầu bằng `eyJ...`
3. Hai giá trị này là **thông tin công khai theo thiết kế** (anon key sẽ nằm trong code web cho mọi người thấy; nó không cho ai sửa dữ liệu vì đã có RLS + đăng nhập admin). Gửi chúng cho Muse qua chat để nối vào web.

> ⚠️ Đừng nhầm với **service_role key** (key bí mật có quyền tuyệt đối) — key đó KHÔNG gửi cho ai và không đưa vào web.

## Bước 3 — Tạo bảng dữ liệu
1. Vào mục **SQL Editor** → **New query**.
2. Mở file `supabase/schema.sql` trong repo này, copy toàn bộ, dán vào và bấm **Run**.
3. Thấy báo "Success. No rows returned" là xong: đã có bảng `products`, phân quyền và kho chứa ảnh.

## Bước 4 — Tạo tài khoản admin
1. Vào **Authentication** → **Users** → **Add user** → **Create new user**.
2. Nhập email của bạn (ví dụ `admin@hoanglighting.vn`) và tự đặt mật khẩu mạnh. Tick **Auto Confirm User** nếu có.
3. Mật khẩu này chỉ bạn biết — dùng để đăng nhập trang `/admin` của web. Đừng gửi mật khẩu cho Muse.

## Bước 5 — Báo Muse nối dây
Gửi cho Muse **Project URL + anon key** ở bước 2. Muse sẽ điền vào `src/config.ts`, push lên, và kiểm tra: web đọc sản phẩm từ Supabase, trang quản trị đăng nhập được.

## Sau khi nối xong — cách dùng trang quản trị
- Địa chỉ: `https://tienmeta94.github.io/hoang-lighting/#/admin`
- Lần đầu: bấm **Nạp sản phẩm mẫu** để đưa 16 sản phẩm mẫu vào database, sau đó sửa dần thành hàng thật (đổi tên/giá/ảnh/thông số ngay trên giao diện).
- Thêm/sửa/xoá/ẩn sản phẩm: thay đổi áp dụng cho khách ngay, không cần build lại web.
- Ảnh: trong form sửa sản phẩm, chọn **tải ảnh từ máy lên** (lưu vào Supabase Storage) hoặc dán link ảnh có sẵn.
