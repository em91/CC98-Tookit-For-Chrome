/**
 * 登录过程中添加马甲
 **/
console.log('login.js loaded');

$('#loginForm').attr('onsubmit','return true');
$('#loginForm').submit(function(evt){
	var username = $('#userName').val(),
		password = $('#password').val(),
		userHidden = 2;

	evt.preventDefault();

	$.post('/sign.asp?a=i&u=' + username + '&p=' + Crypto.MD5(password) + '&userhidden=userHidden',function(response){
		if(response == '9898'){
			var addAccount = window.confirm('登录成功，是否将本账号添加到CC98工具箱的多账号管理中以方便快速切换马甲？');
			if(!addAccount)
				location.href = '/index.asp';
			else{
				chrome.extension.sendRequest({
					method : "addUser",
					data : {
						username : username,
						password : Crypto.MD5(password)
					}
				}, function(response) {
					if(response.code === 1)
						location.href = "/index.asp";
				});
			}
		}else{
			alert('密码错误');
		}
	})
});