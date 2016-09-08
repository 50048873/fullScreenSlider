;(function($) { 
	/*
		loop: false, 	//默认不循环滚动
		tb: true,		//默认上下滑动
		lr: false		//左右滑动
	*/
	var defaults = { 
		loop: false,
		tb: true,
		lr: false
	};

	function FullScreenSlider(container, options) { 
		this.$container = $(container);
		this.$pages = this.$container.find('.page');
		this.len = this.$pages.length;

		this.opts = $.extend({}, defaults, options);

		this.index = 0;
		this.zIndex = 0;

		
		if (this.opts.tb && this.opts.lr) this.opts.tb = false;
		this.init_zIndex();
		this.slide();
		if (!this.opts.loop) { 
			this.reboundMonitor();
		}
		
	};

	FullScreenSlider.prototype.init_zIndex = function() { 
		for (var i = this.len - 1; i >= 0; i--) { 
			this.$pages.eq(i).css('zIndex', this.zIndex++);
		}
	};

	FullScreenSlider.prototype.isFirstElement = function(target) { 
		var firstElement = this.$pages[0];
		return firstElement == target ? true : firstElement == $(target).parent('.page')[0];
	};

	FullScreenSlider.prototype.isLastElement = function(target) { 
		var lastElement = this.$pages[this.len - 1];
		return lastElement == target ? true : lastElement == $(target).parent('.page')[0];
	};

	//滑动到下一页
	FullScreenSlider.prototype.goTo = function(index, direction) { 
		//1.如果不能循环时，且满足下面条件，则不执行2
		if (!this.opts.loop) { 
			if (this.isFirstElement(event.target) && (direction == 'down' || direction == 'right')) return;
			if (this.isLastElement(event.target) && (direction == 'up' || direction == 'left')) return;
		} 
		
		//2.根据索引滑动对应页面
		var $targetPage = this.$pages.eq(index);
		
		if (this.opts.tb) { 
			if (direction == 'up') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInUp').siblings().removeClass('slideInUp slideInDown');
			}
			if (direction == 'down') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInDown').siblings().removeClass('slideInUp slideInDown');
			}
		} else if (this.opts.lr) { 
			if (direction == 'left') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInRight').siblings().removeClass('slideInLeft slideInRight');
			}
			if (direction == 'right') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInLeft').siblings().removeClass('slideInLeft slideInRight');
			}
		}
	};

	FullScreenSlider.prototype.nextIndex = function(direction) { 
		if (direction == 'up' || direction == 'left') { 
			this.index++;
			if (this.index > this.len - 1) { 
				this.opts.loop ? this.index = 0 : this.index = this.len - 1;
			}
		}

		if (direction == 'down' || direction == 'right') { 
			this.index--;
			if (this.index < 0) { 
				this.opts.loop ? this.index = this.len - 1 : this.index = 0;
			}
		}
	};

	//注册滑动事件监听
	FullScreenSlider.prototype.slide = function() { 
		var _this = this;
		
		this.$container.swipe({ 
			swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
				_this.nextIndex(direction);
				_this.goTo(_this.index, direction);
	        }
		});
	};

	//注册首尾页弹回事件监听
	FullScreenSlider.prototype.reboundMonitor = function() { 
		var _this = this;
		addEventListener('touchstart', fingerStart, false);
		addEventListener('touchmove', fingerMove, false);
		addEventListener('touchend', fingerEnd, false);

		//手指触摸
		function fingerStart(e) { 
			this.startPageX = e.touches[0].pageX;
			this.startPageY = e.touches[0].pageY;
		};

		//手指触摸后移动
		function fingerMove(e) {
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
		function fingerEnd(e) { 
			if (_this.isFirstElement(e.target) && (this.offsetX > 0 || this.offsetY > 0) || _this.isLastElement(e.target) && (this.offsetX < 0 || this.offsetY < 0)) { 
				$(_this.$pages[_this.index]).css({
					'-webkit-transform': 'translate3d(0, 0, 0)',
					'transition': 'transform 0.2s ease-out'
				});
			}
		};
	};

	$.fn.fullScreenSlider = function(options) { 
		return this.each(function(index, val) { 
			new FullScreenSlider(val, options);
		});
	};
})(jQuery);