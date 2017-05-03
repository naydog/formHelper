//! formHelper.js
//! version : 0.1.1
//! authors : Yanhan, formHelper.js contributors
//! license : MIT
//! https://github.com/naydog/formHelper/
if (typeof jQuery === 'undefined') {
    throw new Error('FormHelper requires jQuery');
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
				if ($(this).is("input")) {
					$(this).attr("value", args[$(this).attr("name")]);
				} else if ($(this).is("select")){
					$("option[value='" + args[$(this).attr("name")] + "']", this).attr("selected", "selected");
				} else if ($(this).is("textarea")) {
					$(this).html(args[$(this).attr("name")]);
				}
			});
			this._reset();
		},

		_clearDefault: function() {
			$("[name]", this.$form).each(function() {
				if ($(this).is("input")) {
					$(this).removeAttr("value");
				} else if ($(this).is("select")){
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

    // _serializeJson: function(){
  	// 	var arr = this.$form.serializeArray();
  	// 	var obj = {};
  	// 	for (var i = 0 ; i < arr.length; i++) {
  	// 		if (obj[arr[i].name]) {
  	// 			obj[arr[i].name] = [obj[arr[i].name], arr[i].value];
  	// 		} else {
  	// 			obj[arr[i].name]= arr[i].value;
  	// 		}
  	// 	}
  	// 	return obj;
  	// }
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
