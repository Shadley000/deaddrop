
module.exports = function(deaddropService, toolKit, messageService) {
	let operations = {
		GET,
		POST
	};

	function GET(req, res, next) {

		console.log('GET /deaddrop');
		try {
			var readKeys = req.query.read_keys.split(',');
			var writeKeys = req.query.write_keys.split(',');

			console.log('GET /deaddrop %s %s', readKeys, writeKeys);
			res.send(deaddropService.getAccessableDeadDrops(writeKeys, readKeys));
		}
		catch (e) {
			res.send(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function POST(req, res, next) {
		console.log('POST /deaddrop ');
		try {
			var deadDropId = req.body.deaddrop_id;
			var readKey = req.body.read_key;
			var writeKey = req.body.write_key;
			console.log('POST /deaddrop %s %s %s', deadDropId, writeKey, readKey);
			deaddropService.createNewDeadDrop(deadDropId, writeKey, readKey)
			res.send(toolKit.createSimpleResponse("success", "new deaddrop created"));
		}
		catch (e) {
			res.send(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get all available private messages",
		"parameters": [
			{
				"in": 'query',
				"name": 'read_keys',
				"type": 'string'
			},
			{
				"in": 'query',
				"name": 'write_keys',
				"type": 'string'
			}
		],
		"responses": {
			"200": {
				"description": "List of DeadDrop",
				"schema": {
					"$ref": "#/definitions/DeadDrop"
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


	return operations;

}
