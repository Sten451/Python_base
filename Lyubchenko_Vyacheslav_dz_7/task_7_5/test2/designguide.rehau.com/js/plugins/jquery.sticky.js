;
(function ($) {
  'use strict';
  $.sticky = function (element, options) {
    this.$element = null;
    this.options = null;
    this.selector = null;
    this.isWindow = false;
    this.letsStick = false;
    this.offsetMethod = 'offset';
    this.init(element, options);
  };
  $.sticky.prototype = {
    constructor: $.sticky,
    defaults: {
      selectors: '[data-sticky]',
      zIndex: 50
    },
    init: function (element, options) {
      this.$element = $(element);
      this.options = $.extend({}, this.defaults, options);
      if (!$.isArray(this.options.selectors)) {
        this.options.selectors = [this.options.selectors];
      }
      this.selector = this.options.selectors.join();
      this.$offsetParent = $(this.selector, this.$element).parent().css({position: 'relative'});
      this.isWindow = this.$element.is('body') || !(/(auto|scroll)/).test(this.$element.css('overflow') + this.$element.css('overflow-y'));
      this.$scrollElement = this.isWindow ? $(window) : this.$element.css({position: 'relative'});
      this.offsetMethod = this.isWindow ? 'offset' : 'position';
      this.$scrollElement.on('scroll.bss.sticky.stick', $.proxy(this.stick, this));
      this.stick();
    },
    _visible: function () {
      return this.style.display != 'none';
    },
    stick: function () {
      var scrollTop = this.$scrollElement.scrollTop(),
          minimumScrollTop = (this.isWindow ? this.getOffsetTop(this.$offsetParent) : 0) + parseInt(this.$offsetParent.css('padding-top'), 10),
          maximumScrollTop = minimumScrollTop + this.$offsetParent.height(),
          $stickyElements = this.$offsetParent.children(this.selector).filter(this._visible);
      if (minimumScrollTop < scrollTop && scrollTop < maximumScrollTop) {
        this.letsStick = true;
      } else if (this.letsStick) {
        this.letsStick = false;
        $stickyElements.css({top: 0}).removeClass('stuck');
      }
      if (this.letsStick) {
        var self = this;
        $stickyElements.each(function () {
          var $this = $(this);
          if (!$this.data('options')) {
            for (var i = 0, length = self.options.selectors.length; i < length; i++) {
              if ($this.is(self.options.selectors[i])) {
                $this.data('options', {selector: self.options.selectors.slice(0, i + 1).join(), group: i});
                this.style.zIndex = self.options.zIndex - i;
                break;
              }
            }
          }
          var newTop, top = self.getTop($this), offsetTop = self.getOffsetTop($this) - top, height = $this.outerHeight(), options = $this.data('options'),
              $siblings = $(options.selector, $this.parent()).filter(self._visible), pos = $.inArray(this, $siblings),
              $nextSibling = $siblings.eq(pos + 1), $prevSibling = pos > 0 ? $siblings.eq(pos - 1) : $([]),
              offset = $prevSibling.length && options.group != 0 ? $prevSibling.outerHeight() : 0,
              maximumScroll = $nextSibling.length ? self.getOffsetTop($nextSibling) - self.getTop($nextSibling) : maximumScrollTop,
              isSticky = scrollTop >= offsetTop - offset && scrollTop < maximumScroll;
          $this[(isSticky ? 'addClass' : 'removeClass')]('stuck');
          if (!isSticky) {
            newTop = 0
          } else if (scrollTop + height > maximumScroll - offset) {
            newTop = maximumScroll - offsetTop - height;
          } else {
            newTop = scrollTop - offsetTop + offset;
          }
          if (top != newTop) {
            this.style.top = newTop + 'px';
          }
        });
      } else {
        $stickyElements.css({top: 0}).removeClass('stuck');
      }
    },
    getTop: function ($o) {
      return parseInt($o[0].style.top, 10);
    },
    getOffsetTop: function ($o) {
      return Math.round($o[this.offsetMethod]().top);
    }
  };
  $.fn.sticky = function (options) {
    return this.each(function () {
      new $.sticky(this, typeof options == 'object' && options);
    });
  };
}(jQuery));
