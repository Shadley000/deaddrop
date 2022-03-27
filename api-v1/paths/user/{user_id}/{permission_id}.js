module.exports = function(toolKit, userService, user2PermissionService, permissionService) {
	let operations = {
		POST,
		DELETE
	};

	function POST(req, res, next) {
		try {
			var user_id = req.params.user_id;
			var permission_id = req.params.permission_id;
			var details = req.query.details;
			var permission_key = req.query.permission_key;

			if (user_id == req.session.user_id) {
				permissionService.getPermission(permission_id)
					.then((permissionObj) => {
						if (permissionObj) {
							if (permissionObj.permission_key == permission_key) {
								user2PermissionService.addUserPermission(user_id, permission_id, details)
									.then(() => {
										res.status(200).json(toolKit.createSimpleResponse("success", "${permission_id} permission deleted"))
									});
							} else {
								res.status(401).json(toolKit.createSimpleResponse("error", `${permission_id} permission invalid permission_key`));
							}
						} else {
							res.status(404).json(toolKit.createSimpleResponse("error", `${permission_id} permission not found`));
						}
					})
			}
			else {
				res.status(401).json(toolKit.createSimpleResponse("error", "cannot modify other user"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	POST.apiDoc = {
		"summary": "adds a user permission",
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
				"name": 'authorization_key',
				"type": 'string',
				"required": false
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

			if (user_id == 'admin') {
				res.status(401).json(toolKit.createSimpleResponse("error", "administrator is blocked from deleting its own permissions"));
			}
			else if (user_id == req.session.user_id) {
				user2PermissionService.deleteUserPermission(user_id, permission_id)
					.then(() => {
						res.status(200).json(toolKit.createSimpleResponse("success", "permission deleted"))
					});
			}
			else {
				res.status(401).json(toolKit.createSimpleResponse("error", "cannot delete other user"));
			}
		}
		catch (e) {
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