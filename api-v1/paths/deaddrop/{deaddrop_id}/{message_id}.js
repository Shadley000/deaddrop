module.exports = function(toolKit,deaddropService) {
	let operations = {
		POST,
		DELETE
	};

	function POST(req, res, next) {
		console.log('POST v1/deaddrop/:deaddrop_id/:message_id');
		var user_id = req.session.user_id;
		var deaddrop_id = req.params.deaddrop_id;
		var messageObj = req.body;
		try {
			if (messageObj.user_id == user_id && messageObj.deaddrop_id == deaddrop_id) {
				deaddropService.addMessage(messageObj, () => {
					res.status(200).json(toolKit.createSimpleResponse("Success", "message added"));
				});
			}
			else {
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
		console.log('POST v1/deaddrop/:deaddrop_id/:message_id');
		var deaddrop_id = req.params.deaddrop_id;
		var message_id = req.params.message_id;
		var user_id = req.session.user_id;

		try {
			deaddropService.deleteMessage(user_id, deaddrop_id, message_id, () => {
				res.status(200).json(toolKit.createSimpleResponse("Success", "message deleted"));
			});
		}
		catch (e) {
			res.status(500).json(deaddropService.createSimpleResponse("error", e.message));
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