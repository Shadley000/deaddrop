
module.exports = function(deaddropService) {
	let operations = {
		GET,
		POST
	};

	function GET(req, res, next) {

		console.log('GET /deaddrop');
		var privateKey = req.query.privatekey;
		var publicKey = req.query.publickey;

		try {
			res.send(deaddropService.createSuccessMessage(""));
		}
		catch (e) {
			res.send(deadDropService.createErrorMessage(e.message));
		}
	};

	function POST(req, res, next) {
		console.log('POST /deaddrop ');
		var deadDropId = req.body.deaddroid;
		var privateKey = req.body.privatekey;
		var publicKey = req.body.publickey;
		try {
			deaddropService.createNewDeadDrop(deadDropId, publicKey, privateKey)
			res.send(deaddropService.createSuccessMessage(""));
		}
		catch (e) {
			res.send(deadDropService.createErrorMessage(e.message));
		}

	};

	GET.apiDoc = {
		"summary": "Get all available private messages",
		"parameters": [
			{
				in: 'query',
				name: 'privatekey',
				type: 'string'
			},
			{
				in: 'query',
				name: 'publickey',
				type: 'string'
			}
		],
		"responses": {
			"200": {
				"description": "List of messages",
				"schema": {
					"$ref": "#/definitions/Message"
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
		"summary": "adds a new pr message",
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
