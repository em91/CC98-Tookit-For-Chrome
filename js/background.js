/**
 * background
 * 初始化DB，屏蔽一些url请求，增加contextMenu，处理来自contentscript和option的请求
 **/

console.log('background loaded');

DB.init();

var cancel = function(url){
  var cancelUrls = [
    /*"http://v2.cc98.org/Medals/"*/
  ];

  for(var i = 0;i < cancelUrls.length; i++){
    if(url.indexOf(cancelUrls[i]) != -1)
      return true;
  }

  return false;
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      var url = details.url;

      if(cancel(url))
        return {cancel : cancel(url)};
    },
    {urls: ["*://*.cc98.lifetoy.org/*","*://*.cc98.org/*"]},
    ["blocking"/*,"requestHeaders"*/]
);

//菜单右键
var title = "加入cc98黑名单";
var genericOnClick = function(info, tab) {
  var sel = info.selectionText;
  var confirm = window.confirm('您将要添加"'+ sel.trim() +'"到cc98工具箱黑名单列表，确定吗？');
  if(confirm){
    if(localStorage['blacklist'])
        localStorage['blacklist'] += ';' + sel.trim();
    else
        localStorage['blacklist'] = sel.trim();

    alert('添加成功');
  }
}

function createContextMenu(){
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": ["selection"],
        "documentUrlPatterns":["*://*.cc98.org/*","*://*.cc98.lifetoy.org/*"],
        "onclick": genericOnClick
    });
}

createContextMenu();

chrome.extension.onRequest.addListener(
 	function(request, sender, sendResponse) {
    	var method = request.method;

    	switch(method){
    		case 'log' :
    			DB.addReply(request.data || {}, function(response){
    				if(response.code === 1){
    					sendResponse({ code: 1 });
    				}
    			});
    			
    			break;
    		case 'getlog':
    			DB.selectReply(request.data, function(response){
    				if(response.code === 1){
    					sendResponse({ code : 1, data : response.data, total : response.total});
    				}
    			})
    			break;
            case 'delReply':
                DB.delReply(request.data.id, function(response){
                    if(response.code === 1){
                        sendResponse({ code : 1 });
                    }
                })
                break;
            case 'addUser':
                DB.addUser(request.data, function(response){
                    if(response.code === 1){
                        sendResponse({ code : 1 });   
                    }
                });
                break;
            case 'getUser':
                DB.selectUser(function(response){
                    if(response.code === 1){
                        sendResponse({code : 1, data : response.users});
                    }
                })
                break;
            case 'delUser':
                DB.delUser(request.data, function(response){
                    if(response.code === 1){
                        sendResponse({code : 1});
                    }
                })
                break;
            case 'getSettings' :
                DB.selectUser(function(response){
                    if(response.code === 1){
                        var users = response.users;
                        var beautify = Tools.getOption('beautify');
                        var hideQmd = Tools.getOption("hideQmd");
                        var blacklist = Tools.getOption("blacklist") || "";
                        sendResponse({code : 1, beautify : beautify, hideQmd : hideQmd, users : users, blacklist : blacklist});
                    }
                })
                break;
    		default :
    			break;
    	}
  	}
 );