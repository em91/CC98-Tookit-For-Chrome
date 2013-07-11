/**
 * browser action popup
 **/
$(function(){
	HOST = Tools.getOption('domain') || 'http://www.cc98.org/';
	var loadData = function(offset, limit, cb){
		chrome.extension.sendRequest({
			method : "getlog",
			data : {
				offset : offset,
				limit : limit,
				query : ''
			}
		}, function(response) {
			var data = response.data;
			cb(data);
		});
	}

	$('body ul').click(function(evt){
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

	loadData(0, 200, render);

	function render(data){
		var length = data.length;
		for(var i = 0;i < length;i++){
			$('body > ul').append("<li>" + 
				'<h3><img src="images/emots/' + data[i].face + '"/><a class="referer" target="_blank" href="' + HOST + data[i].referer + '">' + data[i].title + '</a></h3>' +
				'<div class="content">' + Tools.parseUbb(data[i].content) + '</div>' +
				'<div class="meta"><span>' + data[i].date + '</span>' +
				'<a href="#" class="del" id="' + data[i].id + '">删除</a></div>' 
			+ "</li>");
		}
	}
})