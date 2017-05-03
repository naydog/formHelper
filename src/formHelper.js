//! formHelper.js
//! version : 0.1.2
//! authors : Yanhan, formHelper.js contributors
//! license : MIT
//! https://github.com/naydog/formHelper/
if (typeof jQuery === 'undefined') {
    throw new Error('FormHelper requires jQuery');
}

if (!Array.prototype.indexOf){
  Array.prototype.indexOf = function(elt /*, from*/){
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++){
      if (from in this && this[from] === elt)
        return from;
    }
    return -1;
  };
}

(function($) {
    var FormHelper = function(form, action, args) {
		this.$form = $(form);
    switch(typeof action) {
      case "string":
      this.action = action;
  		if (this["_" + action]) {
  			this["_" + action](args);
  		}
      break;
      case "object":
      break;
    }
	};

	FormHelper.prototype = {
    constructor: FormHelper,

		_setDefault: function (args) {
			$("[name]", this.$form).each(function() {
        var val = args[$(this).attr("name")];
        if (val) {
          if ($(this).is("input")) {
            switch($(this).attr("type")) {
              case "radio":
              case "checkbox":
              if (val === $(this).val() || (val.length && val.indexOf($(this).val()) > -1)) {
                $(this).attr("checked", "checked");
              }
              break;
              case "button":
              case "submit":
              case "reset":
              case "image":
              break;
              default:
              $(this).attr("value", val);
            }
  				} else if ($(this).is("select")) {
            if (val.length) {
              for (var i = 0; i < val.length; i++) {
                $("option[value='" + val[i] + "']", this).attr("selected", "selected");
              }
            } else {
              $("option[value='" + val + "']", this).attr("selected", "selected");
            }
  				} else if ($(this).is("textarea")) {
  					$(this).html(val);
  				}
        }
			});
			this._reset();
		},

		_clearDefault: function() {
			$("[name]", this.$form).each(function() {
				if ($(this).is("input")) {
          switch($(this).attr("type")) {
            case "radio":
            case "checkbox":
            $(this).removeAttr("checked");
            break;
            case "button":
            case "submit":
            case "reset":
            case "image":
            break;
            default:
            $(this).removeAttr("value");
          }
				} else if ($(this).is("select")) {
					$("option", this).removeAttr("selected");
				} else if ($(this).is("textarea")) {
					$(this).html(null);
				}
			});
			this._reset();
		},

		_reset: function() {
			this.$form[0].reset();
		},

    _validate: function(args) {
      //this.$form
    },
	};

	$.fn.formHelper = function(action, args) {
    var params = arguments;
    return this.each(function() {
      new FormHelper(this, action, args);
    });
  };

  $.fn.serializeJson = function() {
		var arr = $(this).serializeArray();
		var obj = {};
		for (var i = 0 ; i < arr.length; i++) {
			if (obj[arr[i].name]) {
				obj[arr[i].name] = [obj[arr[i].name], arr[i].value];
			} else {
				obj[arr[i].name]= arr[i].value;
			}
		}
		return obj;
	};
}(window.jQuery));
