module.exports = function(toolKit, messageService, user2PermissionService) {
	let operations = {
		POST,
		DELETE
	};

	function POST(req, res, next) {
		var user_id = req.session.user_id;
		var deaddrop_id = req.params.deaddrop_id;
		var messageObj = req.body;
		try {
			//todo add special case for MAILBOX tags
			if (messageObj.user_id == user_id && messageObj.deaddrop_id == deaddrop_id) {
				if (user2PermissionService.isCacheUserPermission(req, deaddrop_id, toolKit.getConstants().SYS_DETAILS_CREATE)) {
					messageService.addMessage(messageObj)
					.then(() => {
						res.status(200).json(toolKit.createSimpleResponse("Success", "message added"));
					});
				} else {
					permissionService.getPermission(permission_id)
					.next((permissionObj) => {
						if(permissionObj.tags.includes(toolKit.constants.SYS_TAGS_MAILDROP)){
							//mailbox tags are a special case that anyone can send to
							messageService.addMessage(messageObj)
						} else {
							console.log("user does not have permission: %s deaddrop_id: %s permission: %j", user_id, deaddrop_id, toolKit.getConstants().SYS_DETAILS_CREATE)
							res.status(403).json(toolKit.createSimpleResponse("error", "user does not have permission: " + toolKit.getConstants().SYS_DETAILS_CREATE));
						}
					})
				}	
			}
			else {
				console.log("attempted forgery user_id: %s deaddrop_id: %s messageObj: %j", user_id, deaddrop_id, messageObj)
				res.status(404).json(toolKit.createSimpleResponse("error", "attempted forgery"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	POST.apiDoc = {
		"summary": "adds a new deaddrop message",
		"parameters": [
		{
			"in": 'path',
			"name": 'deaddrop_id',
			"type": 'string',
			"required": true,
		},
		{
			"in": 'path',
			"name": 'message_id',
			"type": 'string',
			"required": true
		},
		{
			"in": "body",
			"name": "body",
			"description": "message object that needs to be added",
			"required": true,
			"schema": {
				"$ref": "#/definitions/Message"
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
		var deaddrop_id = req.params.deaddrop_id;
		var message_id = req.params.message_id;
		var user_id = req.session.user_id;

		try {
			if (user2PermissionService.isCacheUserPermission(req, deaddrop_id, toolKit.getConstants().SYS_DETAILS_DELETE)) {
				if (user2PermissionService.isCacheUserPermission(req, deaddrop_id, toolKit.getConstants().SYS_DETAILS_ADMIN)) {
					messageService.adminDeleteMessage(deaddrop_id,message_id)
					.then(() => {
						res.status(200).json(toolKit.createSimpleResponse("Success", "message deleted"));
					});
				} else {
					messageService.deleteMessage(user_id, deaddrop_id, message_id)
					.then(() => {
						res.status(200).json(toolKit.createSimpleResponse("Success", "message deleted"));
					});
				}
			}
			else {
				console.log("user does not have permission: %s deaddrop_id: %s permission: %j", user_id, deaddrop_id, toolKit.getConstants().SYS_DETAILS_DELETE)
				res.status(403).json(toolKit.createSimpleResponse("error", "user does not have permission: " + toolKit.getConstants().SYS_DETAILS_DELETE));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	DELETE.apiDoc = {
		"summary": "adds a new message",
		"consumes": ["application/json"],
		"produces": ["application/json"],
		"parameters": [
		{
			"in": 'path',
			"name": 'deaddrop_id',
			"type": 'string',
			"required": true,

		},
		{
			"in": 'path',
			"name": 'message_id',
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