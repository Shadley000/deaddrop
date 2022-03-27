module.exports = function(toolKit, messageService) {
	let operations = {
		POST,
		DELETE
	};

	function POST(req, res, next) {
		var user_id = req.session.user_id;
		var deaddrop_id = req.params.deaddrop_id;
		var messageObj = req.body;
		try {
			if (messageObj.user_id == user_id && messageObj.deaddrop_id == deaddrop_id) {
				messageService.addMessage(messageObj)
					.then(() => {
						res.status(200).json(toolKit.createSimpleResponse("Success", "message added"));
					});
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
			messageService.deleteMessage(user_id, deaddrop_id, message_id)
				.then(() => {
					res.status(200).json(toolKit.createSimpleResponse("Success", "message deleted"));
				});
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