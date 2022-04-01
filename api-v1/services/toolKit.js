var MYSQL_URL = process.env.MYSQL_URL;
var mysql = require('mysql');

const toolKit = {

	getConnection() {
		var connection = mysql.createConnection(MYSQL_URL);

		connection.connect(function(err) {
			if (err) {
				console.error('error connecting to database: ' + err.stack);
				return;
			}
		});

		return connection;
	},
	createSimpleResponse(status, message) {
		var response = {
			"status": status,
			"message": message
		}
		console.log(response);
		return;
	},

	getConstants() {
		return {
			'SYS_LOGIN': 'SYS_LOGIN',
			'SYS_ADMINISTRATOR': 'SYS_ADMINISTRATOR',

			'SYS_TAGS_SYSTEM': 'SYSTEM',
			'SYS_TAGS_DEADDROP': 'DEADDROP',
			'SYS_TAGS_MAILDROP': 'MAILDROP',

			'SYS_DETAILS_ALL': 'CREATE READ UPDATE DELETE ADMIN',
			'SYS_DETAILS_CREATE': 'CREATE',
			'SYS_DETAILS_READ': 'READ',
			'SYS_DETAILS_UPDATE': 'UPDATE',
			'SYS_DETAILS_DELETE': 'DELETE',
			'SYS_DETAILS_ADMIN': 'ADMIN',

			'DEADDROP_ADMIN': 'DEADDROP_ADMIN'
		};
	}
}
module.exports = {
	toolKit
};