module.exports = function(toolKit, userService, user2PermissionService) {
	let operations = {
		GET,
		PUT,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		console.log('GET /admin/{user_id}');
		if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
			try {
				var requested_user_id = req.params.user_id;
				var user_id = req.session.user_id;
				if (user_id == "admin") {
					userService.getUser(requested_user_id, (userObj) => {
						res.status(200).json(userObj);
					});
				}
			}
			catch (e) {
				res.json(toolKit.createSimpleResponse("error", e.message));
			}

		} else {
			res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
		}
	};

	function PUT(req, res, next) {
		console.log('PUT /admin/{user_id}');
		if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
			try {
				var requested_user_id = req.params.user_id;
				var password = req.query.password;
				var user_id = req.session.user_id;
				if (user_id == "admin") {

					userService.updateUser(requested_user_id, password, email, () => {
						res.status(200).json(toolKit.createSimpleResponse("success", "user updated"))
					});
				}
			}
			catch (e) {
				res.json(toolKit.createSimpleResponse("error", e.message));
			}
		} else {
			res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
		}
	};

	function POST(req, res, next) {
		console.log('POST /admin/{user_id}');
		if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
			try {
				var requested_user_id = req.params.user_id;
				var password = req.body.password;
				var email = req.body.email;
				var user_id = req.session.user_id;
				if (user_id == "admin") {

					console.log(req.body)
					console.log("%s %s %s", requested_user_id, password, email)
					userService.createUser(requested_user_id, password, email, () => {
						res.status(200).json(toolKit.createSimpleResponse("success", "User updated"))
					})
				}
			}
			catch (e) {
				res.json(toolKit.createSimpleResponse("error", e.message));
			}
		} else {
			res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
		}
	};

	function DELETE(req, res, next) {
		if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
			console.log('DELETE /admin/{user_id}');
			try {
				var requested_user_id = req.params.user_id;
				var user_id = req.session.user_id;
				if (user_id == "admin") {

					userService.deleteUser(requested_user_id, () => {
						res.status(200).json(toolKit.createSimpleResponse("success", "user deleted"))
					})
				}
			}
			catch (e) {
				res.json(toolKit.createSimpleResponse("error", e.message));
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