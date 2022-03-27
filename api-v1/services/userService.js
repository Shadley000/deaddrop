var toolKit = require('./toolKit').toolKit;


const userService = {

	createUser(user_id, password, email, display_name, callback) {

		var sql = `INSERT INTO users (user_id, user_password, email, display_name) VALUES (?,?,?,?)`;
		var connection = toolKit.getConnection();

		connection.query(sql, [user_id, password, email, display_name], function(error, results, fields) {
			if (error) throw error;
			console.log('user created');
			callback();
		});
		connection.end();
	},

	updateUser(user_id, password, email, display_name, callback) {
		var sql = `UPDATE users SET user_password = ?,  email = ?, display_name = ? WHERE user_id =?`;
		var connection = toolKit.getConnection();

		connection.query(sql, [password, email, display_name, user_id], function(error, results, fields) {
			if (error) throw error;
			console.log('user updated');
			callback();
		});
		connection.end();
	},

	deleteUser(user_id, callback) {
		if (user_id == 'admin') {
			console.log('admin account cannot be deleted');
		} else {
			var sql = `DELETE FROM users WHERE user_id =?`;
			var connection = toolKit.getConnection();

			connection.query(sql, [user_id], function(error, results, fields) {
				if (error) throw error;
				console.log('user deleted');
				callback();
			});
			connection.end();
		}
	},

	getUsers(callback) {
		var sql = `SELECT user_id, email, display_name FROM users`;
		var connection = toolKit.getConnection();
		connection.query(sql, [], function(error, results, fields) {
			if (error) throw error;
			console.log('getusers');
			var list = [];
			if (results) {
				results.forEach((item, index) => {
					list.push({
						"user_id": item.user_id,
						"password": "",
						"email": item.email,
						"authentication_token": "",
						"display_name": item.display_name
					});
				});
				callback(list);
			}
			else callback(list);
		});
		connection.end();
	},

	getUser(user_id, callback) {
		var sql = `SELECT user_id, user_password, email, display_name FROM users WHERE user_id =?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			//console.log(results)
			if (results && results.length > 0) {
				callback({
					"user_id": user_id,
					"password": results[0].user_password,
					"email": results[0].email,
					"permissions": [],
					"display_name": results[0].display_name
				});
			}
			else callback();
		});
		connection.end();
	},

};


module.exports = { userService };