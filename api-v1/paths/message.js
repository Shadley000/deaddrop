
module.exports = function(toolKit, messageService) {
	let operations = {
		GET,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		console.log('GET /message');
		try {
			var messages = messageService.getMessages();
			res.send(messages)

		}
		catch (e) {
			res.send(toolKit.createSimpleResponse("error",e.message));
		}
	};

	function POST(req, res, next) {
		console.log('POST /message ', req.body);
		try {
			var messageObj = req.body;
			messageService.addMessage(messageObj)
			res.send(toolKit.createSimpleResponse("success","added"));
		}
		catch (e) {
			res.send(toolKit.createSimpleResponse("error",e.message));
		}
	};

	function DELETE(req, res, next) {
		console.log('DELETE /message ');
		try {
			messageService.clearAll();
			res.send(toolKit.createSimpleResponse("success","Deleted"));
		}
		catch (e) {
			res.send(toolKit.createSimpleResponse("error",e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get all available public messages",
		"parameters": [

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
		"summary": "adds a new public message",
		"consumes": ["application/json"],
		"produces": ["application/json"],
		"parameters": [
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
		"summary": "deletes all the public messages",
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
	}

	return operations;

}
