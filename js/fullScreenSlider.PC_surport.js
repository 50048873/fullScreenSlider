'use strict';

;(function($) { 
	var defaults = { 
		clickable: false
	};

	function FullScreenSliderPC(container, options) { 
		FullScreenSlider.call(this, container, options);
		this.opts = $.extend({}, defaults, options);

		this.init();

		//pc支持
		this.isNotSupport();
		//this.scroll();
		this.opts.clickable && this.dotClickSlide();
	};

	FullScreenSliderPC.prototype = new FullScreenSlider();

	//兼容性判断
	FullScreenSliderPC.prototype.isNotSupport = function() { 
		var ie8 = window.navigator.userAgent.indexOf('MSIE 8');
		if (ie8 > 0) { 
			alert('您的浏览器不支持，请升级到最新浏览器，或用谷歌或火狐浏览');
		}
	};

	//注册pc端滚动事件监听（注：只有在全屏平行滑动模式下才有效）
	/*FullScreenSliderPC.prototype.scroll = function() { 
		$(window).scroll(function() { 
			console.log(1);
		});
	};*/

	//注册pc端导航圆点单击事件监听
	FullScreenSliderPC.prototype.dotClickSlide = function() { 
		var _this = this;
		this.$dots.click(function() { 
			var index = $(this).index();
			_this.moveTo(index);
			_this.setProgressDot();
		});
	};
	
	$.fn.fullScreenSlider = $.fn.fullScreenSliderPC = function(options) { 
		return this.each(function(index, val) { 
			new FullScreenSliderPC(val, options);
		});
	};

})(jQuery);