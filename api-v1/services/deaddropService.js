var toolKit = require('./toolKit').toolKit;
var permissionService = require('./permissionService').permissionService;

const deaddropService = {
	
	getDeadDrop(user_id, deaddrop_id, callback) {
		var sql = "SELECT    d.deaddrop_id, d.title"
			+ " FROM    user_id2permission_id p,    deaddrop d"
			+ " WHERE   p.permission_id = d.deaddrop_id"
			+ " AND p.user_id = ?"
			+ " AND d.deaddrop_id = ?";

		var connection = toolKit.getConnection();
		connection.query(sql, [user_id,deaddrop_id], function(error, results, fields) {
			if (error) throw error;
			if (results && results.length >0) {
				callback({
						"deaddrop_id": deaddrop_id,
						"title": results[0].title,
						"messages": []
					});
			}
			else callback();
		});
		connection.end();
	},
/*	
	getDeadDrops(user_id, callback) {
		var sql = "SELECT    d.deaddrop_id, d.title"
			+ " FROM    user_id2permission_id k,    deaddrop d"
			+ " WHERE   k.permission_id = d.deaddrop_id"
			+ " AND k.user_id = ?"
			+ " order by d.deaddrop_id";

		var connection = toolKit.getConnection();
		connection.query(sql, [user_id], function(error, results, fields) {
			if (error) throw error;
			if (results) {
				var list = [];
				results.forEach((item, index) => {
					list.push({"deaddrop_id": item.deaddrop_id,
						"title": item.title});					
				});
				callback(list);
			}
			else callback();
		});
		connection.end();
	},*/
	
	createNewDeadDrop(deaddrop_id, deaddrop_key, callback) {

		var sql = `INSERT INTO deaddrop (deaddrop_id, deaddrop_key) VALUES (?,?)`;
		var connection = toolKit.getConnection();
		connection.query(sql, [deaddrop_id, deaddrop_key],
			function(error, results, fields) {
				if (error) throw error;
				permissionService.createPermission(deaddrop_id,deaddrop_id, "deaddrop",callback)
				callback();
			});
		connection.end();
	},

	deleteDeadDrop(user_id, deaddrop_id, callback) {
		var sql_GetUserPermission = "SELECT permission_id from user_id2permission_id where user_id = ? and deaddrop_id = ?"
		var sql_deleteMessages = "DELETE FROM messages WHERE deaddrop_id =?"
		var sql_deleteUser2Deadrop = "DELETE FROM user_id2permission_id WHERE permission_id =?"
		var sql_deleteDeaddrop = "DELETE FROM deaddrop  WHERE deaddrop_id =? ";
		var connection = toolKit.getConnection();
		connection.query(sql_GetUserPermission, [deaddrop_id, deaddrop_key], function(error, results, fields) {

			if (error) throw error;
			if (results.length > 0) {
				connection.query(sql_deleteUser2Deadrop, [deaddrop_id], function(error, results, fields) {
					if (error) throw error;
				});
				connection.query(sql_deleteMessages, [deaddrop_id], function(error, results, fields) {
					if (error) throw error;
				});
				connection.query(sql_deleteDeaddrop, [deaddrop_id], function(error, results, fields) {
					if (error) throw error;
				});
			}
			callback();
		});
		connection.end();
	}
};

module.exports = { deaddropService };