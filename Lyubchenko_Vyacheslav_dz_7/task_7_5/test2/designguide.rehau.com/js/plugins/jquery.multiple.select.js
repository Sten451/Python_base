;
(function ($) {
  'use strict';
  $.multipleSelect = function (element, options) {
    this.$element = null;
    this.options = null;
    this.timeout = null;
    this.active = false;
    this.currentQuery = null;
    this._index = [];
    this._options = [];
    this.handheld = (/android|webos|ip(hone|ad|od)|blackberry|iemobile|opera mini|windows phone/i.test(navigator.userAgent.toLowerCase()));
    this.init(element, options);
  };
  $.multipleSelect.prototype = {
    constructor: $.multipleSelect,
    defaults: {
      template: {
        wrapper: '<div class="multipleSelect"/>',
        placeholder: '<span class="placeholder"/>',
        dropdown: '<div class="dropdown"><div class="search"><input type="text" autocomplete="off" spellcheck="false"><label><input type="checkbox" name="all">{{selectAll}}</label></div><div class="options"/><div class="close"><a href="#">{{submit}}</a></div></div>',
        options: '<ul>{{#options}}<li class="{{type}}"><label class="wrap"><input type="checkbox" name="{{type}}"{{#value}} value="{{value}}"{{/value}}{{#group}} data-group="{{group}}"{{/group}}/> {{label}}</label></li>{{/options}}</ul>'
      },
      maxSelected: 5,
      minChars: 3,
      translations: {
        selectAll: 'Select All',
        submit: 'Apply'
      }
    },
    init: function (element, options) {
      this.$element = $(element);
      this.options = $.extend(true, {}, this.defaults, this.$element.data(), options);
      var $wrapper = this.getWrapper();
      this.$element.after($wrapper).prependTo($wrapper);
      this.$element.on('change.bss.multiple.select.change', $.proxy(this.change, this)).trigger('change.bss.multiple.select.change');
      if (!this.handheld) {
        this.$element.hide();
      }
    },
    toggle: function (e) {
      e.stopPropagation();
      this.active ? this.close() : this.open();
    },
    open: function () {
      $(document).trigger('click.bss.multiple.select.close').one('click.bss.multiple.select.close', $.proxy(this.close, this));
      this.show();
    },
    close: function (e) {
      e && e.preventDefault();
      $(document).off('click.bss.multiple.select.close', $.proxy(this.close, this));
      this.hide();
    },
    show: function () {
      if (this.active) {
        return;
      }
      var $wrapper = this.getWrapper(), $dropdown = this.getDropdown();
      if (!$.contains($wrapper[0], $dropdown[0])) {
        $dropdown.trigger('assemble');
      }
      $wrapper.addClass('active');
      this.setChosen();
      this.updateChoice();
      this.active = true;
    },
    hide: function () {
      if (!this.active) {
        return;
      }
      this.getWrapper().removeClass('active');
      this.setSelected();
      this.$element.trigger('change');
      this.active = false;
    },
    change: function (e, reset) {
      if (e && reset) {
        this.restoreSearch();
      }
      this.setContent();
    },
    restoreSearch: function () {
      if (!this.isAssembled()) {
        return;
      }
      this.currentQuery = null;
      this.getOptions().filter(':not(:visible)').closest('.option').show();
      this.getOptionGroups().filter(':not(:visible)').closest('.group').show();
    },
    getWrapper: function () {
      return this.$wrapper = this.$wrapper || $(this.options.template.wrapper).append(this.getPlaceholder());
    },
    getPlaceholder: function () {
      return this.$placeholder = this.$placeholder || $(this.options.template.placeholder).on('click.bss.multiple.select.toggle', $.proxy(this.toggle, this));
    },
    getDropdown: function () {
      return this.$dropdown = this.$dropdown || (Mustache.parse(this.options.template.dropdown), $((Mustache.render(this.options.template.dropdown, this.options.translations))).on('click.bss.multiple.select.click', function (e) {
            e.stopPropagation();
          }).one('assemble.bss.multiple.select.assemble', $.proxy(this.assemble, this)));
    },
    getSearchInput: function () {
      return this.$searchInput = this.$searchInput || $('.search input[type="text"]', this.getDropdown());
    },
    getSelectAll: function () {
      return this.$selectAll = this.$selectAll || $('.search input[name="all"]', this.getDropdown());
    },
    getOptionsContainer: function () {
      return this.$optionsContainer = this.$optionsContainer || $('.options', this.getDropdown());
    },
    getOptionGroups: function () {
      return this.$optionGroups = this.$optionGroups || $('input[name="group"]', this.getOptionsContainer());
    },
    getOptions: function () {
      return this.$options = this.$options || $('input[name="option"]', this.getOptionsContainer());
    },
    getContent: function () {
      var $selected = this.$element.find(':selected');
      if ($selected.length) {
        return $selected.slice(0, this.options.maxSelected).map(function () {
              return $(this).text();
            }).get().join(', ') + (this.options.maxSelected < $selected.length ? ', ...' : '');
      }
      return this.$element.data('placeholder') || '';
    },
    setContent: function () {
      this.getPlaceholder().text(this.getContent());
    },
    getSelected: function () {
      return this.$element.val() || [];
    },
    setSelected: function () {
      this.$element.val(this.getChosen());
    },
    getChosen: function () {
      return this.getOptions().filter(':checked').map(function () {
        return $(this).val();
      }).get();
    },
    setChosen: function () {
      this.getOptions().val(this.getSelected());
    },
    getOptionsTemplate: function () {
      return this.options.template.options;
    },
    isAssembled: function () {
      return $.contains(this.getWrapper()[0], this.getDropdown()[0]);
    },
    assemble: function () {
      if (this.isAssembled()) {
        return;
      }
      var $dropdown = this.getDropdown(), $optionsContainer = this.getOptionsContainer(), template = this.getOptionsTemplate();
      Mustache.parse(template);
      $optionsContainer.empty().append(Mustache.render(template, {options: this.getOptionsData(this.$element.children())}));
      this.index();
      $dropdown.on('click.bss.multiple.select.click', '.close a', $.proxy(this.close, this));
      this.getSearchInput().val('').on(('oninput' in document ? 'input' : 'keyup') + '.bss.multiple.select.filter', $.proxy(this.filter, this))
          .on('keydown.bss.multiple.select.keydown', function (e) {
            13 == e.which && e.preventDefault();
          });
      this.getSelectAll().on('change.bss.multiple.select.update.choice', $.proxy(this.updateChoice, this));
      this.getOptionGroups().on('change.bss.multiple.select.update.choice', $.proxy(this.updateChoice, this));
      this.getOptions().on('change.bss.multiple.select.update.choice', $.proxy(this.updateChoice, this));
      this.getWrapper().append($dropdown);
      $optionsContainer.sticky({selectors: '.group'});
    },
    reassemble: function () {
      if (!this.isAssembled()) {
        return;
      }
      this.$optionGroups = this.$options = false;
      var $optionsContainer = this.getOptionsContainer();
      $optionsContainer.empty().append(Mustache.render(this.getOptionsTemplate(), {options: this.getOptionsData(this.$element.children())}));
      this.index();
      this.getSearchInput().val('');
      this.getOptionGroups().on('change.bss.multiple.select.update.choice', $.proxy(this.updateChoice, this));
      this.getOptions().on('change.bss.multiple.select.update.choice', $.proxy(this.updateChoice, this));
      $optionsContainer.sticky({selectors: '.group'});
    },
    updateChoice: function (e) {
      var isVisible = function () {
        return this.parentNode.parentNode.style.display != 'none';
      };
      var $options = this.getOptions().filter(isVisible), $optionGroups = this.getOptionGroups().filter(isVisible), $selectAll = this.getSelectAll();
      if (e) {
        var $element = $(e.target), name = $element.prop('name'), checked = $element.prop('checked'), group = $element.data('group');
        if (name == 'all') {
          $optionGroups.prop('checked', checked);
          $options.prop('checked', checked);
        } else if (name == 'group' || name == 'option') {
          var $siblings = $options.filter(function () {
            return $(this).data('group') == group;
          });
          if (name == 'group') {
            $siblings.prop('checked', checked);
          } else {
            $optionGroups.filter(function () {
              return $(this).data('group') == group;
            }).prop('checked', $siblings.length == $siblings.filter(':checked').length);
          }
          $selectAll.prop('checked', $options.length == $options.filter(':checked').length);
        }
      } else { // optimized
        var areChecked = [], inGroup = [];
        for (var i = 0, length = $options.length; i < length; i++) {
          $options[i].checked && areChecked.push(i);
          inGroup.push($($options[i]).data('group'));
        }
        $optionGroups.each(function () {
          if (this.parentNode.parentNode.style.display == 'none') {
            return true;
          }
          var $this = $(this), group = $this.data('group');
          for (var i = 0, length = inGroup.length; i < length; i++) {
            if (group == inGroup[i] && !$options[i].checked) {
              $this.prop('checked', false);
              return true;
            }
          }
          $this.prop('checked', true);
        });
        $selectAll.prop('checked', $options.length == areChecked.length);
      }
      this.getOptionsContainer().trigger('scroll.bss.sticky.stick');
    },
    getOptionsData: function ($elements, group) {
      var self = this;
      return $elements.filter('optgroup, option').map(function () {
        return self.getOptionData($(this), group);
      }).get();
    },
    getOptionData: function ($element, group) {
      var isOption = $element.is('option'),
          grouped = group || (!isOption ? 'group' + $element.index() : group),
          option = {
            type: isOption ? 'option' : 'group',
            label: (isOption ? $element.text() : $element.prop('label')) || '',
            value: $element.val() || '',
            group: grouped,
            wrap: false
          };
      option.wrap = option.label.indexOf('/') !== -1 || option.label.indexOf('-') !== -1;
      return isOption ? option : $.merge([option], this.getOptionsData($element.children('option'), grouped));
    },
    index: function () {
      var parent, i, length, $options = this.getOptions();
      this._index = [];
      this._options = [];
      for (i = 0, length = $options.length; i < length; i++) {
        this._options.push(parent = $options[i].parentNode.parentNode);
        this._index.push((parent.textContent || parent.innerText).trim().toLowerCase());
      }
    },
    filter: function (e) {
      var self = this;
      this.timeout && clearTimeout(this.timeout);
      this.timeout = setTimeout(function () {
        self.search2($(e.target).val());
      }, 200);
    },
    search2: function (text) { // optimized
      var query = text.trim().toLowerCase();
      if (this.currentQuery == query) {
        return;
      }
      this.currentQuery = query;
      var $options = this.getOptions(), $optionGroups = this.getOptionGroups(), i, length, hide, groups = [];
      if (query.length < this.options.minChars) {
        for (i = 0, length = this._options.length; i < length; i++) {
          this._options[i].style.display = 'block';
          groups.push($($options[i]).data('group'));
        }
      } else {
        for (i = 0, length = this._index.length; i < length; i++) {
          (hide = this._index[i].indexOf(query) < 0) || groups.push($($options[i]).data('group'));
          this._options[i].style.display = hide ? 'none' : 'block';
        }
      }
      for (i = 0, length = $optionGroups.length; i < length; i++) {
        $optionGroups[i].parentNode.parentNode.style.display = groups.indexOf($($optionGroups[i]).data('group')) < 0 ? 'none' : 'block';
      }
      this.getSelectAll()[0].parentNode.style.display = groups.length ? 'block' : 'none';
      this.updateChoice();
    },
    search: function (text) { // not optimized
      var query = text.trim().toLowerCase();
      if (this.currentQuery == query) {
        return;
      }
      this.currentQuery = query;
      var $options = this.getOptions(), $optionGroups = this.getOptionGroups();
      if (query.length < this.options.minChars) {
        $options.closest('.option').show();
      } else {
        $options.each(function () {
          var $row = $(this).closest('.option');
          $row[$row.text().toLowerCase().indexOf(query) < 0 ? 'hide' : 'show']();
        });
      }
      var $visibleOptions = $options.filter(':visible');
      $optionGroups.each(function () {
        var $this = $(this), $row = $this.closest('.group'), group = $this.data('group');
        $row[$visibleOptions.filter(function () {
          return $(this).data('group') == group
        }).length ? 'show' : 'hide']();
      });
      this.getSelectAll().closest('label')[$visibleOptions.length ? 'show' : 'hide']();
      this.updateChoice();
    }
  };
  $.multipleSelect.refresh = function (element) {
    var $this = $(element), data = $this.data('bss.multiple.select');
    data && data.reassemble();
    return $this;
  };
  $.fn.multipleSelect = function (options) {
    return this.filter('select[multiple]').each(function () {
      var $this = $(this), data = $this.data('bss.multiple.select');
      data || $this.data('bss.multiple.select', (new $.multipleSelect(this, typeof options == 'object' && options)));
    });
  };
}(jQuery));
