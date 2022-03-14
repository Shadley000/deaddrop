var toolKit = require('./toolKit').toolKit;


const deaddropService = {
	getDeadDrops(user_id, callback) {
		var sql = "SELECT    d.deaddrop_id, m.user_id, m.message_id, m.title, m.message, m.publish_date"
			+ " FROM    user2key k,    deaddrop d,    message m"
			+ " WHERE  k.deaddrop_id = m.deaddrop_id"
			+ " AND k.deaddrop_id = d.deaddrop_id"
			+ " AND k.user_id = ?"
			+ "order by d.deaddrop_id, m.publish_date"

		var connection = dbService.getConnection();
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

	createNewDeadDrop(deaddrop_id, deaddrop_key, callback) {

		var sql = `INSERT (deaddrop_id, deaddrop_key) INTO message VALUES (?,?)`;
		var connection = dbService.getConnection();
		connection.query(sql, [deaddrop_id, deaddrop_key],
			function(error, results, fields) {
				if (error) throw error;
				callback();
			});
		connection.end();
	},

	deleteDeadDrop(deaddrop_id, deaddrop_key, callback) {
		toolKit.validateKey(key)

		var sql = `DELETE FROM deaddrop WHERE deaddrop_id =?`;
		var connection = dbService.getConnection();
		connection.query(sql, [deaddrop_id], function(error, results, fields) {

			if (error) throw error;
			callback();
		});
		connection.end();
	}
};


module.exports = { deaddropService };