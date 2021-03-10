;
(function ($) {
  'use strict';

  $.basket = function (options) {
    this.$spinner = $('.spinner');
    this.itemsComparator = function(a, b) {
      if (a.manufacturer < b.manufacturer) {
        return -1;
      }
      if (a.manufacturer > b.manufacturer) {
        return 1;
      }
      if (a.board < b.board) {
        return -1;
      }
      if (a.board > b.board) {
        return 1;
      }
      return 0;
    };
    this.options = null;
    this.init(options);
  };
  $.basket.prototype = {
    constructor: $.basket,
    items: [],
    infoModal: {},
    defaults: {
      infoTemplate: $('#infoTemplate').html().replace(/\s+/g, ' '),
      infoSelector: '.product .info',
      cartTemplate: $('#cartTemplate').html().replace(/\s+/g, ' '),
      sample: !1,
      webshop: !1,
      webshopUrl: '',
      webshopCountry: '',
      webshopLanguage: '',
      webshopShop: '',
      webshopService: '',
      hybrisShop: !1,
      returnUrl: '',
      customer: '',
      internalSample: !1,
      serviceUrl: '',
      internalServiceUrl: '',
      singleSample: !1,
      chainSample: !1,
      pricePerUnit: 1,
      manufacturerSpecific: !1,
      errorMaxSampleAmount: '',
      maxSampleAmount: 10,
      cpView: !1,
      extView: !1,
      hybrisFitsToBoard: '',
      dgutils: null
    },
    init: function (options) {
      this.infoModal.container = $('#info');
      this.infoModal.content = $('.content', this.infoModal.container);
      this.infoModal.close = $('.close', this.infoModal.container);
      this.options = $.extend({}, this.defaults, options);
      Mustache.parse(this.options.infoTemplate);
      Mustache.parse(this.options.cartTemplate);
      this.bindEvents();
      this.updateBasket();
      this.fixOptions();
    },
    bindEvents: function () {
      $(document.body).on('click', this.options.infoSelector, function (e) {
        var $that = $(e.target), $parent = $that.closest('.wallVariant');
        if (!$parent.length) {
          $parent = $that.closest('.variant');
        }
        this.infoModal.content.html(Mustache.render(this.options.infoTemplate,
            {
              materialNumber: $that.data('materialnumber'),
              materialNumberOrg: $that.data('materialnumberorg'),
              type: $that.data('type'),
              hash: $that.data('hash'),
              fits: $parent.data('fits'),
              komuro: $that.data('komuro'),
              width: $that.data('width'),
              dimension: $that.data('dimension'),
              decor: $parent.data('decor'),
              material: $parent.data('material'),
              embossing: $parent.data('embossing'),
              variantType: $parent.data('type'),
              lacquer: $parent.data('lacquer'),
              manufacturer: $parent.data('manufacturer'),
              board: $parent.data('board'),
              itemid: $parent.data('itemid'),
              sampleDisabled: !!this.cookieCount(),
              webshopDisabled: !!this.items.length
            }));
        var $checkout = $('.checkout', this.infoModal.container);
        var closeDialog = function () {
          $that.removeClass('active');
          $checkout.off('click');
        };
        $that.addClass('active');
        this.infoModal.container.modal('show');
        this.infoModal.container.one('hide.rehau.modal', closeDialog);
        $checkout.on('click', this.add.bind(this));
        $('input[name=sample], input[name=webshop]', this.infoModal.container).on('change keyup', function() {
          var val = $(this).val();
          $(this)[/^[0-9\.]*$/.test(val) ? 'removeClass' : 'addClass']('error');
        }).on('keyup', function(e) {
          if (e && e.keyCode == 13) {
            this.add(e);
          }
        }.bind(this));
        if (this.options.cpView) {
          $('input[name=webshop]', this.infoModal.container)[0].focus();
        }
      }.bind(this))
          .on('click', '.quickBasket', this.checkout.bind(this))
          .on('click', '.remove', $.proxy(this.remove, this))
          .on('click', '.action[rel=order]', $.proxy(this.order, this, true))
          .on('click', '.action[rel=back]', $.proxy(this.closeModal, this))
          .on('click', '.action[rel="sort"]', $.proxy(this.sort, this));
    },
    sort: function(e) {
      e.preventDefault();
      if (!this.items.length) {
        return !1;
      }
      this.items.sort(this.itemsComparator);
      this.checkout(e);
    },
    fixOptions: function() {
      if (!this.options.internalServiceUrl.endsWith('/')) {
        this.options.internalServiceUrl += '/';
      }
    },
    toggleSampleChain: function (chain) {
      this.options.singleSample = !chain;
      this.options.chainSample = chain;
    },
    add: function (e) {
      e.preventDefault();
      // is sample service or webshop active?
      if (!this.options.sample && !this.options.webshop) {
        return false;
      }
      if ((!this.cookieCount() || this.cookieCount() == 0) && $('input[name=sample]', this.infoModal.content).val()) {
        this.addSample();
      } else if (!this.items.length && $('input[name=webshop]', this.infoModal.content).val() || this.options.extView) {
        this.addWebshop();
      }
    },
    addSample: function () {
      var data = $('.data', this.infoModal.container).data();
      data.amount = parseInt($('input[name=sample]', this.infoModal.content).val());
      data.itemid += '-' + this.items.length;
      var amount = data.amount;
      for (var i = 0, length = this.items.length; i < length; i++) {
        amount += this.items[i].amount;
      }
      if (!this.options.internalSample && (amount > this.options.maxSampleAmount)) {
        this.options.dgutils.showMessage(this.options.errorMaxSampleAmount + ' ' + this.options.maxSampleAmount);
        return;
      }
      this.items.push(data);
      this.updateBasket();
      this.closeModal();
    },
    addWebshop: function () {
      var data = $('.data', this.infoModal.container).data(), type;
      if (!this.options.extView) {
        data.length = $('input[name=webshop]', this.infoModal.content).val();
      }
      switch (data.type) {
        case 'preglued':
          type = 'H';
          break;
        case 'plus':
          type = 'L';
          break;
        case 'pro':
          type = 'P';
          break;
        case 'pure':
        default:
          type = 'N';
          break;
      }
      if (this.options.cpView) {
        this.addToHybris(data.materialnumberorg, data.length, data.hash, type, data.width, data.fits);
      } else if (this.options.extView) {
        this.addExternal(data.materialnumberorg, data.materialnumber, type, data.width, data.fits);
      } else {
        this.$spinner.show() && (window.location = this.url(data.materialnumberorg, type, data.width, data.komuro, data.length, ($.rehau.config.application.dgajax.searchtype == 'cs' ? data : null), data.hash, data.fits));
      }
      this.closeModal();
    },
    addToHybris: function (item, quantity, hash, lamination, width, fits) {
      var data = {item: item, quantity: quantity, lamination: lamination, width: width, fits: fits, hash: hash};
      data = JSON.stringify(data);
      parent && parent.postMessage(data, '*');
    },
    addExternal: function (item, materialnumber, lamination, width, fits) {
      var data = {item: item, lamination: lamination, width: width, fits: fits, materialnumber: materialnumber};
      data = JSON.stringify(data);
      parent && parent.postMessage(data, '*');
    },
    checkout: function (e) {
      e && e.preventDefault();
      this.cookieCount() !== 0 && this.$spinner.show() && window.location.replace(this.url());
      if (this.items.length) {
        this.infoModal.content.html(Mustache.render(this.options.cartTemplate, {positions: this.items}));
        this.infoModal.container.modal('show');
        var that = this;
        $('input[name=amount]', this.infoModal.container).on('change', function () {
          var $this = $(this), uniqueid = $this.closest('.product').data('uniqueid'), newAmount = parseInt($this.val()),
              newTotal = 0, item;
          if (newAmount <= 0 || isNaN(newAmount)) {
            that.checkout();
            return;
          }
          for (var i = 0, length = that.items.length; i < length; i++) {
            if (that.items[i].itemid === uniqueid) {
              item = that.items[i];
              newTotal += newAmount;
            } else {
              newTotal += that.items[i].amount;
            }
          }
          if (that.options.internalSample && (newTotal > that.options.maxSampleAmount)) {
            that.options.dgutils.showMessage(that.options.errorMaxSampleAmount + ' ' + that.options.maxSampleAmount);
            return;
          }
          item.amount = newAmount;
          that.updateBasket();
        });
      }
      return false;
    },
    order: function (post, e) {
      e && e.preventDefault();
      if ($(this).attr('href') === '#') return false;
      post && this.post();
    },
    post: function () {
      var totalAmount = 0;
      var form = $('<form/>').attr({
        action: this.options.internalSample ? this.options.internalServiceUrl + (this.options.chainSample ? 'chain' : 'single') : this.options.serviceUrl,
        method: 'POST'
      }).css({display: 'none'});
      this.options.manufacturerSpecific && form.attr('target', '_blank');
      $.each(this.items, function (count, item) {
        $('<input/>', {'name': 'selections[' + count + '].number', 'value': item.decor}).appendTo(form);
        $('<input/>', {'name': 'selections[' + count + '].embossing', 'value': item.embossing}).appendTo(form);
        $('<input/>', {'name': 'selections[' + count + '].material', 'value': item.material}).appendTo(form);
        $('<input/>', {'name': 'selections[' + count + '].lacquer', 'value': item.lacquer}).appendTo(form);
        $('<input/>', {'name': 'selections[' + count + '].manufacturer', 'value': item.manufacturer}).appendTo(form);
        $('<input/>', {'name': 'selections[' + count + '].board', 'value': item.board}).appendTo(form);
        $('<input/>', {'name': 'selections[' + count + '].amount', 'value': item.amount}).appendTo(form);
        totalAmount += parseInt(item.amount);
      });
      this.options.singleSample && ($('<input/>', {
        'type': 'hidden',
        'name': 'cost',
        'value': totalAmount * this.options.pricePerUnit / 100
      }).appendTo(form));
      this.options.chainSample && ($('<input/>', {
        'type': 'hidden',
        'name': 'amount',
        'value': $('.popup input[name=chainCount]').val()
      }).appendTo(form));
      $('<input/>', {'type': 'submit'}).appendTo(form);
      form.appendTo('body');
      form.submit();
      if (this.options.manufacturerSpecific) {
        // remove all the items from basket
        this.items.splice(0, this.items.length);
        this.update();
        this.closeModal();
        form.remove();
      }
    },
    remove: function (e) {
      e.preventDefault();
      $(e.currentTarget).closest('.product').remove();
      var item = $(e.currentTarget).data();
      if (item && item.itemid) {
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].itemid === item.itemid) {
            this.items.splice(i, 1);
            break;
          }
        }
        this.updateBasket();
        !this.items.length && this.closeModal();
      }
    },
    url: function (item, type, width, komuro, length, itemData, hash, fits) {
      // GrelBen - differentiate between hybris and webchannel url
      if (this.options.hybrisShop) {
        return this.options.webshopUrl +
          (item ? (
            '/add?item=' + item +
            '&quantity=' + length +
            '&width=' + width +
            '&lamination=' + type +
            (fits ? '&fits=' + fits : '') +
            (hash ? '&hash=' + hash : '')) : '');
      } else {
        return this.options.webshopUrl +
            '?service=' + this.options.webshopService +
            '&shop=' + this.options.webshopShop +
            '&language=' + this.options.webshopLanguage +
            '&country=' + this.options.webshopCountry +
            '&length=' + length +
            '&rurl=' + this.options.returnUrl +
            (this.options.customer && this.options.customer.length ? '&customer=' + this.options.customer : '') +
            (item ?
                '&item=' + item +
                ((type == 'L' || type == 'H') ? '&SCM_ITR_LAMINATION_EDGEBAND=' + type :
                        (komuro ? '&SCM_ITR_LAMINATION_EDGEBAND=' + type : '')
                ) +
                (komuro ? '&SCM_WIDTH=' + width : '') +
                (itemData ? '&fits=' + (itemData.fits ? encodeURI(itemData.fits) : '') : '') +
                (hash ? '&hash=' + hash : '')
                : '');
      }
    },
    updateBasket: function () {
      var amount = 0;
      for (var i = 0, length = this.items.length; i < length; i++) {
        amount += this.items[i].amount;
      }
      $('.quickBasket').text(amount || this.cookieCount() || 0);
    },
    closeModal: function (e) {
      e && e.preventDefault();
      this.infoModal.close.trigger('click');
    },
    cookieCount: function () {
      var count = $.cookie('rehauCartItems') || 0;
      if (count > 0) {
        return count;
      }
      for (var params = ($.cookie('basketITR') || '').split('|'), length = params.length, i = 0; i < length; i++) {
        var pair = (params[i] || '').split('=');
        if (pair.length && 'itemCount' == pair[0]) {
          return parseInt(pair[1]) || 0;
        }
      }
      return 0;
    }
  }
})(jQuery);
