/*! fullScreenSlider.PC_surport v1.0.0 | (c) 2016, author: 50048873@qq.com*/

'use strict';

;(function($) { 
	var defaults = { 
		clickable: true,	//默认true：支持（需另外引入支持pc的js）；false：不支持pc端的单击事件
		scrollable: true	//默认true：可滚动翻页（此功能未完成）
	};

	//寄生组合式继承方法
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

		this.pc_init(container, options);
	};

	//1.组合式继承
	//FullScreenSliderPC.prototype = new FullScreenSlider();
	//FullScreenSliderPC.prototype.constructor = FullScreenSliderPC;

	//2.寄生组合式继承（此方法最好）
	inheritPrototype(FullScreenSliderPC, FullScreenSlider);

	//3.这是我自己构思的原型继承（此方法直接将父类的原型对象付值给子类的原型对象，切断了子类与父类的原型联系。子类的原型指向了Object基类）
	//FullScreenSliderPC.prototype = FullScreenSlider.prototype;
	//FullScreenSliderPC.prototype.constructor = FullScreenSliderPC;

	//初始化pc端参数及监听
	FullScreenSliderPC.prototype.pc_init = function(container, options) { 
		this.opts = $.extend({}, defaults, options);
		if (this.opts.tb && this.opts.lr) this.opts.lr = false;

		//浏览器不支持提示
		this.isNotSupport();

		//滚动事件
		/*if (this.opts.scrollable) { 
			this.addScroll();
			this.scrollMonitor();
		}*/
		
		//导航圆点点击事件
		this.opts.clickable && this.dotClickSlide();
	};

	//兼容性判断
	FullScreenSliderPC.prototype.isNotSupport = function() { 
		if (window.client) { 
			var ie = client.browser.ie
			if (ie > 0 && ie < 9) { 
				alert('您的浏览器不支持，请升级到最新浏览器');
			}
		}
	};

	//添加滚动条
	FullScreenSliderPC.prototype.addScroll = function() { 
		$('html').add('body').css('overflow', 'visible');
	};

	//注册pc端滚动事件监听
	FullScreenSliderPC.prototype.scrollMonitor = function() { 
		var _this = this;
		var topValue = 0,// 上次滚动条到顶部的距离  
        interval = null;// 定时器  
		$(window).on('scroll', function(e) { 
			$(this).scrollTop(0)
			topValue = $(this).scrollTop();  
	        if(interval == null) { // 如果未发起时定时器，则启动定时器
	            interval = setInterval(function() { 
	            	// 判断此刻到顶部的距离是否和1秒前的距离相等  
			        if($(this).scrollTop() == topValue) { 
			        	_this.moveTo(++_this.index);
						_this.setProgressDot();
			            clearInterval(interval);  
			            interval = null;  
			        }  
	            }, 400);  
	        }

		});
	};

	//注册pc端导航圆点单击事件监听
	FullScreenSliderPC.prototype.dotClickSlide = function() { 
		var _this = this;
		this.$dots.click(function(event) { 
			var index = $(this).index();
			_this.pc_moveTo(index);
			_this.setProgressDot();
		});
	};

	//css中的transform和transition兼容对象
	FullScreenSliderPC.prototype.trans = function(obj) { 
		/*
			参数说明
			opts { 
				x: number
				y: number
			}
		*/
		var x = obj.x, y = obj.y;
		if (x >= 0) { 
			return { 
				'-webkit-transform': 'translate3d(-' + x + 'px, 0, 0)',
				   '-moz-transform': 'translate3d(-' + x + 'px, 0, 0)',
				        'transform': 'translate3d(-' + x + 'px, 0, 0)',
				'-webkit-transition': '-webkit-transform 0.4s ease-out',

				'-o-transition': '-o-transform 0.4s ease-out',
				'-moz-transition': 'transform 0.4s ease-out, -moz-transform 0.4s ease-out',
				'transition': 'transform 0.4s ease-out, -webkit-transform 0.4s ease-out, -moz-transform 0.4s ease-out, -o-transform 0.4s ease-out'
			}
		}
		if (y >= 0) { 
			return { 
				'-webkit-transform': 'translate3d(0, -' + y + 'px, 0)',
				   '-moz-transform': 'translate3d(0, -' + y + 'px, 0)',
				        'transform': 'translate3d(0, -' + y + 'px, 0)',
				'-webkit-transition': '-webkit-transform 0.4s ease-out',

				'-o-transition': '-o-transform 0.4s ease-out',
				'-moz-transition': 'transform 0.4s ease-out, -moz-transform 0.4s ease-out',
				'transition': 'transform 0.4s ease-out, -webkit-transform 0.4s ease-out, -moz-transform 0.4s ease-out, -o-transform 0.4s ease-out'
			}
		}
	};

	//滑动到下一页
	FullScreenSliderPC.prototype.pc_moveTo = function(index) { 
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