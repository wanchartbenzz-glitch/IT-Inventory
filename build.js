#!/usr/bin/env node
// Build step: bakes the shared Sidebar + Header into every page's static HTML.
//
// WHY THIS EXISTS: an earlier version injected the shell via client-side JS
// (fetch/render on page load). That meant the entire navigation vanished if
// jQuery failed to load (slow network, blocked CDN, ad blocker) — a much
// worse failure mode than the plain-HTML duplication it replaced. Baking the
// shell in at build time keeps ONE source of truth (this file + partials/)
// while shipping pages whose navigation works even with JavaScript off.
//
// Usage: node build.js
// Run this after editing the NAV config below or partials/header.html.

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const NAV = [
  { items: [
    { href: 'index.html', icon: 'bi-grid-1x2-fill', label: 'Dashboard' }
  ]},
  { label: 'การดำเนินการ', items: [
    { href: 'receive.html', icon: 'bi-box-arrow-in-down', label: 'รับเข้าอุปกรณ์' },
    { href: 'issue.html', icon: 'bi-box-arrow-up', label: 'เบิกอุปกรณ์' },
    { href: 'borrow.html', icon: 'bi-arrow-left-right', label: 'ยืมอุปกรณ์' },
    { href: 'return.html', icon: 'bi-arrow-return-left', label: 'คืนอุปกรณ์' },
    { href: 'service.html', icon: 'bi-tools', label: 'ส่งซ่อม / ตัดจำหน่าย' }
  ]},
  { label: 'ตรวจสอบ & อนุมัติ', items: [
    { href: 'stock-count.html', icon: 'bi-clipboard-check', label: 'ตรวจนับสต๊อก' },
    { href: 'approvals.html', icon: 'bi-check2-square', label: 'รออนุมัติ' },
    { href: 'claims.html', icon: 'bi-shield-check', label: 'ประวัติการเคลม' }
  ]},
  { label: 'จัดการข้อมูลอุปกรณ์', items: [
    { href: 'inventory.html', icon: 'bi-hdd-stack', label: 'ข้อมูลอุปกรณ์ IT', aliases: ['inventory-detail.html'] },
    { href: 'categories.html', icon: 'bi-diagram-3', label: 'หมวดอุปกรณ์' },
    { href: 'types.html', icon: 'bi-tags', label: 'ประเภทอุปกรณ์' },
    { href: 'units.html', icon: 'bi-rulers', label: 'หน่วยนับ' }
  ]},
  { label: 'ทรัพย์สิน IT', items: [
    { icon: 'bi-pc-display', label: 'IT Assets', soon: true }
  ]}
];

function buildSidebar(currentFile) {
  var html = '<aside class="sidebar" id="shellSidebarAside" aria-label="เมนูหลัก">\n';
  html += '  <div class="sidebar__brand">\n' +
          '    <div class="sidebar__brand-icon" aria-hidden="true"><i class="bi bi-boxes"></i></div>\n' +
          '    <div class="sidebar__brand-text"><div class="sidebar__brand-title">IT INVENTORY</div>\n' +
          '    <div class="sidebar__brand-sub">ระบบจัดการสต๊อกอุปกรณ์ IT</div></div>\n' +
          '  </div>\n';

  NAV.forEach(function (group) {
    html += '  <div class="sidebar__group">\n';
    if (group.label) html += '    <div class="sidebar__group-label">' + group.label + '</div>\n';
    group.items.forEach(function (item) {
      if (item.soon) {
        html += '    <span class="nav-item is-disabled" aria-disabled="true">' +
                  '<span class="nav-item__icon" aria-hidden="true"><i class="bi ' + item.icon + '"></i></span>' +
                  '<span>' + item.label + '</span>' +
                  '<span class="nav-item__soon">Coming Soon</span></span>\n';
        return;
      }
      var isActive = item.href === currentFile || (item.aliases && item.aliases.indexOf(currentFile) > -1);
      html += '    <a href="' + item.href + '" class="nav-item' + (isActive ? ' active' : '') + '"' +
                (isActive ? ' aria-current="page"' : '') + '>' +
                '<span class="nav-item__icon" aria-hidden="true"><i class="bi ' + item.icon + '"></i></span>' +
                '<span>' + item.label + '</span></a>\n';
    });
    html += '  </div>\n';
  });

  html += '  <button class="sidebar-collapse-btn" type="button" aria-label="ย่อ/ขยายเมนู" aria-expanded="true">' +
            '<i class="bi bi-layout-sidebar-inset" aria-hidden="true"></i><span>ย่อเมนู</span></button>\n';
  html += '</aside>\n<div class="sidebar-overlay"></div>';
  return html;
}

function replaceBetween(html, marker, content) {
  var re = new RegExp('<!-- shell:' + marker + ' -->[\\s\\S]*?<!-- /shell:' + marker + ' -->');
  var wrapped = '<!-- shell:' + marker + ' -->\n' + content + '\n<!-- /shell:' + marker + ' -->';
  if (!re.test(html)) {
    throw new Error('Marker "shell:' + marker + '" not found — run this only on files that already have the marker comments.');
  }
  return html.replace(re, wrapped);
}

var headerHtml = fs.readFileSync(path.join(ROOT, 'partials/header.html'), 'utf8').trim();

var pages = fs.readdirSync(ROOT).filter(function (f) {
  return f.endsWith('.html') && fs.statSync(path.join(ROOT, f)).isFile();
});

var built = 0;
pages.forEach(function (file) {
  var full = path.join(ROOT, file);
  var html = fs.readFileSync(full, 'utf8');
  html = replaceBetween(html, 'sidebar', buildSidebar(file));
  html = replaceBetween(html, 'header', headerHtml);
  fs.writeFileSync(full, html);
  built++;
});

console.log('Built shell into ' + built + ' page(s): ' + pages.join(', '));
