$(function() {
	var status = function(status) {
		var statusMap = {
			"-2": "错误",
			"-1": "正在发送",
			"0": "未发送",
			"1": "发送成功",
			"2": "发送失败",
			"3": "反垃圾"
		};
		return statusMap[status.toString()];
	}

	$('.query').on('click', function(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		var $this = $(this);
		$.getJSON($this.prop('href'), function(resp) {
			if (resp.success) {
				var txt = status(resp.sms.status)
				$this.parents('tr').find('td')[2].innerHTML = txt;
			}
		})
	});
})