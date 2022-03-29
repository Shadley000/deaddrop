var toolKit = require('./toolKit').toolKit;


const userService = {

	createUser(user_id, password, email, display_name) {
		return new Promise(function(resolve, reject) {
			var sql = `INSERT INTO users (user_id, user_password, email, display_name) VALUES (?,?,?,?)`;
			var connection = toolKit.getConnection();

			connection.query(sql, [user_id, password, email, display_name], function(error, results, fields) {
				if (error) return reject(error);
				console.log('user created');
				resolve();
			});
			connection.end();
		})
	},

	updateUser(user_id, password, email, display_name) {
		return new Promise(function(resolve, reject) {
			var sql = `UPDATE users SET user_password = ?,  email = ?, display_name = ? WHERE user_id =?`;
			var connection = toolKit.getConnection();

			connection.query(sql, [password, email, display_name, user_id], function(error, results, fields) {
				if (error) return reject(error);
				console.log('user updated');
				resolve();
			});
			connection.end()
		})
	},

	deleteUser(user_id) {
		return new Promise(function(resolve, reject) {
			if (user_id == 'admin') {
				console.log('admin account cannot be deleted');
			} else {
				var sql = `DELETE FROM users WHERE user_id =?`;
				var connection = toolKit.getConnection();

				connection.query(sql, [user_id], function(error, results, fields) {
					if (error) return reject(error);
					console.log('user deleted');
					resolve();
				});
				connection.end();
			}
		})
	},

	getUsers() {
		return new Promise(function(resolve, reject) {
			var sql = `SELECT user_id, email, display_name FROM users`;
			var connection = toolKit.getConnection();
			connection.query(sql, [], function(error, results, fields) {
				if (error) return reject(error);
				//console.log('getusers');
				if (results) {
					var list = [];
					results.forEach((item, index) => {
						list.push({
							"user_id": item.user_id,
							"password": "",
							"email": item.email,
							"authentication_token": "",
							"display_name": item.display_name
						});
					});
					resolve(list);
				}
				else resolve([]);
			});
			connection.end();
		})
	},

	getUser(user_id) {
		return new Promise(function(resolve, reject) {
			var sql = `SELECT user_id, user_password, email, display_name FROM users WHERE user_id =?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id], function(error, results, fields) {
				if (error) return reject(error);
				//console.log(results)
				if (results && results.length > 0) {
					resolve({
						"user_id": user_id,
						"password": results[0].user_password,
						"email": results[0].email,
						"permissions": [],
						"display_name": results[0].display_name
					});
				}
				else resolve();
			});
			connection.end();
		})
	},
	search(searchString) {
		if (searchString.length > 0) {
			return new Promise(function(resolve, reject) {

				var likeSearchstring = searchString + '%'
				var sql = `SELECT user_id, email, display_name FROM users WHERE user_id LIKE ?`;
				var connection = toolKit.getConnection();
				connection.query(sql, [likeSearchstring], function(error, results, fields) {
					if (error) return reject(error);
					console.log('getusers');
					if (results) {
						var list = [];
						results.forEach((item, index) => {
							list.push({
								"user_id": item.user_id,
								"password": "",
								"email": "",
								"authentication_token": "",
								"display_name": item.display_name
							});
						});
						resolve(list);
					}
					else resolve([]);

				});
				connection.end();
			})
		}

	}

};


module.exports = { userService };