module.exports = function(toolKit, userService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {
		console.log('GET /admin');
		try {
			var user_id = req.session.user_id;

			if (user_id == "admin") {
				userService.getUsers((users) => {
					res.status(200).json(users)
				});

			}
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Administrator Only: Get all users",
		"parameters": [
			{
				"in": 'query',
				"name": 'admin_password',
				"type": 'string',
				"required": true
			}
		],
		"responses": {
			"200": {
				"description": "List of users",
				"schema": {
					"$ref": "#/definitions/User"
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