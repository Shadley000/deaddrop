var toolKit = require('./toolKit').toolKit;


const deaddropService = {
	addMessage(messageObj, callback) {
		var sql = `INSERT INTO message (deaddrop_id, user_id, publish_date, title, message) VALUES (?,?,now(),?,?)`;
		var connection = toolKit.getConnection();
		connection.query(sql, [
			messageObj.deaddrop_id,
			messageObj.user_id,
		
			messageObj.title,
			messageObj.message
		],
			function(error, results, fields) {

				if (error) throw error;
				callback();
			});
		connection.end();
	},
	
	deleteMessage(user_id,deaddrop_id,message_id, callback) {
		var sql = `DELETE FROM message WHERE message_id =? AND user_id = ? AND deaddrop_id = ? `;
		var connection = toolKit.getConnection();
		connection.query(sql, [message_id,user_id,deaddrop_id], function(error, results, fields) {

			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	getDeadDrops(user_id, callback) {
		var sql = "SELECT    d.deaddrop_id"
			+ " FROM    user2deaddrop k,    deaddrop d"
			+ " WHERE   k.deaddrop_id = d.deaddrop_id"
			+ " AND k.user_id = ?"
			+ "order by d.deaddrop_id";

		var connection = toolKit.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			if (results) {
				var list = [];
				results.forEach((item, index) => {
					list.push(item.deaddrop_id);					
				});
				callback(list);
			}
			else callback();
		});
		connection.end();
	},
	
	getDeadDrop(user_id, deaddrop_id, callback) {
		var sql = "SELECT    d.deaddrop_id, m.user_id, m.message_id, m.title, m.message, m.publish_date"
			+ " FROM    user2deaddrop k,    deaddrop d,    message m"
			+ " WHERE  k.deaddrop_id = m.deaddrop_id"
			+ " AND k.deaddrop_id = d.deaddrop_id"
			+ " AND k.user_id = ?"
			+ " AND k.deaddrop_id = ?"
			+ "order by d.deaddrop_id, m.publish_date";

		var connection = toolKit.getConnection();
		connection.query(sql, [user_id, deaddrop_id], function(error, results, fields) {

			if (error) throw error;
			if (results) {
				var deaddropObj = {
					"deaddrop_id": deaddrop_id,
					"messages": []
				};
				results.forEach((item, index) => {
					var message = {
						"user_id": item.user_id,
						"message_id": item.message_id,
						"title": item.title,
						"message": item.message,
						"publish_date": item.publish_date
					}
					deaddropObj.messages.push(message);
				});
				callback(deaddropObj);
			}
			else callback();
		});
		connection.end();
	},	

	createNewDeadDrop(deaddrop_id, deaddrop_key, callback) {

		var sql = `INSERT INTO deaddrop (deaddrop_id, deaddrop_key) VALUES (?,?)`;
		var connection = toolKit.getConnection();
		connection.query(sql, [deaddrop_id, deaddrop_key],
			function(error, results, fields) {
				if (error) throw error;
				callback();
			});
		connection.end();
	},

	deleteDeadDrop(user_id, deaddrop_id, callback) {
		var sql_GetUserPermission = "SELECT deaddrop_id from user2deaddrop where user_id = ? and deaddrop_id = ?"
		var sql_deleteMessages = "DELETE FROM messages WHERE deaddrop_id =?"
		var sql_deleteUser2Deadrop = "DELETE FROM user2deaddrop WHERE deaddrop_id =?"
		var sql_deleteDeaddrop = "DELETE FROM deaddrop  WHERE deaddrop_id =? ";
		var connection = toolKit.getConnection();
		connection.query(sql_GetUserPermission, [deaddrop_id, deaddrop_key], function(error, results, fields) {

			if (error) throw error;
			if (results.length > 0) {
				connection.query(sql_deleteUser2Deadrop, [deaddrop_id], function(error, results, fields) {
					if (error) throw error;
				});
				connection.query(sql_deleteMessages, [deaddrop_id], function(error, results, fields) {
					if (error) throw error;
				});
				connection.query(sql_deleteDeaddrop, [deaddrop_id], function(error, results, fields) {
					if (error) throw error;
				});
			}
			callback();
		});
		connection.end();
	},
	
	emptyDeadDrop(user_id, deaddrop_id, callback) {
		var sql_GetUserPermission = "SELECT deaddrop_id from user2deaddrop where user_id = ? and deaddrop_id = ?"
		var sql_deleteMessages = "DELETE FROM messages WHERE deaddrop_id =?"
		var connection = toolKit.getConnection();
		connection.query(sql_GetUserPermission, [deaddrop_id, deaddrop_key], function(error, results, fields) {

			if (error) throw error;
			if (results.length > 0) {
				connection.query(sql_deleteMessages, [deaddrop_id], function(error, results, fields) {
					if (error) throw error;
				});
				
			}
			callback();
		});
		connection.end();
	}
};

module.exports = { deaddropService };