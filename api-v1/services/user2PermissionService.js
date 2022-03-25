var toolKit = require('./toolKit').toolKit;

const user2PermissionService = {	
	deleteUserPermissionsByPermission(permission_id, callback) {
		var sql = `DELETE FROM user_id2permission_id WHERE permission_id = ?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [permission_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	getUserPermissions(user_id, callback) {
		var sql = `SELECT p.permission_id, p.permission_name, p.tags, u.details `+
			`FROM user_id2permission_id u, permissions p `+
			`WHERE user_id = ? and p.permission_id = u.permission_id`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			if (results) {
				var permissions = [];
				for (let i = 0; i < results.length; i++) {
					permissions.push( {
						'permission_id': results[i].permission_id, 
						'permission_name': results[i].permission_name, 
						'tags': results[i].tags, 
						'details': results[i].details
					});
				}
				callback(permissions);
			}
			else callback();
		});
		connection.end();
	},

	addUserPermission(user_id,permission_id, details, callback) {
		var sql = `INSERT INTO user_id2permission_id (user_id, permission_id, details) VALUES (?,?,? )`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id, permission_id, details], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	deleteUserPermissions(user_id, callback) {
		var sql = `DELETE FROM user_id2permission_id WHERE user_id = ?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	deleteUserPermission(user_id, permission_id, callback) {
		var sql = `DELETE FROM user_id2permission_id WHERE user_id = ? and permission_id = ?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id,permission_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	updateUserPermission(user_id, permission_id, details, callback) {
		var sql = `UPDATE user_id2permission_id SET details = ? WHERE user_id = ? and permission_id = ?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [details, user_id,permission_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
};


module.exports = { user2PermissionService};