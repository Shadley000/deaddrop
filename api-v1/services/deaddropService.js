var toolKit = require('./toolKit').toolKit;
var permissionService = require('./permissionService').permissionService;
var user2PermissionService = require('./user2PermissionService').user2PermissionService;

const deaddropService = {
	
	getDeadDrop(user_id, deaddrop_id, callback) {
		var sql = "SELECT d.deaddrop_id, d.title, d.deaddrop_key"
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
						"deaddrop_key": results[0].deaddrop_key,
						"title": results[0].title,
						"messages": []
					});
			}
			else callback();
		});
		connection.end();
	},
	
	createNewDeadDrop(deaddrop_id, title, deaddrop_key, callback) {
		console.log("createNewDeadDrop %s %s %s ",deaddrop_id, title, deaddrop_key);
		var sql = "INSERT INTO deaddrop (deaddrop_id, title, deaddrop_key) VALUES (?,?,?)";
		var connection = toolKit.getConnection();
		connection.query(sql, [deaddrop_id, title, deaddrop_key],
			function(error, results, fields) {
				if (error) throw error;
				callback();
			});
		connection.end();
	},

	deleteDeadDrop(user_id, deaddrop_id, callback) {
	/*	var sql_GetUserPermission = "SELECT permission_id,details from user_id2permission_id where user_id = ? and deaddrop_id = ?"
		var sql_deleteMessages = "DELETE FROM messages WHERE deaddrop_id =?"
		var sql_deleteUser2Deadrop = "DELETE FROM user_id2permission_id WHERE permission_id =?"
		var sql_deleteDeaddrop = "DELETE FROM deaddrop  WHERE deaddrop_id =? ";
		var connection = toolKit.getConnection();
		connection.query(sql_GetUserPermission, [deaddrop_id, deaddrop_key], function(error, results, fields) {

			if (error) throw error;
			if (results.length > 0) {
				//permission_id = results[0].permission_id;
				var details = results[0].details;
				if(details.includes("DELETE")){
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
			}
			callback();
		});
		connection.end();*/
	}
};

module.exports = { deaddropService };