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
  $doc.on('click', '.header-menu-btn', function () {
    $('.sidebar, .sidebar-overlay').addClass('is-open');
    $(this).attr('aria-expanded', 'true');
  });
  $doc.on('click', '.sidebar-overlay', function () {
    $('.sidebar, .sidebar-overlay').removeClass('is-open');
    $('.header-menu-btn').attr('aria-expanded', 'false');
  });

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
  $doc.on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.dropdown-panel').addClass('d-none');
      $('[data-panel-toggle]').attr('aria-expanded', 'false');
      $('.sidebar, .sidebar-overlay').removeClass('is-open');
      $('.header-menu-btn').attr('aria-expanded', 'false');
    }
  });
});
