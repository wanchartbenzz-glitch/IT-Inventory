// IT Inventory — shared sample catalog (single source of truth for the demo data).
// Both inventory.html (list) and inventory-detail.html (detail + stock movement)
// render from this array instead of each hardcoding its own copy, so clicking any
// row shows THAT item's real data instead of always the same hardcoded page.
//
// This is still sample/demo data (no backend exists yet, per the project brief),
// but centralizing it fixes: (1) every row linking to the same detail page,
// (2) mobile cards drifting out of sync with the desktop table, (3) the
// "ประเภท" column showing category names instead of actual equipment types.

var INVENTORY_ITEMS = [
  {
    code: 'IT-MOU-001', name: 'Wireless Mouse', brand: 'Logitech', model: 'M185',
    category: 'Peripheral', type: 'Mouse', unit: 'ชิ้น', icon: 'bi-mouse2', tone: 'primary',
    stock: 42, min: 10, status: 'available',
    location: 'อาคาร A ชั้น 2', assignedTo: 'สมชาย วิชัย', serial: 'FVFHP3X2Q1',
    purchase: { date: '15 มี.ค. 2567', price: '450 บาท', supplier: 'บจก. ไอที โซลูชัน', po: 'PO-2567-0142', warrantyYears: 1, warrantyEnd: '14 มี.ค. 2568' },
    movements: [
      { date: '13 ก.ย. 2569', type: 'receive', qty: 20, balance: 42, user: 'Admin', ref: 'RCV-2026-0142' },
      { date: '12 ก.ย. 2569', type: 'issue', qty: -5, balance: 22, user: 'กมล ศรีสุข (IT Support)', ref: 'ISS-2026-0311' },
      { date: '10 ก.ย. 2569', type: 'issue', qty: -2, balance: 27, user: 'วิชัย ทองดี (Sales)', ref: 'ISS-2026-0298' },
      { date: '5 ก.ย. 2569', type: 'return', qty: 1, balance: 29, user: 'กมล ศรีสุข', ref: 'RET-2026-0044' },
      { date: '1 ก.ย. 2569', type: 'receive', qty: 10, balance: 28, user: 'Admin', ref: 'RCV-2026-0098' }
    ]
  },
  {
    code: 'IT-KEY-001', name: 'Mechanical Keyboard', brand: 'Logitech', model: 'K380',
    category: 'Peripheral', type: 'Keyboard', unit: 'ชิ้น', icon: 'bi-keyboard', tone: 'primary',
    stock: 18, min: 10, status: 'available',
    location: 'คลังอุปกรณ์ IT', assignedTo: '-', serial: 'KB2024K380X',
    purchase: { date: '1 ส.ค. 2567', price: '890 บาท', supplier: 'บจก. ไอที โซลูชัน', po: 'PO-2567-0210', warrantyYears: 1, warrantyEnd: '31 ก.ค. 2568' },
    movements: [
      { date: '5 ก.ย. 2569', type: 'issue', qty: -2, balance: 18, user: 'ทีมบัญชี', ref: 'ISS-2026-0300' },
      { date: '1 ส.ค. 2569', type: 'receive', qty: 20, balance: 20, user: 'Admin', ref: 'RCV-2026-0071' }
    ]
  },
  {
    code: 'IT-LAN-001', name: 'LAN Cable Cat6', brand: '-', model: '-',
    category: 'Network', type: 'LAN Cable', unit: 'เมตร', icon: 'bi-hdd-network', tone: 'cyan',
    stock: 125, min: 50, status: 'available',
    location: 'คลังอุปกรณ์ IT', assignedTo: '-', serial: '-',
    purchase: { date: '8 ก.ย. 2569', price: '4,200 บาท/กล่อง', supplier: 'บจก. เน็ตเวิร์ค ซัพพลาย', po: 'PO-2569-0142', warrantyYears: null, warrantyEnd: null },
    movements: [
      { date: '8 ก.ย. 2569', type: 'issue', qty: -180, balance: 125, user: 'ทีม IT (เดินสายชั้น 3)', ref: 'ISS-2026-0320' },
      { date: '1 ก.ย. 2569', type: 'receive', qty: 305, balance: 305, user: 'Admin', ref: 'RCV-2026-0142', note: '1 กล่อง = 305 เมตร' }
    ]
  },
  {
    code: 'IT-SSD-001', name: 'SSD M.2 1TB', brand: 'Samsung', model: '970 EVO',
    category: 'Storage', type: 'SSD', unit: 'ชิ้น', icon: 'bi-hdd', tone: 'purple',
    stock: 4, min: 5, status: 'low',
    location: 'คลังอุปกรณ์ IT', assignedTo: '-', serial: '-',
    purchase: { date: '20 ก.ค. 2567', price: '2,590 บาท', supplier: 'บจก. คอมพิวเตอร์ พาร์ท', po: 'PO-2567-0188', warrantyYears: 5, warrantyEnd: '19 ก.ค. 2572' },
    movements: [
      { date: '9 ก.ย. 2569', type: 'issue', qty: -6, balance: 4, user: 'ทีม IT (อัปเกรดเครื่อง)', ref: 'ISS-2026-0315' },
      { date: '20 ก.ค. 2569', type: 'receive', qty: 10, balance: 10, user: 'Admin', ref: 'RCV-2026-0055' }
    ]
  },
  {
    code: 'IT-RAM-001', name: 'RAM DDR4 16GB', brand: 'Kingston', model: 'Fury',
    category: 'Storage', type: 'RAM', unit: 'ชิ้น', icon: 'bi-cpu', tone: 'purple',
    stock: 28, min: 10, status: 'available',
    location: 'คลังอุปกรณ์ IT', assignedTo: '-', serial: '-',
    purchase: { date: '13 ก.ย. 2569', price: '1,190 บาท', supplier: 'บจก. คอมพิวเตอร์ พาร์ท', po: 'PO-2569-0143', warrantyYears: 3, warrantyEnd: '12 ก.ย. 2572' },
    movements: [
      { date: '13 ก.ย. 2569', type: 'receive', qty: 20, balance: 28, user: 'Admin', ref: 'RCV-2026-0143' },
      { date: '2 ก.ย. 2569', type: 'issue', qty: -12, balance: 8, user: 'ทีม IT (อัปเกรดเครื่อง)', ref: 'ISS-2026-0305' },
      { date: '1 ส.ค. 2569', type: 'receive', qty: 20, balance: 20, user: 'Admin', ref: 'RCV-2026-0072' }
    ]
  },
  {
    code: 'IT-SW-001', name: 'Switch 24-Port', brand: 'TP-Link', model: 'TL-SG1024',
    category: 'Network', type: 'Switch', unit: 'ชิ้น', icon: 'bi-diagram-3', tone: 'cyan',
    stock: 6, min: 5, status: 'available',
    location: 'ห้อง Server', assignedTo: '-', serial: '-',
    purchase: { date: '10 มิ.ย. 2567', price: '8,900 บาท', supplier: 'บจก. เน็ตเวิร์ค ซัพพลาย', po: 'PO-2567-0155', warrantyYears: 5, warrantyEnd: '9 มิ.ย. 2572' },
    movements: [
      { date: '3 ก.ย. 2569', type: 'issue', qty: -2, balance: 6, user: 'ทีม IT (ขยายเครือข่ายชั้น 2)', ref: 'ISS-2026-0308' },
      { date: '10 มิ.ย. 2569', type: 'receive', qty: 8, balance: 8, user: 'Admin', ref: 'RCV-2026-0031' }
    ]
  },
  {
    code: 'IT-PSU-001', name: 'Power Supply 650W', brand: 'Corsair', model: 'CV650',
    category: 'Power', type: 'Power Supply', unit: 'ชิ้น', icon: 'bi-lightning-charge', tone: 'orange',
    stock: 3, min: 5, status: 'low',
    location: 'คลังอุปกรณ์ IT', assignedTo: '-', serial: '-',
    purchase: { date: '5 พ.ค. 2567', price: '2,100 บาท', supplier: 'บจก. คอมพิวเตอร์ พาร์ท', po: 'PO-2567-0120', warrantyYears: 5, warrantyEnd: '4 พ.ค. 2572' },
    movements: [
      { date: '11 ก.ย. 2569', type: 'issue', qty: -7, balance: 3, user: 'ทีม IT (ซ่อมเครื่อง)', ref: 'ISS-2026-0318' },
      { date: '5 พ.ค. 2569', type: 'receive', qty: 10, balance: 10, user: 'Admin', ref: 'RCV-2026-0022' }
    ]
  },
  {
    code: 'IT-UPS-001', name: 'UPS 1000VA', brand: 'APC', model: 'BX1000',
    category: 'Power', type: 'UPS', unit: 'ชิ้น', icon: 'bi-battery-charging', tone: 'orange',
    stock: 0, min: 3, status: 'out',
    location: 'คลังอุปกรณ์ IT', assignedTo: '-', serial: '-',
    purchase: { date: '2 เม.ย. 2567', price: '6,500 บาท', supplier: 'บจก. คอมพิวเตอร์ พาร์ท', po: 'PO-2567-0098', warrantyYears: 2, warrantyEnd: '1 เม.ย. 2569' },
    movements: [
      { date: '7 ก.ย. 2569', type: 'issue', qty: -5, balance: 0, user: 'ทีม IT (ห้อง Server)', ref: 'ISS-2026-0312' },
      { date: '2 เม.ย. 2569', type: 'receive', qty: 5, balance: 5, user: 'Admin', ref: 'RCV-2026-0015' }
    ]
  },
  {
    code: 'IT-HDMI-001', name: 'HDMI Cable 2m', brand: '-', model: '-',
    category: 'Cable', type: 'HDMI Cable', unit: 'เส้น', icon: 'bi-display', tone: 'teal',
    stock: 62, min: 20, status: 'available',
    location: 'คลังอุปกรณ์ IT', assignedTo: '-', serial: '-',
    purchase: { date: '1 ก.ย. 2569', price: '150 บาท', supplier: 'บจก. ไอที โซลูชัน', po: 'PO-2569-0140', warrantyYears: null, warrantyEnd: null },
    movements: [
      { date: '6 ก.ย. 2569', type: 'issue', qty: -18, balance: 62, user: 'ทีม IT (ห้องประชุม)', ref: 'ISS-2026-0309' },
      { date: '1 ก.ย. 2569', type: 'receive', qty: 80, balance: 80, user: 'Admin', ref: 'RCV-2026-0138' }
    ]
  },
  {
    code: 'IT-RJ45-001', name: 'RJ45 Connector', brand: '-', model: '-',
    category: 'Network', type: 'RJ45 / Connector', unit: 'กล่อง', icon: 'bi-plug', tone: 'success',
    stock: 7, min: 5, status: 'low',
    location: 'คลังอุปกรณ์ IT', assignedTo: '-', serial: '-',
    purchase: { date: '4 ก.ย. 2569', price: '350 บาท/กล่อง', supplier: 'บจก. เน็ตเวิร์ค ซัพพลาย', po: 'PO-2569-0141', warrantyYears: null, warrantyEnd: null },
    movements: [
      { date: '9 ก.ย. 2569', type: 'issue', qty: -3, balance: 7, user: 'ทีม IT (เดินสายชั้น 3)', ref: 'ISS-2026-0316', note: '1 กล่อง = 100 ชิ้น' },
      { date: '4 ก.ย. 2569', type: 'receive', qty: 10, balance: 10, user: 'Admin', ref: 'RCV-2026-0140', note: '1 กล่อง = 100 ชิ้น' }
    ]
  }
];

var STATUS_META = {
  available: { badge: 'success', label: 'พร้อมใช้งาน' },
  low: { badge: 'warning', label: 'ใกล้หมด' },
  out: { badge: 'danger', label: 'หมดสต๊อก' }
};

var TONE_META = {
  primary: { bg: 'var(--color-primary-light)', fg: 'var(--color-primary)' },
  cyan: { bg: 'var(--color-cyan-light)', fg: 'var(--color-cyan)' },
  purple: { bg: 'var(--color-purple-light)', fg: 'var(--color-purple)' },
  orange: { bg: 'var(--color-orange-light)', fg: 'var(--color-orange)' },
  teal: { bg: 'var(--color-teal-light)', fg: 'var(--color-teal)' },
  success: { bg: 'var(--color-success-bg)', fg: 'var(--color-success)' }
};

function findInventoryItem(code) {
  for (var i = 0; i < INVENTORY_ITEMS.length; i++) {
    if (INVENTORY_ITEMS[i].code === code) return INVENTORY_ITEMS[i];
  }
  return null;
}

var MOVEMENT_META = {
  receive: { badge: 'success', label: 'รับเข้า' },
  issue: { badge: 'danger', label: 'เบิก' },
  return: { badge: 'neutral', label: 'คืน', dotColor: 'var(--color-primary)' },
  adjust: { badge: 'neutral', label: 'ปรับปรุง', dotColor: 'var(--color-purple)' }
};
