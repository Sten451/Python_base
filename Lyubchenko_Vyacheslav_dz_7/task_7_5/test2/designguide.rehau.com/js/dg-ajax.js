;
(function($) {
  'use strict';
  $.dgajax = function (options) {
    this.$spinner = $('.spinner');
    this.options = null;
    this.init(options);
  };
  $.dgajax.prototype = {
    constructor: $.dgajax,
    lastManufacturer: '',
    processing: !1,
    currentTab: '',
    previous: {},
    request: null,
    offset: 0,
    stop: !1,
    jobId: null,
    defaults: {
      boardSearchForm: $('form#boardSearch'),
      boardDropdown: $('form#boardSearch #board'),
      boardUpdateUrl: '',
      boardDropdownTemplate: '',
      collectionUpdateUrl: '',
      collectionDropdownTemplate: '',
      manufacturerDropdown: $('form#boardSearch #manufacturer'),
      decorDropdown: $('form#boardSearch #decor'),
      dimensionDropdown: $('form#boardSearch #dimension'),
      materialDropdown: $('form#boardSearch #material'),
      typeDropdown: $('form#boardSearch #type'),
      embossingDropdown: $('form#boardSearch #embossing'),
      lacquerDropdown: $('form#boardSearch #lacquer'),
      collectionDropdown: $('form#boardSearch #collection'),
      decorDecorDropdown: $('form#decorSearch #decor2'),
      dimensionDecorDropdown: $('form#decorSearch #dimension2'),
      materialDecorDropdown: $('form#decorSearch #material2'),
      embossingDecorDropdown: $('form#decorSearch #embossing2'),
      lacquerDecorDropdown: $('form#decorSearch #lacquer2'),
      materialNumberInput: $('form#materialSearch #txtMaterialNumber'),
      edgeRequestUrl: '',
      manufacturerTemplate: '',
      productTemplate: '',
      colorSearchResults: $('#colorSearch'),
      wapAvailable: !1,
      downloadUrl: '',
      downloadStatusUrl: '',
      downloadBlobUrl: '',
      downloadLimitText: '',
      downloadFailedText: '',
      downloadLimitAmount: 0,
      dgutils: null,
      noLinkedBoard: ''
    },
    init: function (options) {
      this.options = $.extend({}, this.defaults, options);
      Mustache.parse(this.options.boardDropdownTemplate);
      Mustache.parse(this.options.collectionDropdownTemplate);
      Mustache.parse(this.options.manufacturerTemplate);
      Mustache.parse(this.options.productTemplate);
      this.bindEvents();
    },
    bindEvents: function() {
      this.options.manufacturerDropdown.on('change', $.proxy(this.updateBoardDropdown, this));
      this.options.manufacturerDropdown.on('change', $.proxy(this.updateCollections, this));
      $('select[multiple]').on('change', function(e) {
        if (this.isPrevious(this.serializeForm())) {
          return;
        }
        var $target = $(e.target);
        if ($target[0] == this.options.manufacturerDropdown[0] && (this.options.manufacturerDropdown.val() || []).length) {
          (this.options.decorDropdown.val() || []).length && this.options.decorDropdown.val('') && this.options.decorDropdown.trigger('change', [true]);
        } else if ($target[0] == this.options.decorDropdown[0] && (this.options.decorDropdown.val() || []).length) {
          (this.options.manufacturerDropdown.val() || []).length && this.options.manufacturerDropdown.val('') && this.options.manufacturerDropdown.trigger('change', [true]);
          (this.options.boardDropdown.val() || []).length && this.options.boardDropdown.val('') && this.options.boardDropdown.trigger('change', [true]);
        }
        this.clearResults();
        this.loadResults();
      }.bind(this));
      $('a[rel="reset"]').on('click', function (e) {
        e.preventDefault();
        var $form = $(this).closest('form');
        $form.trigger('reset');
        $form.find('select[multiple]').trigger('change', [true]);
        $form.find('select, [name="advanced"]').trigger('change', [true]);
      });
      $('#materialSearch').on('submit', function(e) {
        e && e.preventDefault();
        this.clearResults(true);
      }.bind(this));
      $('.button[rel="pdf"], .button[rel="decor-pdf"]').on('click', $.proxy(this.download, this, {resultType: 'pdf'}));
      $('.button[rel="excel"], .button[rel="decor-excel"]').on('click', $.proxy(this.download, this, {resultType: 'excel'}));
      $('.button[rel="search"]').on('click', function(e) {
        e && e.preventDefault();
        $(this).closest('form').submit();
      });
    },
    clone: function(obj) {
      if ('object' !== typeof obj) {
        return obj;
      }
      var tmp = {}, key;
      for (key in obj) {
        obj.hasOwnProperty(key) && (tmp[key] = obj[key]);
      }
      return tmp;
    },
    download: function(options, e) {
      e && e.preventDefault();
      if (this.options.wapAvailable && !options.selection) {
        return;
      }
      this.$spinner.show();
      var data = this.serializeForm();
      if (!data.group && this.options.downloadLimitAmount && (data.manufacturers.length > this.options.downloadLimitAmount || data.manufacturers.length === 0)) {
        this.$spinner.hide();
        this.options.dgutils.showMessage(this.options.downloadLimitText);
        return;
      }
      data.offset = 0;
      data.downloadType = options.resultType.toUpperCase() + "_FULL";
      $.ajax({
        url: this.options.downloadUrl,
        data: JSON.stringify(data),
        method: 'post',
        cache : false,
        contentType: 'application/json',
        success: function(data) {
          if (!data) {
            this.$spinner.hide();
            this.options.dgutils.showMessage(this.options.downloadFailedText);
          }
          this.jobId = data.jobId;
          window.setTimeout($.proxy(this.checkForFinishedJob, this), 2000);
        }.bind(this),
        error: function() {
          this.$spinner.hide();
          console.log('error');
        }.bind(this)
      });
    },
    checkForFinishedJob: function() {
      if (this.jobId) {
        $.ajax({
          url: this.options.downloadStatusUrl + this.jobId,
          method: 'get',
          cache : false,
          contentType: 'application/json',
          success: function (data) {
            if (data.ready) {
              this.downloadBlob();
            } else {
              window.setTimeout($.proxy(this.checkForFinishedJob, this), 2000);
            }
          }.bind(this),
          error: function () {
            this.$spinner.hide();
            console.log('error');
          }.bind(this)

        });
      }
    },
    downloadBlob: function() {
      var form = $('<form/>').attr({action: this.options.downloadBlobUrl + this.jobId, method: 'GET', target: '_blank'}).css({display: 'none'});
      form.appendTo($('body'));
      form.submit();
      this.jobId = null;
      this.$spinner.hide();
      setTimeout(function() {
          form.remove();
      }, 100);
    },
    isPrevious: function(data) {
      var previousProps = Object.getOwnPropertyNames(this.previous), dataProps = Object.getOwnPropertyNames(data);
      if (previousProps.length != dataProps.length) {
        this.previous = this.clone(data);
        return false;
      }
      for (var i = 0; i < previousProps.length; i++) {
        var propName = previousProps[i];
        if (Array.isArray(this.previous[propName])) {
          if (this.previous[propName].length != data[propName].length || !this.previous[propName].every(function (e, j) {
              return e === data[propName][j];
            })) {
            this.previous = this.clone(data);
            return false;
          }
        } else if (this.previous[propName] !== data[propName]) {
          this.previous = this.clone(data);
          return false;
        }
      }
      return true;
    },
    switchTab: function(tab) {
      this.currentTab = tab;
      this.request && this.request.abort();
      this.processing = false;
      this.clearResults();
      'cs' === tab && (this.options.colorSearchResults.show(), this.options.colorSearchResults.removeClass('decor'));
      'ds' === tab && (this.options.colorSearchResults.show(), this.options.colorSearchResults.addClass('decor'));
      'ms' === tab && (this.options.colorSearchResults.show(), this.options.colorSearchResults.addClass('decor'));
      'sl' === tab && (this.options.colorSearchResults.hide());
    },
    clearResults: function(force) {
      this.lastManufacturer = '';
      this.offset = 0;
      $('.manufacturer, .product', this.options.colorSearchResults).remove();
      if (this.currentTab === 'cs' || this.currentTab === 'ds' || force) {
        this.stop = !1;
        this.loadResults();
      } else {
        this.stop = !0;
      }
    },
    serializeForm: function() {
      var data = {};
      switch (this.currentTab) {
        case 'cs':
          data = {
            manufacturers: this.options.manufacturerDropdown.val(),
            boards: this.options.boardDropdown.val(),
            decors: this.options.decorDropdown.val(),
            dimensions: this.options.dimensionDropdown.val(),
            materials: this.options.materialDropdown.val(),
            types: this.options.typeDropdown.val(),
            embossings: this.options.embossingDropdown.val(),
            lacquers: this.options.lacquerDropdown.val(),
            collections: this.options.collectionDropdown.val(),
            group: false
          };
          break;
        case 'ds':
          data = {
            decors: this.options.decorDecorDropdown.val(),
            dimensions: this.options.dimensionDecorDropdown.val(),
            materials: this.options.materialDecorDropdown.val(),
            embossings: this.options.embossingDecorDropdown.val(),
            lacquers: this.options.lacquerDecorDropdown.val(),
            group: true
          };
          break;
        case 'ms':
          data = {
            materialNumber: this.options.materialNumberInput.val(),
            group: true
          }
      }
      return data;
    },
    loadResults: function() {
      if (!this.processing && !this.stop) {
        this.processing = !0;
        this.previous = this.serializeForm();
        var data = this.clone(this.previous);
        data.offset = this.offset;
        this.request = $.ajax({
          url: this.options.edgeRequestUrl,
          data: JSON.stringify(data),
          method: 'post',
          cache : false,
          contentType: 'application/json',
          success: function(data) {
            this.processing = !1;
            this.processResponse(data);
          }.bind(this),
          error: function() {
            this.processing = !1;
          }.bind(this)
        });
      }
    },
    processResponse: function (data) {
      var boards = [], colors = [], lastBoardName, lastCollections = [], lastCommingSoon = !1;
      this.offset = data.offset;
      if (data.edges.length == 0) {
        this.stop = !0;
        if (this.currentTab == 'ms' && !this.offset) {
          this.options.dgutils.showMessage($.rehau.config.materialNumberNotFound);
        }
        return;
      }
      data.edges.forEach(function(entry) {
        var boardName;
        if (this.lastManufacturer != entry.manufacturerName) {
          lastBoardName && (boards.push({manufacturerName: this.lastManufacturer, boardName: lastBoardName, colors: colors, collections: lastCollections, commingSoon: lastCommingSoon}), lastBoardName = '');
          boards.length && (this.addProducts(boards), boards = [], colors = []);
          this.addManufacturer({manufacturerName: entry.manufacturerName});
          this.lastManufacturer = entry.manufacturerName;
        }
        boardName = entry.boardName;
        if (lastBoardName && (lastBoardName != boardName)) {
          colors.length && boards.push({manufacturerName: this.lastManufacturer, boardName: lastBoardName, colors: colors, collections: lastCollections, commingSoon: lastCommingSoon});
          colors = [];
        }
        lastBoardName = boardName;
        lastCollections = entry.collections || [];
        lastCommingSoon = entry.commingSoon || !1;
        //entry.dim = encodeURI(JSON.stringify(entry.dimensions));
        colors.push(entry);
      }.bind(this));
      boards.push({manufacturerName: this.lastManufacturer, boardName: lastBoardName, colors: colors, collections: lastCollections, commingSoon: lastCommingSoon});
      this.addProducts(boards);
    },
    addManufacturer: function(data) {
      this.options.colorSearchResults.append(Mustache.render(this.options.manufacturerTemplate, data));
    },
    addProducts: function(data) {
      this.options.colorSearchResults.append(Mustache.render(this.options.productTemplate, {laminates: data}));
      this.cleanupEmptyManufacturers();
    },
    updateBoardDropdown: function() {
      var data = {manufacturerIds: this.options.manufacturerDropdown.val()};
      $.ajax({
        url: this.options.boardUpdateUrl,
        data: JSON.stringify(data),
        method: 'post',
        cache : false,
        contentType: 'application/json',
        success: function(data) {
          this.options.boardDropdown.html(Mustache.render(this.options.boardDropdownTemplate, {manufacturers: data}));
          $.autoCompleteSelect.refresh(this.options.boardDropdown) && $.multipleSelect.refresh(this.options.boardDropdown);
        }.bind(this)
      });
    },
    updateCollections: function() {
      var data = {manufacturerIds: this.options.manufacturerDropdown.val()}
      $.ajax({
        url: this.options.collectionUpdateUrl,
        data: JSON.stringify(data),
        method: 'post',
        cache : false,
        contentType: 'application/json',
        success: function(data) {
          this.options.collectionDropdown.html(Mustache.render(this.options.collectionDropdownTemplate, {collections: data}));
          $.autoCompleteSelect.refresh(this.options.collectionDropdown) && $.multipleSelect.refresh(this.options.collectionDropdown);
        }.bind(this)
      });
    },
    cleanupEmptyManufacturers: function () {
      var that = this;
      var $otherProducts = $('.product h3[data-manufacturer="' + that.options.noLinkedBoard + '"]:not(:first)').parent().parent();
      $otherProducts.each(function () {
        var $lastVariant = $('.product h3[data-manufacturer="' + that.options.noLinkedBoard + '"]:first').parent().parent().find('.variant:last');
        $lastVariant.after($(this).find('.variant'));
        $(this).remove();
      });
    }
  }
})(jQuery);
