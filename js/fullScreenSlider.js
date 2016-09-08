'use strict';

;(function($) { 
	/*
		loop: false, 	//默认不循环滚动
		tb: true,		//默认上下滑动
		lr: false		//左右滑动
	*/
	var defaults = { 
		loop: false,
		tb: false,
		lr: true
	};

	function FullScreenSlider(container, options) { 
		this.$container = $(container);
		this.$pages = this.$container.find('.page');
		this.len = this.$pages.length;

		this.opts = $.extend({}, defaults, options);

		this.index = 0;
		this.zIndex = 0;

		if (this.opts.tb && this.opts.lr) this.opts.tb = false;

		//默认初始化页面元素zIndex层级
		this.init_zIndex();

		//默认监听滑动事件
		this.slide();

		//如果不循环，则执行回弹监听
		if (!this.opts.loop) { 
			this.reboundMonitor();
		}
	};

	//初始化页面元素zIndex层级
	FullScreenSlider.prototype.init_zIndex = function() { 
		for (var i = this.len - 1; i >= 0; i--) { 
			this.$pages.eq(i).css('zIndex', this.zIndex++);
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
	FullScreenSlider.prototype.goTo = function(index, direction) { 
		var _this = this;

		//1.如果不能循环时，且满足下面条件，则不执行2
		if (!this.opts.loop) { 
			if (this.isFirstElement(event.target) && (direction == 'down' || direction == 'right')) return;
			if (this.isLastElement(event.target) && (direction == 'up' || direction == 'left')) return;
		} 
		
		//2.根据索引滑动对应页面
		var startSlide = function(add_class, remove_class) { 
			_this.$pages.eq(index).css('zIndex', _this.zIndex++).addClass(add_class).siblings().removeClass(remove_class);
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
	};

	//取得下一个滑动元素索引
	FullScreenSlider.prototype.nextIndex = function(direction) { 

		if (this.opts.tb) { 
			if (direction == 'up') { 
				this.index++;
				if (this.index > this.len - 1) { 
					this.opts.loop ? this.index = 0 : this.index = this.len - 1;
				}
			}
			if (direction == 'down') { 
				this.index--;
				if (this.index < 0) { 
					this.opts.loop ? this.index = this.len - 1 : this.index = 0;
				}
			}
		}
		
		if (this.opts.lr) { 
			if (direction == 'left') { 
				this.index++;
				if (this.index > this.len - 1) { 
					this.opts.loop ? this.index = 0 : this.index = this.len - 1;
				}
			}
			if (direction == 'right') { 
				this.index--;
				if (this.index < 0) { 
					this.opts.loop ? this.index = this.len - 1 : this.index = 0;
				}
			}
		}
	};

	//注册滑动事件监听
	FullScreenSlider.prototype.slide = function() { 
		var _this = this;
		
		this.$pages.swipe({ 
			swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
				_this.nextIndex(direction);
				_this.goTo(_this.index, direction);
				_this.setProgressDot();
	        }
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
			//阻止android滑动时的默认行为，重要！
			e.preventDefault(); 

			//记录偏移量 = 移动位置座标 - 开始位置座标
			this.offsetX = e.touches[0].pageX - this.startPageX;
			this.offsetY = e.touches[0].pageY - this.startPageY;

			if (_this.opts.lr) { 
				if (_this.isFirstElement(e.target) && this.offsetX > 0 || _this.isLastElement(e.target) && this.offsetX < 0) { 
					$(_this.$pages[_this.index]).removeClass('slideInUp slideInDown slideInLeft slideInRight').css({
						'-webkit-transform': 'translate3d(' + (this.offsetX /= 2) + 'px, 0, 0)',
						'transition': 'none'
					});
				}
			}

			if (_this.opts.tb) { 
				if (_this.isFirstElement(e.target) && this.offsetY > 0 || _this.isLastElement(e.target) && this.offsetY < 0) { 
					$(_this.$pages[_this.index]).removeClass('slideInUp slideInDown slideInLeft slideInRight').css({
						'-webkit-transform': 'translate3d(0, ' + (this.offsetY /= 2) + 'px, 0)',
						'transition': 'none'
					});
				}
			}
		};

		//手指抬起
		var fingerEnd = function (e) { 
			//if (_this.isFirstElement(e.target) && (this.offsetX > 0 || this.offsetY > 0) || _this.isLastElement(e.target) && (this.offsetX < 0 || this.offsetY < 0)) { 
				$(_this.$pages[_this.index]).css({
					'-webkit-transform': 'translate3d(0, 0, 0)',
					'transition': 'transform 0.2s ease-out'
				});
			//}
		};

		addEventListener('touchstart', fingerStart, false);
		addEventListener('touchmove', fingerMove, false);
		addEventListener('touchend', fingerEnd, false);
	};

	FullScreenSlider.prototype.setProgressDot = function() { 
		var $dots = this.$container.siblings('nav').find('span');
		$dots.eq(this.index).addClass('active').siblings().removeClass('active');
	};

	$.fn.fullScreenSlider = function(options) { 
		return this.each(function(index, val) { 
			new FullScreenSlider(val, options);
		});
	};
})(jQuery);