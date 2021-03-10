;
(function ($) {
  'use strict';
  $.autoCompleteSelect = function (element, options) {
    this.$element = null;
    this.$input = null;
    this.options = null;
    this.handheld = (/android|webos|ip(hone|ad|od)|blackberry|iemobile|opera mini|windows phone/i.test(navigator.userAgent.toLowerCase()));
    this.init(element, options);
  };
  $.autoCompleteSelect.prototype = {
    constructor: $.autoCompleteSelect,
    defaults: {
      template: {
        wrapper: '<div class="autoCompleteSelect"/>',
      }
    },
    init: function (element, options) {
      this.$element = $(element);
      this.options = $.extend(true, {}, this.defaults, this.$element.data(), options);
      var $wrap = this.getWrapper();
      this.$element.after($wrap).appendTo($wrap);
      this.assemble();
    },
    getWrapper: function () {
      return this.$wrapper = this.$wrapper || $(this.options.template.wrapper);
    },
    assemble: function () {
      var $wrapper = this.getWrapper(), $selected = $(':selected', this.$element), value = $selected.val() ? $selected.text() : '';
      this.$input = $('<input/>', {type: 'text', placeholder: this.options.placeholder || ''}).val(value)
          .appendTo($wrapper).autocomplete({
            appendTo: $wrapper, delay: 200, minLength: 0,
            source: $.proxy(this.source, this), select: $.proxy(this.select, this)
          }).focus(function () {
            $(this).autocomplete('search', $(this).val() || '');
          });
    },
    reassemble: function () {
      this.$input.val('');
    },
    source: function (request, response) {
      var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), 'i');
      response($('option', this.$element).map(function () {
        var text = $(this).text();
        if (this.value && ( !request.term || matcher.test(text) )) {
          return {label: text, value: text, option: this};
        }
      }));
    },
    select: function (event, ui) {
      $('option:selected', this.$element).removeAttr('selected');
      ui.item.option.selected = true;
      this.$element.trigger('change');
    }
  };
  $.autoCompleteSelect.refresh = function (element) {
    var $this = $(element), data = $this.data('bss.autocomplete.select');
    data && data.reassemble();
    return $this;
  };
  $.fn.autoCompleteSelect = function (options) {
    return this.filter('select').each(function () {
      var $this = $(this), data = $this.data('bss.autocomplete.select');
      data || $this.data('bss.autocomplete.select', (new $.autoCompleteSelect(this, typeof options == 'object' && options)));
    });
  };
}(jQuery));
