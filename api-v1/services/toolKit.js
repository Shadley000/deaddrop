var MYSQL_URL = process.env.MYSQL_URL;

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
	}
}
module.exports = { toolKit };