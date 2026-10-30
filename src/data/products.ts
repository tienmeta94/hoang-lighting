// Dữ liệu sản phẩm MẪU cho giai đoạn dựng khung (M1–M3).
// Thay bằng sản phẩm thật của shop ở mốc M4: sửa trực tiếp file này.

export type CategorySlug = 'solar' | 'led' | 'day-nhay' | 'trang-tri'

export interface Category {
  slug: CategorySlug
  name: string
  tagline: string
}

export interface Spec {
  label: string
  value: string
}

export type Badge = 'hot' | 'new' | 'sale'

export interface Product {
  id: string
  slug: string
  name: string
  category: CategorySlug
  price: number
  oldPrice?: number
  shortDesc: string
  description: string
  specs: Spec[]
  badge?: Badge
  featured?: boolean
  rating: number
  sold: number
}

export const categories: Category[] = [
  { slug: 'solar', name: 'Đèn năng lượng mặt trời', tagline: 'Không tốn điện, tự sáng khi trời tối' },
  { slug: 'led', name: 'Đèn LED', tagline: 'Sáng mạnh, tiết kiệm điện, tuổi thọ cao' },
  { slug: 'day-nhay', name: 'Đèn nháy', tagline: 'Dây nháy trang trí sân vườn, lễ Tết, quán cà phê' },
  { slug: 'trang-tri', name: 'Đèn trang trí', tagline: 'Thả trần, đèn bàn, đèn tường cho không gian đẹp' },
]

export const categoryName = (slug: CategorySlug): string =>
  categories.find((c) => c.slug === slug)?.name ?? slug

export const products: Product[] = [
  // ——— Năng lượng mặt trời ———
  {
    id: 'p01',
    slug: 'den-tru-cong-nang-luong-mat-troi-solargate-30',
    name: 'Đèn trụ cổng năng lượng mặt trời SolarGate 30',
    category: 'solar',
    price: 389000,
    oldPrice: 520000,
    shortDesc: 'Gắn trụ cổng/sân vườn, cảm biến tự bật khi tối, chống nước IP65.',
    description:
      'Đèn trụ cổng dùng tấm pin mặt trời, ban ngày tự sạc, ban đêm tự sáng. Vỏ nhôm đúc sơn tĩnh điện, phù hợp trụ cổng, hàng rào và lối đi sân vườn.',
    specs: [
      { label: 'Dung lượng pin', value: '6.000 mAh' },
      { label: 'Thời gian sáng', value: '10–12 giờ sau 6 giờ sạc nắng' },
      { label: 'Chống nước', value: 'IP65' },
      { label: 'Ánh sáng', value: 'Vàng ấm 3000K / trắng 6000K' },
      { label: 'Bảo hành', value: '12 tháng' },
    ],
    badge: 'sale',
    featured: true,
    rating: 4.8,
    sold: 342,
  },
  {
    id: 'p02',
    slug: 'den-pha-led-nang-luong-mat-troi-200w',
    name: 'Đèn pha LED năng lượng mặt trời 200W SolarFlood',
    category: 'solar',
    price: 549000,
    oldPrice: 790000,
    shortDesc: 'Chiếu sáng sân, bãi xe, biển hiệu diện rộng; kèm remote điều khiển từ xa.',
    description:
      'Đèn pha solar công suất 200W với tấm pin rời dây dài 5m, lắp được cả vị trí khuất nắng. Có remote hẹn giờ và cảm biến ánh sáng tự bật/tắt.',
    specs: [
      { label: 'Công suất', value: '200W' },
      { label: 'Dung lượng pin', value: '15.000 mAh' },
      { label: 'Thời gian sáng', value: '8–12 giờ' },
      { label: 'Chống nước', value: 'IP67' },
      { label: 'Bảo hành', value: '18 tháng' },
    ],
    badge: 'hot',
    featured: true,
    rating: 4.9,
    sold: 587,
  },
  {
    id: 'p03',
    slug: 'den-cam-san-vuon-solargarden-bo-4',
    name: 'Đèn cắm sân vườn SolarGarden (bộ 4 chiếc)',
    category: 'solar',
    price: 249000,
    shortDesc: 'Cắm đất dọc lối đi, bồn hoa; ánh vàng ấm tạo điểm nhấn ban đêm.',
    description:
      'Bộ 4 đèn cắm đất năng lượng mặt trời, chỉ cần cắm xuống đất là dùng, không đi dây. Ánh sáng vàng ấm dịu, phù hợp lối đi và tiểu cảnh.',
    specs: [
      { label: 'Số lượng', value: '4 chiếc / bộ' },
      { label: 'Thời gian sáng', value: '6–8 giờ' },
      { label: 'Chống nước', value: 'IP44' },
      { label: 'Chiều cao', value: '38 cm' },
      { label: 'Bảo hành', value: '6 tháng' },
    ],
    rating: 4.6,
    sold: 198,
  },
  // ——— LED ———
  {
    id: 'p04',
    slug: 'bong-led-bulb-12w-e27-combo-3',
    name: 'Bóng LED bulb 12W đui E27 (combo 3 bóng)',
    category: 'led',
    price: 99000,
    shortDesc: 'Ánh sáng trắng/vàng, thay bóng sợi đốt và compact, tiết kiệm 80% điện.',
    description:
      'Bóng LED bulb 12W đui xoáy E27 phổ thông, sáng tương đương bóng 100W sợi đốt. Tản nhiệt nhôm, không nhấp nháy hại mắt.',
    specs: [
      { label: 'Công suất', value: '12W' },
      { label: 'Quang thông', value: '1.100 lm' },
      { label: 'Nhiệt độ màu', value: '3000K / 6500K' },
      { label: 'Tuổi thọ', value: '25.000 giờ' },
      { label: 'Bảo hành', value: '12 tháng' },
    ],
    rating: 4.7,
    sold: 1240,
  },
  {
    id: 'p05',
    slug: 'den-led-day-rgb-5m-dieu-khien-app',
    name: 'Đèn LED dây RGB 5m điều khiển qua app',
    category: 'led',
    price: 189000,
    oldPrice: 259000,
    shortDesc: '16 triệu màu, nháy theo nhạc, dán sau TV/bàn làm việc/kệ trang trí.',
    description:
      'Dây LED RGB 5m có keo dán mặt sau, điều khiển bằng remote và app điện thoại, đổi màu và nháy theo nhạc. Nguồn USB/adapter 5V tiện dụng.',
    specs: [
      { label: 'Chiều dài', value: '5 m (cắt ngắn được mỗi 3 LED)' },
      { label: 'Điều khiển', value: 'Remote + app Bluetooth' },
      { label: 'Nguồn', value: 'USB 5V' },
      { label: 'Chống nước', value: 'IP65 (phần dây)' },
      { label: 'Bảo hành', value: '6 tháng' },
    ],
    badge: 'sale',
    featured: true,
    rating: 4.5,
    sold: 863,
  },
  {
    id: 'p06',
    slug: 'den-downlight-am-tran-led-9w',
    name: 'Đèn downlight âm trần LED 9W',
    category: 'led',
    price: 79000,
    shortDesc: 'Âm trần thạch cao phi 90mm, ánh sáng đều, chống chói.',
    description:
      'Đèn downlight âm trần 9W cho phòng khách, phòng ngủ và văn phòng. Mặt tản sáng chống chói, driver rời dễ thay thế.',
    specs: [
      { label: 'Công suất', value: '9W' },
      { label: 'Lỗ khoét', value: '90 mm' },
      { label: 'Nhiệt độ màu', value: '3000K / 4000K / 6500K' },
      { label: 'Tuổi thọ', value: '30.000 giờ' },
      { label: 'Bảo hành', value: '24 tháng' },
    ],
    rating: 4.8,
    sold: 456,
  },
  // ——— Đèn nháy ———
  {
    id: 'p07',
    slug: 'day-den-nhay-led-10m-100-bong',
    name: 'Dây đèn nháy LED 10m 100 bóng chống nước',
    category: 'day-nhay',
    price: 129000,
    shortDesc: 'Trang trí cây, ban công, sảnh tiệc; 8 chế độ nháy, nối dài được.',
    description:
      'Dây nháy 10m 100 bóng LED, vỏ dây chống nước dùng ngoài trời. Bộ điều khiển 8 chế độ nháy, đuôi dây có phích nối để ghép nhiều dây.',
    specs: [
      { label: 'Chiều dài', value: '10 m' },
      { label: 'Số bóng', value: '100 bóng LED' },
      { label: 'Chế độ nháy', value: '8 chế độ' },
      { label: 'Nguồn', value: 'Điện 220V' },
      { label: 'Bảo hành', value: '6 tháng' },
    ],
    badge: 'hot',
    featured: true,
    rating: 4.7,
    sold: 978,
  },
  {
    id: 'p08',
    slug: 'den-nhay-sao-bang-8-ong-50cm',
    name: 'Đèn nháy sao băng 8 ống 50cm',
    category: 'day-nhay',
    price: 159000,
    shortDesc: 'Hiệu ứng giọt sáng rơi như sao băng, treo cây và mái hiên rất bắt mắt.',
    description:
      'Bộ đèn sao băng gồm 8 ống 50cm, hiệu ứng sáng chạy đuổi từng giọt. Chống nước, dùng cho cây xanh, mái hiên, cổng chào dịp lễ Tết.',
    specs: [
      { label: 'Số ống', value: '8 ống × 50 cm' },
      { label: 'Màu sắc', value: 'Vàng ấm / trắng / đa sắc' },
      { label: 'Chống nước', value: 'IP65' },
      { label: 'Nguồn', value: 'Điện 220V' },
      { label: 'Bảo hành', value: '6 tháng' },
    ],
    rating: 4.6,
    sold: 264,
  },
  {
    id: 'p09',
    slug: 'day-den-nhay-bi-tron-6m-usb',
    name: 'Dây đèn nháy bi tròn 6m dùng USB',
    category: 'day-nhay',
    price: 89000,
    shortDesc: 'Bóng bi mờ ánh vàng ấm, cắm USB/sạc dự phòng, hợp decor phòng và chụp ảnh.',
    description:
      'Dây nháy bi tròn 6m ánh vàng ấm, nguồn USB tiện cắm sạc dự phòng khi đi dã ngoại hoặc trang trí góc chụp ảnh, bàn tiệc.',
    specs: [
      { label: 'Chiều dài', value: '6 m, 40 bóng bi' },
      { label: 'Nguồn', value: 'USB 5V' },
      { label: 'Chế độ', value: 'Sáng tĩnh + nháy nhẹ' },
      { label: 'Bảo hành', value: '3 tháng' },
    ],
    badge: 'new',
    rating: 4.5,
    sold: 151,
  },
  // ——— Trang trí ———
  {
    id: 'p10',
    slug: 'den-tha-tran-edison-vintage',
    name: 'Đèn thả trần Edison phong cách vintage',
    category: 'trang-tri',
    price: 329000,
    shortDesc: 'Chao sắt đen + bóng Edison, hợp quán cà phê, bàn ăn, homestay.',
    description:
      'Đèn thả trần phong cách công nghiệp với chao sắt sơn đen và bóng sợi tóc Edison ánh vàng. Dây thả điều chỉnh độ dài theo trần nhà.',
    specs: [
      { label: 'Chất liệu', value: 'Sắt sơn tĩnh điện' },
      { label: 'Đui đèn', value: 'E27 (kèm bóng Edison 6W)' },
      { label: 'Dây thả', value: 'Dài 1 m, cắt ngắn được' },
      { label: 'Bảo hành', value: '12 tháng' },
    ],
    featured: true,
    rating: 4.9,
    sold: 187,
  },
  {
    id: 'p11',
    slug: 'den-ban-gom-luna',
    name: 'Đèn bàn gốm Luna ánh sáng ấm',
    category: 'trang-tri',
    price: 459000,
    oldPrice: 590000,
    shortDesc: 'Thân gốm thủ công, chao vải, 3 mức sáng cảm ứng cho bàn đầu giường.',
    description:
      'Đèn bàn thân gốm men mờ với chao vải linen, chạm để đổi 3 mức sáng. Ánh vàng ấm dịu mắt, phù hợp phòng ngủ và góc đọc sách.',
    specs: [
      { label: 'Chất liệu', value: 'Gốm + chao vải linen' },
      { label: 'Điều khiển', value: 'Cảm ứng 3 mức sáng' },
      { label: 'Kích thước', value: 'Cao 38 cm, chao Ø26 cm' },
      { label: 'Bảo hành', value: '12 tháng' },
    ],
    badge: 'sale',
    rating: 4.8,
    sold: 96,
  },
  {
    id: 'p12',
    slug: 'den-long-tre-trang-tri',
    name: 'Đèn lồng tre trang trí thủ công',
    category: 'trang-tri',
    price: 219000,
    shortDesc: 'Đan tre thủ công, treo ban công/quán ăn, ánh sáng xuyên nan tre ấm cúng.',
    description:
      'Đèn lồng đan từ tre tự nhiên bởi làng nghề, mỗi chiếc là một sản phẩm thủ công. Treo ban công, sân vườn hoặc không gian quán phong cách mộc.',
    specs: [
      { label: 'Chất liệu', value: 'Tre tự nhiên đã xử lý mối mọt' },
      { label: 'Kích thước', value: 'Ø30 cm × cao 28 cm' },
      { label: 'Đui đèn', value: 'E27 (chưa kèm bóng)' },
      { label: 'Bảo hành', value: '6 tháng' },
    ],
    badge: 'new',
    rating: 4.7,
    sold: 73,
  },
  {
    id: 'p13',
    slug: 'den-tuong-nang-luong-mat-troi-cam-ung',
    name: 'Đèn tường năng lượng mặt trời cảm ứng chuyển động',
    category: 'solar',
    price: 179000,
    oldPrice: 240000,
    shortDesc: 'Gắn tường/cổng, người đi qua tự sáng mạnh, 3 chế độ sáng.',
    description:
      'Đèn tường solar với cảm biến chuyển động PIR: lại gần thì sáng mạnh, vắng người thì mờ tiết kiệm pin. Lắp không cần đi dây điện, hợp cổng, cầu thang, ban công.',
    specs: [
      { label: 'Cảm biến', value: 'Chuyển động PIR, góc 120°, xa 3–5 m' },
      { label: 'Dung lượng pin', value: '2.400 mAh' },
      { label: 'Chống nước', value: 'IP65' },
      { label: 'Bảo hành', value: '12 tháng' },
    ],
    badge: 'sale',
    rating: 4.6,
    sold: 412,
  },
  {
    id: 'p14',
    slug: 'den-panel-led-tran-24w',
    name: 'Đèn panel LED âm trần 24W siêu mỏng',
    category: 'led',
    price: 149000,
    shortDesc: 'Panel mỏng 600×300 cho văn phòng, phòng họp; ánh sáng đều không chói.',
    description:
      'Đèn panel LED 24W kích thước 600×300mm, mặt tản sáng đồng đều, phù hợp trần thạch cao và trần thả văn phòng, lớp học, cửa hàng.',
    specs: [
      { label: 'Công suất', value: '24W' },
      { label: 'Kích thước', value: '600 × 300 mm' },
      { label: 'Nhiệt độ màu', value: '4000K / 6500K' },
      { label: 'Tuổi thọ', value: '30.000 giờ' },
      { label: 'Bảo hành', value: '24 tháng' },
    ],
    rating: 4.7,
    sold: 238,
  },
  {
    id: 'p15',
    slug: 'den-nhay-rem-cua-so-3x3m',
    name: 'Đèn nháy rèm cửa sổ 3×3m 300 bóng',
    category: 'day-nhay',
    price: 199000,
    oldPrice: 269000,
    shortDesc: 'Rèm nháy phủ cửa sổ/ban công/sân khấu, hiệu ứng mưa rơi lãng mạn.',
    description:
      'Bộ rèm đèn nháy 3×3m gồm 300 bóng LED thả thành màn sáng, 8 chế độ nháy có ghi nhớ. Dùng trang trí cửa sổ, backdrop chụp ảnh, tiệc cưới.',
    specs: [
      { label: 'Kích thước', value: '3 m × 3 m, 12 sợi thả' },
      { label: 'Số bóng', value: '300 bóng LED' },
      { label: 'Chống nước', value: 'IP44 (treo trong nhà/hiên)' },
      { label: 'Nguồn', value: 'Điện 220V' },
      { label: 'Bảo hành', value: '6 tháng' },
    ],
    badge: 'hot',
    featured: true,
    rating: 4.8,
    sold: 356,
  },
  {
    id: 'p16',
    slug: 'den-tuong-trang-tri-bac-au',
    name: 'Đèn tường trang trí Bắc Âu hai đầu hắt',
    category: 'trang-tri',
    price: 289000,
    shortDesc: 'Hắt sáng hai đầu lên/xuống tạo vệt sáng nghệ thuật cho hành lang, phòng khách.',
    description:
      'Đèn gắn tường phong cách Bắc Âu thân nhôm, hắt sáng đồng thời lên và xuống tạo hiệu ứng vệt sáng đẹp trên tường. Hợp hành lang, cầu thang, phòng khách.',
    specs: [
      { label: 'Chất liệu', value: 'Nhôm đúc sơn tĩnh điện' },
      { label: 'Công suất', value: '2 × 5W LED tích hợp' },
      { label: 'Nhiệt độ màu', value: '3000K vàng ấm' },
      { label: 'Bảo hành', value: '18 tháng' },
    ],
    badge: 'new',
    rating: 4.8,
    sold: 64,
  },
]

export const featuredProducts = products.filter((p) => p.featured)
export const bestSellers = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4)
