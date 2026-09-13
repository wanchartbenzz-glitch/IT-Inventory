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
        '<button class="btn btn-soft btn-sm ms-2 add-to-cart" type="button" aria-label="เพิ่ม ' + item.name + '"' +
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

  // Up to three lots: radio rows that stay readable on a phone. More than that: a select.
  if (lots.length <= 3) {
    var rows = lots.map(function (lot) {
      var w = warrantyState(lot);
      var picked = lot.lotRef === entry.lotRef;
      var warranty = w.state === 'expired' ? '<span class="warn">หมดประกันแล้ว</span>'
                   : w.state === 'none' ? 'ไม่มีประกัน' : 'ประกันถึง ' + lot.warrantyEnd;
      return '<label class="lot-radio' + (picked ? ' is-picked' : '') + '">' +
               '<input type="radio" class="lot-radio-input" name="lot-' + item.code + '" data-code="' + item.code + '" value="' + lot.lotRef + '"' + (picked ? ' checked' : '') + '>' +
               '<span><span class="lot-radio__po">' + lot.poRef + '</span> <span class="lot-radio__meta">· รับเข้า ' + lot.date + '</span>' +
               '<div class="lot-radio__meta">เหลือ ' + lot.remaining + ' ' + item.unit + ' · ' + warranty + '</div></span>' +
             '</label>';
    }).join('');
    return '<fieldset class="cart-item__lot"><legend class="visually-hidden">ตัดจากล็อต</legend>' +
             '<label>ตัดจากล็อต</label><div class="lot-radios">' + rows + '</div></fieldset>';
  }

  var options = lots.map(function (lot) {
    return '<option value="' + lot.lotRef + '"' + (lot.lotRef === entry.lotRef ? ' selected' : '') + '>' +
             lotOptionLabel(item, lot) + '</option>';
  }).join('');
  var lot = cartEntryLot(entry);
  var note = '';
  if (lot) {
    var w = warrantyState(lot);
    if (w.state === 'expired') note = '<span class="lot-note lot-note--warn"><i class="bi bi-shield-exclamation" aria-hidden="true"></i> ' + w.label + '</span>';
    else if (w.state !== 'none') note = '<span class="lot-note"><i class="bi bi-shield-check" aria-hidden="true"></i> ' + w.label + '</span>';
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

  return '<fieldset class="serial-picker">' +
           '<legend class="serial-picker__label">เลือก Serial ที่จ่ายออก (เลือกแล้ว ' + entry.serials.length + ' ชิ้น)</legend>' +
           '<div class="serial-chips">' + chips + '</div>' +
         '</fieldset>';
}

function renderCart() {
  var $list = $('#cartList').empty();
  var keys = Object.keys(cart);
  $('#cartEmpty').toggleClass('d-none', keys.length > 0);
  $('#cartCount, #cartCount2').text(keys.length);
  var invalid = keys.filter(function (code) { var e = cart[code]; return e.item.serialized && !e.serials.length; });
  $('#confirmBtn').prop('disabled', keys.length === 0 || invalid.length > 0);
  // A dimmed button with no reason is a guess; say why it is dimmed.
  var $hint = $('#cartHint');
  if (!$hint.length) $hint = $('<div class="cart-hint" id="cartHint" role="status" aria-live="polite"></div>').insertBefore('.cart-summary-bar button');
  $hint.text(invalid.length ? 'เลือก Serial ของ ' + invalid.map(function (c) { return cart[c].item.name; }).join(', ') + ' ก่อน' : '');
  persistCart();

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
          '<input type="number" inputmode="numeric" min="1" max="' + maxQtyFor(entry) + '" class="num qty-input" value="' + entry.qty + '" data-code="' + code + '" aria-label="จำนวน ' + item.name + '">' +
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
// Persistence: a phone call mid-เบิก must not empty the cart. Same pattern as
// the stock count. Keyed per page so an issue cart never leaks into borrow.
// ---------------------------------------------------------------------------
var CART_KEY = 'itinv.cart.' + location.pathname.split('/').pop();
var cartSubmitted = false;
function persistCart() {
  try {
    var keys = Object.keys(cart);
    if (!keys.length || cartSubmitted) { localStorage.removeItem(CART_KEY); return; }
    var slim = {};
    keys.forEach(function (c) { slim[c] = { lotRef: cart[c].lotRef, qty: cart[c].qty, serials: cart[c].serials }; });
    localStorage.setItem(CART_KEY, JSON.stringify({ at: Date.now(), cart: slim }));
  } catch (e) { /* storage unavailable */ }
}
function restoreCart() {
  var raw = null;
  try { raw = localStorage.getItem(CART_KEY); } catch (e) { return false; }
  if (!raw) return false;
  try {
    var saved = JSON.parse(raw).cart || {};
    Object.keys(saved).forEach(function (code) {
      var item = findInventoryItem(code);
      if (!item) return;
      cart[code] = { item: item, lotRef: saved[code].lotRef, qty: saved[code].qty, serials: saved[code].serials || [] };
    });
    if (Object.keys(cart).length) showToast('info', 'กู้คืนรายการที่เลือกค้างไว้ ' + Object.keys(cart).length + ' รายการ');
    return Object.keys(cart).length > 0;
  } catch (e) { return false; }
}
window.addEventListener('beforeunload', function (e) {
  if (Object.keys(cart).length && !cartSubmitted) { e.preventDefault(); e.returnValue = ''; }
});

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

// Typed quantity: clamp to the lot on change, keep the field live while typing.
$(document).on('change', '.qty-input', function () {
  var entry = cart[$(this).data('code')];
  if (!entry) return;
  var v = parseInt($(this).val(), 10);
  entry.qty = isNaN(v) ? 1 : Math.max(1, Math.min(maxQtyFor(entry), v));
  renderCart();
});

// Switching lot clears any serials picked from the previous one.
$(document).on('change', '.lot-select, .lot-radio-input', function () {
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
// Receipt: what the person walks away with. The reference number is the one
// thing the requester writes on the paper form and the receiver sticks on the
// box, so it must outlive the toast — no redirect.
// ---------------------------------------------------------------------------
function showReceipt(opts) {
  // opts: { title, ref, lines:[{label,value}], meta, nextHref, nextLabel, container }
  var $c = $(opts.container || '#receiptHost');
  if (!$c.length) { $c = $('<div id="receiptHost"></div>').prependTo('.app-main'); }
  $c.html(
    '<div class="receipt" role="status" aria-live="polite" tabindex="-1">' +
      '<div class="receipt__head"><div class="receipt__icon"><i class="bi bi-check-lg" aria-hidden="true"></i></div>' +
        '<div class="receipt__title">' + opts.title + '</div></div>' +
      '<div class="receipt__ref"><span class="receipt__meta">เลขที่อ้างอิง</span>' +
        '<span class="receipt__ref-value" id="receiptRef">' + opts.ref + '</span>' +
        '<button class="btn btn-soft btn-sm" type="button" id="receiptCopy"><i class="bi bi-clipboard" aria-hidden="true"></i> คัดลอกเลขที่</button></div>' +
      '<div class="receipt__lines">' + opts.lines.map(function (l) {
        return '<div class="receipt__line"><span>' + l.label + '</span><span class="num fw-700" style="text-align:right">' + l.value + '</span></div>';
      }).join('') + '</div>' +
      (opts.meta ? '<div class="receipt__meta mb-3">' + opts.meta + '</div>' : '') +
      '<div class="receipt__actions">' +
        '<button class="btn btn-primary" type="button" id="receiptNext"><i class="bi bi-plus-lg" aria-hidden="true"></i> ' + (opts.nextLabel || 'ทำรายการถัดไป') + '</button>' +
        '<a class="btn btn-ghost" href="index.html">ไปหน้าแรก</a>' +
        (opts.nextHref ? '<a class="btn btn-ghost" href="' + opts.nextHref.href + '">' + opts.nextHref.label + '</a>' : '') +
      '</div>' +
    '</div>'
  );
  $c[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
  $c.find('.receipt').trigger('focus');
  $('#receiptCopy').on('click', function () {
    var text = $('#receiptRef').text();
    var done = function () { showToast('success', 'คัดลอก ' + text + ' แล้ว'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  });
  $('#receiptNext').on('click', function () { if (opts.onNext) opts.onNext(); else location.reload(); });
}

// ---------------------------------------------------------------------------
// Confirm summary shared by both pages
// ---------------------------------------------------------------------------
function cartSummaryRows() {
  return Object.keys(cart).map(function (code) {
    var entry = cart[code];
    var lot = cartEntryLot(entry);
    var trace = lot ? '<div style="font-size:12.5px;color:var(--color-muted)">ล็อต ' + lot.lotRef + ' &middot; ' + lot.poRef +
                      (entry.serials.length ? ' &middot; ' + entry.serials.join(', ') : '') + '</div>' : '';
    return '<div style="padding:6px 0;border-bottom:1px solid #eef1f6">' +
             '<div style="display:flex;justify-content:space-between;gap:8px">' +
               '<span>' + entry.item.name + '</span>' +
               '<span><b>' + entry.qty + '</b> ' + entry.item.unit + '</span>' +
             '</div>' + trace +
           '</div>';
  }).join('');
}
