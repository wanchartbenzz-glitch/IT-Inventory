// IT Inventory — shell INTERACTIONS only (drawer, collapse, dropdowns, escape).
//
// The sidebar/header MARKUP itself is no longer built here — it's baked
// directly into every page's HTML by `node build.js` (see partials/ and
// build.js at the project root). That way navigation works even if this
// script — or jQuery, or the CDN it comes from — never loads. This file
// only adds progressive-enhancement behavior on top of markup that already
// works as plain links.

$(function () {
  var $doc = $(document);

  // Mobile drawer
  // Opening the drawer moves focus into it (first link, or the current page's link);
  // closing hands focus back to the button, so keyboard and screen-reader users are
  // never left "behind" an overlay.
  function openDrawer() {
    $('.sidebar, .sidebar-overlay').addClass('is-open');
    $('.header-menu-btn').attr('aria-expanded', 'true');
    var target = document.querySelector('.sidebar .nav-item.active') || document.querySelector('.sidebar .nav-item');
    if (target) setTimeout(function () { target.focus(); }, 200);
  }
  function closeDrawer(returnFocus) {
    if (!$('.sidebar').hasClass('is-open')) return;
    $('.sidebar, .sidebar-overlay').removeClass('is-open');
    $('.header-menu-btn').attr('aria-expanded', 'false');
    if (returnFocus) $('.header-menu-btn').trigger('focus');
  }
  $doc.on('click', '.header-menu-btn', openDrawer);
  $doc.on('click', '.sidebar-overlay', function () { closeDrawer(true); });

  // Desktop manual collapse
  $doc.on('click', '.sidebar-collapse-btn', function () {
    var $shell = $('.app-shell').toggleClass('is-collapsed');
    $(this).attr('aria-expanded', String(!$shell.hasClass('is-collapsed')));
  });

  // Dropdown panels (notifications / user menu) — click + Escape + outside-click to close
  $doc.on('click', '[data-panel-toggle]', function (e) {
    e.stopPropagation();
    var target = $(this).data('panel-toggle');
    var willOpen = $(target).hasClass('d-none');
    $('.dropdown-panel').not(target).addClass('d-none');
    $('[data-panel-toggle]').not(this).attr('aria-expanded', 'false');
    $(target).toggleClass('d-none', !willOpen);
    $(this).attr('aria-expanded', String(willOpen));
  });
  $doc.on('click', function () {
    $('.dropdown-panel').addClass('d-none');
    $('[data-panel-toggle]').attr('aria-expanded', 'false');
  });
  $doc.on('click', '.dropdown-panel', function (e) { e.stopPropagation(); });

  // Header search: Enter hands the query to the inventory list, which also
  // matches serials — the placeholder promised that and nothing delivered it.
  $doc.on('keydown', '.header-search input', function (e) {
    if (e.key !== 'Enter') return;
    var q = $(this).val().trim();
    if (!q) return;
    e.preventDefault();
    location.href = 'inventory.html?q=' + encodeURIComponent(q);
  });

  $doc.on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.dropdown-panel').addClass('d-none');
      $('[data-panel-toggle]').attr('aria-expanded', 'false');
      closeDrawer(true);
    }
  });

  // Notifications: rebuilt from js/data.js when it is on the page, so the bell
  // reflects real overdue loans, low stock and pending approvals rather than
  // the three placeholder rows baked into the header partial.
  if (typeof overdueLoans !== 'function') return;

  var rows = [];
  overdueLoans().forEach(function (l) {
    rows.push({ tone: 'danger', icon: 'bi-exclamation-triangle-fill', href: 'return.html',
      title: l.item.name + ' เลยกำหนดคืน', meta: l.dep.holder + ' · ' + loanStateLabel(l.dep) });
  });
  dueSoonLoans().forEach(function (l) {
    rows.push({ tone: 'warning', icon: 'bi-clock-fill', href: 'return.html',
      title: l.item.name + ' ' + loanStateLabel(l.dep), meta: l.dep.holder + ' · คืน ' + l.dep.due });
  });
  lowStockItems().forEach(function (item) {
    var out = item.status === 'out';
    rows.push({ tone: out ? 'danger' : 'warning', icon: out ? 'bi-x-circle-fill' : 'bi-exclamation-triangle-fill',
      href: 'inventory-detail.html?code=' + encodeURIComponent(item.code),
      title: item.name + (out ? ' หมดสต๊อก' : ' เหลือ ' + item.stock + ' ' + item.unit),
      meta: 'จุดสั่งซื้อ ' + item.min + ' ' + item.unit });
  });
  if (typeof PENDING_APPROVALS !== 'undefined' && PENDING_APPROVALS.length) {
    rows.push({ tone: 'primary', icon: 'bi-check2-square', href: 'approvals.html',
      title: 'คำขอรออนุมัติ ' + PENDING_APPROVALS.length + ' รายการ', meta: PENDING_APPROVALS[0].detail });
  }

  var bg = { danger: 'var(--color-danger-bg)', warning: 'var(--color-warning-bg)', primary: 'var(--color-primary-light)' };
  var fg = { danger: 'var(--color-danger)', warning: 'var(--color-warning)', primary: 'var(--color-primary)' };
  var $body = $('#notifPanel .dropdown-panel__body');
  if (!$body.length) return;
  $body.html(rows.length ? rows.map(function (r) {
    return '<a class="notif-row" href="' + r.href + '" style="text-decoration:none;color:inherit">' +
      '<div class="notif-row__icon" style="background:' + bg[r.tone] + ';color:' + fg[r.tone] + '"><i class="bi ' + r.icon + '"></i></div>' +
      '<div><div class="notif-row__title">' + r.title + '</div><div class="notif-row__time">' + r.meta + '</div></div></a>';
  }).join('') : '<div class="text-muted-2 text-center py-3" style="font-size:12.5px">ไม่มีการแจ้งเตือน</div>');
  $('#notifPanel .dropdown-panel__head').text('การแจ้งเตือน (' + rows.length + ')');
  $('.icon-btn__dot').toggle(rows.length > 0);
});
