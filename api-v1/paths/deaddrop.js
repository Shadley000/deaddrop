
module.exports = function(deaddropService, toolKit, messageService) {
	let operations = {
		GET,
		POST
	};

	function GET(req, res, next) {

		console.log('GET /deaddrop');
		try {
			var keys = req.query.keys.split(',');
			
			console.log('GET /deaddrop %s ', keys);
			res.send(deaddropService.getAccessableDeadDrops(keys));
		}
		catch (e) {
			res.send(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function POST(req, res, next) {
		console.log('POST /deaddrop ');
		try {
			var deadDropId = req.body.deaddrop_id;
			var key = req.body.key;
			console.log('POST /deaddrop %s %s', deadDropId, key);
			deaddropService.createNewDeadDrop(deadDropId, key)
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
				"name": 'keys',
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
