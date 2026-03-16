export const TAX_RATES = {
  RETAIL: 0.015,
  SERVICE: 0.075,
};

export const MOCK_DB = [
  { id: 1, name: 'Táo Envy 1kg', emoji: "🍎", price: 120000, keywords: ['táo', 'envy', 'apple'], stock: 45, taxCategory: 'RETAIL', unit: 'kg' },
  { id: 2, name: 'Nho mẫu đơn 500g', emoji: "🍇", price: 250000, keywords: ['nho', 'mẫu đơn'], stock: 30, taxCategory: 'RETAIL', unit: 'hộp' },
  { id: 3, name: 'Mì Hảo Hảo Tôm Cay', emoji: "🍜", price: 4500, keywords: ['mì', 'hảo hảo'], stock: 500, taxCategory: 'RETAIL', unit: 'gói' },
  { id: 4, name: 'Trứng gà (vỉ 10)', emoji: "🥚", price: 35000, keywords: ['trứng'], stock: 120, taxCategory: 'RETAIL', unit: 'vỉ' },
  { id: 5, name: 'Sữa tươi TH True 1L', emoji: "🥛", price: 32000, keywords: ['sữa', 'th true'], stock: 80, taxCategory: 'RETAIL', unit: 'hộp' },
  { id: 6, name: 'Bánh KitKat', emoji: "🍫", price: 15000, keywords: ['kitkat', 'bánh'], stock: 200, taxCategory: 'RETAIL', unit: 'thanh' },
  { id: 7, name: 'Coca Cola 320ml', emoji: "🥤", price: 10000, keywords: ['coca', 'nước ngọt'], stock: 300, taxCategory: 'RETAIL', unit: 'lon' },
  { id: 8, name: 'Dầu ăn Simply 1L', emoji: "🧴", price: 55000, keywords: ['dầu ăn', 'simply'], stock: 60, taxCategory: 'RETAIL', unit: 'chai' },
  { id: 9, name: 'Gạo ST25 5kg', emoji: "🌾", price: 185000, keywords: ['gạo', 'st25'], stock: 40, taxCategory: 'RETAIL', unit: 'túi' },
  { id: 10, name: 'Nước xả Downy', emoji: "🌸", price: 95000, keywords: ['downy', 'nước xả'], stock: 25, taxCategory: 'RETAIL', unit: 'túi' },
  { id: 11, name: 'Kem đánh răng PS', emoji: "🪥", price: 35000, keywords: ['ps', 'kem đánh răng'], stock: 90, taxCategory: 'RETAIL', unit: 'tuýp' },
  { id: 12, name: 'Bia Heineken', emoji: "🍺", price: 22000, keywords: ['bia', 'ken'], stock: 150, taxCategory: 'RETAIL', unit: 'lon' },
  { id: 13, name: 'Xúc xích CP', emoji: "🌭", price: 45000, keywords: ['xúc xích', 'cp'], stock: 75, taxCategory: 'RETAIL', unit: 'vỉ' },
  { id: 14, name: 'Bột giặt Omo 3kg', emoji: "🧼", price: 135000, keywords: ['omo', 'bột giặt'], stock: 35, taxCategory: 'RETAIL', unit: 'túi' },
  { id: 15, name: 'Nước rửa bát Sunlight', emoji: "🍋", price: 28000, keywords: ['sunlight', 'rửa bát'], stock: 110, taxCategory: 'RETAIL', unit: 'chai' }
];

export const INPUT_INVOICES = [
  { id: 'NK101', productId: 1, date: '2024-03-01', qty: 50, price: 90000, supplier: 'Green Farm' },
  { id: 'NK102', productId: 1, date: '2024-03-12', qty: 100, price: 85000, supplier: 'Elite Import' },
  { id: 'NK201', productId: 2, date: '2024-03-05', qty: 80, price: 180000, supplier: 'Premium Garden' },
  { id: 'NK202', productId: 2, date: '2024-03-14', qty: 120, price: 195000, supplier: 'Green Farm' },
  { id: 'NK301', productId: 3, date: '2024-03-01', qty: 1000, price: 3600, supplier: 'Acecook Dist.' },
  { id: 'NK401', productId: 4, date: '2024-03-05', qty: 200, price: 28000, supplier: 'Ba Huan Corp' },
  { id: 'NK501', productId: 5, date: '2024-03-02', qty: 150, price: 25000, supplier: 'TH Food' },
  { id: 'NK601', productId: 6, date: '2024-03-10', qty: 300, price: 11000, supplier: 'Nestle VN' },
  { id: 'NK701', productId: 7, date: '2024-03-01', qty: 500, price: 7500, supplier: 'Coca Cola VN' },
  { id: 'NK801', productId: 8, date: '2024-03-05', qty: 100, price: 42000, supplier: 'Simply Corp' },
  { id: 'NK901', productId: 9, date: '2024-03-01', qty: 100, price: 145000, supplier: 'Sóc Trăng Rice' },
  { id: 'NK1001', productId: 10, date: '2024-03-08', qty: 50, price: 78000, supplier: 'P&G VN' },
  { id: 'NK1101', productId: 11, date: '2024-03-10', qty: 200, price: 24000, supplier: 'Unilever VN' },
  { id: 'NK1201', productId: 12, date: '2024-03-01', qty: 400, price: 18000, supplier: 'Heineken VN' },
  { id: 'NK1301', productId: 13, date: '2024-03-05', qty: 150, price: 32000, supplier: 'CP Food' }
];

export const SALES_HISTORY_AGGREGATE = [
  { productId: 1, totalSold: 105, lastSale: '2024-03-15' },
  { productId: 2, totalSold: 170, lastSale: '2024-03-14' },
  { productId: 3, totalSold: 850, lastSale: '2024-03-15' },
  { productId: 4, totalSold: 380, lastSale: '2024-03-15' },
  { productId: 5, totalSold: 70, lastSale: '2024-03-15' },
  { productId: 6, totalSold: 100, lastSale: '2024-03-15' },
  { productId: 7, totalSold: 200, lastSale: '2024-03-15' },
  { productId: 8, totalSold: 40, lastSale: '2024-03-15' },
  { productId: 9, totalSold: 60, lastSale: '2024-03-15' },
  { productId: 10, totalSold: 25, lastSale: '2024-03-15' },
  { productId: 11, totalSold: 110, lastSale: '2024-03-15' },
  { productId: 12, totalSold: 250, lastSale: '2024-03-15' },
  { productId: 13, totalSold: 75, lastSale: '2024-03-15' }
];
