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
  var icons = { success: 'bi-check-circle-fill', warning: 'bi-exclamation-triangle-fill', danger: 'bi-x-circle-fill', info: 'bi-info-circle-fill' };
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
