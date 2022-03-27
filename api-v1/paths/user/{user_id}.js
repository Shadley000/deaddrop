module.exports = function(toolKit, userService, user2PermissionService) {
	let operations = {
		GET,
		PUT,
		DELETE
	};

	function GET(req, res, next) {
		try {
			var user_id = req.params.user_id;
			userService.getUser(user_id)
				.then((userObj) => {
					if (!userObj) {
						res.status(401).json(toolKit.createSimpleResponse("error", "user not found: " + user_id));
					}
					userObj.password = "";

					if (user_id == req.headers.user_id) {
						userObj.authentication_token = req.headers.authentication_token;

						user2PermissionService.getUserPermissions(user_id)
							.then((permissions) => {
								userObj.permissions = permissions;
								res.status(200).json(userObj);
							});
					}
					else {
						userObj.authentication_token = "";
						userObj.permissions = [];
						userObj.email = "";
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
			var new_password = req.body.new_password;
			var email = req.body.email;
			var display_name = req.body.display_name;

			if (user_id == req.session.user_id) {

				userService.getUser(user_id)
					.then((userObj) => {
						if (userObj.password == password) {
							if (!new_password) new_password = userObj.password;
							userService.updateUser(user_id, new_password, email, display_name)
								.then(() => {
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
				"in": "body",
				"name": "body",
				"description": "user object containing update information",
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
			var user_id = req.params.user_id;
			var password = req.params.password;

			if (user_id == 'admin') {
				res.status(401).json(toolKit.createSimpleResponse("error", "cannot delete admin user"));
			}
			else if (user_id == req.session.user_id) {
				userService.getUser(user_id)
					.then((userObj) => {
						if (userObj && userObj.password == password) {
							user2PermissionService.deleteUserPermissions(user_id)
								.then(() => {
									/*userService.deleteUser(user_id, () => {
										res.status(200).json(toolKit.createSimpleResponse("success", "user deleted"))
									});*/
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