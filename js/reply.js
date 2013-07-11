/**
 * 回帖嵌入
 **/

console.log('reply.js loaded');

$('form').submit(function(evt){
	var target = evt.target;

	if(!evt.isDefaultPrevented())
		evt.preventDefault();

	//判断是否为回复/发帖/编辑的表单,如果不是则不进行处理
	var isReplyForm = /.*SaveReAnnounce.asp\?method=.*/.test(target.action);
	if(!isReplyForm)
		return true;

	var author = $('input[name=UserName]').val() || $('input[name=username]').val(),
		expression = $('input[name=Expression][checked]').val(),
		content = $('textarea#content').val(),
		d = new Date(),
		date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds(),
		title = document.title,
		url = location.href;


	if(title.indexOf('回复帖子') > -1){
		if(url.indexOf('reannounce.asp') != -1){
			url = url.replace('reannounce.asp','dispbbs.asp');
		}
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, false);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				/<title>([\s\S]*?)<\/title>/.exec(xhr.responseText); 
				try{
					title = RegExp.$1;
				}catch(err){
					title = title.replace("回复帖子","点击查看原帖");
				}
			}
		}
		xhr.send();
	}

	setTimeout(function(){
		chrome.extension.sendRequest({
			method : "log",
			data : {
				title : title.replace(/» CC98论坛/,''),
				content : content,
				expression : expression,
				date : date,
				author : author,
				referer : url.substr(url.indexOf('dispbbs'))
			}
		}, function(response) {
			evt.target.submit();
		});	
	},100);
	
})