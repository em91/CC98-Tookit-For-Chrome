/**
 * websql存储
 **/
DB = {
	init : function(){
		var db = openDatabase('cc98_tookit', '1.0', 'data for cc98 toolkit extension', 50 * 1024 * 1024);
		if(!db)
			alert("Failed to connect to database.");

		db.transaction(function (tx) {  
			//回帖存储
			tx.executeSql('CREATE TABLE IF NOT EXISTS POSTS (\
				id INTEGER PRIMARY KEY AUTOINCREMENT, \
				title VARCHAR,\
				face VARCHAR,\
				content TEXT,\
				author VARCHAR,\
				date DATETIME,\
				referer TEXT)');

			//多用户信息
			tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (\
				id INTEGER PRIMARY KEY AUTOINCREMENT, \
				username VARCHAR,\
				password TEXT)');
		});

		this.db = db;
	},

	selectUser : function(cb){
		this.db.transaction(function(tx){
			tx.executeSql("SELECT DISTINCT username,password FROM USERS",[],function(tx,result){
				var data = [];
				for(var i = 0;i < result.rows.length; i++){
					data.push(result.rows.item(i));
				}

				if(cb)
					cb({code : 1, users : data});
			});
		})
	},

	selectReply : function(data, cb){
		var offset = data.offset,
			limit = data.limit,
			query = decodeURIComponent(data.query);


		this.db.transaction(function(tx){
			tx.executeSql("SELECT * FROM POSTS WHERE content like \"%" + query + "%\" or title like \"%" + query + "%\" ORDER BY id desc LIMIT " + offset + "," + limit,[],function(tx,result){
				var data = [];
				for(var i = 0;i < result.rows.length; i++){
					data.push(result.rows.item(i));
				}

				tx.executeSql("SELECT count(*) FROM POSTS WHERE content like \"%" + query + "%\" or title like \"%" + query + "%\"",[],function(tx,result){
					var total = result.rows.item(0);
					cb({code : 1, data : data, total : total['count(*)']});
				});
			});
		})
	},

	addReply : function(reply, cb){
		this.db.transaction(function (tx) { 
			tx.executeSql('INSERT INTO POSTS (title, face, content, author, date, referer) VALUES (?,?,?,?,?,?)',
				[reply.title, reply.expression, reply.content, reply.author, reply.date, reply.referer ],function(){
					if(cb)
						cb({code : 1});
				});
		});
	},

	addUser : function(data, cb){
		var username = data.username,
			password = data.password;


		this.db.transaction(function (tx) { 
			tx.executeSql('INSERT INTO USERS (username, password) VALUES (?,?)',
				[username,password],function(tx, res){
					if(cb)
						cb({code : 1});
				});
		});
	},
	
	delReply : function(id, cb){
		this.db.transaction(function (tx) { 
			tx.executeSql('DELETE FROM POSTS WHERE id = ' + id,
				[],function(response){
					if(cb)
						cb({code : 1});
				});
		});
	},

	delUser : function(data,cb){
		var username = data.username;
		this.db.transaction(function (tx) { 
			tx.executeSql('DELETE FROM USERS WHERE username = "' + username + '"',
				[],function(response){
					if(cb)
						cb({code : 1});
				});
		});
	},

	queryReply : function(query){

	},

	destroy : function(){

	}
}