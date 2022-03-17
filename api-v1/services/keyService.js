var toolKit = require('./toolKit').toolKit;

const keyService = {
	getUserKeys(user_id, callback) {
		var sql = `SELECT deaddrop_id, user_key FROM user2key WHERE user_id =?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			if (results) {
				var keys = [];
				for (let i = 0; i < results.length; i++) {
					keys.push(results[i].user_key);
				}
				callback(keys);
			}
			else callback();
		});
		connection.end();
	},

	addUserKey(user_id,deaddrop_id, key, callback) {
		var sql = `INSERT INTO user2key (user_id, deaddrop_id, user_key) VALUES (?,?,? )`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id, deaddrop_id, key], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	deleteUserKeys(user_id, callback) {
		var sql = `DELETE FROM user2key WHERE user_id = ?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	deleteUserKeyForDeaddrop(user_id, deaddrop_id, callback) {
		var sql = `DELETE FROM user2key WHERE user_id = ? and deaddrop_id = ?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id,deaddrop_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	}

};


module.exports = { keyService};