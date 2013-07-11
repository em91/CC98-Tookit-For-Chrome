/**
 * 嵌入在所有的页面中，修改topbar菜单以及设置全局CSS、屏蔽QMD、屏蔽黑名单用户的回复
 **/
$(function(){
	var extensionId = chrome.i18n.getMessage("@@extension_id");

	var spacer = '<img src="pic/navspacer.gif" align="absmiddle">';
	var record = $('<a style="margin-left:2px;" href="chrome-extension://' + extensionId + '/search.html" target="_blank">搜索回帖</a>');
	var option = $('<a style="margin-left:2px;color:red" title="CC98工具箱设置，包含黑名单、马甲管理等" href="chrome-extension://' + extensionId + '/option.html" target="_blank">工具箱选项</a>');
	$('.TopLighNav1 > div > div').eq(0).append($(spacer)).append(record).append($(spacer)).append(option);

	chrome.extension.sendRequest({
		method : "getSettings"
	}, function(response) {
		var beautify = response.beautify,
			hideQmd = response.hideQmd,
			users = response.users,
			blacklist = response.blacklist.split(";");

		if(beautify){
			$('head').append('<style>*{font-family:"微软雅黑"" !important}</style>')
		}

		if(hideQmd && hideQmd != "false"){
			$('.userQmd').parent().hide();
		}

		var users = document.querySelectorAll('a[name] font[color] b');
		for(var i = 0;i < users.length; i++){
			if(blacklist.indexOf(users[i].innerText) != -1){
				var tbl = users[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
				tbl.style.display = 'none';
				var tip = document.createElement('table');
				tip.className = "tableborder1";
				tip.align = 'center';
				tip.style.cssText = 'table-layout:fixed;word-wrap:break-word;word-break:break-all;overflow:hidden;border-collapse:collapse;cursor:pointer;';
				tip.innerHTML = '<tr><td class="tablebody2" style="border:1px solid #6595D6;padding:10px;">[该贴已被 My cc98,My home]</td></tr>';
				//tip.innerHTML = "[该贴已被 My cc98,My home]";
				tbl.parentNode.insertBefore(tip,tbl);
				tip.addEventListener('click',function(evt){
					var elm = evt.target;
					while(elm.tagName.toUpperCase() != "TABLE")
						elm = elm.parentNode;

					elm.nextSibling.style.display = '';
					elm.style.display = "none";
				})
			}
		}

	});
})