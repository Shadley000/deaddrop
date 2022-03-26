var toolKit = require('./toolKit').toolKit;

const permissionService = {
	createPermission(permission_id, permission_name, tags, callback){
		var sql = `INSERT INTO permissions ( permission_id, permission_name, tags) VALUES (?,?,?)`;
		var connection = toolKit.getConnection();
		connection.query(sql, [permission_id, permission_name, tags], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	deletePermission(permission_id, callback){
		var sql = `DELETE FROM permissions WHERE permission_id = ?)`;
		var connection = toolKit.getConnection();
		connection.query(sql, [permission_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	updatePermission(permission_id, permission_name, callback){
		var sql = `UPDATE permissions SET permission_name = ? WHERE permission_id = ?)`;
		var connection = toolKit.getConnection();
		connection.query(sql, [permission_name, permission_id], function(error, results, fields) {
			if (error) throw error;
			callback();
		});
		connection.end();
	},
	
	getPermission(permission_id, callback) {
		var sql = `SELECT permission_id, permission_name, tags FROM permissions WHERE permission_id = ?`;
		var connection = toolKit.getConnection();
		connection.query(sql, [permission_id], function(error, results, fields) {
			if (error) throw error;
			if (results && results.length>0) {
				callback( {
						'permission_id': results[0].permission_id, 
						'permission_name': results[0].permission_name, 
						'tags': results[0].tags
					});			
			}
			else callback();
		});
		connection.end();
	},
	
	getPermissions(callback) {
		var sql = `SELECT permission_id, permission_name, tags FROM permissions `;
		var connection = toolKit.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			if (results) {
				var permissions = [];
				for (let i = 0; i < results.length; i++) {
					permissions.push( {
						'permission_id': results[i].permission_id, 
						'permission_name': results[i].permission_name, 
						'tags': results[i].tags
					});
				}
				callback(permissions);
			}
			else callback();
		});
		connection.end();
	},
};


module.exports = { permissionService};