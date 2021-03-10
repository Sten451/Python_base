;
(function ($) {
  'use strict';
  $.rehau = $.rehau || {};
  $.rehau.modal = function (element, options) {
    this.options = options;
    this.$body = $(document.body);
    this.$element = $(element);
    this.isShown = false;
    this.$element.on('click.close.rehau.modal', '[data-action="close"]', $.proxy(this.hide, this));
    if (this.options.closeOnEsc) {
      this.$element.on('click.close.rehau.modal', $.proxy(function (e) {
        e.target === e.currentTarget && this.hide();
      }, this));
      $(document).on('keyup.close.rehau.modal', $.proxy(function (e) {
        e && e.which && e.which === 27 && this.hide();
      }, this));
    }
  };
  $.rehau.modal.defaults = {closeOnEsc: false};
  $.rehau.modal.prototype = {
    constructor: $.rehau.modal,
    show: function (e) {
      e && (e.preventDefault(), e.stopImmediatePropagation());
      var that = this;
      if (this.isShown) {
        return;
      }
      this.isShown = true;
      this.backdrop(function () {
        that.$element.appendTo(that.$body).show();
      });
      this.$element.trigger($.Event('show.rehau.modal'));
    },
    backdrop: function (callback) {
      if (this.isShown) {
        this.$backdrop = $(document.createElement('div')).addClass('overlay').appendTo(this.$body);
      } else {
        this.$backdrop.remove();
        this.$backdrop = null;
      }
      callback && callback();
    },
    hide: function (e) {
      e && (e.preventDefault(), e.stopImmediatePropagation());
      var that = this;
      if (!this.isShown) {
        return;
      }
      this.isShown = false;
      this.backdrop(function () {
        that.$element.hide();
      });
      this.$element.trigger($.Event('hide.rehau.modal'));
    }
  };
  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this), data = $this.data('rehau.modal'),
        options = $.extend({}, $.rehau.modal.defaults, $this.data(), typeof option == 'object' && option);
      !data && $this.data('rehau.modal', (data = new $.rehau.modal(this, options)));
      data[typeof option == 'string' ? option : 'show']();
    })
  };
  $(document).on('click.rehau.modal', '[data-action="modal"]', function () {
    var $this = $(this), href = $this.attr('href'),
      $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))),
      option = $target.data('rehau.modal') ? 'show' : $.extend({}, $target.data(), $this.data());
    $.fn.modal.call($target, option);
  });
}(jQuery));
