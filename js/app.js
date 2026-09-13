// IT Inventory — generic page utilities.
// Shell (sidebar/header) markup + its interactions now live in js/shell.js.

$(function () {
  // Quantity steppers
  $(document).on('click', '.qty-stepper [data-step]', function () {
    var $wrap = $(this).closest('.qty-stepper');
    var $input = $wrap.find('input');
    var min = parseInt($input.attr('min') || '0', 10);
    var max = parseInt($input.attr('max') || '999999', 10);
    var val = parseInt($input.val(), 10) || 0;
    val += parseInt($(this).data('step'), 10);
    val = Math.max(min, Math.min(max, val));
    $input.val(val).trigger('change');
  });

  // Filter chip active state
  $('.filter-select, .search-input input').on('change keyup', function () {
    // hook point for live filtering — left for page-specific scripts
  });
});

// ---- Toast helper ----
function showToast(type, message) {
  var icons = { success: 'bi-check-circle-fill', warning: 'bi-exclamation-triangle-fill', danger: 'bi-x-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
  if (type === 'error') type = 'danger';
  var icon = icons[type] || icons.info;
  var $stack = $('.toast-stack');
  if ($stack.length === 0) {
    $stack = $('<div class="toast-stack" role="status" aria-live="polite"></div>').appendTo('body');
  }
  var $toast = $(
    '<div class="app-toast app-toast--' + type + '">' +
      '<i class="bi ' + icon + ' app-toast__icon"></i>' +
      '<span class="app-toast__text">' + message + '</span>' +
    '</div>'
  );
  $stack.append($toast);
  setTimeout(function () {
    $toast.fadeOut(200, function () { $(this).remove(); });
  }, 3200);
}

// ---- Modal helper ----
// Closing a modal must never abort the action that triggered it. bootstrap.Modal
// .getInstance() returns null for a modal that was never opened through the JS API,
// and the whole `bootstrap` global is missing if its CDN fails — either way the
// bare `.hide()` call used to throw and skip everything after it, losing the save.
function closeModal(id) {
  var el = document.getElementById(id);
  if (!el) return;
  try {
    if (window.bootstrap && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(el).hide();
      return;
    }
  } catch (e) {
    // fall through to the manual teardown below
  }
  el.classList.remove('show');
  el.style.display = 'none';
  el.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  var backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) backdrop.parentNode.removeChild(backdrop);
}

// ---- Button loading helper ----
function setBtnLoading($btn, loadingText) {
  if (!$btn.data('orig-html')) {
    $btn.data('orig-html', $btn.html());
  }
  $btn.addClass('btn-loading').prop('disabled', true);
  $btn.find('.btn-label').text(loadingText || 'กำลังบันทึก...');
}
function resetBtnLoading($btn) {
  $btn.removeClass('btn-loading').prop('disabled', false);
  if ($btn.data('orig-html')) { $btn.html($btn.data('orig-html')); }
}

// ---- Inline field validation ----
// A toast disappears in 3 seconds and never sits next to the field it is about.
// showFieldError() writes the message under the control (and announces it), and
// the next edit clears it.
function showFieldError(sel, message) {
  var $f = $(sel);
  if (!$f.length) return;
  var $msg = $f.nextAll('.field-error').first();
  if (!$msg.length) { $msg = $('<div class="field-error" role="alert"></div>'); $f.after($msg); }
  var id = $f.attr('id') ? $f.attr('id') + 'Error' : null;
  if (id) { $msg.attr('id', id); $f.attr('aria-describedby', id); }
  $msg.html('<i class="bi bi-exclamation-circle-fill" aria-hidden="true"></i> ' + message).addClass('is-shown');
  $f.addClass('is-invalid').attr('aria-invalid', 'true');
  $f[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  $f.trigger('focus');
}
function clearFieldError(sel) {
  var $f = $(sel);
  $f.removeClass('is-invalid').removeAttr('aria-invalid');
  $f.nextAll('.field-error').first().removeClass('is-shown');
}
$(document).on('input change', '.is-invalid', function () { clearFieldError(this); });

// ---- Thai date echo for native date inputs ----
// <input type="date"> shows mm/dd/yyyy in the Gregorian year; everything else in
// the app says "13 ก.ย. 2569". Echo the Thai date under every date field.
var THAI_MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
function thaiDateFromIso(iso) {
  if (!iso) return '';
  var p = iso.split('-');
  if (p.length !== 3) return '';
  return parseInt(p[2], 10) + ' ' + THAI_MONTHS_SHORT[parseInt(p[1], 10) - 1] + ' ' + (parseInt(p[0], 10) + 543);
}
function refreshDateEcho(input) {
  var $i = $(input);
  var $echo = $i.nextAll('.date-thai').first();
  if (!$echo.length) { $echo = $('<div class="date-thai" aria-live="polite"></div>'); $i.after($echo); }
  var t = thaiDateFromIso($i.val());
  $echo.text(t ? '= ' + t : '');
}
$(function () {
  $('input[type="date"]').each(function () { refreshDateEcho(this); });
  $(document).on('input change', 'input[type="date"]', function () { refreshDateEcho(this); });

  // Wizard steps: expose the active step to assistive tech
  $('.wizard-step').attr('role', 'listitem');
  $('.wizard-steps').attr('role', 'list');
});
function syncWizardAria() {
  $('.wizard-step').removeAttr('aria-current');
  $('.wizard-step.active').attr('aria-current', 'step');
}
