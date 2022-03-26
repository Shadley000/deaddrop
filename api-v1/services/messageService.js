var toolKit = require('./toolKit').toolKit;

const messageService = {
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
	
	getDeadDropMessages(user_id, deaddrop_id, callback) {
		var sql = "SELECT    d.deaddrop_id, m.user_id, m.message_id, m.title, m.message, m.publish_date"
			+ " FROM    user_id2permission_id k,    deaddrop d,    message m"
			+ " WHERE  k.permission_id = m.deaddrop_id"
			+ " AND k.permission_id = d.deaddrop_id"
			+ " AND k.user_id = ?"
			+ " AND k.permission_id = ?"
			+ "order by d.deaddrop_id, m.publish_date";

		var connection = toolKit.getConnection();
		connection.query(sql, [user_id, deaddrop_id], function(error, results, fields) {

			if (error) throw error;
			if (results) {
				var messages =[];
				results.forEach((item, index) => {
					var message = {
						"user_id": item.user_id,
						"message_id": item.message_id,
						"title": item.title,
						"message": item.message,
						"publish_date": item.publish_date
					}
					messages.push(message);
				});
				callback(messages);
			}
			else callback([]);
		});
		connection.end();
	},	
	
	emptyDeadDrop(user_id, deaddrop_id, callback) {
		var sql_GetUserPermission = "SELECT deaddrop_id from user_id2permission_id where user_id = ? and permission_id = ?"
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

module.exports = { messageService };