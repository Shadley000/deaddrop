var toolKit = require('./toolKit').toolKit;

const keyService = {
	getUserDeadrops(user_id, callback) {
		var sql = `SELECT deaddrop_id FROM user2deaddrop WHERE user_id =?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			if (results) {
				var keys = [];
				for (let i = 0; i < results.length; i++) {
					keys.push(results[i].deaddrop_id);
				}
				callback(keys);
			}
			else callback();
		});
		connection.end();
	},

	addUserDeadrop(user_id,deaddrop_id, callback) {
		var sql = `INSERT INTO user2deaddrop (user_id, deaddrop_id) VALUES (?,? )`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id, deaddrop_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	deleteUserLinks(user_id, callback) {
		var sql = `DELETE FROM user2deaddrop WHERE user_id = ?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	deleteUserForDeaddrop(user_id, deaddrop_id, callback) {
		var sql = `DELETE FROM user2deaddrop WHERE user_id = ? and deaddrop_id = ?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id,deaddrop_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},

	deleteDeaddropLinks(deaddrop_id, callback) {
		var sql = `DELETE FROM user2deaddrop WHERE deaddrop_id = ?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [deaddrop_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	}
};


module.exports = { keyService};