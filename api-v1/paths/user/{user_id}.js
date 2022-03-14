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
			var user_password = req.query.password;
			//console.log('GET /user/{user_id} %s %s ',user_id, user_password);
			userService.getUser(user_id, (userObj) => {
				if (userObj.password == user_password) {
					req.session.authentication_token = Math.random();
					req.session.user_id = user_id;
					userObj.authentication_token = req.session.authentication_token;
					userObj.password = "";
					console.log('GET /user/{user_id} authentication passed %j ',userObj);
					res.status(200).json(userObj)
				}
				else {
					res.status(404).json(toolKit.createSimpleResponse("error", "password mismatch"));
				}
			});
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function PUT(req, res, next) {
		console.log('PUT /user/{user_id}');
		try {
			var user_id = req.params.user_id;
			var password = req.query.password;
			var new_password = req.query.new_password;
			var new_email = req.query.email;

			if (req.session.authentication_token == req.query.authentication_token) {
				userService.getUser(user_id, (userObj) => {
					if (userObj.password == user_password) {
						if (!new_password) new_password = password;
						if (!new_email) new_email = userObj.email;
						userService.updateUser(user_id, new_password, new_email, () => {
							res.status(200).json(toolKit.createSimpleResponse("success", "user updated"));
						});
					}
					else {
						res.status(403).json(toolKit.createSimpleResponse("error", "password mismatch"));
					}
				});
			}
			else {
				res.status(403).json(toolKit.createSimpleResponse("error", "authentication_token mismatch"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function POST(req, res, next) {
		console.log('POST /user/{user_id}');
		try {
			var user_id = req.params.user_id;
			var password = req.body.password;
			var email = req.body.email;

			userService.getUser(user_id, (userObj) => {
				if (!userObj) {
					userService.createUser(user_id, password, email, () => {
						res.status(200).json(toolKit.createSimpleResponse("success", "User created"))
					});
				}
				else {
					res.status(403).json(toolKit.createSimpleResponse("error", "user already exists"));
				}
			});
			
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function DELETE(req, res, next) {
		console.log('DELETE /user/{user_id}');
		try {
			var user_id = req.params.user_id;
			var password = req.params.password;
			if (req.session.authentication_token == req.query.authentication_token) {
				userService.getUser(user_id, (userObj) => {
					if (userObj) {
						if (userObj.password == password) {
							keyService.deleteUserKeys(user_id, () => {
								userService.deleteUser(user_id, () => {
									res.status(200).json(toolKit.createSimpleResponse("success", "user deleted"))
								});
							})
						}
						else {
							res.status(403).json(toolKit.createSimpleResponse("error", "user does not exist"));
						}
					}
				});
			}
			else {
				res.status(403).json(toolKit.createSimpleResponse("error", "authentication_token mismatch"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get a user",
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
		"summary": "update a user",
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
				"name": 'new_password',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'email',
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
		"summary": "adds a new user",
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
		"summary": "Get a user",
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