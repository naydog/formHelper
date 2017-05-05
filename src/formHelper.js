//! formHelper.js
//! version : 0.1.2
//! authors : Yanhan, formHelper.js contributors
//! license : MIT
//! https://github.com/naydog/formHelper/
if (typeof jQuery === 'undefined') {
    throw new Error('FormHelper requires jQuery');
}
if (!jQuery.ajaxFileUpload) {
  throw new Error('FormHelper requires jQuery ajaxFileUpload plugin');
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
    }

/*    _fileInput: function(args) {
      if (!this.$form.is("input[type='file']")) {
        return;
      }
      if (this.$form.parent().is("div.fh-file-input")) {
        return;
      }
      var thisScope = this;
      this.$form.addClass("fh-file-input-control");
      this.$form.wrap("<div class='fh-file-input'><div class='fh-file-input-wrapper'></div></div>");
      var $parent = this.$form.parent().parent();
      if (navigator.userAgent.indexOf("MSIE") == -1) {
        $parent.append("<button type='button' class='fh-file-browse'>Browse</button>");
        $(".fh-file-browse", $parent).on("click", function() {
          thisScope.$form.click();
        });
      }
      $parent.append("<button type='button' class='fh-file-submit'>Upload</button>");
      $parent.prepend("<div class='fh-file-preview'><div class='fh-file-preview-wrapper'><div class='fh-file-preview-fake'>"
        + "<img class='fh-file-preview-img' src='' alt='头像'/></div></div><br/>"
        + "<img class='fh-file-preview-size-fake' /></div>");

      var objPreview = $('.fh-file-preview-img', $parent)[0];
      var objPreviewFake = $('.fh-file-preview-fake', $parent)[0];
      var objPreviewSizeFake = $('.fh-file-preview-size-fake', $parent)[0];
      var filePreview = $('.fh-file-preview');

      function __onUploadImgChange(sender) {
      	if (!sender.value.match(/.jpg|.gif|.png|.bmp/i)) {
      		return false;
      	}

      	if (sender.files && sender.files[0]) {
      		objPreview.style.display = 'block';
      		objPreview.style.width = 'auto';
      		objPreview.style.height = 'auto';
      		try {
      			objPreview.src = sender.files[0].getAsDataURL();
      		} catch (e) {
      			var reader = new FileReader();
      			reader.onload = function(e) {
      				objPreview.src = e.target.result;
      			}
      			reader.readAsDataURL(sender.files[0]);
      		}
      		// Firefox 因安全性问题已无法直接通过 input[file].value 获取完整的文件路径
      	} else if (objPreviewFake.filters) {
      		// IE7,IE8 在设置本地图片地址为 img.src 时出现莫名其妙的后果
      		//（相同环境有时能显示，有时不显示），因此只能用滤镜来解决
      		// IE7, IE8因安全性问题已无法直接通过 input[file].value 获取完整的文件路径
      		sender.select();
      		sender.blur();
      		var imgSrc = document.selection.createRange().text;
      		objPreviewFake.filters
      				.item('DXImageTransform.Microsoft.AlphaImageLoader').src = imgSrc;
      		objPreviewSizeFake.filters
      				.item('DXImageTransform.Microsoft.AlphaImageLoader').src = imgSrc;
      		__autoSizePreview(objPreviewFake, objPreviewSizeFake.offsetWidth,
      				objPreviewSizeFake.offsetHeight);
      		objPreview.style.display = 'none';
      	}
      }

      function __onPreviewLoad(sender) {
      	__autoSizePreview(sender, sender.offsetWidth, sender.offsetHeight);
      }

      function __autoSizePreview(objPre, originalWidth, originalHeight) {
      	var zoomParam = __calcImgZoomParam(filePreview.width(), filePreview.height(), originalWidth, originalHeight);
      	objPre.style.width = zoomParam.width + 'px';
      	objPre.style.height = zoomParam.height + 'px';
      	objPre.style.marginTop = zoomParam.top + 'px';
      	objPre.style.marginLeft = zoomParam.left + 'px';
      }

      function __calcImgZoomParam(maxWidth, maxHeight, width, height) {
      	var param = {
      		width : width,
      		height : height,
      		top : 0,
      		left : 0
      	};
      	if (width > maxWidth || height > maxHeight) {
      		rateWidth = width / maxWidth;
      		rateHeight = height / maxHeight;

      		if (rateWidth > rateHeight) {
      			param.width = maxWidth;
      			param.height = height / rateWidth;
      		} else {
      			param.width = width / rateHeight;
      			param.height = maxHeight;
      		}
      	}

      	param.left = (maxWidth - param.width) / 2;
      	param.top = (maxHeight - param.height) / 2;
      	return param;
      }

      $(".fh-file-preview-img", $parent).on("load", function() {
        __onPreviewLoad($(this)[0]);
      });
      this.$form.on("change", function() {
        __onUploadImgChange($(this)[0]);
      });

      $(".fh-file-submit", $parent).on("click", function() {
        // var fd = new FormData();
        // fd.append(thisScope.$form[0].name, thisScope.$form[0].files[0]);
        // for (var item in args.uploadExtraData) {
        //   fd.append(item, args.uploadExtraData[item]);
        // }
        // $.ajax({
  			// 	type: 'post',
  			// 	url: args.uploadUrl,
  			// 	processData: false,
  			// 	contentType: false,
  			// 	dataType: "json",
        //   data: fd,
  			// 	success: args.onSuccess,
        //   error: args.onError
        // });

        //jquery.form
        // var form = document.createElement("form");
        // form.id = "fhform" + new Date().getTime();
        // form.enctype = "multipart/form-data";
        // if (args.uploadExtraData) {
        //   for (var item in args.uploadExtraData) {
        //     $(form).append("<input type='hidden' name='" + item + "' value='" + args.uploadExtraData[item] + "' />");
        //   }
        // }
        // $("body").append(form);
        // var o = thisScope.$form.parent();
        // thisScope.$form.appendTo(form);
        //
        // $("#picForm").ajaxForm({
        //   url : args.uploadUrl, // 请求的url
        //   type : "post", // 请求方式
        //   dataType : "text", // 响应的数据类型
        //   async :true, // 异步
        //   success : args.success,
        //   error : args.error
        // }).submit();

        if(!thisScope.$form.attr("id")) {
          thisScope.$form.attr("id", "uploadid" + new Date().getTime());
        }
console.log("111");
        $.ajaxFileUpload({
          url: args.uploadUrl,

                 fileElementId: thisScope.$form.attr("id"),
                  data: args.uploadExtraData,
                  success: args.success,
                  error: args.error,
                  type: "post"
        });
      });
    }*/
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
