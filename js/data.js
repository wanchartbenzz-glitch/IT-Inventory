// IT Inventory — shared sample catalog (single source of truth for the demo data).
//
// DATA MODEL (built around the two things this system exists to answer):
//
//   1. "อุปกรณ์ชิ้นนี้ถูกนำไปใช้ที่ไหน"  -> item.deployments[]
//   2. "ของชิ้นนี้รับเข้ามาจาก PO ไหน"   -> item.lots[]  (for warranty claims)
//
// Each RECEIPT creates a lot carrying its PO number, supplier, unit price and
// warranty end. Each ISSUE/BORROW records which lot it drew from, so any unit
// sitting on a user's desk can be traced back to the PO it arrived on.
//
// เบิก (issue)  = ตัดออกถาวร, ไม่คาดว่าจะได้คืน (consumed / given away)
// ยืม (borrow) = ออกไปชั่วคราว, มีกำหนดคืน, คืนกลับเข้าสต๊อกได้
//
// INVARIANT: sum(item.lots[].remaining) === item.stock
//   `remaining` is the authoritative "ยังเหลือในสต๊อกจากล็อตนี้" figure and is what
//   the lot pickers offer. Lot `qty` is the original receipt size — it does not
//   reconcile against deployments, because returns and adjustments happen in between.
//
// SERIALISED ITEMS (item.serialized === true) track individual units:
//   lot.serials[]        = serials from that lot still sitting in stock
//   deployment.serials[] = serials handed out, so a claim can name the exact unit
//   Non-serialised items (cables, connectors) track quantity only.
//
// `image` is optional: drop a photo at assets/items/<CODE>.jpg and set it here.
// The UI falls back to the coloured category icon when there is no photo yet.

var INVENTORY_ITEMS = [
  {
    code: 'IT-MOU-001', name: 'Wireless Mouse', brand: 'Logitech', model: 'M185',
    category: 'Peripheral', type: 'Mouse', unit: 'ชิ้น', icon: 'bi-mouse2', tone: 'primary',
    image: null, serialized: false,
    stock: 42, min: 10, status: 'available',
    lots: [
      { lotRef: 'LOT-2569-0142', poRef: 'PO-2569-0142', date: '13 ก.ย. 2569', qty: 20, remaining: 18, supplier: 'บจก. ไอที โซลูชัน', unitPrice: '450 บาท', warrantyEnd: '12 ก.ย. 2570' },
      { lotRef: 'LOT-2567-0142', poRef: 'PO-2567-0142', date: '15 มี.ค. 2567', qty: 30, remaining: 24, supplier: 'บจก. ไอที โซลูชัน', unitPrice: '430 บาท', warrantyEnd: '14 มี.ค. 2568' }
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
    image: null, serialized: false,
    stock: 16, min: 10, status: 'available',
    lots: [
      { lotRef: 'LOT-2569-0071', poRef: 'PO-2567-0210', date: '1 ส.ค. 2569', qty: 20, remaining: 16, supplier: 'บจก. ไอที โซลูชัน', unitPrice: '890 บาท', warrantyEnd: '31 ก.ค. 2570' }
    ],
    deployments: [
      { kind: 'issue', holder: 'ทีมบัญชี', dept: 'บัญชี', location: 'อาคาร A ชั้น 3', qty: 2, since: '5 ก.ย. 2569', txRef: 'ISS-2026-0300', lotRef: 'LOT-2569-0071' },
      { kind: 'borrow', holder: 'ฝ่ายขาย', dept: 'Sales', location: 'อาคาร B ชั้น 1', qty: 2, since: '29 ส.ค. 2569', due: '5 ก.ย. 2569', txRef: 'BRW-2026-0035', lotRef: 'LOT-2569-0071' }
    ],
    movements: [
      { date: '5 ก.ย. 2569', type: 'issue', qty: -2, balance: 16, user: 'ทีมบัญชี', ref: 'ISS-2026-0300' },
      { date: '29 ส.ค. 2569', type: 'borrow', qty: -2, balance: 18, user: 'ฝ่ายขาย', ref: 'BRW-2026-0035' },
      { date: '1 ส.ค. 2569', type: 'receive', qty: 20, balance: 20, user: 'Admin', ref: 'RCV-2026-0071', lotRef: 'LOT-2569-0071' }
    ]
  },
  {
    code: 'IT-LAN-001', name: 'LAN Cable Cat6', brand: '-', model: '-',
    category: 'Network', type: 'LAN Cable', unit: 'เมตร', icon: 'bi-hdd-network', tone: 'cyan',
    image: null, serialized: false,
    stock: 125, min: 50, status: 'available',
    recvUnit: 'กล่อง', recvFactor: 305,
    lots: [
      { lotRef: 'LOT-2569-0142N', poRef: 'PO-2569-0142', date: '1 ก.ย. 2569', qty: 305, remaining: 125, supplier: 'บจก. เน็ตเวิร์ค ซัพพลาย', unitPrice: '4,200 บาท/กล่อง', warrantyEnd: null }
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
    image: null, serialized: true,
    stock: 4, min: 5, status: 'low',
    lots: [
      {
        lotRef: 'LOT-2569-0055', poRef: 'PO-2567-0188', date: '20 ก.ค. 2569', qty: 10, remaining: 4,
        supplier: 'บจก. คอมพิวเตอร์ พาร์ท', unitPrice: '2,590 บาท', warrantyEnd: '19 ก.ค. 2574',
        serials: ['SN-SSD-0007', 'SN-SSD-0008', 'SN-SSD-0009', 'SN-SSD-0010']
      }
    ],
    deployments: [
      { kind: 'issue', holder: 'ทีม IT (อัปเกรดเครื่อง)', dept: 'IT', location: 'อาคาร A ชั้น 2', qty: 4, since: '9 ก.ย. 2569', txRef: 'ISS-2026-0315', lotRef: 'LOT-2569-0055', serials: ['SN-SSD-0001', 'SN-SSD-0002', 'SN-SSD-0003', 'SN-SSD-0004'] },
      { kind: 'issue', holder: 'ห้อง Server', dept: 'IT', location: 'ห้อง Server', qty: 2, since: '9 ก.ย. 2569', txRef: 'ISS-2026-0315', lotRef: 'LOT-2569-0055', serials: ['SN-SSD-0005', 'SN-SSD-0006'] }
    ],
    service: [
      { state: 'claim', serial: 'SN-SSD-0003', lotRef: 'LOT-2569-0055', since: '10 ก.ย. 2569', ref: 'CLM-2569-001', note: 'อ่านไม่เจอไดรฟ์ ส่งเคลมตามประกัน' }
    ],
    movements: [
      { date: '9 ก.ย. 2569', type: 'issue', qty: -6, balance: 4, user: 'ทีม IT (อัปเกรดเครื่อง)', ref: 'ISS-2026-0315' },
      { date: '20 ก.ค. 2569', type: 'receive', qty: 10, balance: 10, user: 'Admin', ref: 'RCV-2026-0055', lotRef: 'LOT-2569-0055' }
    ]
  },
  {
    code: 'IT-RAM-001', name: 'RAM DDR4 16GB', brand: 'Kingston', model: 'Fury',
    category: 'Storage', type: 'RAM', unit: 'ชิ้น', icon: 'bi-cpu', tone: 'purple',
    image: null, serialized: false,
    stock: 28, min: 10, status: 'available',
    lots: [
      { lotRef: 'LOT-2569-0143', poRef: 'PO-2569-0143', date: '13 ก.ย. 2569', qty: 20, remaining: 20, supplier: 'บจก. คอมพิวเตอร์ พาร์ท', unitPrice: '1,190 บาท', warrantyEnd: '12 ก.ย. 2574' },
      { lotRef: 'LOT-2569-0072', poRef: 'PO-2569-0072', date: '1 ส.ค. 2569', qty: 20, remaining: 8, supplier: 'บจก. คอมพิวเตอร์ พาร์ท', unitPrice: '1,150 บาท', warrantyEnd: '31 ก.ค. 2574' }
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
    image: null, serialized: true,
    stock: 5, min: 5, status: 'low',
    lots: [
      {
        lotRef: 'LOT-2569-0031', poRef: 'PO-2567-0155', date: '10 มิ.ย. 2569', qty: 8, remaining: 5,
        supplier: 'บจก. เน็ตเวิร์ค ซัพพลาย', unitPrice: '8,900 บาท', warrantyEnd: '9 มิ.ย. 2574',
        serials: ['SN-SW-0004', 'SN-SW-0005', 'SN-SW-0006', 'SN-SW-0007', 'SN-SW-0008']
      }
    ],
    deployments: [
      { kind: 'issue', holder: 'ตู้ Rack ชั้น 2', dept: 'IT', location: 'อาคาร A ชั้น 2', qty: 1, since: '3 ก.ย. 2569', txRef: 'ISS-2026-0308', lotRef: 'LOT-2569-0031', serials: ['SN-SW-0001'] },
      { kind: 'issue', holder: 'ตู้ Rack ชั้น 3', dept: 'IT', location: 'อาคาร A ชั้น 3', qty: 1, since: '3 ก.ย. 2569', txRef: 'ISS-2026-0308', lotRef: 'LOT-2569-0031', serials: ['SN-SW-0002'] },
      { kind: 'borrow', holder: 'ทีมติดตั้งสาขา', dept: 'IT', location: 'สาขารังสิต', qty: 1, since: '6 ก.ย. 2569', due: '13 ก.ย. 2569', txRef: 'BRW-2026-0040', lotRef: 'LOT-2569-0031', serials: ['SN-SW-0003'] }
    ],
    movements: [
      { date: '6 ก.ย. 2569', type: 'borrow', qty: -1, balance: 5, user: 'ทีมติดตั้งสาขา', ref: 'BRW-2026-0040' },
      { date: '3 ก.ย. 2569', type: 'issue', qty: -2, balance: 6, user: 'ทีม IT (ขยายเครือข่ายชั้น 2)', ref: 'ISS-2026-0308' },
      { date: '10 มิ.ย. 2569', type: 'receive', qty: 8, balance: 8, user: 'Admin', ref: 'RCV-2026-0031', lotRef: 'LOT-2569-0031' }
    ]
  },
  {
    code: 'IT-PSU-001', name: 'Power Supply 650W', brand: 'Corsair', model: 'CV650',
    category: 'Power', type: 'Power Supply', unit: 'ชิ้น', icon: 'bi-lightning-charge', tone: 'orange',
    image: null, serialized: true,
    stock: 3, min: 5, status: 'low',
    lots: [
      {
        lotRef: 'LOT-2569-0022', poRef: 'PO-2567-0120', date: '5 พ.ค. 2569', qty: 10, remaining: 3,
        supplier: 'บจก. คอมพิวเตอร์ พาร์ท', unitPrice: '2,100 บาท', warrantyEnd: '4 พ.ค. 2574',
        serials: ['SN-PSU-0008', 'SN-PSU-0009', 'SN-PSU-0010']
      }
    ],
    deployments: [
      { kind: 'issue', holder: 'ทีม IT (ซ่อมเครื่อง)', dept: 'IT', location: 'อาคาร A ชั้น 1', qty: 7, since: '11 ก.ย. 2569', txRef: 'ISS-2026-0318', lotRef: 'LOT-2569-0022', serials: ['SN-PSU-0001', 'SN-PSU-0002', 'SN-PSU-0003', 'SN-PSU-0004', 'SN-PSU-0005', 'SN-PSU-0006', 'SN-PSU-0007'] }
    ],
    service: [
      { state: 'disposed', serial: 'SN-PSU-0004', lotRef: 'LOT-2569-0022', since: '11 ก.ย. 2569', ref: 'DSP-2569-003', note: 'ไฟกระชากจนบอร์ดไหม้ หมดประกัน ตัดจำหน่าย' }
    ],
    movements: [
      { date: '11 ก.ย. 2569', type: 'issue', qty: -7, balance: 3, user: 'ทีม IT (ซ่อมเครื่อง)', ref: 'ISS-2026-0318' },
      { date: '5 พ.ค. 2569', type: 'receive', qty: 10, balance: 10, user: 'Admin', ref: 'RCV-2026-0022', lotRef: 'LOT-2569-0022' }
    ]
  },
  {
    code: 'IT-UPS-001', name: 'UPS 1000VA', brand: 'APC', model: 'BX1000',
    category: 'Power', type: 'UPS', unit: 'ชิ้น', icon: 'bi-battery-charging', tone: 'orange',
    image: null, serialized: true,
    stock: 0, min: 3, status: 'out',
    lots: [
      {
        lotRef: 'LOT-2569-0015', poRef: 'PO-2567-0098', date: '2 เม.ย. 2569', qty: 5, remaining: 0,
        supplier: 'บจก. คอมพิวเตอร์ พาร์ท', unitPrice: '6,500 บาท', warrantyEnd: '1 เม.ย. 2571',
        serials: []
      }
    ],
    deployments: [
      { kind: 'issue', holder: 'ห้อง Server', dept: 'IT', location: 'ห้อง Server', qty: 3, since: '7 ก.ย. 2569', txRef: 'ISS-2026-0312', lotRef: 'LOT-2569-0015', serials: ['SN-UPS-0001', 'SN-UPS-0002', 'SN-UPS-0003'] },
      { kind: 'issue', holder: 'ตู้ Rack ชั้น 2', dept: 'IT', location: 'อาคาร A ชั้น 2', qty: 2, since: '7 ก.ย. 2569', txRef: 'ISS-2026-0312', lotRef: 'LOT-2569-0015', serials: ['SN-UPS-0004', 'SN-UPS-0005'] }
    ],
    service: [
      { state: 'repair', serial: 'SN-UPS-0002', lotRef: 'LOT-2569-0015', since: '8 ก.ย. 2569', ref: 'REP-2569-007', note: 'แบตเตอรี่เสื่อม ไม่สำรองไฟ ส่งศูนย์บริการ' }
    ],
    movements: [
      { date: '7 ก.ย. 2569', type: 'issue', qty: -5, balance: 0, user: 'ทีม IT (ห้อง Server)', ref: 'ISS-2026-0312' },
      { date: '2 เม.ย. 2569', type: 'receive', qty: 5, balance: 5, user: 'Admin', ref: 'RCV-2026-0015', lotRef: 'LOT-2569-0015' }
    ]
  },
  {
    code: 'IT-HDMI-001', name: 'HDMI Cable 2m', brand: '-', model: '-',
    category: 'Cable', type: 'HDMI Cable', unit: 'เส้น', icon: 'bi-display', tone: 'teal',
    image: null, serialized: false,
    stock: 62, min: 20, status: 'available',
    lots: [
      { lotRef: 'LOT-2569-0138', poRef: 'PO-2569-0140', date: '1 ก.ย. 2569', qty: 80, remaining: 62, supplier: 'บจก. ไอที โซลูชัน', unitPrice: '150 บาท', warrantyEnd: null }
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
    image: null, serialized: false,
    stock: 700, min: 500, status: 'low',
    recvUnit: 'กล่อง', recvFactor: 100,
    lots: [
      { lotRef: 'LOT-2569-0140', poRef: 'PO-2569-0141', date: '4 ก.ย. 2569', qty: 1000, remaining: 700, supplier: 'บจก. เน็ตเวิร์ค ซัพพลาย', unitPrice: '350 บาท/กล่อง', warrantyEnd: null }
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
  adjust: { badge: 'neutral', label: 'ปรับปรุง', dotColor: 'var(--color-purple)' },
  repair: { badge: 'warning', label: 'ส่งซ่อม' },
  disposed: { badge: 'danger', label: 'ตัดจำหน่าย' }
};

var DEPLOY_META = {
  issue: { badge: 'danger', label: 'เบิกถาวร' },
  borrow: { badge: 'warning', label: 'ยืม' }
};

// สถานะของอุปกรณ์ที่ไม่ได้อยู่ในสภาพใช้งานปกติ
var SERVICE_META = {
  repair: { badge: 'warning', label: 'ส่งซ่อม', icon: 'bi-tools' },
  claim: { badge: 'primary', label: 'ส่งเคลม', icon: 'bi-shield-check' },
  damaged: { badge: 'danger', label: 'ชำรุด', icon: 'bi-exclamation-octagon' },
  disposed: { badge: 'neutral', label: 'ตัดจำหน่าย', icon: 'bi-trash3' }
};

var CLAIM_META = {
  open: { badge: 'warning', label: 'รอส่งเคลม' },
  sent: { badge: 'primary', label: 'ส่งเคลมแล้ว' },
  returned: { badge: 'success', label: 'ได้รับคืนแล้ว' },
  rejected: { badge: 'danger', label: 'เคลมไม่ผ่าน' }
};

// ---------------------------------------------------------------------------
// ประวัติการส่งเคลม — ผูกกับ lot/PO เพื่อให้อ้างอิงใบสั่งซื้อและประกันได้
// ---------------------------------------------------------------------------
var CLAIMS = [
  {
    claimRef: 'CLM-2569-001', code: 'IT-SSD-001', serial: 'SN-SSD-0003',
    lotRef: 'LOT-2569-0055', poRef: 'PO-2567-0188', supplier: 'บจก. คอมพิวเตอร์ พาร์ท',
    qty: 1, opened: '10 ก.ย. 2569', status: 'sent', warrantyEnd: '19 ก.ค. 2574',
    issue: 'เครื่องอ่านไม่เจอไดรฟ์ ทดสอบกับเครื่องอื่นแล้วไม่ขึ้น',
    by: 'กมล ศรีสุข', note: 'ส่งของให้ผู้จำหน่ายแล้ว รอผลตรวจสอบ', closed: null
  },
  {
    claimRef: 'CLM-2569-002', code: 'IT-UPS-001', serial: 'SN-UPS-0002',
    lotRef: 'LOT-2569-0015', poRef: 'PO-2567-0098', supplier: 'บจก. คอมพิวเตอร์ พาร์ท',
    qty: 1, opened: '8 ก.ย. 2569', status: 'returned', warrantyEnd: '1 เม.ย. 2571',
    issue: 'แบตเตอรี่เสื่อม ไฟดับแล้วไม่สำรองไฟ',
    by: 'สมชาย วิชัย', note: 'ผู้จำหน่ายเปลี่ยนแบตเตอรี่ให้ใหม่ รับของคืนแล้ว', closed: '12 ก.ย. 2569'
  },
  {
    claimRef: 'CLM-2569-003', code: 'IT-PSU-001', serial: 'SN-PSU-0004',
    lotRef: 'LOT-2569-0022', poRef: 'PO-2567-0120', supplier: 'บจก. คอมพิวเตอร์ พาร์ท',
    qty: 1, opened: '11 ก.ย. 2569', status: 'rejected', warrantyEnd: '4 พ.ค. 2574',
    issue: 'บอร์ดไหม้จากไฟกระชาก',
    by: 'กมล ศรีสุข', note: 'ผู้จำหน่ายแจ้งว่าความเสียหายจากไฟกระชากไม่อยู่ในเงื่อนไขประกัน', closed: '12 ก.ย. 2569'
  }
];

// ---------------------------------------------------------------------------
// ประวัติการตรวจนับสต๊อกย้อนหลัง
// ---------------------------------------------------------------------------
var COUNT_HISTORY = [
  { period: 'ส.ค. 2569', countedOn: '31 ส.ค. 2569', countedBy: 'กมล ศรีสุข', items: 10, diffs: 2, status: 'approved', approvedBy: 'หัวหน้าแผนก IT', approvedOn: '1 ก.ย. 2569' },
  { period: 'ก.ค. 2569', countedOn: '31 ก.ค. 2569', countedBy: 'กมล ศรีสุข', items: 10, diffs: 0, status: 'approved', approvedBy: 'หัวหน้าแผนก IT', approvedOn: '1 ส.ค. 2569' },
  { period: 'มิ.ย. 2569', countedOn: '30 มิ.ย. 2569', countedBy: 'สมชาย วิชัย', items: 10, diffs: 1, status: 'approved', approvedBy: 'หัวหน้าแผนก IT', approvedOn: '2 ก.ค. 2569' },
  { period: 'พ.ค. 2569', countedOn: '31 พ.ค. 2569', countedBy: 'สมชาย วิชัย', items: 9, diffs: 3, status: 'approved', approvedBy: 'หัวหน้าแผนก IT', approvedOn: '3 มิ.ย. 2569' }
];

// ---------------------------------------------------------------------------
// คำขอที่รออนุมัติ — การเบิก และการปรับยอดหลังตรวจนับ
// ---------------------------------------------------------------------------
var APPROVAL_META = {
  issue: { badge: 'danger', label: 'ขอเบิก', icon: 'bi-box-arrow-right' },
  borrow: { badge: 'warning', label: 'ขอยืม', icon: 'bi-arrow-left-right' },
  adjust: { badge: 'purple', label: 'ขอปรับยอด', icon: 'bi-sliders' },
  disposal: { badge: 'neutral', label: 'ขอตัดจำหน่าย', icon: 'bi-trash3' }
};

var PENDING_APPROVALS = [
  {
    ref: 'REQ-2569-0021', kind: 'issue', requester: 'สมหญิง ใจงาม', dept: 'บัญชี',
    date: '12 ก.ย. 2569', code: 'IT-RAM-001', qty: 2,
    detail: 'RAM DDR4 16GB จำนวน 2 ชิ้น', reason: 'พนักงานใหม่ 2 ตำแหน่ง'
  },
  {
    ref: 'REQ-2569-0022', kind: 'issue', requester: 'ประเสริฐ สุขใจ', dept: 'ขาย',
    date: '13 ก.ย. 2569', code: 'IT-MOU-001', qty: 5,
    detail: 'Wireless Mouse จำนวน 5 ชิ้น', reason: 'ทดแทนของเดิมที่ชำรุด'
  },
  {
    ref: 'REQ-2569-0023', kind: 'borrow', requester: 'ธนากร มั่นคง', dept: 'IT',
    date: '13 ก.ย. 2569', code: 'IT-SW-001', qty: 1,
    detail: 'Switch 24-Port จำนวน 1 ชิ้น (กำหนดคืน 27 ก.ย. 2569)', reason: 'ติดตั้งชั่วคราวที่สาขาบางนา'
  },
  {
    ref: 'ADJ-2569-0008', kind: 'adjust', requester: 'กมล ศรีสุข', dept: 'IT',
    date: '13 ก.ย. 2569', code: 'IT-PSU-001', qty: -1,
    detail: 'ปรับยอด Power Supply 650W ลง 1 ชิ้น (นับได้ 2 ระบบมี 3)', reason: 'ผลต่างจากการตรวจนับประจำเดือน ก.ย.'
  },
  {
    ref: 'DSP-2569-0004', kind: 'disposal', requester: 'สมชาย วิชัย', dept: 'IT',
    date: '11 ก.ย. 2569', code: 'IT-PSU-001', qty: 1,
    detail: 'ตัดจำหน่าย Power Supply 650W (SN-PSU-0004)', reason: 'บอร์ดไหม้ เคลมไม่ผ่าน ซ่อมไม่คุ้ม'
  }
];

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------
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

// Lots that still have stock left, oldest receipt first (FIFO — เบิกของเก่าออกก่อน).
function availableLots(item) {
  if (!item || !item.lots) return [];
  return item.lots.filter(function (lot) { return (lot.remaining || 0) > 0; })
    .sort(function (a, b) { return parseThaiDate(a.date) - parseThaiDate(b.date); });
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

// Every ส่งซ่อม / เคลม / ชำรุด / ตัดจำหน่าย record across the catalog.
function allServiceRecords() {
  var out = [];
  INVENTORY_ITEMS.forEach(function (item) {
    (item.service || []).forEach(function (rec) { out.push({ item: item, rec: rec }); });
  });
  return out;
}

function findClaim(claimRef) {
  for (var i = 0; i < CLAIMS.length; i++) {
    if (CLAIMS[i].claimRef === claimRef) return CLAIMS[i];
  }
  return null;
}

function lowStockItems() {
  return INVENTORY_ITEMS.filter(function (item) { return item.status !== 'available'; });
}

// ---------------------------------------------------------------------------
// Thai Buddhist-era dates ("13 ก.ย. 2569") <-> JS Date
// ---------------------------------------------------------------------------
var THAI_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

function parseThaiDate(str) {
  if (!str) return null;
  var parts = String(str).trim().split(/\s+/);
  if (parts.length < 3) return null;
  var day = parseInt(parts[0], 10);
  var month = THAI_MONTHS.indexOf(parts[1]);
  var year = parseInt(parts[2], 10) - 543; // BE -> CE
  if (isNaN(day) || month < 0 || isNaN(year)) return null;
  return new Date(year, month, day);
}

function formatThaiDate(date) {
  if (!date) return '-';
  return date.getDate() + ' ' + THAI_MONTHS[date.getMonth()] + ' ' + (date.getFullYear() + 543);
}

// Today, normalised to midnight so day maths never trips on the clock time.
function today() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysBetween(from, to) {
  if (!from || !to) return 0;
  return Math.round((to - from) / 86400000);
}

// ---------------------------------------------------------------------------
// กำหนดคืน — how a loan is doing against its due date
//   overdue  : เลยกำหนดคืนแล้ว
//   due-today: ครบกำหนดวันนี้
//   due-soon : เหลือไม่เกิน 3 วัน
//   ok       : ยังมีเวลา
// ---------------------------------------------------------------------------
var LOAN_STATE_META = {
  overdue: { badge: 'danger', label: 'เลยกำหนดคืน', icon: 'bi-exclamation-triangle-fill' },
  'due-today': { badge: 'warning', label: 'ครบกำหนดวันนี้', icon: 'bi-clock-fill' },
  'due-soon': { badge: 'warning', label: 'ใกล้ครบกำหนด', icon: 'bi-clock' },
  ok: { badge: 'neutral', label: 'ยังไม่ถึงกำหนด', icon: 'bi-check-circle' }
};

function loanState(dep) {
  var due = parseThaiDate(dep && dep.due);
  if (!due) return { state: 'ok', days: null };
  var days = daysBetween(today(), due); // negative => past due
  var state = days < 0 ? 'overdue' : days === 0 ? 'due-today' : days <= 3 ? 'due-soon' : 'ok';
  return { state: state, days: days };
}

function loanStateLabel(dep) {
  var st = loanState(dep);
  if (st.state === 'overdue') return 'เลยกำหนด ' + Math.abs(st.days) + ' วัน';
  if (st.state === 'due-today') return 'ครบกำหนดวันนี้';
  if (st.state === 'due-soon') return 'อีก ' + st.days + ' วัน';
  return 'อีก ' + st.days + ' วัน';
}

// Loans past their due date, most overdue first.
function overdueLoans() {
  return outstandingLoans()
    .filter(function (l) { return loanState(l.dep).state === 'overdue'; })
    .sort(function (a, b) { return loanState(a.dep).days - loanState(b.dep).days; });
}

// Loans due today or within the next 3 days.
function dueSoonLoans() {
  return outstandingLoans().filter(function (l) {
    var s = loanState(l.dep).state;
    return s === 'due-today' || s === 'due-soon';
  });
}

// A lot's warranty against today — used by the claim form to warn before sending.
function warrantyState(lot) {
  var end = parseThaiDate(lot && lot.warrantyEnd);
  if (!end) return { state: 'none', days: null, label: 'ไม่มีข้อมูลประกัน' };
  var days = daysBetween(today(), end);
  if (days < 0) return { state: 'expired', days: days, label: 'หมดประกันแล้ว ' + Math.abs(days) + ' วัน' };
  if (days <= 30) return { state: 'expiring', days: days, label: 'ประกันเหลืออีก ' + days + ' วัน' };
  return { state: 'active', days: days, label: 'อยู่ในประกันถึง ' + lot.warrantyEnd };
}

// ---------------------------------------------------------------------------
// Reference numbers for new records (demo-side only — the real system issues these)
// ---------------------------------------------------------------------------
function nextRef(prefix) {
  var year = today().getFullYear() + 543;
  var seq = Math.floor(Math.random() * 9000) + 1000;
  return prefix + '-' + year + '-' + seq;
}

// ---------------------------------------------------------------------------
// CSV export — built entirely in the browser, no server round-trip.
// Excel (Thai Windows) needs the UTF-8 BOM or Thai text arrives as mojibake.
// ---------------------------------------------------------------------------
function toCsv(headers, rows) {
  function cell(v) {
    var s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  var lines = [headers.map(cell).join(',')];
  rows.forEach(function (row) { lines.push(row.map(cell).join(',')); });
  return lines.join('\r\n');
}

function downloadCsv(filename, headers, rows) {
  var blob = new Blob(['﻿' + toCsv(headers, rows)], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

// ---------------------------------------------------------------------------
// Rendering helpers
// ---------------------------------------------------------------------------
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

// One <option>/row label for a lot in the เบิก/ยืม lot pickers.
function lotOptionLabel(item, lot) {
  var bits = [lot.poRef, 'เหลือ ' + lot.remaining + ' ' + item.unit, 'รับเข้า ' + lot.date];
  if (lot.warrantyEnd) bits.push('ประกันถึง ' + lot.warrantyEnd);
  return bits.join(' · ');
}
