module.exports = function(toolKit, userService, user2PermissionService, sessionService) {
	let operations = {
		GET,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		try {
			var user_id = req.query.user_id;
			var user_password = req.query.password;
			userService.getUser(user_id, (userObj) => {
				if (!userObj) {
					res.status(401).json(toolKit.createSimpleResponse("error", "user not found: " + user_id));
				} else if (userObj.password == user_password) {
					console.log('GET /login authentication passed %j ', userObj);
					sessionService.deleteSession(user_id).then(function() {
						var authentication_token = Math.random();
						sessionService.createSession(user_id, authentication_token).then(function() {
							userObj.authentication_token = authentication_token;
							userObj.password = "";

							user2PermissionService.getUserPermissions(user_id, (permissions) => {
								userObj.permissions = permissions;

								if (user2PermissionService.validatePermission('sys_login', permissions)) {
									res.status(200).json(userObj)
								}
								else {
									res.status(401).json(toolKit.createSimpleResponse("error", "this users login privileges have been revoked"));
								}

							});
						});
					});					
				}
				else {
					res.status(401).json(toolKit.createSimpleResponse("error", "password mismatch"));
				}
			});
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get a user",
		"parameters": [
			{
				"in": 'query',
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

	function POST(req, res, next) {
		try {
			var user_id = req.body.user_id;
			var password = req.body.password;
			var email = req.body.email;
			
			userService.getUser(user_id, (userObj) => {
				if (!userObj) {
					userService.createUser(user_id, password, email, () => {
						user2PermissionService.addUserPermission(user_id, "sys_login", "", () => {
							user2PermissionService.addUserPermission(user_id, "public deaddrop", "", () => {
								res.status(200).json(toolKit.createSimpleResponse("success", "User created"))
							});
						});
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


	POST.apiDoc = {
		"summary": "adds a new user",
		"consumes": ["application/json"],
		"produces": ["application/json"],
		"parameters": [
			{
				"in": "body",
				"name": "body",
				"description": "user object to be added",
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

	function DELETE(req, res, next) {
		try {
			if (req.headers && req.headers.user_id) {
				sessionService.deleteSession(req.headers.user_id, authentication_token)
			}
			req.session.destroy(function(error) {
				console.log("Session Destroyed")
			});
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	DELETE.apiDoc = {
		"summary": "logout",
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