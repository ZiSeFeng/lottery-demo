/**
 * 
 * @authors Maggie
 * @date    2018-07-26 13:47:58
 * @params 
 *   index      当前选中对象的位置
 *   num        共有多少个对象参与抽奖
 *   speed      抽奖速度
 *   flag       响应点击事件
 *   lucky      中奖的位置
 *   award      奖品的名称
 *   times      转动次数
 *   timer      定时器
 *   cycle      转动基本次数，
 * @version 1.0.0
 */

;(function($){
	$.fn.lottery = function(opts){
		var defaults = {
			index: 0,
			num: 8,
			cycle: 50,
		}
		$.extend(defaults, opts);
		console.log(opts)

        var lottery,
            flag = false,
            timer = 0,
            times = 0;
		
        function show_lottery(){
			if (opts.index > opts.num) {
				opts.index = 1;
				opts.cycle--;
			}
			$('.lottery li').css('opacity', 0.3);
			$('.lottery'+opts.index).css('opacity', 1);
			console.log(opts.cycle, 'opts.cycle')
			

		    times += 1;
		    if( times < opts.cycle ){
		    	opts.speed -= 10;
		    }else{
		        if (times > opts.cycle + 10 && opts.lucky == opts.index + 1) {
		        	opts.speed += 110;
		        }else{
		        	opts.speed += 20;
		        }
		    }
		    if (opts.speed < 40) {
		    	opts.speed = 40;
		    }

			if (times > opts.cycle + 10 && opts.lucky == opts.index) {  //结束抽奖
				clearTimeout(timer);
				// 重置参数
				timer = 0;
				opts.speed = 300;
				opts.cycle = 50;
				times = 0;
				console.log('中奖位置', opts.lucky)
				// setTimeout(function(){
		  //           $('.lottery li').css('opacity', 1);
				// },1200)
				flag = false;
			}else{
				timer = setTimeout(show_lottery,opts.speed)
			}
			opts.index++;
		}

		return this.each(function() {
			console.log($(opts.draw))
			$(opts.draw).click(function(event) {
				if (flag) {
					return false;
				}
				flag = true;
				show_lottery();
			});
		});
		
	}
})(jQuery)