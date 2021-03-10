;
(function($) {
  'use strict';
  $.dgutils = function (options) {
    this.options = null;
    this.init(options);
  };
  $.dgutils.prototype = {
    constructor: $.dgutils,
    infoModal: {},
    modalShown: !1,
    messageTemplate: $('#messageTemplate').html().replace(/\s+/g, ' '),
    defaults: {
      cpView: !1
    },
    init: function (options) {
      this.infoModal.container = $('#info');
      this.infoModal.content = $('.content', this.infoModal.container);
      this.infoModal.close = $('.close', this.infoModal.container);
      this.options = $.extend({}, this.defaults, options);
      Mustache.parse(this.messageTemplate);
      this.bindEvents();
    },
    showMessage: function(message) {
      this.infoModal.content.html(Mustache.render(this.messageTemplate, {message: message}));
      this.infoModal.container.modal('show');
    },
    bindEvents: function() {
      this.infoModal.container.on('show.rehau.modal', $.proxy(this.showTriggered, this)).on('hide.rehau.modal', $.proxy(this.hideTriggered, this));
      document.onkeyup = $.proxy(this.handleEsc, this);
    },
    showTriggered: function() {
      this.modalShown = !0;
    },
    hideTriggered: function() {
      this.modalShown = !1;
    },
    handleEsc: function(e) {
      if (e && e.keyCode == 27) {
        if (this.modalShown) {
          this.infoModal.container.modal('hide');
        } else if (this.options.cpView) {
          this.closeFrame();
        }
      }
    },
    closeFrame: function() {
      var data = {'userAction' : 'closeFrame'};
      data = JSON.stringify(data);
      parent && parent.postMessage(data, '*');
    }
  }
})(jQuery);

