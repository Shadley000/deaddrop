
module.exports = function(deaddropService) {
	let operations = {
		GET,
		POST,
		DELETE
	};
	function GET(req, res, next) {

		console.log('GET v1/deaddrop/:deadDropId');
		var deadDropId = req.deaddropid;
		var privateKey = req.query.privatekey;
		try {
			var messages = deadDropService.getDeadDrops(deadDropId, privateKey)
			res.send({
				"status": "success",
				"messages": messages
			});
		}
		catch (e) {
			res.send(createErrorMessage(e.message));
		}
	};

	//creates a new deaddrop with the requested box and key
	function POST(req, res, next) {
		console.log('POST v1/deaddrop/:deaddropid');
		var deadDropId = req.deaddropid;
		var privateKey = req.query.privateKey;
		var publicKey = req.query.publicKey;
		try {
			deadDropService.createNewDeadDrop(deadDropId, publicKey, privateKey);
			res.send({ "status": "success" });
		}
		catch (e) {
			res.send(createErrorMessage(e.message));
		}
	};

	//deletes the deaddrop if the private key matches
	function DELETE(req, res, next) {
		console.log('DELETE v1/deaddrop/:deadDropId ');
		var deadDropId = req.deadDropId;
		var privateKey = req.query.privateKey;
		try {
			deadDropService.deleteADeadDrop(deadDropId, privateKey);
			res.send({ "status": "success" });
		}
		catch (e) {
			res.send(createErrorMessage(e.message));
		}
	};

	function createErrorMessage(message) {
		console.log("error: " + message);
		return {
			"status": "error",
			"message": message
		};
	}

	GET.apiDoc = {
		"summary": "Get all available private messages",
		"parameters": [
			{
				in: 'query',
				name: 'privatekey',
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
	DELETE.apiDoc = {
		"summary": "Get all available private messages",
		"parameters": [
			{
				in: 'query',
				name: 'privatekey',
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
	}

	return operations;

}
