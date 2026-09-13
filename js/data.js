// IT Inventory — shared sample catalog (single source of truth for the demo data).
//
// DATA MODEL (built around the two things this system exists to answer):
//
//   1. "อุปกรณ์ชิ้นนี้ถูกนำไปใช้ที่ไหน"  -> item.deployments[]
//   2. "ของชิ้นนี้รับเข้ามาจาก PO ไหน"   -> item.lots[]  (for warranty claims)
//
// Each RECEIPT creates a lot carrying its PO number, supplier and warranty end.
// Each ISSUE/BORROW records which lot it drew from, so any unit sitting on a
// user's desk can be traced back to the PO it arrived on.
//
// เบิก (issue)  = ตัดออกถาวร, ไม่คาดว่าจะได้คืน (consumed / given away)
// ยืม (borrow) = ออกไปชั่วคราว, มีกำหนดคืน, คืนกลับเข้าสต๊อกได้
//
// `image` is optional: drop a photo at assets/items/<CODE>.jpg and set it here.
// The UI falls back to the coloured category icon when there is no photo yet.

var INVENTORY_ITEMS = [
  {
    code: 'IT-MOU-001', name: 'Wireless Mouse', brand: 'Logitech', model: 'M185',
    category: 'Peripheral', type: 'Mouse', unit: 'ชิ้น', icon: 'bi-mouse2', tone: 'primary',
    image: null,
    stock: 42, min: 10, status: 'available',
    lots: [
      { lotRef: 'LOT-2569-0142', poRef: 'PO-2569-0142', date: '13 ก.ย. 2569', qty: 20, supplier: 'บจก. ไอที โซลูชัน', unitPrice: '450 บาท', warrantyEnd: '12 ก.ย. 2570' },
      { lotRef: 'LOT-2567-0142', poRef: 'PO-2567-0142', date: '15 มี.ค. 2567', qty: 30, supplier: 'บจก. ไอที โซลูชัน', unitPrice: '430 บาท', warrantyEnd: '14 มี.ค. 2568' }
    ],
    deployments: [
      { kind: 'issue', holder: 'สมชาย วิชัย', dept: 'IT', location: 'อาคาร A ชั้น 2', qty: 1, since: '12 ก.ย. 2569', txRef: 'ISS-2026-0311', lotRef: 'LOT-2567-0142' },
      { kind: 'issue', holder: 'วิชัย ทองดี', dept: 'Sales', location: 'อาคาร B ชั้น 1', qty: 2, since: '10 ก.ย. 2569', txRef: 'ISS-2026-0298', lotRef: 'LOT-2567-0142' },
      { kind: 'borrow', holder: 'กมล ศรีสุข', dept: 'IT Support', location: 'ห้องประชุม 2', qty: 2, since: '12 ก.ย. 2569', due: '19 ก.ย. 2569', txRef: 'BRW-2026-0042', lotRef: 'LOT-2569-0142' }
    ],
    movements: [
      { date: '13 ก.ย. 2569', type: 'receive', qty: 20, balance: 42, user: 'Admin', ref: 'RCV-2026-0142', lotRef: 'LOT-2569-0142' },
      { date: '12 ก.ย. 2569', type: 'borrow', qty: -2, balance: 22, user: 'กมล ศรีสุข (IT Support)', ref: 'BRW-2026-0042' },
      { date: '12 ก.ย. 2569', type: 'issue', qty: -3, balance: 24, user: 'กมล ศรีสุข (IT Support)', ref: 'ISS-2026-0311' },
      { date: '10 ก.ย. 2569', type: 'issue', qty: -2, balance: 27, user: 'วิชัย ทองดี (Sales)', ref: 'ISS-2026-0298' },
      { date: '5 ก.ย. 2569', type: 'return', qty: 1, balance: 29, user: 'กมล ศรีสุข', ref: 'RET-2026-0044' },
      { date: '1 ก.ย. 2569', type: 'receive', qty: 10, balance: 28, user: 'Admin', ref: 'RCV-2026-0098', lotRef: 'LOT-2567-0142' }
    ]
  },
  {
    code: 'IT-KEY-001', name: 'Mechanical Keyboard', brand: 'Logitech', model: 'K380',
    category: 'Peripheral', type: 'Keyboard', unit: 'ชิ้น', icon: 'bi-keyboard', tone: 'primary',
    image: null,
    stock: 18, min: 10, status: 'available',
    lots: [
      { lotRef: 'LOT-2569-0071', poRef: 'PO-2567-0210', date: '1 ส.ค. 2569', qty: 20, supplier: 'บจก. ไอที โซลูชัน', unitPrice: '890 บาท', warrantyEnd: '31 ก.ค. 2570' }
    ],
    deployments: [
      { kind: 'issue', holder: 'ทีมบัญชี', dept: 'บัญชี', location: 'อาคาร A ชั้น 3', qty: 2, since: '5 ก.ย. 2569', txRef: 'ISS-2026-0300', lotRef: 'LOT-2569-0071' }
    ],
    movements: [
      { date: '5 ก.ย. 2569', type: 'issue', qty: -2, balance: 18, user: 'ทีมบัญชี', ref: 'ISS-2026-0300' },
      { date: '1 ส.ค. 2569', type: 'receive', qty: 20, balance: 20, user: 'Admin', ref: 'RCV-2026-0071', lotRef: 'LOT-2569-0071' }
    ]
  },
  {
    code: 'IT-LAN-001', name: 'LAN Cable Cat6', brand: '-', model: '-',
    category: 'Network', type: 'LAN Cable', unit: 'เมตร', icon: 'bi-hdd-network', tone: 'cyan',
    image: null,
    stock: 125, min: 50, status: 'available',
    recvUnit: 'กล่อง', recvFactor: 305,
    lots: [
      { lotRef: 'LOT-2569-0142N', poRef: 'PO-2569-0142', date: '1 ก.ย. 2569', qty: 305, supplier: 'บจก. เน็ตเวิร์ค ซัพพลาย', unitPrice: '4,200 บาท/กล่อง', warrantyEnd: null }
    ],
    deployments: [
      { kind: 'issue', holder: 'ทีม IT', dept: 'IT', location: 'เดินสายอาคาร A ชั้น 3', qty: 180, since: '8 ก.ย. 2569', txRef: 'ISS-2026-0320', lotRef: 'LOT-2569-0142N' }
    ],
    movements: [
      { date: '8 ก.ย. 2569', type: 'issue', qty: -180, balance: 125, user: 'ทีม IT (เดินสายชั้น 3)', ref: 'ISS-2026-0320' },
      { date: '1 ก.ย. 2569', type: 'receive', qty: 305, balance: 305, user: 'Admin', ref: 'RCV-2026-0142', lotRef: 'LOT-2569-0142N', note: '1 กล่อง = 305 เมตร' }
    ]
  },
  {
    code: 'IT-SSD-001', name: 'SSD M.2 1TB', brand: 'Samsung', model: '970 EVO',
    category: 'Storage', type: 'SSD', unit: 'ชิ้น', icon: 'bi-hdd', tone: 'purple',
    image: null,
    stock: 4, min: 5, status: 'low',
    lots: [
      { lotRef: 'LOT-2569-0055', poRef: 'PO-2567-0188', date: '20 ก.ค. 2569', qty: 10, supplier: 'บจก. คอมพิวเตอร์ พาร์ท', unitPrice: '2,590 บาท', warrantyEnd: '19 ก.ค. 2574' }
    ],
    deployments: [
      { kind: 'issue', holder: 'ทีม IT (อัปเกรดเครื่อง)', dept: 'IT', location: 'อาคาร A ชั้น 2', qty: 4, since: '9 ก.ย. 2569', txRef: 'ISS-2026-0315', lotRef: 'LOT-2569-0055' },
      { kind: 'issue', holder: 'ห้อง Server', dept: 'IT', location: 'ห้อง Server', qty: 2, since: '9 ก.ย. 2569', txRef: 'ISS-2026-0315', lotRef: 'LOT-2569-0055' }
    ],
    movements: [
      { date: '9 ก.ย. 2569', type: 'issue', qty: -6, balance: 4, user: 'ทีม IT (อัปเกรดเครื่อง)', ref: 'ISS-2026-0315' },
      { date: '20 ก.ค. 2569', type: 'receive', qty: 10, balance: 10, user: 'Admin', ref: 'RCV-2026-0055', lotRef: 'LOT-2569-0055' }
    ]
  },
  {
    code: 'IT-RAM-001', name: 'RAM DDR4 16GB', brand: 'Kingston', model: 'Fury',
    category: 'Storage', type: 'RAM', unit: 'ชิ้น', icon: 'bi-cpu', tone: 'purple',
    image: null,
    stock: 28, min: 10, status: 'available',
    lots: [
      { lotRef: 'LOT-2569-0143', poRef: 'PO-2569-0143', date: '13 ก.ย. 2569', qty: 20, supplier: 'บจก. คอมพิวเตอร์ พาร์ท', unitPrice: '1,190 บาท', warrantyEnd: '12 ก.ย. 2574' },
      { lotRef: 'LOT-2569-0072', poRef: 'PO-2569-0072', date: '1 ส.ค. 2569', qty: 20, supplier: 'บจก. คอมพิวเตอร์ พาร์ท', unitPrice: '1,150 บาท', warrantyEnd: '31 ก.ค. 2574' }
    ],
    deployments: [
      { kind: 'issue', holder: 'ทีม IT (อัปเกรดเครื่อง)', dept: 'IT', location: 'อาคาร A ชั้น 1-2', qty: 12, since: '2 ก.ย. 2569', txRef: 'ISS-2026-0305', lotRef: 'LOT-2569-0072' }
    ],
    movements: [
      { date: '13 ก.ย. 2569', type: 'receive', qty: 20, balance: 28, user: 'Admin', ref: 'RCV-2026-0143', lotRef: 'LOT-2569-0143' },
      { date: '2 ก.ย. 2569', type: 'issue', qty: -12, balance: 8, user: 'ทีม IT (อัปเกรดเครื่อง)', ref: 'ISS-2026-0305' },
      { date: '1 ส.ค. 2569', type: 'receive', qty: 20, balance: 20, user: 'Admin', ref: 'RCV-2026-0072', lotRef: 'LOT-2569-0072' }
    ]
  },
  {
    code: 'IT-SW-001', name: 'Switch 24-Port', brand: 'TP-Link', model: 'TL-SG1024',
    category: 'Network', type: 'Switch', unit: 'ชิ้น', icon: 'bi-diagram-3', tone: 'cyan',
    image: null,
    stock: 6, min: 5, status: 'available',
    lots: [
      { lotRef: 'LOT-2569-0031', poRef: 'PO-2567-0155', date: '10 มิ.ย. 2569', qty: 8, supplier: 'บจก. เน็ตเวิร์ค ซัพพลาย', unitPrice: '8,900 บาท', warrantyEnd: '9 มิ.ย. 2574' }
    ],
    deployments: [
      { kind: 'issue', holder: 'ตู้ Rack ชั้น 2', dept: 'IT', location: 'อาคาร A ชั้น 2', qty: 1, since: '3 ก.ย. 2569', txRef: 'ISS-2026-0308', lotRef: 'LOT-2569-0031' },
      { kind: 'issue', holder: 'ตู้ Rack ชั้น 3', dept: 'IT', location: 'อาคาร A ชั้น 3', qty: 1, since: '3 ก.ย. 2569', txRef: 'ISS-2026-0308', lotRef: 'LOT-2569-0031' }
    ],
    movements: [
      { date: '3 ก.ย. 2569', type: 'issue', qty: -2, balance: 6, user: 'ทีม IT (ขยายเครือข่ายชั้น 2)', ref: 'ISS-2026-0308' },
      { date: '10 มิ.ย. 2569', type: 'receive', qty: 8, balance: 8, user: 'Admin', ref: 'RCV-2026-0031', lotRef: 'LOT-2569-0031' }
    ]
  },
  {
    code: 'IT-PSU-001', name: 'Power Supply 650W', brand: 'Corsair', model: 'CV650',
    category: 'Power', type: 'Power Supply', unit: 'ชิ้น', icon: 'bi-lightning-charge', tone: 'orange',
    image: null,
    stock: 3, min: 5, status: 'low',
    lots: [
      { lotRef: 'LOT-2569-0022', poRef: 'PO-2567-0120', date: '5 พ.ค. 2569', qty: 10, supplier: 'บจก. คอมพิวเตอร์ พาร์ท', unitPrice: '2,100 บาท', warrantyEnd: '4 พ.ค. 2574' }
    ],
    deployments: [
      { kind: 'issue', holder: 'ทีม IT (ซ่อมเครื่อง)', dept: 'IT', location: 'อาคาร A ชั้น 1', qty: 7, since: '11 ก.ย. 2569', txRef: 'ISS-2026-0318', lotRef: 'LOT-2569-0022' }
    ],
    movements: [
      { date: '11 ก.ย. 2569', type: 'issue', qty: -7, balance: 3, user: 'ทีม IT (ซ่อมเครื่อง)', ref: 'ISS-2026-0318' },
      { date: '5 พ.ค. 2569', type: 'receive', qty: 10, balance: 10, user: 'Admin', ref: 'RCV-2026-0022', lotRef: 'LOT-2569-0022' }
    ]
  },
  {
    code: 'IT-UPS-001', name: 'UPS 1000VA', brand: 'APC', model: 'BX1000',
    category: 'Power', type: 'UPS', unit: 'ชิ้น', icon: 'bi-battery-charging', tone: 'orange',
    image: null,
    stock: 0, min: 3, status: 'out',
    lots: [
      { lotRef: 'LOT-2569-0015', poRef: 'PO-2567-0098', date: '2 เม.ย. 2569', qty: 5, supplier: 'บจก. คอมพิวเตอร์ พาร์ท', unitPrice: '6,500 บาท', warrantyEnd: '1 เม.ย. 2571' }
    ],
    deployments: [
      { kind: 'issue', holder: 'ห้อง Server', dept: 'IT', location: 'ห้อง Server', qty: 3, since: '7 ก.ย. 2569', txRef: 'ISS-2026-0312', lotRef: 'LOT-2569-0015' },
      { kind: 'issue', holder: 'ตู้ Rack ชั้น 2', dept: 'IT', location: 'อาคาร A ชั้น 2', qty: 2, since: '7 ก.ย. 2569', txRef: 'ISS-2026-0312', lotRef: 'LOT-2569-0015' }
    ],
    movements: [
      { date: '7 ก.ย. 2569', type: 'issue', qty: -5, balance: 0, user: 'ทีม IT (ห้อง Server)', ref: 'ISS-2026-0312' },
      { date: '2 เม.ย. 2569', type: 'receive', qty: 5, balance: 5, user: 'Admin', ref: 'RCV-2026-0015', lotRef: 'LOT-2569-0015' }
    ]
  },
  {
    code: 'IT-HDMI-001', name: 'HDMI Cable 2m', brand: '-', model: '-',
    category: 'Cable', type: 'HDMI Cable', unit: 'เส้น', icon: 'bi-display', tone: 'teal',
    image: null,
    stock: 62, min: 20, status: 'available',
    lots: [
      { lotRef: 'LOT-2569-0138', poRef: 'PO-2569-0140', date: '1 ก.ย. 2569', qty: 80, supplier: 'บจก. ไอที โซลูชัน', unitPrice: '150 บาท', warrantyEnd: null }
    ],
    deployments: [
      { kind: 'issue', holder: 'ห้องประชุมใหญ่', dept: 'Admin', location: 'อาคาร A ชั้น 4', qty: 12, since: '6 ก.ย. 2569', txRef: 'ISS-2026-0309', lotRef: 'LOT-2569-0138' },
      { kind: 'borrow', holder: 'ฝ่ายการตลาด', dept: 'Marketing', location: 'ห้องประชุม 1', qty: 6, since: '6 ก.ย. 2569', due: '20 ก.ย. 2569', txRef: 'BRW-2026-0039', lotRef: 'LOT-2569-0138' }
    ],
    movements: [
      { date: '6 ก.ย. 2569', type: 'borrow', qty: -6, balance: 62, user: 'ฝ่ายการตลาด', ref: 'BRW-2026-0039' },
      { date: '6 ก.ย. 2569', type: 'issue', qty: -12, balance: 68, user: 'ทีม IT (ห้องประชุม)', ref: 'ISS-2026-0309' },
      { date: '1 ก.ย. 2569', type: 'receive', qty: 80, balance: 80, user: 'Admin', ref: 'RCV-2026-0138', lotRef: 'LOT-2569-0138' }
    ]
  },
  {
    code: 'IT-RJ45-001', name: 'RJ45 Connector', brand: '-', model: '-',
    category: 'Network', type: 'RJ45 / Connector', unit: 'ชิ้น', icon: 'bi-plug', tone: 'success',
    image: null,
    stock: 700, min: 500, status: 'low',
    recvUnit: 'กล่อง', recvFactor: 100,
    lots: [
      { lotRef: 'LOT-2569-0140', poRef: 'PO-2569-0141', date: '4 ก.ย. 2569', qty: 1000, supplier: 'บจก. เน็ตเวิร์ค ซัพพลาย', unitPrice: '350 บาท/กล่อง', warrantyEnd: null }
    ],
    deployments: [
      { kind: 'issue', holder: 'ทีม IT', dept: 'IT', location: 'เดินสายอาคาร A ชั้น 3', qty: 300, since: '9 ก.ย. 2569', txRef: 'ISS-2026-0316', lotRef: 'LOT-2569-0140' }
    ],
    movements: [
      { date: '9 ก.ย. 2569', type: 'issue', qty: -300, balance: 700, user: 'ทีม IT (เดินสายชั้น 3)', ref: 'ISS-2026-0316', note: '3 กล่อง' },
      { date: '4 ก.ย. 2569', type: 'receive', qty: 1000, balance: 1000, user: 'Admin', ref: 'RCV-2026-0140', lotRef: 'LOT-2569-0140', note: '10 กล่อง (1 กล่อง = 100 ชิ้น)' }
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

// เบิก ตัดออกถาวร / ยืม ออกไปชั่วคราวแล้วคืนกลับเข้าสต๊อก
var MOVEMENT_META = {
  receive: { badge: 'success', label: 'รับเข้า' },
  issue: { badge: 'danger', label: 'เบิก' },
  borrow: { badge: 'warning', label: 'ยืม' },
  return: { badge: 'neutral', label: 'คืน', dotColor: 'var(--color-primary)' },
  adjust: { badge: 'neutral', label: 'ปรับปรุง', dotColor: 'var(--color-purple)' }
};

var DEPLOY_META = {
  issue: { badge: 'danger', label: 'เบิกถาวร' },
  borrow: { badge: 'warning', label: 'ยืม' }
};

function findInventoryItem(code) {
  for (var i = 0; i < INVENTORY_ITEMS.length; i++) {
    if (INVENTORY_ITEMS[i].code === code) return INVENTORY_ITEMS[i];
  }
  return null;
}

function findLot(item, lotRef) {
  if (!item || !item.lots) return null;
  for (var i = 0; i < item.lots.length; i++) {
    if (item.lots[i].lotRef === lotRef) return item.lots[i];
  }
  return null;
}

// Every outstanding ยืม across the catalog — this is what คืนอุปกรณ์ searches,
// because เบิก is a permanent deduction and has nothing to return.
function outstandingLoans() {
  var loans = [];
  INVENTORY_ITEMS.forEach(function (item) {
    (item.deployments || []).forEach(function (d) {
      if (d.kind === 'borrow') {
        loans.push({ item: item, dep: d });
      }
    });
  });
  return loans;
}

// Renders a product photo when one exists, otherwise the coloured category icon.
// size: css length for the square (e.g. '34px').
function itemThumbHtml(item, size, fontSize) {
  var tone = TONE_META[item.tone] || TONE_META.primary;
  var box = 'width:' + size + ';height:' + size + ';';
  if (item.image) {
    return '<div class="item-thumb" style="' + box + '">' +
             '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy" ' +
             'onerror="this.parentNode.innerHTML=\'<span class=&quot;item-thumb__fallback&quot; style=&quot;background:' + tone.bg + ';color:' + tone.fg + '&quot;><i class=&quot;bi ' + item.icon + '&quot;></i></span>\'">' +
           '</div>';
  }
  return '<div class="item-icon-box" style="' + box + 'font-size:' + (fontSize || '15px') + ';background:' + tone.bg + ';color:' + tone.fg + '">' +
           '<i class="bi ' + item.icon + '"></i></div>';
}
