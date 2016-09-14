'use strict';

;(function($) { 
	var defaults = { 
		clickable: true
	};

	function FullScreenSliderPC(options) { 
		FullScreenSlider.call(this);
		this.opts = $.extend({}, defaults, options);
		console.log(this.opts);

		this.opts.clickable && this.dotClickSlide();
	};
	FullScreenSliderPC.prototype = new FullScreenSlider();
	console.log(FullScreenSliderPC);


	//兼容性判断
	FullScreenSliderPC.prototype.isNotSupport = function() { 
		var ie8 = window.navigator.userAgent.indexOf('MSIE 8');
		if (ie8 > 0) { 
			alert('您的浏览器不支持，请升级到最新浏览器，或用谷歌或火狐浏览');
		}
	};

	//注册pc端滚动事件监听（注：只有在全屏平行滑动模式下才有效）
	FullScreenSliderPC.prototype.scroll = function() { 
		$(window).scroll(function() { 
			console.log(1);
		});
	};

	//注册pc端导航圆点单击事件监听
	FullScreenSliderPC.prototype.dotClickSlide = function() { 
		console.log(this);
		var _this = this;
		this.clickable && this.$dots.click(function() { 
			var index = $(this).index();
			_this.goTo(index);
			_this.setProgressDot();
		});
	};

	new FullScreenSliderPC();

})(jQuery);