import { Category, Product, Banner, User, Combo } from '@/types';

// ============= Categories =============
export const seedCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Cây Thông Noel',
    slug: 'cay-thong-noel',
    description: 'Các loại cây thông trang trí Giáng sinh',
    image: 'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=400',
    order: 1
  },
  {
    id: 'cat-2',
    name: 'Đồ Trang Trí Cây',
    slug: 'do-trang-tri-cay',
    description: 'Quả cầu, dây kim tuyến, ngôi sao và phụ kiện treo cây thông',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=400',
    order: 2
  },
  {
    id: 'cat-3',
    name: 'Đèn LED & Dây Đèn',
    slug: 'den-led-day-den',
    description: 'Đèn trang trí, dây đèn LED nhiều màu sắc',
    image: 'https://images.unsplash.com/photo-1513297887119-d46091b24b39?w=400',
    order: 3
  },
  {
    id: 'cat-4',
    name: 'Ông Già Noel & Người Tuyết',
    slug: 'ong-gia-noel-nguoi-tuyet',
    description: 'Tượng, búp bê ông già Noel và người tuyết',
    image: 'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=400',
    order: 4
  },
  {
    id: 'cat-5',
    name: 'Vòng Hoa & Trang Trí Cửa',
    slug: 'vong-hoa-trang-tri-cua',
    description: 'Vòng nguyệt quế, banner, dây treo trang trí cửa',
    image: 'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?w=400',
    order: 5
  },
  {
    id: 'cat-6',
    name: 'Phụ Kiện Khác',
    slug: 'phu-kien-khac',
    description: 'Các phụ kiện trang trí Giáng sinh khác',
    image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400',
    order: 6
  }
];

// ============= Products =============
export const seedProducts: Product[] = [
  // Cây Thông Noel
  {
    id: 'prod-1',
    name: 'Cây Thông Noel Cao Cấp 1.5m',
    slug: 'cay-thong-noel-cao-cap-1-5m',
    description: 'Cây thông Noel nhựa PVC cao cấp, lá dày đẹp tự nhiên, khung thép chắc chắn. Phù hợp trang trí phòng khách, cửa hàng.',
    price: 450000,
    images: [
      'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=600',
      'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600'
    ],
    categoryId: 'cat-1',
    variants: [
      { id: 'v1-1', name: '1.2m', type: 'size', value: '1.2m', stock: 15, priceModifier: -100000 },
      { id: 'v1-2', name: '1.5m', type: 'size', value: '1.5m', stock: 20, priceModifier: 0 },
      { id: 'v1-3', name: '1.8m', type: 'size', value: '1.8m', stock: 10, priceModifier: 150000 },
      { id: 'v1-4', name: '2.1m', type: 'size', value: '2.1m', stock: 5, priceModifier: 350000 }
    ],
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Cây Thông Mini Để Bàn',
    slug: 'cay-thong-mini-de-ban',
    description: 'Cây thông nhỏ xinh để bàn làm việc, kèm chậu gỗ trang trí. Cao 30-45cm.',
    price: 89000,
    images: [
      'https://images.unsplash.com/photo-1577003833619-76bbd7f82948?w=600'
    ],
    categoryId: 'cat-1',
    variants: [
      { id: 'v2-1', name: '30cm', type: 'size', value: '30cm', stock: 50, priceModifier: 0 },
      { id: 'v2-2', name: '45cm', type: 'size', value: '45cm', stock: 30, priceModifier: 40000 }
    ],
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },

  // Đồ Trang Trí Cây
  {
    id: 'prod-3',
    name: 'Bộ Quả Cầu Trang Trí 24 Món',
    slug: 'bo-qua-cau-trang-tri-24-mon',
    description: 'Bộ 24 quả cầu trang trí đủ size, màu sắc lấp lánh. Chất liệu nhựa cao cấp không vỡ.',
    price: 159000,
    images: [
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600',
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600'
    ],
    categoryId: 'cat-2',
    variants: [
      { id: 'v3-1', name: 'Đỏ - Vàng', type: 'color', value: '#DC2626', stock: 40, priceModifier: 0 },
      { id: 'v3-2', name: 'Xanh - Bạc', type: 'color', value: '#3B82F6', stock: 35, priceModifier: 0 },
      { id: 'v3-3', name: 'Hồng - Tím', type: 'color', value: '#EC4899', stock: 25, priceModifier: 20000 }
    ],
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Ngôi Sao Đỉnh Cây LED',
    slug: 'ngoi-sao-dinh-cay-led',
    description: 'Ngôi sao trang trí đỉnh cây thông, có đèn LED nhấp nháy. Kích thước 20cm.',
    price: 79000,
    images: [
      'https://images.unsplash.com/photo-1513297887119-d46091b24b39?w=600'
    ],
    categoryId: 'cat-2',
    variants: [
      { id: 'v4-1', name: 'Vàng', type: 'color', value: '#FBBF24', stock: 60, priceModifier: 0 },
      { id: 'v4-2', name: 'Bạc', type: 'color', value: '#94A3B8', stock: 45, priceModifier: 0 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Dây Kim Tuyến 5m',
    slug: 'day-kim-tuyen-5m',
    description: 'Dây kim tuyến lấp lánh trang trí cây thông, dài 5m. Nhiều màu sắc.',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600'
    ],
    categoryId: 'cat-2',
    variants: [
      { id: 'v5-1', name: 'Đỏ', type: 'color', value: '#DC2626', stock: 100, priceModifier: 0 },
      { id: 'v5-2', name: 'Vàng', type: 'color', value: '#FBBF24', stock: 100, priceModifier: 0 },
      { id: 'v5-3', name: 'Bạc', type: 'color', value: '#94A3B8', stock: 80, priceModifier: 0 },
      { id: 'v5-4', name: 'Xanh lá', type: 'color', value: '#16A34A', stock: 70, priceModifier: 0 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },

  // Đèn LED & Dây Đèn
  {
    id: 'prod-6',
    name: 'Dây Đèn LED 10m 100 Bóng',
    slug: 'day-den-led-10m-100-bong',
    description: 'Dây đèn LED trang trí 100 bóng, dài 10m. Có 8 chế độ nhấp nháy, chống nước IP44.',
    price: 125000,
    images: [
      'https://images.unsplash.com/photo-1513297887119-d46091b24b39?w=600',
      'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600'
    ],
    categoryId: 'cat-3',
    variants: [
      { id: 'v6-1', name: 'Vàng ấm', type: 'color', value: '#FCD34D', stock: 80, priceModifier: 0 },
      { id: 'v6-2', name: 'Trắng', type: 'color', value: '#FFFFFF', stock: 60, priceModifier: 0 },
      { id: 'v6-3', name: 'Đa màu', type: 'color', value: '#rainbow', stock: 50, priceModifier: 30000 }
    ],
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'Đèn Ngôi Sao Rèm LED',
    slug: 'den-ngoi-sao-rem-led',
    description: 'Rèm đèn LED hình ngôi sao, kích thước 3x1m. Thích hợp trang trí cửa sổ, ban công.',
    price: 289000,
    images: [
      'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600'
    ],
    categoryId: 'cat-3',
    variants: [
      { id: 'v7-1', name: 'Vàng ấm', type: 'color', value: '#FCD34D', stock: 25, priceModifier: 0 },
      { id: 'v7-2', name: 'Đa màu', type: 'color', value: '#rainbow', stock: 20, priceModifier: 50000 }
    ],
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'Đèn Nến LED Không Lửa',
    slug: 'den-nen-led-khong-lua',
    description: 'Bộ 3 đèn nến LED điều khiển từ xa, ánh sáng lung linh như nến thật. An toàn cho gia đình có trẻ nhỏ.',
    price: 179000,
    images: [
      'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=600'
    ],
    categoryId: 'cat-3',
    variants: [
      { id: 'v8-1', name: 'Bộ 3 cây', type: 'size', value: '3pcs', stock: 40, priceModifier: 0 },
      { id: 'v8-2', name: 'Bộ 6 cây', type: 'size', value: '6pcs', stock: 25, priceModifier: 120000 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },

  // Ông Già Noel & Người Tuyết
  {
    id: 'prod-9',
    name: 'Tượng Ông Già Noel Đứng 60cm',
    slug: 'tuong-ong-gia-noel-dung-60cm',
    description: 'Tượng ông già Noel cao 60cm, trang phục đỏ truyền thống, cầm túi quà. Chất liệu vải và nhựa cao cấp.',
    price: 359000,
    images: [
      'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600'
    ],
    categoryId: 'cat-4',
    variants: [
      { id: 'v9-1', name: '45cm', type: 'size', value: '45cm', stock: 20, priceModifier: -80000 },
      { id: 'v9-2', name: '60cm', type: 'size', value: '60cm', stock: 15, priceModifier: 0 },
      { id: 'v9-3', name: '90cm', type: 'size', value: '90cm', stock: 8, priceModifier: 200000 }
    ],
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-10',
    name: 'Người Tuyết Bông Nhồi',
    slug: 'nguoi-tuyet-bong-nhoi',
    description: 'Người tuyết bông nhồi siêu mềm, đội mũ len và quàng khăn đỏ. Thích hợp làm quà tặng.',
    price: 129000,
    images: [
      'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600'
    ],
    categoryId: 'cat-4',
    variants: [
      { id: 'v10-1', name: '25cm', type: 'size', value: '25cm', stock: 50, priceModifier: 0 },
      { id: 'v10-2', name: '40cm', type: 'size', value: '40cm', stock: 30, priceModifier: 70000 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-11',
    name: 'Tuần Lộc Rudolf Nhồi Bông',
    slug: 'tuan-loc-rudolf-nhoi-bong',
    description: 'Tuần lộc Rudolf mũi đỏ siêu cute, kích thước 35cm. Làm quà tặng Giáng sinh ý nghĩa.',
    price: 149000,
    images: [
      'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=600'
    ],
    categoryId: 'cat-4',
    variants: [
      { id: 'v11-1', name: 'Nâu', type: 'color', value: '#8B4513', stock: 35, priceModifier: 0 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },

  // Vòng Hoa & Trang Trí Cửa
  {
    id: 'prod-12',
    name: 'Vòng Nguyệt Quế Giáng Sinh 40cm',
    slug: 'vong-nguyet-que-giang-sinh-40cm',
    description: 'Vòng nguyệt quế trang trí cửa, đường kính 40cm, kèm nơ đỏ và quả thông. Lá nhựa cao cấp như thật.',
    price: 199000,
    images: [
      'https://images.unsplash.com/photo-1512474932049-78ac69ede12c?w=600'
    ],
    categoryId: 'cat-5',
    variants: [
      { id: 'v12-1', name: '30cm', type: 'size', value: '30cm', stock: 30, priceModifier: -50000 },
      { id: 'v12-2', name: '40cm', type: 'size', value: '40cm', stock: 25, priceModifier: 0 },
      { id: 'v12-3', name: '50cm', type: 'size', value: '50cm', stock: 15, priceModifier: 100000 }
    ],
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-13',
    name: 'Banner Merry Christmas Dạ Quang',
    slug: 'banner-merry-christmas-da-quang',
    description: 'Banner chữ Merry Christmas dạ quang, dài 2m. Phát sáng trong bóng tối.',
    price: 89000,
    images: [
      'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600'
    ],
    categoryId: 'cat-5',
    variants: [
      { id: 'v13-1', name: 'Đỏ', type: 'color', value: '#DC2626', stock: 40, priceModifier: 0 },
      { id: 'v13-2', name: 'Vàng', type: 'color', value: '#FBBF24', stock: 35, priceModifier: 0 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-14',
    name: 'Dây Treo Cờ Giáng Sinh',
    slug: 'day-treo-co-giang-sinh',
    description: 'Dây treo cờ tam giác họa tiết Giáng sinh, dài 3m. Trang trí tường, trần nhà.',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600'
    ],
    categoryId: 'cat-5',
    variants: [
      { id: 'v14-1', name: '3m', type: 'size', value: '3m', stock: 60, priceModifier: 0 },
      { id: 'v14-2', name: '5m', type: 'size', value: '5m', stock: 40, priceModifier: 25000 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },

  // Phụ Kiện Khác
  {
    id: 'prod-15',
    name: 'Mũ Santa Claus Đỏ',
    slug: 'mu-santa-claus-do',
    description: 'Mũ ông già Noel chất liệu nỉ cao cấp, viền lông trắng mềm mại. Phù hợp cả người lớn và trẻ em.',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1545048702-79362596cdc9?w=600'
    ],
    categoryId: 'cat-6',
    variants: [
      { id: 'v15-1', name: 'Trẻ em', type: 'size', value: 'kids', stock: 100, priceModifier: -10000 },
      { id: 'v15-2', name: 'Người lớn', type: 'size', value: 'adult', stock: 80, priceModifier: 0 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-16',
    name: 'Tất Giáng Sinh Treo Quà',
    slug: 'tat-giang-sinh-treo-qua',
    description: 'Tất đỏ trang trí và đựng quà Giáng sinh, thêu tên theo yêu cầu. Kích thước 45cm.',
    price: 59000,
    images: [
      'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600'
    ],
    categoryId: 'cat-6',
    variants: [
      { id: 'v16-1', name: 'Ông già Noel', type: 'color', value: 'santa', stock: 50, priceModifier: 0 },
      { id: 'v16-2', name: 'Người tuyết', type: 'color', value: 'snowman', stock: 45, priceModifier: 0 },
      { id: 'v16-3', name: 'Tuần lộc', type: 'color', value: 'reindeer', stock: 40, priceModifier: 0 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-17',
    name: 'Hộp Nhạc Giáng Sinh',
    slug: 'hop-nhac-giang-sinh',
    description: 'Hộp nhạc quay tay phát nhạc Jingle Bells, thiết kế cây thông xoay. Quà tặng ý nghĩa.',
    price: 249000,
    images: [
      'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600'
    ],
    categoryId: 'cat-6',
    variants: [
      { id: 'v17-1', name: 'Mặc định', type: 'size', value: 'default', stock: 20, priceModifier: 0 }
    ],
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-18',
    name: 'Bình Xịt Tuyết Giả',
    slug: 'binh-xit-tuyet-gia',
    description: 'Bình xịt tạo tuyết giả trang trí kính, cây thông. Dễ dàng lau sạch sau sử dụng.',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=600'
    ],
    categoryId: 'cat-6',
    variants: [
      { id: 'v18-1', name: '150ml', type: 'size', value: '150ml', stock: 80, priceModifier: 0 },
      { id: 'v18-2', name: '300ml', type: 'size', value: '300ml', stock: 50, priceModifier: 25000 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-19',
    name: 'Khăn Trải Bàn Giáng Sinh',
    slug: 'khan-trai-ban-giang-sinh',
    description: 'Khăn trải bàn họa tiết Giáng sinh, chất liệu cotton cao cấp. Kích thước 140x180cm.',
    price: 159000,
    images: [
      'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=600'
    ],
    categoryId: 'cat-6',
    variants: [
      { id: 'v19-1', name: 'Đỏ', type: 'color', value: '#DC2626', stock: 25, priceModifier: 0 },
      { id: 'v19-2', name: 'Xanh lá', type: 'color', value: '#16A34A', stock: 20, priceModifier: 0 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'prod-20',
    name: 'Quả Chuông Giáng Sinh Đôi',
    slug: 'qua-chuong-giang-sinh-doi',
    description: 'Bộ đôi chuông vàng trang trí, có nơ đỏ. Kích thước mỗi chuông 8cm.',
    price: 69000,
    images: [
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600'
    ],
    categoryId: 'cat-2',
    variants: [
      { id: 'v20-1', name: 'Vàng', type: 'color', value: '#FBBF24', stock: 45, priceModifier: 0 },
      { id: 'v20-2', name: 'Bạc', type: 'color', value: '#94A3B8', stock: 40, priceModifier: 0 }
    ],
    featured: false,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  }
];

// ============= Banners =============
export const seedBanners: Banner[] = [
  {
    id: 'banner-1',
    title: 'Giáng Sinh An Lành 2024',
    subtitle: 'Giảm đến 30% tất cả sản phẩm',
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=1200',
    link: '/san-pham',
    order: 1,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'banner-2',
    title: 'Combo Trang Trí Tiết Kiệm',
    subtitle: 'Mua combo tiết kiệm đến 40%',
    image: 'https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=1200',
    link: '/combo',
    order: 2,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'banner-3',
    title: 'Đèn LED Rực Rỡ',
    subtitle: 'Bộ sưu tập đèn LED mới nhất',
    image: 'https://images.unsplash.com/photo-1513297887119-d46091b24b39?w=1200',
    link: '/danh-muc/den-led-day-den',
    order: 3,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  }
];

// ============= Combos =============
export const seedCombos: Combo[] = [
  {
    id: 'combo-1',
    name: 'Combo Gia Đình Ấm Áp',
    slug: 'combo-gia-dinh-am-ap',
    description: 'Bộ trang trí hoàn chỉnh cho gia đình: Cây thông 1.5m, bộ quả cầu, ngôi sao đỉnh, dây đèn LED.',
    images: ['https://images.unsplash.com/photo-1576919228236-a097c32a5cd4?w=600'],
    items: [
      { productId: 'prod-1', variantId: 'v1-2', quantity: 1 },
      { productId: 'prod-3', variantId: 'v3-1', quantity: 1 },
      { productId: 'prod-4', variantId: 'v4-1', quantity: 1 },
      { productId: 'prod-6', variantId: 'v6-1', quantity: 1 }
    ],
    originalPrice: 813000,
    discountPrice: 650000,
    discountPercent: 20,
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'combo-2',
    name: 'Combo Văn Phòng Xinh Xắn',
    slug: 'combo-van-phong-xinh-xan',
    description: 'Trang trí góc làm việc: Cây thông mini, bộ đèn nến LED, mũ Santa.',
    images: ['https://images.unsplash.com/photo-1577003833619-76bbd7f82948?w=600'],
    items: [
      { productId: 'prod-2', variantId: 'v2-1', quantity: 1 },
      { productId: 'prod-8', variantId: 'v8-1', quantity: 1 },
      { productId: 'prod-15', variantId: 'v15-2', quantity: 2 }
    ],
    originalPrice: 338000,
    discountPrice: 269000,
    discountPercent: 20,
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  },
  {
    id: 'combo-3',
    name: 'Combo Quán Café Noel',
    slug: 'combo-quan-cafe-noel',
    description: 'Trang trí quán café rực rỡ: Cây thông lớn, rèm đèn sao, vòng nguyệt quế, banner.',
    images: ['https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600'],
    items: [
      { productId: 'prod-1', variantId: 'v1-3', quantity: 1 },
      { productId: 'prod-7', variantId: 'v7-2', quantity: 2 },
      { productId: 'prod-12', variantId: 'v12-3', quantity: 1 },
      { productId: 'prod-13', variantId: 'v13-1', quantity: 2 }
    ],
    originalPrice: 1526000,
    discountPrice: 1150000,
    discountPercent: 25,
    featured: true,
    active: true,
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-01T00:00:00Z'
  }
];

// ============= Admin User =============
// Simple hash for demo: "admin123" -> "-1k2j3h4g"
export const seedUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@noelshop.vn',
    phone: '0909123456',
    fullName: 'Quản trị viên',
    password: '-1k2j3h4g', // Hashed from "admin123"
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];
