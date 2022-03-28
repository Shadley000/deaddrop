var toolKit = require('./toolKit').toolKit;

const contactsService = {
	getContacts(user_id) {
		return new Promise(function(resolve, reject) {

			var sql = `SELECT user_id, contact_user_id FROM contacts WHERE user_id = ?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id], function(error, results, fields) {
				if (error) {
					return reject(error);
				}
				else if (results) {
					var contacts = [];
					results.forEach((item, index) => {
						contacts.push({
							"user_id": item.contact_user_id,
							"contact_user_id": item.contact_id,							
						});
					});
					resolve(contacts);
				}
				else {
					resolve([]);
				}
			});
			connection.end();
		})
	},
	getContact(user_id, contact_user_id) {
		return new Promise(function(resolve, reject) {

			var sql = `SELECT user_id, contact_user_id FROM contacts WHERE user_id = ? && contact_user_id = ?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id, contact_user_id], function(error, results, fields) {
				if (error) {
					return reject(error);
				}
				else if (results) {
					var contacts = [];
					results.forEach((item, index) => {
						contacts.push({
							"user_id": item.contact_user_id,
							"contact_user_id": item.contact_id,							
						});
					});
					resolve(contacts);
				}
				else {
					resolve([]);
				}
			});
			connection.end();
		})
	},
	deleteContact(user_id, contact_user_id) {
		return new Promise(function(resolve, reject) {

			var sql = `DELETE FROM contacts WHERE user_id = ? AND contact_user_id = ?`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id, contact_user_id], function(error, results, fields) {
				if (error) {
					return reject(error);
				}
					resolve();
				
			});
			connection.end();
		})
	},
	
};


module.exports = { contactsService };