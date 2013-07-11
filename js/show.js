/**
 * 马甲切换
 **/

console.log('show.js loaded');

var extensionId = chrome.i18n.getMessage("@@extension_id");
//Could not send response: Cannot send a response more than once per chrome.extension.onRequest listener per document 
$('#multiLogin').css({'text-align':'right','padding-right':'5px'});
chrome.extension.sendRequest({
	method : "getUser"
}, function(response) {
	if(response.code === 1){
		var users = response.data;
		if(users.length == 0){
			$('#multiLogin').empty().append('<a href="chrome-extension://'+ extensionId + '/option.html" target="_blank" style="color:red !important">管理马甲</a>');
			return;
		}

		$('#multiLogin').empty().append('<select style="margin-top:-1px"></select');
		var currentUser = $('.TopLighNav1 > div > div > b').text();
		for(var i = 0;i < users.length;i++){
			$('#multiLogin select').append('<option ' + (currentUser == users[i].username ? 'selected' : '') + '>' + users[i].username + '</option>');
		}

		$('#multiLogin select').change(function(evt){
			var username = evt.target.value,
				password = '';

			for(var i = 0;i < users.length;i++){
				if(users[i].username == username)
					password = users[i].password;
			}
			$.post('/sign.asp?a=i&u=' + username + '&p=' + password + '&userhidden=userHidden',function(response){
				if(response == '9898'){
					location.reload();
				}
			});
		});
	}
});