

var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
var MYSQL_URL = process.env.MYSQL_URL;

const toolKit = {
	getConnection() {
		var connection = mysql.createConnection(MYSQL_URL);

		connection.connect(function(err) {
			if (err) {
				console.error('dbService error connecting: ' + err.stack);
				return;
			}
			//console.log('dbService connected as id ' + connection.threadId);
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
	}
}
module.exports = { toolKit };