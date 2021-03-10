;
(function ($) {
  'use strict';
  var $event = $.event, timeout,
      $special = $event.special.debouncedresize = {
        setup: function () {
          $(this).on('resize', $special.handler);
        },
        teardown: function () {
          $(this).off('resize', $special.handler);
        },
        handler: function (event, exec) {
          var context = this, args = arguments,
              dispatch = function () {
                event.type = 'debouncedresize';
                $event.dispatch.apply(context, args);
              };
          if (timeout) {
            clearTimeout(timeout);
          }
          exec ? dispatch() : timeout = setTimeout(dispatch, $special.threshold);
        },
        threshold: 100
      };
})(jQuery);
