/*! fullScreenSlider.PC_surport v1.0.0 | (c) 2016, author: 50048873@qq.com*/

'use strict';

;(function($) { 
	var defaults = { 
		clickable: false
	};


	function inheritPrototype(subType, superType){
		function F() {};
		F.prototype = superType.prototype;
		var prototype = new F();
		
		subType.prototype = prototype; //指定对象
		prototype.constructor = subType; //增强对象
	}

	function FullScreenSliderPC(container, options) { 
		//1.效果与2相同，但会多调用一次父类构造函数
		//FullScreenSlider.call(this, container, options); 

		//2.这种方法不会调用父类构造函数，只是调用父类原型上共享的方法
		this.init.call(this, container, options);

		this.opts = $.extend({}, defaults, options);
		if (this.opts.tb && this.opts.lr) this.opts.lr = false;

		//pc支持
		this.isNotSupport();
		this.scroll();
		this.opts.clickable && this.dotClickSlide();
	};

	//1.组合式继承
	//FullScreenSliderPC.prototype = new FullScreenSlider();
	//FullScreenSliderPC.prototype.constructor = FullScreenSliderPC;

	//2.寄生组合式继承（此方法最好）
	inheritPrototype(FullScreenSliderPC, FullScreenSlider);

	//3.这是我自己构思的原型继承（此方法直接将父类的原型对象付值给子类的原型对象，切断了子类与父类的原型联系。子类的原型指向了Object基类）
	//FullScreenSliderPC.prototype = FullScreenSlider.prototype;
	//FullScreenSliderPC.prototype.constructor = FullScreenSliderPC;

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
		var _this = this;
		this.$dots.click(function(event) { 
			var index = $(this).index();
			_this.moveTo(index);
			_this.setProgressDot();
		});
	};

	/*
		参数说明
		opts { 
			x: number
			y: number
		}
	*/
	FullScreenSliderPC.prototype.trans = function(obj) { 
		var x = obj.x, y = obj.y;
		if (x >= 0) { 
			return { 
				'-webkit-transform': 'translate3d(-' + x + 'px, 0, 0)',
				   '-moz-transform': 'translate3d(-' + x + 'px, 0, 0)',
				        'transform': 'translate3d(-' + x + 'px, 0, 0)',
				'-webkit-transition': '-webkit-transform 0.4s ease-out',

				'transition': '-webkit-transform 0.4s ease-out',
				'-o-transition': '-o-transform 0.4s ease-out',
				'-moz-transition': 'transform 0.4s ease-out, -moz-transform 0.4s ease-out',
				'transition': 'transform 0.4s ease-out',
				'transition': 'transform 0.4s ease-out, -webkit-transform 0.4s ease-out, -moz-transform 0.4s ease-out, -o-transform 0.4s ease-out'
			}
		}
		if (y >= 0) { 
			return { 
				'-webkit-transform': 'translate3d(0, -' + y + 'px, 0)',
				   '-moz-transform': 'translate3d(0, -' + y + 'px, 0)',
				        'transform': 'translate3d(0, -' + y + 'px, 0)',
				'-webkit-transition': '-webkit-transform 0.4s ease-out',

				'transition': '-webkit-transform 0.4s ease-out',
				'-o-transition': '-o-transform 0.4s ease-out',
				'-moz-transition': 'transform 0.4s ease-out, -moz-transform 0.4s ease-out',
				'transition': 'transform 0.4s ease-out',
				'transition': 'transform 0.4s ease-out, -webkit-transform 0.4s ease-out, -moz-transform 0.4s ease-out, -o-transform 0.4s ease-out'
			}
		}
	};

	//滑动到下一页
	FullScreenSliderPC.prototype.moveTo = function(index) { 
		var _this = this;

		//1.根据索引滑动对应页面
		if (_this.opts.cover) { 
			var startSlide = function(addClass, removeClass) { 
				_this.$pages.eq(index).css('zIndex', _this.zIndex++).addClass(addClass).siblings().removeClass(removeClass);
			};
			if (this.opts.lr) { 
				if (index > _this.index) { 
					startSlide('slideInRight', 'slideInLeft slideInRight');
				} else { 
					startSlide('slideInLeft', 'slideInLeft slideInRight');
				}
			}
			if (this.opts.tb) { 
				if (index > _this.index) { 
					startSlide('slideInUp', 'slideInUp slideInDown');
				} else { 
					startSlide('slideInDown', 'slideInUp slideInDown');
				}
			} 
		} else { 
			if (_this.opts.lr) { 
				_this.$container.css(_this.trans({x: _this.window_w * index}));
			} 
			if (this.opts.tb) { 
				_this.$container.css(_this.trans({y: _this.window_h * index}));
			}
		}
		
		_this.index = index;
	};
	
	$.fn.fullScreenSlider = $.fn.fullScreenSliderPC = function(options) { 
		return this.each(function(index, val) { 
			var instance = new FullScreenSliderPC(val, options);
			//console.log(instance);
		});
	};

})(jQuery);