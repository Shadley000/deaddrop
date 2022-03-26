var toolKit = require('./toolKit').toolKit;

const sessionService = {
	getSession(user_id) {
		return new Promise(function(resolve, reject) {

			var sql = `SELECT authentication_token FROM session_store WHERE user_id = ?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id], function(error, results, fields) {
				if (error) {
					return reject(err);
				}
				else if (results && results.length > 0) {
					resolve(results[0].authentication_token)
				}
				else {
					resolve(undefined);
				}
			});
			connection.end();
		})
	},

	createSession(user_id, authentication_token) {
		return new Promise(function(resolve, reject) {
			var sql = `INSERT INTO session_store (user_id, authentication_token) values (?,?)`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id, authentication_token], function(error, results, fields) {
				if (error) {
					return reject(err);
				}
				else {
					resolve();
				}
			});
			connection.end();
		})
	},

	updateSession(user_id) {
		return new Promise(function(resolve, reject) {
			var sql = `UPDATE session_store SET touch_date = now() WHERE user_id =?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id], function(error, results, fields) {
				if (error) {
					return reject(err);
				}
				else {
					resolve();
				}
			});
			connection.end();
		})
	},

	deleteSession(user_id) {
		return new Promise(function(resolve, reject) {
			var sql = `DELETE FROM session_store WHERE user_id = ?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id], function(error, results, fields) {
				if (error) {
					return reject(err);
				}
				else {
					resolve();
				}
			});
			connection.end();
		})
	},

	deleteExpiredSessions() {
		return new Promise(function(resolve, reject) {
			var sql = `DELETE FROM session_store WHERE touch_date < (NOW() - INTERVAL 30 MINUTE)`;
			var connection = toolKit.getConnection();
			connection.query(sql, [], function(error, results, fields) {
				if (error) {
					return reject(err);
				}
				else {
					resolve();
				}
			});
			connection.end();
		})
	},
};


module.exports = { sessionService };