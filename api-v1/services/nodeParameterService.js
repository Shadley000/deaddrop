 var toolKit = require('./toolKit').toolKit;

const nodeParameterService = {
	addParameter(creater_user_id,parameter_name, node_id, parameter_value) {
		return new Promise(function(resolve, reject) {
			var sql = `INSERT INTO node_parameter (parameter_name, node_id, parameter_value, creater_user_id, publish_date) VALUES (?,?,?, ?, now())`  
			var connection = toolKit.getConnection();
			connection.query(sql, [parameter_name, node_id, parameter_value, creater_user_id], function(error, results, fields) {
				if (error) {
					return reject(error);
				}
				resolve();
			});
			connection.end();
		})
	}
};


module.exports = { nodeParameterService };