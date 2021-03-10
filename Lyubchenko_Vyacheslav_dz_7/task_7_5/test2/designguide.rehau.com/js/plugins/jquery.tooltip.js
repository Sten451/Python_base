;
(function ($) {
  'use strict';
  $.tooltip = function (element, options) {
    this.$element = null;
    this.options = null;
    this.timeout = null;
    this.active = false;
    this.touchable = 'ontouchend' in document;
    this.init(element, options);
  };
  $.tooltip.prototype = {
    constructor: $.tooltip,
    defaults: {
      template: '<div class="tooltip"><div class="content"/><div class="arrow"/></div>',
      trigger: 'hover',
      delay: 200,
      selector: false
    },
    init: function (element, options) {
      this.$element = $(element);
      this.options = $.extend({}, this.defaults, options);
      if (this.options.trigger == 'hover') {
        this.$element.on((this.touchable ? 'touchstart' : 'mouseenter') + '.bss.tooltip.enter', this.options.selector, $.proxy(this.enter, this));
        this.$element.on((this.touchable ? 'touchend' : 'mouseleave') + '.bss.tooltip.leave', this.options.selector, $.proxy(this.leave, this));
      }
      if (this.options.selector) {
        this._options = $.extend({}, this.options, {trigger: 'manual', selector: ''});
      }
    },
    enter: function (e) {
      var self = $(e.currentTarget).data('bss.tooltip');
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bss.tooltip', self);
      }
      if (self.timeout) {
        clearTimeout(self.timeout);
      }
      if (self.touchable || !self.options.delay) {
        return self.show();
      }
      self.timeout = setTimeout(function () {
        self.show();
      }, self.options.delay);
    },
    leave: function (e) {
      var self = $(e.currentTarget).data('bss.tooltip');
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions());
        $(e.currentTarget).data('bss.tooltip', self);
      }
      clearTimeout(self.timeout);
      return self.hide();
    },
    getDelegateOptions: function () {
      var self = this, options = {};
      this._options && $.each(this._options, function (key, value) {
        if (self.defaults[key] != value) {
          options[key] = value;
        }
      });
      return options;
    },
    show: function () {
      if (this.active || !this.hasContent()) {
        return;
      }
      var $tip = this.getTip();
      this.setContent();
      $tip.css({top: 0, left: 0, display: 'block'}).data('bss.tooltip', this);
      $tip.appendTo(document.body);
      var pos = this.getPosition();
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;
      var placement = pos.top - scrollTop - actualHeight < 0 ? 'bottom' : 'top';
      $tip.addClass(placement);
      var offset = {
        top: placement == 'bottom' ? pos.top + pos.height : pos.top - actualHeight,
        left: pos.left + pos.width / 2 - actualWidth / 2
      };
      this.applyPlacement(offset, placement);
      this.active = true;
    },
    hide: function () {
      if (this.active) {
        this.getTip().detach();
        this.active = false;
      }
    },
    getTip: function () {
      return this.$tip = this.$tip || $(this.options.template);
    },
    hasContent: function () {
      return this.getContent();
    },
    getContent: function () {
      return this.$element.data('tooltip');
    },
    setContent: function () {
      this.getTip().removeClass('active top bottom').find('.content').text(this.getContent());
    },
    getPosition: function () {
      return $.extend({}, {
        width: this.$element.outerWidth(),
        height: this.$element.outerHeight()
      }, this.$element.offset());
    },
    applyPlacement: function (offset, placement) {
      var $tip = this.getTip();
      var width = $tip[0].offsetWidth;
      var height = $tip[0].offsetHeight;
      $.offset.setOffset($tip[0], $.extend({
        using: function (props) {
          $tip.css({
            top: Math.round(props.top),
            left: Math.round(props.left)
          })
        }
      }, offset), 0);
      var actualWidth = $tip[0].offsetWidth;
      var actualHeight = $tip[0].offsetHeight;
      if (placement == 'top' && actualHeight != height) {
        offset.top = offset.top + height - actualHeight;
      }
      var left = 0;
      var edgeOffset = offset.left + actualWidth;
      if (offset.left < 0) {
        left = -offset.left;
      } else if (edgeOffset > $(window).width()) {
        left = $(window).width() - edgeOffset
      }
      if (left) {
        offset.left += left;
      }
      $tip.offset(offset);
      this.correctArrow(left * 2 - width + actualWidth, $tip[0].offsetWidth);
      $tip.addClass('active');
    },
    correctArrow: function (delta, dimension) {
      this.getArrow().css('left', delta ? (50 * (1 - delta / dimension) + '%') : '')
    },
    getArrow: function () {
      return (this.$arrow = this.$arrow || this.getTip().find('.arrow'));
    }
  };
  $.fn.tooltip = function (options) {
    return this.each(function () {
      var $this = $(this);
      if (!$this.data('bss.tooltip')) {
        $this.data('bss.tooltip', new $.tooltip(this, typeof options == 'object' && options))
      }
    });
  };
}(jQuery));
