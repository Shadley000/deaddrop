var toolKit = require('./toolKit').toolKit;

const deaddropService = {

	getDeadDrop(user_id, deaddrop_id) {
		return new Promise(function(resolve, reject) {
			var sql = "SELECT d.deaddrop_id, d.title"
				+ " FROM    user_id2permission_id p,    deaddrop d"
				+ " WHERE   p.permission_id = d.deaddrop_id"
				+ " AND p.user_id = ?"
				+ " AND d.deaddrop_id = ?";

			var connection = toolKit.getConnection();
			connection.query(sql, [user_id, deaddrop_id], function(error, results, fields) {
				if (error) reject(error)
				if (results && results.length > 0) {
					resolve({
						"deaddrop_id": deaddrop_id,
						"deaddrop_key": results[0].deaddrop_key,
						"title": results[0].title,
						"messages": []
					});
				}
				else resolve();
			});
			connection.end();
		})
	},

	createNewDeadDrop(deaddrop_id, title) {
		return new Promise(function(resolve, reject) {
			console.log("createNewDeadDrop %s %s ", deaddrop_id, title);
			var sql = "INSERT INTO deaddrop (deaddrop_id, title) VALUES (?,?)";
			var connection = toolKit.getConnection();
			connection.query(sql, [deaddrop_id, title],
				function(error, results, fields) {
					if (error) reject(error)
					resolve();
				});
			connection.end();
		})
	},

	deleteDeadDrop(user_id, deaddrop_id) {
		return new Promise(function(resolve, reject) {
			var sql_deleteDeaddrop = "DELETE FROM deaddrop  WHERE deaddrop_id =? ";
			var connection = toolKit.getConnection();
			connection.query(sql_deleteDeaddrop, [deaddrop_id], function(error, results, fields) {
				if (error) reject(error)
				resolve();
			});
			connection.end();

		})
	}
};

module.exports = { deaddropService };