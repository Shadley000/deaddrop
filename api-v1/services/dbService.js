var mysql = require('mysql');

var MYSQL_URL = process.env.MYSQL_URL;


const dbService = {
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
	}
};


module.exports = { dbService };



