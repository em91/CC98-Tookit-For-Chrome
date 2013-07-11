function xpath(query)
{
	var results = document.evaluate(
			query,
			document,
			null,
			XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
			null);
	if(results.snapshotLength > 1)
		return results;
	else
		return results.snapshotItem(0);
}

function GetRadioValue(RadioName){
    var obj;    
    obj=document.getElementsByName(RadioName);
    if(obj!=null){
        var i;
        for(i=0;i<obj.length;i++){
            if(obj[i].checked){
                return obj[i].value;            
            }
        }
    }
    return null;
}


//屏蔽黑名单
var users = document.querySelectorAll('a[name] font[color] b');

chrome.extension.sendRequest({method: "getBlackList"}, function(response) {
	var blacklist = response.blacklist;

	function inBlackList(id){
		var arr = blacklist;
    	if(!arr)
    		return false;

    	arr = arr.split(';');
   		for(var i = 0; i < arr.length; i++){
   			if(arr[i] == id)
    			return true;
   			}
  		return false;
	}

	for(var i = 0;i < users.length; i++){
		if(inBlackList(users[i].innerText)){
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

//监听提交
HTMLFormElement.prototype._submit = HTMLFormElement.prototype.submit;
function newsubmit(event) {
	var target = event ? event.target : this;
	if (/.*SaveReAnnounce.asp\?method=.*/.test(target.action)) {
		var f = GetRadioValue("Expression");
		var textArea = xpath("//textarea[@id='content']");
		textArea.value.length > 500?c = textArea.value.substring(0,500):c = textArea.value;
		c = c.replace(/'/g,"\'");
		var d = new Date();
		d = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		var u = window.location.href;
		if(u.indexOf('reannounce.asp') != -1){
			u = u.replace('reannounce.asp','dispbbs.asp');
		}
		var t = document.title;
		
		if(t.indexOf("回复帖子")!=-1){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", u , false);
			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
				/<title>([\s\S]*?)<\/title>/.exec(xhr.responseText); 
				try{
					t = RegExp.$1;
				}catch(err){
					t = t.replace("回复帖子","点击查看原帖");
				}
			  }
			}
			xhr.send();
		}
		
		var db = openDatabase('cc98_posts_record', '1.0', 'store posts user viewed/posted in cc98', 2 * 1024 * 1024);
		if(!db)
			alert("Failed to connect to database.");
		db.transaction(function (tx) {  
			tx.executeSql('CREATE TABLE IF NOT EXISTS POSTS (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR, face VARCHAR, content TEXT, date DATETIME, referer TEXT)');
		});
		db.transaction(function (tx) {  
			tx.executeSql('INSERT INTO POSTS (title, face, content, date, referer) VALUES (?,?,?,?,?)',[t,f,c,d,u]);
		});
	}
	this._submit();
}
HTMLFormElement.prototype.submit = newsubmit;
var db = openDatabase('cc98_posts_record', '1.0', 'store posts user viewed/posted in cc98', 2 * 1024 * 1024);
window.addEventListener('submit', newsubmit, true);
