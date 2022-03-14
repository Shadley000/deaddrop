module.exports = function(deaddropService) {
	let operations = {
		//GET,
		//PUT,
		//POST,
		//DELETE
	};

	function GET(req, res, next) {
		console.log('POST v1/deaddrop/:deaddropid/drop');
		var deadDropId = req.params.deaddrop_id;
		var messageId = req.params.message_id;
		var readKey = req.query.readKey;

		try {
			//deaddropService.dropAMessage(deadDropId, publicKey, message);
			res.status(200).json(deaddropService.createSimpleResponse("success", "not implemented"));
		}
		catch (e) {
			res.json(deaddropService.createSimpleResponse("error", e.message));
		}
	};

	function PUT(req, res, next) {
		console.log('POST v1/deaddrop/:deaddropid/drop');
		var deadDropId = req.params.deaddrop_id;
		var messageId = req.params.message_id;
		var readKey = req.query.readKey;

		try {
			//deaddropService.dropAMessage(deadDropId, publicKey, message);
			res.status(200).json(deaddropService.createSimpleResponse("success", "not implemented"));
		}
		catch (e) {
			res.json(deaddropService.createSimpleResponse("error", e.message));
		}
	};

	function POST(req, res, next) {
		console.log('POST v1/deaddrop/:deaddrop_id');
		try {
			var deadDropId = req.params.deaddrop_id;
			var key = req.query.key;
			var messageObj = req.body;
			deaddropService.addDeaddropMessage(deadDropId, key, messageObj)
			res.status(200).json(toolKit.createSimpleResponse("success", "message added to deaddrop"));
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};
	function DELETE(req, res, next) {
		console.log('POST v1/deaddrop/:deaddropid/drop');
		var deadDropId = req.params.deaddrop_id;
		var messageId = req.params.message_id;
		var readKey = req.query.readKey;

		try {
			//deaddropService.dropAMessage(deadDropId, publicKey, message);
			res.status(200).json(deaddropService.createSimpleResponse("success", "not implemented"));
		}
		catch (e) {
			res.json(deaddropService.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {}
	PUT.apiDoc = {}
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
				"in": 'query',
				"name": 'key',
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
	DELETE.apiDoc = {
		"summary": "adds a new message",
		"consumes": ["application/json"],
		"produces": ["application/json"],
		"parameters": [
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