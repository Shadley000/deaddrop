module.exports = function(toolKit, userService, keyService) {
	let operations = {
		GET,
		PUT,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		console.log('GET /user/{user_id}');
		try {
			var user_id = req.params.user_id;
			toolKit.validateAdminPassword(req.query.admin_password);

			userService.getUser(user_id, (userObj) => {
				res.status(200).json(userObj);
			});

		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function PUT(req, res, next) {
		console.log('PUT /user/{user_id}');
		try {
			var user_id = req.params.user_id;
			var password = req.query.password;
			toolKit.validateAdminPassword(req.query.admin_password);

			userService.updateUser(user_id, password, email, () => {
				res.status(200).json(toolKit.createSimpleResponse("success", "user updated"))
			});
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function POST(req, res, next) {
		console.log('POST /user/{user_id}');
		try {
			var user_id = req.params.user_id;
			var password = req.body.password;
			var email = req.body.email;
			toolKit.validateAdminPassword(req.query.admin_password);

			console.log(req.body)
			console.log("%s %s %s", user_id, password, email)
			userService.createUser(user_id, password, email, () => {
				res.status(200).json(toolKit.createSimpleResponse("success", "User updated"))
			})
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function DELETE(req, res, next) {
		console.log('DELETE /user/{user_id}');
		try {
			var user_id = req.params.user_id;
			toolKit.validateAdminPassword(req.query.admin_password);
			userService.deleteUser(user_id, () => {
				res.status(200).json(toolKit.createSimpleResponse("success", "user deleted"))
			})
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Administrator Only: Get a user",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'admin_password',
				"type": 'string',
				"required": true
			}
		],
		"responses": {
			"200": {
				"description": "a user",
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
	PUT.apiDoc = {
		"summary": "Administrator Only: update a user",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'password',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'admin_password',
				"type": 'string',
				"required": true
			}
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
	POST.apiDoc = {
		"summary": "Administrator Only: adds a new user",
		"consumes": ["application/json"],
		"produces": ["application/json"],
		"parameters": [
			{
				"in": "body",
				"name": "body",
				"description": "user object that needs to be added",
				"required": true,
				"schema": {
					"$ref": "#/definitions/User"
				}
			},
			{
				"in": 'query',
				"name": 'admin_password',
				"type": 'string',
				"required": true
			}
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

	DELETE.apiDoc = {
		"summary": "Administrator Only: delete a user",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'admin_password',
				"type": 'string',
				"required": true
			}
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