-- ============================================================
-- Hoang Lighting — schema cho Supabase (chạy 1 lần trong SQL Editor)
-- Tạo: bảng products, phân quyền RLS, bucket chứa ảnh sản phẩm.
-- ============================================================

-- 1) Bảng sản phẩm
create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  name text not null,
  category text not null check (category in ('solar', 'led', 'day-nhay', 'trang-tri')),
  price integer not null check (price > 0),
  old_price integer,
  image text not null default '',
  short_desc text not null default '',
  description text not null default '',
  specs jsonb not null default '[]'::jsonb,
  badge text check (badge in ('hot', 'new', 'sale')),
  featured boolean not null default false,
  rating numeric not null default 0,
  sold integer not null default 0,
  visible boolean not null default true,
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);

-- 2) Bật Row Level Security
alter table public.products enable row level security;

-- 3) Chính sách truy cập
-- Khách (chưa đăng nhập) chỉ ĐỌC được sản phẩm đang bán
drop policy if exists "public read visible products" on public.products;
create policy "public read visible products"
  on public.products for select
  to anon
  using (visible = true);

-- Tài khoản đã đăng nhập (admin) đọc được tất cả…
drop policy if exists "admin read all products" on public.products;
create policy "admin read all products"
  on public.products for select
  to authenticated
  using (true);

-- …và là người duy nhất thêm/sửa/xoá được
drop policy if exists "admin insert products" on public.products;
create policy "admin insert products"
  on public.products for insert
  to authenticated
  with check (true);

drop policy if exists "admin update products" on public.products;
create policy "admin update products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "admin delete products" on public.products;
create policy "admin delete products"
  on public.products for delete
  to authenticated
  using (true);

-- 4) Bucket chứa ảnh sản phẩm (public để web hiển thị, chỉ admin tải lên)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
