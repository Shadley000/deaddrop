var toolKit = require('./toolKit').toolKit;

const permissionService = {
	createPermission(permission_id, permission_name, tags) {
		return new Promise(function(resolve, reject) {

			var sql = `INSERT INTO permissions ( permission_id, permission_name, tags) VALUES (?,?,?)`;
			var connection = toolKit.getConnection();
			connection.query(sql, [permission_id, permission_name, tags], function(error, results, fields) {
				if (error) return reject(error);
				resolve();
			});
			connection.end();
		});
	},

	deletePermission(permission_id) {
		return new Promise(function(resolve, reject) {
			;
			var sql = `DELETE FROM permissions WHERE permission_id = ?)`;
			var connection = toolKit.getConnection();
			connection.query(sql, [permission_id], function(error, results, fields) {
				if (error) return reject(error);
				resolve();
			});
			connection.end();
		})
	},

	updatePermission(permission_id, permission_name) {
		return new Promise(function(resolve, reject) {
			var sql = `UPDATE permissions SET permission_name = ? WHERE permission_id = ?)`;
			var connection = toolKit.getConnection();
			connection.query(sql, [permission_name, permission_id], function(error, results, fields) {
				if (error) return reject(error);
				resolve();
			});
			connection.end();
		});
	},

	getPermission(permission_id) {
		return new Promise(function(resolve, reject) {
			var sql = `SELECT permission_id, permission_name, tags FROM permissions WHERE permission_id = ?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [permission_id], function(error, results, fields) {
				if (error) return reject(error);
				if (results && results.length > 0) {
					resolve({
						'permission_id': results[0].permission_id,
						'permission_name': results[0].permission_name,
						'tags': results[0].tags
					});
				}
				else resolve(undefined);;
			});
			connection.end();
		});
	},

	getPermissions() {
		return new Promise(function(resolve, reject) {
			var sql = `SELECT permission_id, permission_name, tags FROM permissions ORDER BY permission_id `;
			var connection = toolKit.getConnection();
			connection.query(sql, [], function(error, results, fields) {
				if (error) return reject(error);
				if (results) {
					var permissions = [];
					for (let i = 0; i < results.length; i++) {
						permissions.push({
							'permission_id': results[i].permission_id,
							'permission_name': results[i].permission_name,
							'tags': results[i].tags
						});
					}
					resolve(permissions);
				}
				else resolve(undefined);;
			});
			connection.end();
		});
	},
};


module.exports = { permissionService };