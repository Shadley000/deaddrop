module.exports = function(toolKit, deaddropService, messageService, permissionService, user2PermissionService) {
	let operations = {
		GET,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		try {
			var user_id = req.session.user_id;
			var deaddrop_id = req.params.deaddrop_id;
			
			//verify the user has permission to create a deaddrop
			if (user2PermissionService.isCacheUserPermission(req, deaddrop_id,toolKit.getConstants().SYS_DETAILS_READ)) {

				deaddropService.getDeadDrop(user_id, deaddrop_id)
					.then((deaddropObj) => {
						if (deaddropObj) {
							messageService.getDeadDropMessages(user_id, deaddrop_id)
								.then((messages) => {
									deaddropObj.messages = messages;
									res.status(200).json(deaddropObj);
								});
						} else {
							res.status(404).json(toolKit.createSimpleResponse("error", "deaddrop not found:" + deaddrop_id));
						}
					});
			} else {
				res.status(401).json(toolKit.createSimpleResponse("error", `${user_id} does not have ${toolKit.getConstants().SYS_DETAILS_READ} permissions for ${deaddrop_id}`));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get a deaddrops messages",
		"parameters": [
			{
				"in": 'path',
				"name": 'deaddrop_id',
				"type": 'string',
				"required": true
			}
		],
		"responses": {
			"200": {
				"description": "a deaddrop",
				"schema": {
					"$ref": "#/definitions/Deaddrop"
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
			var user_id = req.session.user_id;
			var deaddrop_id = req.params.deaddrop_id;
			var deaddrop_key = req.body.deaddrop_key;
			var title = req.body.title;
			var tags = "DEADDROP";

			if (user2PermissionService.isCacheUserPermission(req,  toolKit.getConstants().DEADDROP_ADMIN,toolKit.getConstants().SYS_DETAILS_CREATE)) {

				// if the permission exists than the deaddrop is already taken
				permissionService.getPermission(deaddrop_id)
					.then(function(aPermissionObj) {
						if (aPermissionObj) {
							res.status(401).json(toolKit.createSimpleResponse("error", "This deaddrop name is already taken"));
						} else {
							permissionService.createPermission(deaddrop_id, deaddrop_id, tags, deaddrop_key)
								.then(() => {
									user2PermissionService.addUserPermission(user_id, deaddrop_id, toolKit.getConstants().SYS_DETAILS_ALL)
										.then(() => {
											deaddropService.createNewDeadDrop(deaddrop_id, title)
												.then(() => {
													messageObj = {
														"deaddrop_id": deaddrop_id,
														"user_id": user_id,
														"title": "Welcome to " + deaddrop_id,
														"message": "This is " + deaddrop_id
													}
													messageService.addMessage(messageObj)
														.then(() => {
															res.status(200).json(toolKit.createSimpleResponse("success", "deaddrop added"));
														});
												})
										})
								})
						}
					});
			} else {
				res.status(401).json(toolKit.createSimpleResponse("error", `${user_id} does not have ${toolKit.getConstants().SYS_DETAILS_CREATE} permissions for ${deaddrop_id}`));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	POST.apiDoc = {
		"summary": "creates a new deaddrop",
		"consumes": ["application/json"],
		"produces": ["application/json"],
		"parameters": [
			{
				"in": 'path',
				"name": 'deaddrop_id',
				"type": 'string',
				"required": true
			},
			{
				"in": "body",
				"name": "body",
				"description": "message object that needs to be added",
				"required": true,
				"schema": {
					"$ref": "#/definitions/Deaddrop"
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
			var user_id = req.session.user_id;
			var deaddrop_id = req.params.deaddrop_id;

			if (user2PermissionService.isCacheUserPermission(req,  deaddrop_id,toolKit.getConstants().SYS_DETAILS_DELETE)) {
				user2PermissionService.deleteUserPermissionsByPermission(deaddrop_id)
					.then(() => {
						res.stats(200).json(toolKit.createSimpleResponse("success", "deaddrop removed"));
					})
				messageService.deleteDeadDropMessages(deaddrop_id)
					.then(() => {
						deaddropService.deleteDeadDrop(user_id, deaddrop_id)
							.then(() => {
								permissionService.deletePermission(deaddrop_id)
							})
					})
			} else {
				res.status(401).json(toolKit.createSimpleResponse("error", `${user_id} does not have ${toolKit.getConstants().SYS_DETAILS_DELETE} permissions for ${deaddrop_id}`));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	DELETE.apiDoc = {
		"summary": "Delete a deaddrop",
		"parameters": [
			{
				"in": 'path',
				"name": 'deaddrop_id',
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