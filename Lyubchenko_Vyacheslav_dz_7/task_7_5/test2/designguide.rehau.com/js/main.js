;
'use strict';

(function ($) {
  function toggleTabs($panels, showTabs) {
    $panels.data('uiTabs') ? $panels.tabs('destroy') : $panels.data('uiAccordion') && $panels.accordion('destroy');
    showTabs ? $panels.tabs({active: 1, disabled: [0]}) : $panels.accordion({
      active: false,
      collapsible: true,
      header: 'h3',
      heightStyle: 'content'
    });
  }

  var $panels = $('#panels');
  if (!$panels.length) {
    return;
  }
  var $catalyst = $('.catalyst'), showTabs = $catalyst.is(':visible');
  toggleTabs($panels, showTabs);
  $(window).on('debouncedresize', function () {
    showTabs != $catalyst.is(':visible') && (showTabs = $catalyst.is(':visible'), toggleTabs($panels, showTabs));
  });
}(jQuery));

$(document).ready(function ($) {
  $.rehau = $.rehau || {};
  var translations = $.rehau.translations || {};
  var $info = $('#info'), $content = $('.content', $info);
  if ($.rehau.modal) {
    $(document.body).on('click', 'a.preview[href]', function (e) {
      e.preventDefault();
      $content.html($('<img/>').attr('src', e.currentTarget.href));
      $info.modal('show');
    });
  }
  $('a[rel="external"]').attr('target', '_blank');
  if ((/android|webos|ip(hone|ad|od)|blackberry|iemobile|opera mini|windows phone/i.test(navigator.userAgent.toLowerCase()))) {
    $.autoCompleteSelect && $('select[multiple]').autoCompleteSelect({translations: translations});
  } else {
    $.multipleSelect && $('select[multiple]').multipleSelect({translations: translations});
  }
  $.tooltip && $(document.body).tooltip({selector: '[data-tooltip]'});
  $('input:checkbox[name="advanced"]').on('change', function () {
    $('.row.advanced')[$(this).prop('checked') ? 'show' : 'hide']();
  });
  $(document.body).on('click', '.toggle', function (e) {
    e.preventDefault();
    var $this = $(this);
    $this.closest('.variant').toggleClass('folded' + $this.data('target'));
    $this.toggleClass('folded');
  });
});

(function ($) {
  if (!$.sticky) {
    return;
  }
  $('#content').sticky({selectors: ['#hotline'], zIndex: 5});
  $('#colorSearch').sticky({selectors: ['.row.headline', '.row.manufacturer']});
  $(window).on('debouncedresize', function () {
    $(window).trigger('scroll.bss.sticky.stick');
  });
})(jQuery);

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}
