	/*抽奖lottery*/
	var lottery = {
		index: 0,    //当前转动到哪个位置，起点位置
		count: 0,    //总共有多少个位置
		timer: 0,    //setTimeout的ID，用clearTimeout清除
		speed: 20,    //初始转动速度
		times: 0,    //转动次数
		cycle: 50,    //转动基本次数：即至少需要转动多少次再进入抽奖环节
		prize: 0,    //中奖位置
		init: function (id) {
			if ($("#" + id).find(".lottery-unit").length > 0) {
				this.obj = $("#" + id);
				this.count = $("#" + id).find('.lottery-unit').length;
				$("#" + id).find(".lottery" + this.index).addClass("active" + this.index);
			};
		},
		roll: function () {
			var index = this.index;
			var count = this.count;
			var lottery = this.obj;
			$(lottery).find(".lottery" + index).removeClass("active" + index);
			index += 1;
			if (index > count) {
				index = 0;
			};
			$(lottery).find(".lottery" + index).addClass("active" + index);
			this.index = index;
			return false;
		},
		stop: function (index) {
			this.prize = index;
			return false;
		}
	};

	/*抽奖滚动事件*/
	function roll() {
		lottery.times += 1;
		lottery.roll();
		if (lottery.times > lottery.cycle + 10 && lottery.index == prize_site) {


			// alert('中奖位置')
			clearTimeout(lottery.timer);
			lottery.prize = -1;
			lottery.times = 0;
			click = false;

		} else {
			if (lottery.times < lottery.cycle) {
				lottery.speed -= 10;
			} else if (lottery.times == lottery.cycle) {
				var index = Math.random() * (lottery.count) | 0;
				lottery.prize = index;
			} else {
				if (lottery.times > lottery.cycle + 10 && ((lottery.prize == 0 && lottery.index == 7) || lottery.prize == lottery.index + 1)) {
					lottery.speed += 110;
				} else {
					lottery.speed += 20;
				}
			}
			if (lottery.speed < 40) {
				lottery.speed = 40;
			}
			lottery.timer = setTimeout(roll, lottery.speed);
		}
		return false;
	}

	/*抽奖过程中不响应点击事件*/
	var click = false;

	lottery.init('lottery');
	$('#lottery .btn_lottery').click(function (event) {
		if (getCookie('ab737') != '') {
			if (click) {
				return false;
			} else {
				lottery.speed = 100;
				$.ajax({
					url: 'lottery.php',
					type: 'get',
					dataType: 'json',
					success: function (res) {
						if (res.status == 0) {
							getUser();
						}
				 		if (res.status == 1) {
							prize_site = res.index; //中奖位置
							prize_name = res.name; //中奖名字
							prize_id = res.id; 
							lottery_id = res.id;
							cdkey = res.cdkey;


							lottery.prize = prize_site; //中奖记录

							$('#lottery').attr('prize_site', prize_site);
							$('#lottery').attr('prize_name', prize_name);
							$('#lottery').attr('prize_virtual', isVirtual);
							$('#lottery').attr('prize_img', prize_img);
							$('#lottery').attr('prize_id', prize_id)

							roll();    //转圈过程不响应click事件，会将click置为false
							click = true; //一次抽奖完成后，设置click为true，可继续抽奖
							return false;
						}
						if (res.status == -1) {
							alert(res.text)
						}
					}
				});
			}
		}else{
			getUser();
		}
	})