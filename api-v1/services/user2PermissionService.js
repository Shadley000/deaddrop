var toolKit = require('./toolKit').toolKit;

const user2PermissionService = {
	deleteUserPermissionsByPermission(permission_id) {
		return new Promise(function(resolve, reject) {
			var sql = `DELETE FROM user_id2permission_id WHERE permission_id = ?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [permission_id], function(error, results, fields) {
				if (error) return reject(error);
				resolve();
			});
			connection.end();
		})
	},
	getUserPermissions(user_id) {
		return new Promise(function(resolve, reject) {
			var sql = `SELECT p.permission_id, p.permission_name, p.tags, u.details ` +
				`FROM user_id2permission_id u, permissions p ` +
				`WHERE user_id = ? and p.permission_id = u.permission_id`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id], function(error, results, fields) {
				if (error) return reject(error);
				if (results) {
					var permissions = [];
				for (let i = 0; i < results.length; i++) {
						permissions.push({
							'permission_id': results[i].permission_id,
							'permission_name': results[i].permission_name,
							'tags': results[i].tags,
							'details': results[i].details
						});
					}
					resolve(permissions);
				}
				else resolve([]);
			});
			connection.end();
		})
	},

	addUserPermission(user_id, permission_id, details) {
		return new Promise(function(resolve, reject) {
			var sql = `INSERT INTO user_id2permission_id (user_id, permission_id, details) VALUES (?,?,? )`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id, permission_id, details], function(error, results, fields) {
				if (error) return reject(error);
				resolve();
			});
			connection.end();
		})
	},

	deleteUserPermissions(user_id) {
		return new Promise(function(resolve, reject) {
			var sql = `DELETE FROM user_id2permission_id WHERE user_id = ?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id], function(error, results, fields) {
				if (error) return reject(error);
				resolve();
			});
			connection.end();
		})
	},

	deleteUserPermission(user_id, permission_id) {
		return new Promise(function(resolve, reject) {
			var sql = `DELETE FROM user_id2permission_id WHERE user_id = ? and permission_id = ?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id, permission_id], function(error, results, fields) {
				if (error) return reject(error);
				resolve();
			});
			connection.end();
		})
	},

	updateUserPermission(user_id, permission_id, details) {
		return new Promise(function(resolve, reject) {
			var sql = `UPDATE user_id2permission_id SET details = ? WHERE user_id = ? and permission_id = ?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [details, user_id, permission_id], function(error, results, fields) {
				if (error) return reject(error);
				resolve();
			});
			connection.end();
		})
	},

	isCacheUserPermission(req, permission_id, action)
	{	if(req.session && req.session.permissions )
		{	var permissionsObj =  req.session.permissions.find(o => o.permission_id == permission_id)
			console.log(permissionsObj)
			return (permissionsObj.details.indexOf(action)>-1)
		}
		console.log(permissionsObj)
		return false;
	},
	getCacheUserPermissionObj(req, permission_id){
		return req.session && req.session.permissions && req.session.permissions.find(o => o.permission_id === permission_id)
	},

	validatePermission(permission_id, permissions) {
		return (permissions && permissions.find(o => o.permission_id == permission_id))
	}
};


module.exports = { user2PermissionService };