;(function($) { 
	/*
		loop: false, 	//默认不循环滚动
		tb: true,		//默认上下滑动
		lr: false		//左右滑动（如果tb和lr都为true，则上下左右滑动）
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
		this.index = 0;
		this.zIndex = 0;

		this.opts = $.extend({}, defaults, options);

		this.init_zIndex();
		this.slide();
	};

	FullScreenSlider.prototype.init_zIndex = function() { 
		for (var i = this.len - 1; i >= 0; i--) { 
			this.$pages.eq(i).css('zIndex', this.zIndex++);
		}
	};

	FullScreenSlider.prototype.slide = function() { 
		var _this = this;
		
		this.$container.swipe({ 
			swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
				if (direction == 'up') { 
					_this.nextIndex(direction);
					_this.goTo(_this.index, direction);
				}
				if (direction == 'down') { 
					_this.nextIndex(direction);
					_this.goTo(_this.index, direction);
				}
				if (direction == 'left') { 
					_this.nextIndex(direction);
					_this.goTo(_this.index, direction);
				}
				if (direction == 'right') { 
					_this.nextIndex(direction);
					_this.goTo(_this.index, direction);
				}
	        }
		});
	};

	FullScreenSlider.prototype.nextIndex = function(direction) { 
		if (direction == 'up' || direction == 'left') { 
			this.index++;
			if (this.index >= this.len) { 
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

	FullScreenSlider.prototype.goTo = function(index, direction) { 
		if (!this.opts.loop) { 
			if (direction == 'up' || direction == 'left') { 
				if (this.$pages[this.len - 1] == event.target) return;
			}
			if (direction == 'down' || direction == 'right') { 
				if (this.$pages[0] == event.target) return;
			}
		}
		
		var $targetPage = this.$pages.eq(index);

		if (this.opts.tb && !this.opts.lr) { 
			if (direction == 'up') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInUp').siblings().removeClass('slideInUp slideInDown');
			}
			if (direction == 'down') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInDown').siblings().removeClass('slideInUp slideInDown');
			}
		} else if (this.opts.lr && !this.opts.tb) { 
			if (direction == 'left') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInRight').siblings().removeClass('slideInLeft slideInRight');
			}
			if (direction == 'right') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInLeft').siblings().removeClass('slideInLeft slideInRight');
			}
		} else if (this.opts.tb && this.opts.lr) { 
			if (direction == 'up') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInUp').siblings().removeClass('slideInUp slideInDown slideInLeft slideInRight');
			}
			if (direction == 'down') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInDown').siblings().removeClass('slideInUp slideInDown slideInLeft slideInRight');
			}
			if (direction == 'left') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInRight').siblings().removeClass('slideInUp slideInDown slideInLeft slideInRight');
			}
			if (direction == 'right') { 
				$targetPage.css('zIndex', this.zIndex++).addClass('slideInLeft').siblings().removeClass('slideInUp slideInDown slideInLeft slideInRight');
			}
		} 
	};

	$.fn.fullScreenSlider = function(options) { 
		return this.each(function(index, val) { 
			new FullScreenSlider(val, options);
		});
	};
})(jQuery);