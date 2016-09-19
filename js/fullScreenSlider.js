/*! fullScreenSlider v1.0.0 | (c) 2016, author: 50048873@qq.com*/

'use strict';

;(function($) { 
	/*
		loop: false 		//false：不循环滑动；true：循环滑动
		tb: false			//上下滑动
		lr: true			//默认true：左右滑动
		cover: true			//默认true：覆盖滑动（覆盖滑动的意思是滑动时下一张动，上一张不动，下一张覆盖上一张）；false：平行滑动（平行滑动的意思是滑动时下一张、上一张同时移动）
		clickable: false	//默认false：不支持pc端的单击事件；true：支持（需另外引入支持pc的js）
	*/
	var defaults = { 
		loop: false,
		tb: false,
		lr: true,
		cover: true,
		clickable: false
	};

	function FullScreenSlider(container, options) { 
		this.init(container, options);
	};

	FullScreenSlider.prototype.init = function(container, options) { 
		this.$container = $(container);
		this.$pages = this.$container.find('.page');
		this.$nav = this.$container.siblings('nav');
		this.$dots = this.$nav.find('span');
		this.len = this.$pages.length;
		this.window_w = $(window).width();
		this.window_h = $(window).height();

		this.opts = $.extend({}, defaults, options);

		this.index = 0;
		this.zIndex = 0;

		if (this.opts.tb && this.opts.lr) this.opts.lr = false;

		//初始化页面元素
		this.redrawPage();

		//监听滑动事件
		this.slide();

		//如果不循环，则执行回弹监听
		!this.opts.loop && this.reboundMonitor();
	};

	/*FullScreenSlider.prototype.updateParams = function() { 
		this.$container = $('.page-container');
		this.$pages = this.$container.find('.page');
		this.len = this.$pages.length;
	};*/

	//初始化页面元素
	FullScreenSlider.prototype.redrawPage = function() { 
		
		if (this.opts.cover) { 
			for (var i = this.len - 1; i >= 0; i--) { 
				this.$pages.eq(i).css('zIndex', this.zIndex++);
			}
		} else { 
			$('.fullScreenSlider').removeClass('fullScreenSlider-cover').addClass('fullScreenSlider-parallel');
			/*if (this.opts.loop) { 
				this.$pages.clone().appendTo(this.$container);
				this.updateParams();
			}*/
			if (this.opts.lr) { 
				this.$container.css('width', this.window_w * this.len);
				this.$pages.css('width', this.window_w);
			} else { 
				this.$container.css('height', this.window_h * this.len);
				this.$pages.css('height', this.window_h);
			}
		}
		
		if (this.opts.tb) { 
			this.$nav.addClass('verticalDot').removeClass('horizontalDot');
		}
	};

	//判断是否第一个元素
	FullScreenSlider.prototype.isFirstElement = function(target) { 
		var firstElement = this.$pages[0];
		return firstElement == target ? true : firstElement == $(target).parent('.page')[0];
	};

	//判断是否最后一个元素
	FullScreenSlider.prototype.isLastElement = function(target) { 
		var lastElement = this.$pages[this.len - 1];
		return lastElement == target ? true : lastElement == $(target).parent('.page')[0];
	};

	//滑动到下一页
	FullScreenSlider.prototype.moveTo = function(index, direction, event) { 
		var _this = this;
		var startSlide;

		//2.如果不能循环时，且满足下面条件，则不滑动
		if (!this.opts.loop) { 
			if (this.isFirstElement(event.target) && (direction == 'down' || direction == 'right')) return;
			if (this.isLastElement(event.target) && (direction == 'up' || direction == 'left')) return;
		} 

		//1.根据索引滑动对应页面
		if (_this.opts.cover) { 
			startSlide = function(addClass, removeClass) { 
				_this.$pages.eq(index).css('zIndex', _this.zIndex++).addClass(addClass).siblings().removeClass(removeClass);
			};
			if (this.opts.tb) { 
				if (direction == 'up') { 
					startSlide('slideInUp', 'slideInUp slideInDown');
				}
				if (direction == 'down') { 
					startSlide('slideInDown', 'slideInUp slideInDown');
				}
			} 
			if (this.opts.lr) { 
				if (direction == 'left') { 
					startSlide('slideInRight', 'slideInLeft slideInRight');
				}
				if (direction == 'right') { 
					startSlide('slideInLeft', 'slideInLeft slideInRight');
				}
			}
		} else { 
			startSlide = function() { 
				if (_this.opts.lr) { 
					_this.$container.css({ 
						'-webkit-transform': 'translate3d(-' + _this.window_w * index + 'px, 0, 0)',
						'transition': '-webkit-transform 0.4s ease-out'
					});
				} else { 
					_this.$container.css({ 
						'-webkit-transform': 'translate3d(0, -' + _this.window_h * index + 'px, 0)',
						'transition': '-webkit-transform 0.4s ease-out'
					});
				}
			};
			startSlide();
		}
	};

	//取得下一个滑动元素索引
	FullScreenSlider.prototype.nextIndex = function(direction) { 
		if (this.opts.tb) { 
			if (direction == 'up') { 
				this.index++;
			}
			if (direction == 'down') { 
				this.index--;
			}
		}
		
		if (this.opts.lr) { 
			if (direction == 'left') { 
				this.index++;
			}
			if (direction == 'right') { 
				this.index--;
			}
		}

		if (this.index > this.len - 1) { 
			this.opts.loop ? this.index = 0 : this.index = this.len - 1;
		}
		if (this.index < 0) { 
			this.opts.loop ? this.index = this.len - 1 : this.index = 0;
		}
	};

	//注册滑动事件监听
	FullScreenSlider.prototype.slide = function() { 
		var _this = this;
		
		this.$pages.swipe({ 
			swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
				if (event.type === 'mouseup') return;
				_this.nextIndex(direction);
				_this.moveTo(_this.index, direction, event);
				_this.setProgressDot();
	        },
	        threshold: 10
		});
	};

	//注册首尾页弹回事件监听
	FullScreenSlider.prototype.reboundMonitor = function() { 
		var _this = this;
		
		//手指触摸
		var fingerStart = function (e) { 
			this.startPageX = e.touches[0].pageX;
			this.startPageY = e.touches[0].pageY;
		};

		//手指触摸后移动
		var fingerMove = function (e) {
			//阻止android滑动时的默认行为！
			e.preventDefault(); 

			//记录偏移量 = 移动位置座标 - 开始位置座标
			this.offsetX = e.touches[0].pageX - this.startPageX;
			this.offsetY = e.touches[0].pageY - this.startPageY;

			if (_this.opts.lr) { 
				if (_this.isFirstElement(e.target) && this.offsetX > 0 || _this.isLastElement(e.target) && this.offsetX < 0) { 
					$(_this.$pages[_this.index]).removeClass('slideInUp slideInDown slideInLeft slideInRight').css({
						'-webkit-transform': 'translate3d(' + (this.offsetX /= 2) + 'px, 0, 0)',
						'transition': 'none'
					}).siblings().css('opacity', '0');
				}
			}

			if (_this.opts.tb) { 
				if (_this.isFirstElement(e.target) && this.offsetY > 0 || _this.isLastElement(e.target) && this.offsetY < 0) { 
					$(_this.$pages[_this.index]).removeClass('slideInUp slideInDown slideInLeft slideInRight').css({
						'-webkit-transform': 'translate3d(0, ' + (this.offsetY /= 2) + 'px, 0)',
						'transition': 'none'
					}).siblings().css('opacity', '0');
				}
			}
		};

		//手指抬起
		var fingerEnd = function (e) { 
			//if (_this.isFirstElement(e.target) && (this.offsetX > 0 || this.offsetY > 0) || _this.isLastElement(e.target) && (this.offsetX < 0 || this.offsetY < 0)) { 
				var $activeEle = $(_this.$pages[_this.index]);
				$activeEle.css({
					'-webkit-transform': 'translate3d(0, 0, 0)',
					'transition': 'transform 0.2s ease-out'
				});
				setTimeout(function() { 
					$activeEle.siblings().css('opacity', '1');
				}, 200);
			//}
		};

		if (window.addEventListener) { 
			addEventListener('touchstart', fingerStart, false);
			addEventListener('touchmove', fingerMove, false);
			addEventListener('touchend', fingerEnd, false);
			addEventListener('touchcancel', fingerEnd, false);
		}
	};

	//设置小点active样式
	FullScreenSlider.prototype.setProgressDot = function() { 
		this.$dots.eq(this.index).addClass('active').siblings().removeClass('active');
	};

	$.fn.fullScreenSlider = function(options) { 
		return this.each(function(index, val) { 
			new FullScreenSlider(val, options);
		});
	};

	window.FullScreenSlider = FullScreenSlider;
})(jQuery);