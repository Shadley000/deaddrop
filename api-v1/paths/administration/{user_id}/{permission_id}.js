module.exports = function(toolKit, userService, user2PermissionService) {
	let operations = {
		PUT,
		POST,
		DELETE
	};

	function PUT(req, res, next) {
		try {
			var user_id = req.params.user_id;
			var permission_id = req.params.permission_id;
			var details = req.query.details ? req.query.details : "";
			if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
				user2PermissionService.updateUserPermission(user_id, permission_id, details)
					.then(() => {
						res.status(200).json(toolKit.createSimpleResponse("success", "permission updated"))
					});

			} else {
				res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
			}
		} catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	PUT.apiDoc = {
		"summary": "add permission for a user",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'path',
				"name": 'permission_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'details',
				"type": 'string',
				"required": false
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
		try {
			var user_id = req.params.user_id;
			var permission_id = req.params.permission_id;
			var details = req.query.details ? req.query.details : "";

			if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
				user2PermissionService.addUserPermission(user_id, permission_id, details)
					.then(() => {
						res.status(200).json(toolKit.createSimpleResponse("success", "permission deleted"))
					});

			} else {
				res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
			}
		} catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}


	};

	POST.apiDoc = {
		"summary": "add permission for a user",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'path',
				"name": 'permission_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'details',
				"type": 'string',
				"required": false
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
			var permission_id = req.params.permission_id;


			if (user2PermissionService.validatePermission('sys_administrator', req.session.permissions)) {
				if (user_id == 'admin') {
					var permissionObj = req.session.permissions.find(o => o.permission_id === permission_id)
					if (permissionObj.tags.indexOf("SYSTEM") > -1) {
						res.status(401).json(toolKit.createSimpleResponse("error", "administrator cannot delete its SYSTEM privileges"));
					} else {
						user2PermissionService.deleteUserPermission(user_id, permission_id)
							.then(() => {
								res.status(200).json(toolKit.createSimpleResponse("success", "permission deleted"))
							});
					}

				} else {
					user2PermissionService.deleteUserPermission(user_id, permission_id)
						.then(() => {
							res.status(200).json(toolKit.createSimpleResponse("success", "permission deleted"))
						});
				}


			} else {
				res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
			}
		} catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}


	};

	DELETE.apiDoc = {
		"summary": "Delete a users permission",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'path',
				"name": 'permission_id',
				"type": 'string',
				"required": true
			},
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