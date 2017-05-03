//! formHelper.js
//! version : 0.0.1
//! authors : Yanhan, Moment.js contributors
//! license : MIT
(function($) {
    var FormHelper = function(form, action, args) {
		this.$form = $(form);
		this.action = action;
		if (this["_" + action]) {
			this["_" + action](args);
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
		}
	};

	$.fn.formHelper = function(action, args) {
        var params = arguments;
        return this.each(function() {
			new FormHelper(this, action, args);
        });
    };
}(window.jQuery));
