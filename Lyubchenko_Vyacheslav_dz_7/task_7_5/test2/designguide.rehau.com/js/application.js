;
(function ($) {
  'use strict';
  $.rehau.config.application = {};

  var dgutils = new $.dgutils({
    cpView: $.rehau.config.cpView
  });

  var dgajax = new $.dgajax({
    boardUpdateUrl : $.rehau.config.boardUpdateUrl,
    boardDropdownTemplate: $('#boardDropdownTemplate').html(),
    collectionUpdateUrl: $.rehau.config.collectionUpdateUrl,
    collectionDropdownTemplate: $('#collectionsDropdownTemplate').html(),
    edgeRequestUrl: $.rehau.config.edgeRequestUrl,
    manufacturerTemplate: $('#manufacturerTemplate').html().replace(/\s+/g, ' '),
    productTemplate: $('#productTemplate').html().replace(/\s+/g, ' '),
    colorSearchResults: $('#colorSearch'),
    wapAvailable: $.rehau.config.wapAvailable,
    downloadUrl: $.rehau.config.downloadUrl,
    downloadStatusUrl: $.rehau.config.downloadStatusUrl,
    downloadBlobUrl: $.rehau.config.downloadBlobUrl,
    downloadLimitText: $.rehau.config.downloadLimitText,
    downloadLimitAmount: $.rehau.config.downloadLimitAmount,
    downloadFailedText: $.rehau.config.downloadFailedText,
    dgutils: dgutils,
    noLinkedBoard: $.rehau.config.noLinkedBoard
  });

  var dgbasket = new $.basket({
    sample: $.rehau.config.sample,
    webshop: $.rehau.config.webshop,
    webshopUrl: $.rehau.config.webshopUrl,
    webshopCountry: $.rehau.config.webshopCountry,
    webshopLanguage:$.rehau.config.webshopLanguage,
    webshopShop:$.rehau.config.webshopShop,
    webshopService:$.rehau.config.webshopService,
    hybrisShop:$.rehau.config.hybrisShop,
    internalSample: $.rehau.config.internalSample,
    serviceUrl: $.rehau.config.sampleServiceUrl,
    internalServiceUrl: $.rehau.config.internalSampleServiceUrl,
    singleSample: !$.rehau.config.chainSample,
    chainSample: $.rehau.config.chainSample,
    pricePerUnit: $.rehau.config.pricePerUnit,
    manufacturerSpecific: $.rehau.config.manufacturerSpecific,
    maxSampleAmount: $.rehau.config.maxSampleAmount,
    errorMaxSampleAmount: $.rehau.config.errorMaxSampleAmount,
    cpView: $.rehau.config.cpView,
    extView: $.rehau.config.extView,
    hybrisFitsToBoard: $.rehau.config.hybrisFitsToBoard,
    dgutils: dgutils
  });

  if($.rehau.config.showCookieBar && !$.rehau.config.cpView){
    $.cookieBar();
  }

  if ($.rehau.config.internalSample) {
    var that = this;
    var chainTemplate = $('#chainTemplate').html().replace(/\s+/g, ' ');

    var $info = $('#info'), $content = $('.content', $info), $popup = $('.popup', $info), $close = $('.close', $info);
    var chain = function (e) {
      e.preventDefault();
      dgbasket.toggleSampleChain($(e.currentTarget).hasClass('chain'));
      var $body = $('body');
      dgbasket.options.singleSample && ($body.removeClass('hideSingle'));
      dgbasket.options.chainSample && ($body.removeClass('hideChain'));
      $close.show();
      $info.removeData('closeOnEsc');
      $popup.removeClass('internal');
      $close.trigger('click');
    };

    if ($.rehau.modal) {
      $content.html(chainTemplate);
      $close.hide();
      $info.data('closeOnEsc', false);
      $info.modal('show');
      $popup.addClass('internal');
      $('a.action', $content).one('click.bss.choise.click', $.proxy(chain, this));
    }
  }

  $.rehau.config.application.dgajax = dgajax;
  $.rehau.config.application.dgbasket = dgbasket;

  $(window).scroll(function () {
    ($(document).height() < $(window).scrollTop() + $(window).height() + 200) && dgajax.loadResults();
  });

  var tab = 'cs';
  dgajax.switchTab(tab);
  $('div#panels ul li a').click(function (e) {
    e.preventDefault();
    var colorSearchDiv = $('#colorSearch');
    if (e.target.rel == tab) return;
    tab = e.target.rel;
    dgajax.switchTab(tab);
  });
})(jQuery);
