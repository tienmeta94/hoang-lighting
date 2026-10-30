# hoang-lighting

Repo khởi tạo để thử vòng làm việc với Muse: code → commit → push → (deploy nếu có CI/CD).

## Website
- Web bán đèn Hoang Lighting (kế hoạch: xem [PLAN.md](PLAN.md)).
- Link live (GitHub Pages): https://tienmeta94.github.io/hoang-lighting/
- Mỗi lần push lên `main`, GitHub Actions tự build và deploy lại.

## Trạng thái
- Repo public. Commit đầu tiên đã được Muse push lên nhánh `main` qua GitHub API (token fine-grained chỉ cho repo này, quyền Contents Read/Write).
- Vòng thử nghiệm code → commit → push đã thông suốt.
- M1 (khung + trang chủ + dữ liệu mẫu) đã code xong, đang bật deploy tự động lên GitHub Pages.
