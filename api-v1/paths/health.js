module.exports = function(toolKit) {
	let operations = {
		GET
	};
	function GET(req, res, next) {
		try {
			var connection = toolKit.getConnection();

			connection.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
				if (error) throw error;
				console.log('The solution is: ', results[0].solution);
			});

			connection.end();

			res.status(200).json(toolKit.createSimpleResponse("success", "all good"))
			next()
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get a server health",
		"parameters": [
		],
		"responses": {
			"200": {
				"description": "success or error",
				"schema": {
					"$ref": "#/definitions/SimpleResponse"
				}
			},
			"default": {
				"description": "Unexpected error",
				"schema": {
					"$ref": "#/definitions/Error"
				}
			}
		}
	};

	return operations;

}