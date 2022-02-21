
module.exports = function(deaddropService, toolKit) {
	let operations = {
		GET,
		POST,
		DELETE
	};
	function GET(req, res, next) {

		console.log('GET v1/deaddrop/:deaddrop_id');
		try {
			var deadDropId = req.params.deaddrop_id;
			var readKey = req.query.read_key;
			var messages = deaddropService.getDeadDropMessages(deadDropId, readKey);
			console.log('GET v1/deaddrop/:deaddrop_id %j', messages);
			res.send(messages);
		}
		catch (e) {
			res.send(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function POST(req, res, next) {
		console.log('POST v1/deaddrop/:deaddrop_id');
		try {
			var deadDropId = req.params.deaddrop_id;
			var writeKey = req.query.write_key;
			var messageObj = req.body;
			console.log('POST v1/deaddrop/:deaddrop_id %s %s %j', deadDropId, writeKey, messageObj);
			deaddropService.addDeaddropMessage(deadDropId, writeKey, messageObj)
			res.send(toolKit.createSimpleResponse("success", "message added to deaddrop"));
		}
		catch (e) {
			res.send(toolKit.createSimpleResponse("error", e.message));
		}
	};

	//deletes the deaddrop if the private key matches
	function DELETE(req, res, next) {
		console.log('DELETE v1/deaddrop/:deaddrop_id ');
		try {
			var deadDropId = req.params.deaddrop_id;
			var readKey = req.query.read_key;
			deaddropService.deleteDeadDrop(deadDropId, readKey);
			res.send(toolKit.createSimpleResponse("success", "deaddrop deleted"));
		}
		catch (e) {
			res.send(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get all messages from a deaddrop",
		"parameters": [
			{
				"in": 'path',
				"name": 'deaddrop_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'read_key',
				"type": 'string',
				"required": true
			}
		],
		"responses": {
			"200": {
				"description": "List of messages",
				"schema": {
					"type": 'array',
					"items": { 
						"$ref": "#/definitions/Message" 
					}
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
				"name": 'write_key',
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
		"summary": "delete this deaddrop",
		"parameters": [
			{
				"in": 'path',
				"name": 'deaddrop_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'read_key',
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
	}

	return operations;

}
