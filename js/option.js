$(function(){
	/**
	 * 多账号管理
	 */
	$('#account ul').click(function(evt){
		var target = $(evt.target);
		if(target.hasClass('del')){
			var toDel = target.prev().text();
			chrome.extension.sendRequest({
				method : 'delUser',
				data : {
					username : toDel
				}
			},function(response){
				if(response.code === 1){
					target.parent().remove();
					if($('#account ul').find('li').size() == 0){
						$('#account ul').append('<li style="color:red">您尚未添加账号，请在论坛重新登录后根据提示添加</li>');
					}
				}
			})
		}
	})
	chrome.extension.sendRequest({
		method : "getUser"
	}, function(response) {
		if(response.code === 1){
			$('#account ul').empty();
			var users = response.data;
			if(users.length == 0){
				$('#account ul').append('<li style="color:red">您尚未添加账号，请在论坛重新登录后根据提示添加</li>');
			}
			for(var i = 0;i < users.length;i++){
				$('#account ul').append('<li><span>' + users[i].username + '</span><a class="del" href="#">x</a></li>');
			}
		}
	});

	/**
	 * 屏蔽签名档、美化字体等
	 */
	$('#hideQmd').prop('checked',Tools.getOption('hideQmd') == 'true');
	$('#beautify').prop('checked',Tools.getOption('beautify') == 'true');
	$('#hideQmd,#beautify').change(function(evt){
		var checked = evt.target.checked;
		Tools.setOption(evt.target.id,!!checked);
	});


	/**
	 * 黑名单
	 */
	$('#blacklists ul').click(function(evt){
		var target = $(evt.target);
		if(target.hasClass('del')){
			var toDel = target.prev().text();
			Tools.setOption('blacklist', Tools.getOption('blacklist').replace(toDel,""));
			target.parent().remove();

			if($('#blacklists ul li').size() == 0){
				$('#blacklists ul').append('<li style="color:red">您还没有添加黑名单，请在帖子详情页面选中要屏蔽的ID右键加入CC98黑名单。</li>');
			}
		}
	})

    var blacklists = Tools.getOption('blacklist');
    if(blacklists)
    	blacklists = blacklists.split(';');
    else{
    	blacklists = [];
    }

    for(var i = 0; i < blacklists.length; i++){
    	if(!!blacklists[i])
    		$('#blacklists ul').append('<li><span>'+ blacklists[i] + '</span><a href="javascript:void(0)" class="del">x</a></li>');
    }

    if($('#blacklists ul li').size() == 0){
		$('#blacklists ul').append('<li style="color:red">您还没有添加黑名单，请在帖子详情页面选中要屏蔽的ID右键加入CC98黑名单。</li>');
	}


	/**
	 * 反向代理
	 */
	var domain = Tools.getOption("domain") || 'http://www.cc98.org/';
	$('#domain').val(domain);


	/**
	 * 一些链接
	 */
	var feedback = $('#feedback').attr('href');
	$('#feedback').attr('href',domain + feedback);

	/**
	 * 提交表单
	 */
	$('form').submit(function(evt){
		evt.preventDefault();

		Tools.setOption('domain', $('#domain').val());
		$('#feedback').attr('href',$('#domain').val() + feedback);
		$('.saveSuc').addClass('saveSucFadeIn');
		setTimeout(function(){
			$('.saveSuc').removeClass('saveSucFadeIn');
		},5000);
	});
})