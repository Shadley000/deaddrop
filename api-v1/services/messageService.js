var toolKit = require('./toolKit').toolKit;

const messageService = {
	getMessages(deaddrop_id, callback) {
		var sql = `SELECT message_id,deaddrop_id, user_id, publish_date, title, message FROM message WHERE deaddrop_id =?`;
		var connection = dbService.getConnection();
		connection.query(sql, [deaddrop_id], function(error, results, fields) {

			if (error) throw error;
			if (results) {
				var list = [];
				results.forEach((item, index) => {
					var messageObj = {
						"message_id": item.message_id,
						"deaddrop_id": item.deaddrop_id,
						"user_id": item.user_id,
						"publish_date": item.publish_date,
						"title": item.title,
						"message": item.message
					}
					list.push(messageObj);
				}
				);
				callback(list);
			}
			else callback();
		});
		connection.end();
	},
	
	getMessage(message_id, callback) {
		var sql = `SELECT message_id,deaddrop_id, user_id, publish_date, title, message FROM message WHERE message_id =?`;
		var connection = dbService.getConnection();
		connection.query(sql, [message_id], function(error, results, fields) {

			if (error) throw error;
			if (results) {
				var messageObj = {
					"message_id": results[0].message_id,
					"deaddrop_id": results[0].deaddrop_id,
					"user_id": results[0].user_id,
					"publish_date": results[0].publish_date,
					"title": results[0].title,
					"message": results[0].message
				}
				callback(messageObj);

			}
			else callback();
		});
		connection.end();
	},
	
	addMessage(messageObj, callback) {
		var sql = `INSERT (message_id,deaddrop_id, user_id, publish_date, title, message) INTO message VALUES (?,?,?,?,?,?)`;
		var connection = dbService.getConnection();
		connection.query(sql, [
			messageObj.message_id,
			messageObj.deaddrop_id,
			messageObj.user_id,
			messageObj.publish_date,
			messageObj.title,
			messageObj.message
		],
			function(error, results, fields) {

				if (error) throw error;
				callback();
			});
		connection.end();
	},
	
	deleteMessage(message_id, callback) {
		var sql = `DELETE FROM message WHERE message_id =?`;
		var connection = dbService.getConnection();
		connection.query(sql, [message_id], function(error, results, fields) {

			if (error) throw error;
			callback();
		});
		connection.end();
	}
}
module.exports = { messageService };