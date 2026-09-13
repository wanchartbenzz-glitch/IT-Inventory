// Shared cart for เบิก (issue.html) and ยืม (borrow.html).
//
// The two pages differ only in wording and in what the confirm step collects, so
// the picking logic — including the lot picker that keeps the PO trail intact —
// lives here once.
//
// cart[code] = { item, qty, lotRef, serials: [] }
//   lotRef  : which receipt the units are drawn from (FIFO-suggested)
//   serials : chosen units, for serialized items only; qty follows its length

var cart = {};

// ---------------------------------------------------------------------------
// Catalog picker
// ---------------------------------------------------------------------------
function renderPicker(targetSel, filter) {
  var $picker = $(targetSel).empty();
  var q = (filter || '').trim().toLowerCase();
  var matches = INVENTORY_ITEMS.filter(function (item) {
    return !q || item.name.toLowerCase().indexOf(q) > -1 || item.code.toLowerCase().indexOf(q) > -1;
  });

  if (!matches.length) {
    $picker.append('<div class="text-muted-2 text-center py-4" style="font-size:13px">ไม่พบอุปกรณ์ที่ค้นหา</div>');
    return;
  }

  matches.forEach(function (item) {
    var outOfStock = item.stock <= 0;
    $picker.append(
      '<div class="item-picker-row" data-code="' + item.code + '">' +
        itemThumbHtml(item, '34px', '15px') +
        '<div><div class="item-picker-row__name">' + item.name + '</div>' +
          '<div class="item-picker-row__code">' + item.code + (item.serialized ? ' &middot; มี Serial' : '') + '</div></div>' +
        '<div class="item-picker-row__stock num">' + (outOfStock ? 'หมดสต๊อก' : 'เหลือ ' + item.stock + ' ' + item.unit) + '</div>' +
        '<button class="btn btn-soft btn-sm ms-2 add-to-cart" type="button"' +
          (outOfStock ? ' disabled title="หมดสต๊อก ไม่สามารถทำรายการได้"' : '') + '>+ เพิ่ม</button>' +
      '</div>'
    );
  });
}

// ---------------------------------------------------------------------------
// Adding an item picks the oldest lot that still has stock (FIFO) as the default
// ---------------------------------------------------------------------------
function addToCart(code) {
  if (cart[code]) { showToast('info', 'มีรายการนี้อยู่แล้ว'); return; }
  var item = findInventoryItem(code);
  if (!item || item.stock <= 0) return;

  var lots = availableLots(item);
  var firstLot = lots[0];
  cart[code] = {
    item: item,
    lotRef: firstLot ? firstLot.lotRef : null,
    qty: 1,
    serials: item.serialized && firstLot && firstLot.serials && firstLot.serials.length
      ? [firstLot.serials[0]]
      : []
  };
  renderCart();
}

function cartEntryLot(entry) {
  return findLot(entry.item, entry.lotRef);
}

// The most a row may take: never more than the chosen lot still holds.
function maxQtyFor(entry) {
  var lot = cartEntryLot(entry);
  return lot ? lot.remaining : entry.item.stock;
}

// ---------------------------------------------------------------------------
// Cart rendering
// ---------------------------------------------------------------------------
function lotPickerHtml(entry) {
  var item = entry.item;
  var lots = availableLots(item);
  if (!lots.length) return '';

  var options = lots.map(function (lot) {
    return '<option value="' + lot.lotRef + '"' + (lot.lotRef === entry.lotRef ? ' selected' : '') + '>' +
             lotOptionLabel(item, lot) + '</option>';
  }).join('');

  var lot = cartEntryLot(entry);
  var note = '';
  if (lot) {
    var w = warrantyState(lot);
    if (w.state === 'expired') {
      note = '<span class="lot-note lot-note--warn"><i class="bi bi-shield-exclamation"></i> ' + w.label + '</span>';
    } else if (w.state !== 'none') {
      note = '<span class="lot-note"><i class="bi bi-shield-check"></i> ' + w.label + '</span>';
    }
  }

  return '<div class="cart-item__lot">' +
           '<label for="lot-' + item.code + '">ตัดจากล็อต</label>' +
           '<select class="lot-select" id="lot-' + item.code + '" data-code="' + item.code + '">' + options + '</select>' +
           note +
         '</div>';
}

function serialPickerHtml(entry) {
  var item = entry.item;
  if (!item.serialized) return '';
  var lot = cartEntryLot(entry);
  var serials = (lot && lot.serials) || [];
  if (!serials.length) {
    return '<div class="serial-picker"><div class="serial-picker__label">ล็อตนี้ไม่มี Serial คงเหลือในสต๊อก</div></div>';
  }

  var chips = serials.map(function (sn) {
    var picked = entry.serials.indexOf(sn) > -1;
    return '<label class="serial-chip' + (picked ? ' is-picked' : '') + '">' +
             '<input type="checkbox" class="serial-check" data-code="' + item.code + '" value="' + sn + '"' + (picked ? ' checked' : '') + '>' +
             sn +
           '</label>';
  }).join('');

  return '<div class="serial-picker">' +
           '<div class="serial-picker__label">เลือก Serial ที่จ่ายออก (เลือกแล้ว ' + entry.serials.length + ' ชิ้น)</div>' +
           '<div class="serial-chips">' + chips + '</div>' +
         '</div>';
}

function renderCart() {
  var $list = $('#cartList').empty();
  var keys = Object.keys(cart);
  $('#cartEmpty').toggleClass('d-none', keys.length > 0);
  $('#cartCount, #cartCount2').text(keys.length);
  $('#confirmBtn').prop('disabled', keys.length === 0 || !cartIsValid());

  keys.forEach(function (code) {
    var entry = cart[code];
    var item = entry.item;
    var remaining = item.stock - entry.qty;

    // Serialized rows take their quantity from the serials ticked, so the stepper
    // would only be a second source of truth — show a plain count instead.
    var qtyControl = item.serialized
      ? '<div class="cart-item__qty-fixed num">' + entry.qty + ' ' + item.unit + '</div>'
      : '<div class="qty-stepper">' +
          '<button type="button" data-step="-1" aria-label="ลดจำนวน">-</button>' +
          '<input type="text" class="num qty-input" value="' + entry.qty + '" readonly aria-label="จำนวน">' +
          '<button type="button" data-step="1" aria-label="เพิ่มจำนวน">+</button>' +
        '</div>';

    $list.append(
      '<div class="cart-item" data-code="' + code + '">' +
        itemThumbHtml(item, '34px', '15px') +
        '<div class="cart-item__body">' +
          '<div class="cart-item__name">' + item.name + '</div>' +
          '<div class="cart-item__code">' + item.code + '</div>' +
          '<div class="cart-item__remaining">เหลือหลังทำรายการ: <b class="num">' + remaining + '</b> ' + item.unit + '</div>' +
          lotPickerHtml(entry) +
          serialPickerHtml(entry) +
        '</div>' +
        qtyControl +
        '<button class="cart-remove" type="button" aria-label="ลบรายการ"><i class="bi bi-trash"></i></button>' +
      '</div>'
    );
  });
}

// A serialized row is only valid once at least one serial is ticked.
function cartIsValid() {
  return Object.keys(cart).every(function (code) {
    var entry = cart[code];
    return !entry.item.serialized || entry.serials.length > 0;
  });
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
$(document).on('click', '.add-to-cart', function () {
  addToCart($(this).closest('.item-picker-row').data('code'));
});

$(document).on('click', '.cart-remove', function () {
  delete cart[$(this).closest('.cart-item').data('code')];
  renderCart();
});

$(document).on('click', '.cart-item .qty-stepper button', function () {
  var entry = cart[$(this).closest('.cart-item').data('code')];
  var step = parseInt($(this).data('step'), 10);
  entry.qty = Math.max(1, Math.min(maxQtyFor(entry), entry.qty + step));
  renderCart();
});

// Switching lot clears any serials picked from the previous one.
$(document).on('change', '.lot-select', function () {
  var entry = cart[$(this).data('code')];
  entry.lotRef = $(this).val();
  entry.serials = [];
  entry.qty = entry.item.serialized ? 0 : Math.min(entry.qty, maxQtyFor(entry));
  renderCart();
});

$(document).on('change', '.serial-check', function () {
  var entry = cart[$(this).data('code')];
  var sn = $(this).val();
  var at = entry.serials.indexOf(sn);
  if (this.checked && at === -1) entry.serials.push(sn);
  if (!this.checked && at > -1) entry.serials.splice(at, 1);
  entry.qty = entry.serials.length;
  renderCart();
});

// ---------------------------------------------------------------------------
// Confirm summary shared by both pages
// ---------------------------------------------------------------------------
function cartSummaryRows() {
  return Object.keys(cart).map(function (code) {
    var entry = cart[code];
    var lot = cartEntryLot(entry);
    var trace = lot ? '<div style="font-size:11.5px;color:#64748b">ล็อต ' + lot.lotRef + ' &middot; ' + lot.poRef +
                      (entry.serials.length ? ' &middot; ' + entry.serials.join(', ') : '') + '</div>' : '';
    return '<div style="padding:6px 0;border-bottom:1px solid #eef1f6">' +
             '<div style="display:flex;justify-content:space-between;gap:8px">' +
               '<span>' + entry.item.name + '</span>' +
               '<span><b>' + entry.qty + '</b> ' + entry.item.unit + '</span>' +
             '</div>' + trace +
           '</div>';
  }).join('');
}
