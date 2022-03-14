var dbService = require('./dbService').dbService;

const userService = {

	createUser(user_id, password, email, callback) {

		var sql = `INSERT INTO users (user_id, user_password, email) VALUES (?,?,?)`;
		var connection = dbService.getConnection();

		connection.query(sql, [user_id, password,   email], function(error, results, fields) {
			if (error) throw error;
			console.log('user created');
			callback();
		});
		connection.end();
	},

	updateUser(user_id, password, email, callback) {
		var sql = `UPDATE users SET user_password = ?,  email = ? WHERE user_id =?`;
		var connection = dbService.getConnection();

		connection.query(sql, [password, email, user_id], function(error, results, fields) {
			if (error) throw error;
			console.log('user updated');
			callback();
		});
		connection.end();
	},

	deleteUser(user_id, callback) {

		var sql = `DELETE FROM users WHERE user_id =?`;
		var connection = dbService.getConnection();

		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			console.log('user deleted');
			callback();
		});
		connection.end();
	},

	getUsers(callback){
		var sql = `SELECT user_id, user_password, email FROM users`;
		var connection = dbService.getConnection();
		connection.query(sql, [], function(error, results, fields) {
			if (error) throw error;
			console.log('getusers');
			callback(results);
		});
		connection.end();
	},
	
	getUser(user_id, callback) {
		var sql = `SELECT user_id, user_password, email FROM users WHERE user_id =?`;
		var connection = dbService.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			//console.log(results)
			if (results && results.length > 0) {
				callback({
					"user_id": user_id,
					"password": results[0].user_password,
					"email": results[0].email,
				});
			}
			else callback();
		});
		connection.end();
	},
	
};


module.exports = { userService};