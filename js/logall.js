/**
 * 搜索页面
 **/
$(function(){
	HOST = Tools.getOption('domain') || 'http://www.cc98.org/';
	var per = 8;
	var current = Tools.parseUrl()['p'] || 1;
	var query = Tools.parseUrl()['q'] || "";

	if(query)
		$('[name=q]').val(decodeURIComponent(query));

	var loadData = function(offset, limit, cb){
		chrome.extension.sendRequest({
			method : "getlog",
			data : {
				query : query,
				offset : offset,
				limit : limit
			}
		}, function(response) {
			var data = response.data,
				total = response.total;

			cb(data, total);
		});
	}

	$('#container ul').click(function(evt){
		if(evt.target.tagName == 'A'){
			if($(evt.target).hasClass('del')){
				var id = evt.target.id;
				chrome.extension.sendRequest({
					method : "delReply",
					data : {
						id : id
					}
				}, function(response) {
					var code = response.code;
					if(code === 1){
						$(evt.target).parent().parent().remove();
					}
				});
				evt.preventDefault();
			}else if($(evt.target).hasClass('referer')){
				Tools.createTab(evt.target.href);
				evt.preventDefault();
			}
		}
	});


	loadData(current - 1, per, render);

	function render (data, total) {
		var length = data.length;
		$('#container > ul').empty();

		if(data.length == 0)
			$('#container > ul').append('没有找到任何符合条件的回帖记录 :-(');

		for(var i = 0;i < length;i++){
			$('#container > ul').append("<li>" + 
					'<h3><img src="images/emots/' + data[i].face + '"/><a class="referer" target="_blank" href="' + HOST + data[i].referer + '">' + data[i].title + '</a></h3>' +
					'<div class="content">' + Tools.parseUbb(data[i].content) + '</div>' +
					'<div class="meta"><span>' + data[i].date + '</span>' +
					'<a href="#" class="del" id="' + data[i].id + '">删除</a></div>' 
				+ "</li>");
		}

		if(total > per){
			$('#pager').empty();
			for(var i = 0;i < Math.ceil(total / per);i++){
				if(i+1 != current){
					$('#pager').append('<a href="?p='+ (i+1) + '">' + (i+1) + '</a>');
				}else{
					$('#pager').append('<span>' + current + '</span>');
				}
			}
		}
	}
})