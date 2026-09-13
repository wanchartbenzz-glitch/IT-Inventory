// IT Inventory — shared shell behavior

$(function () {
  // Mobile drawer
  $('.header-menu-btn').on('click', function () {
    $('.sidebar, .sidebar-overlay').addClass('is-open');
  });
  $('.sidebar-overlay').on('click', function () {
    $('.sidebar, .sidebar-overlay').removeClass('is-open');
  });

  // Desktop collapse
  $('.sidebar-collapse-btn').on('click', function () {
    $('.app-shell').toggleClass('is-collapsed');
  });

  // Dropdown panels (notifications / user menu)
  $('[data-panel-toggle]').on('click', function (e) {
    e.stopPropagation();
    var target = $(this).data('panel-toggle');
    $('.dropdown-panel').not(target).addClass('d-none');
    $(target).toggleClass('d-none');
  });
  $(document).on('click', function () {
    $('.dropdown-panel').addClass('d-none');
  });
  $('.dropdown-panel').on('click', function (e) { e.stopPropagation(); });

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
    $stack = $('<div class="toast-stack"></div>').appendTo('body');
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
