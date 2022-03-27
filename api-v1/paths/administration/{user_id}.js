module.exports = function(toolKit, userService, user2PermissionService) {
	let operations = {
		GET,
		PUT,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
			try {
				var requested_user_id = req.params.user_id;
				userService.getUser(requested_user_id, (userObj) => {
					user2PermissionService.getUserPermissions(requested_user_id)
						.then((permissions) => {
							userObj.permissions = permissions;
							res.status(200).json(userObj);
						});
				});
			}
			catch (e) {
				res.status(401).json(toolKit.createSimpleResponse("error", e.message));
			}
		} else {
			res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
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
		if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
			try {
				var requested_user_id = req.params.user_id;
				var password = req.body.password; /// todo this is likely to be a problem
				var email = req.body.email;
				var display_name = req.body.display_name;

				userService.updateUser(requested_user_id, password, email, display_name, () => {
					res.status(200).json(toolKit.createSimpleResponse("success", "user updated"))
				});
			}
			catch (e) {
				res.status(500).json(toolKit.createSimpleResponse("error", e.message));
			}
		} else {
			res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
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

	function POST(req, res, next) {
		if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
			try {
				var requested_user_id = req.params.user_id;
				var password = req.body.password;
				var email = req.body.email;
				var display_name = req.body.display_name;
				userService.createUser(requested_user_id, password, email, display_name, () => {
					res.status(200).json(toolKit.createSimpleResponse("success", "User updated"))
				})
			}
			catch (e) {
				res.status(500).json(toolKit.createSimpleResponse("error", e.message));
			}
		} else {
			res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
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
		if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
			try {
				var requested_user_id = req.params.user_id;
				if (requested_user_id != "admin") {

					userService.deleteUser(requested_user_id, () => {
						res.status(200).json(toolKit.createSimpleResponse("success", "user deleted"))
					})
				}
				else {
					res.status(401).json(toolKit.createSimpleResponse("error", 'admin user cannot be deleted'));
				}
			}
			catch (e) {
				res.status(500).json(toolKit.createSimpleResponse("error", e.message));
			}
		} else {
			res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
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