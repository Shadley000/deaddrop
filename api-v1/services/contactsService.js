var toolKit = require('./toolKit').toolKit;

const contactsService = {
	getContacts(user_id) {
		return new Promise(function(resolve, reject) {

			var sql = `SELECT u.user_id, u.email, u.display_name FROM contacts c, users u WHERE c.user_id = ? AND u.user_id = c.contact_user_id`;
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id], function(error, results, fields) {
				if (error) {
					return reject(error);
				}
				else if (results) {
					var contacts = [];
					results.forEach((item, index) => {
						contacts.push({
							"user_id": item.user_id,
							"password": "",
							"email": "",
							"authentication_token": "",
							"display_name": item.display_name
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

			var sql = `SELECT u.user_id, u.email, u.display_name FROM contacts c, users u WHERE c.user_id = ? AND u.user_id = c.contact_user_id && contact_user_id = ?`;
			
			var connection = toolKit.getConnection();
			connection.query(sql, [user_id, contact_user_id], function(error, results, fields) {
				if (error) {
					return reject(error);
				}
				else if (results && results.length >0) {
						resolve({
							"user_id": results[0].user_id,
							"password": "",
							"email": "",
							"authentication_token": "",
							"display_name": results[0].display_name
						});
				}
				else {
					resolve();
				}
			});
			connection.end();
		})
	},
	
	addContact(user_id, contact_user_id) {
		return new Promise(function(resolve, reject) {

			var sql = `INSERT INTO contacts (user_id, contact_user_id) VALUES (?,?)`;
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
	}

};


module.exports = { contactsService };