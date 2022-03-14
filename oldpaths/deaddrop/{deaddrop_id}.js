
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
			var key = req.query.key;
			var messages = deaddropService.getDeadDropMessages(deadDropId, key);
			res.status(200).json(messages);
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function POST(req, res, next) {
		console.log('POST /deaddrop ');
		try {
			var deadDropId = req.body.deaddrop_id;
			var key = req.body.key;
			deaddropService.createNewDeadDrop(deadDropId, key)
			res.status(200).json(toolKit.createSimpleResponse("success", "new deaddrop created"));
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	//deletes the deaddrop if the private key matches
	function DELETE(req, res, next) {
		console.log('DELETE v1/deaddrop/:deaddrop_id ');
		try {
			var deadDropId = req.params.deaddrop_id;
			var key = req.query.key;
			deaddropService.deleteDeadDrop(deadDropId, key);
			res.status(200).json(toolKit.createSimpleResponse("success", "deaddrop deleted"));
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
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
				"name": 'key',
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
		"summary": "adds a new deaddrop",
		"consumes": ["application/json"],
		"produces": ["application/json"],
		"parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "message object that needs to be added",
            "required": true,
            "schema": {
              "$ref": "#/definitions/DeadDrop"
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
				"name": 'key',
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
