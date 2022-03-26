module.exports = function(toolKit, userService, user2PermissionService) {
	let operations = {
		GET,
		PUT,
		DELETE
	};

	function GET(req, res, next) {
		try {
			var user_id = req.params.user_id;
			console.log('GET /login ', user_id);
			if (user_id == req.headers.user_id) {
				userService.getUser(user_id, (userObj) => {
					if (!userObj) {
						res.status(401).json(toolKit.createSimpleResponse("error", "user not found: " + user_id));
					}
					userObj.authentication_token = req.headers.authentication_token;
					userObj.password = "";

					user2PermissionService.getUserPermissions(user_id, (permissions) => {
						userObj.permissions = permissions;
						res.status(200).json(userObj);
					});

				});
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
	function PUT(req, res, next) {
		try {
			var user_id = req.params.user_id;
			var password = req.query.password;
			var new_password = req.query.new_password;
			var new_email = req.query.email;
			console.log('PUT /user/', user_id);

			if (user_id == req.session.user_id) {

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
				res.status(403).json(toolKit.createSimpleResponse("error", "cannot update other user"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
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

	function DELETE(req, res, next) {
		try {
			var user_id = req.params.user_id;
			var password = req.params.password;
			console.log('DELETE /user/', user_id);
			
			if(user_id == 'admin') {
				res.status(401).json(toolKit.createSimpleResponse("error", "cannot delete admin user"));
			}
			else if (user_id == req.session.user_id) {
				userService.getUser(user_id, (userObj) => {
					if (userObj && userObj.password == password) {
						user2PermissionService.deleteUserPermissions(user_id, () => {
							userService.deleteUser(user_id, () => {
								res.status(200).json(toolKit.createSimpleResponse("success", "user deleted"))
							});
						})
					}
					else {
						res.status(403).json(toolKit.createSimpleResponse("error", "user does not exist"));
					}

				});
			}
			else {
				res.status(403).json(toolKit.createSimpleResponse("error", "cannot delete other user"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
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