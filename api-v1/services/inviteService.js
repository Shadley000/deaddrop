var toolKit = require('./toolKit').toolKit;

const inviteService = {

	getInvites(invitee_user_id) {
		return new Promise(function(resolve, reject) {
			var sql = "SELECT invitee_user_id, inviter_user_id, deaddrop_id, details"
			+ " FROM    deaddrop_invite"
			+ " WHERE   invitee_user_id = ?"

			var connection = toolKit.getConnection();
			connection.query(sql, [invitee_user_id], function(error, results, fields) {
				if (error) reject(error)
				if (results) {
					var invites = [];
					results.forEach((item, index) => {
						var inviteObj = {
							"inviter_user_id": item.inviter_user_id,
							"invitee_user_id": item.invitee_user_id,
							"deaddrop_id": item.deaddrop_id,
							"details": item.details
						}
						invites.push(inviteObj);
					});
					resolve(invites);
				}
				else resolve([]);
			});
			connection.end();
		})
	},
	
	getInvite(invitee_user_id, deaddrop_id) {
		return new Promise(function(resolve, reject) {
			var sql = "SELECT invitee_user_id, inviter_user_id, deaddrop_id, details"
			+ " FROM    deaddrop_invite"
			+ " WHERE   invitee_user_id = ? AND deaddrop_id = ?"

			var connection = toolKit.getConnection();
			connection.query(sql, [ invitee_user_id, deaddrop_id], function(error, results, fields) {
				if (error) reject(error)
				if (results && results.length >0) {
					
					resolve({
						"inviter_user_id": results[0].inviter_user_id,
						"invitee_user_id": results[0].invitee_user_id,
						"deaddrop_id": results[0].deaddrop_id,
						"details": results[0].details
					});
				}
				else resolve();
			});
			connection.end();
		})
	},
	
	addInvite(inviter_user_id, invitee_user_id, deaddrop_id, details) {
		return new Promise(function(resolve, reject) {
			var sql = "insert into deaddrop_invite (inviter_user_id, invitee_user_id, deaddrop_id, details) VALUES (?, ?, ?, ?)    "

			var connection = toolKit.getConnection();
			connection.query(sql, [inviter_user_id, invitee_user_id, deaddrop_id, details], function(error, results, fields) {
				if (error) reject(error)
				resolve();
			});
			connection.end();
		})
	},
	
	deleteInvite(invitee_user_id, deaddrop_id) {
		return new Promise(function(resolve, reject) {
			var sql = "DELETE FROM deaddrop_invite WHERE invitee_user_id = ? AND deaddrop_id = ?  "

			var connection = toolKit.getConnection();
			connection.query(sql, [inviter_user_id, invitee_user_id, deaddrop_id], function(error, results, fields) {
				if (error) reject(error)
				resolve();
			});
			connection.end();
		})
	}

};

module.exports = { inviteService };