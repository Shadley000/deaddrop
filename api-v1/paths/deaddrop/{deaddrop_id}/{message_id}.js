module.exports = function(deaddropService) {
	let operations = {
		//GET,
		//PUT,
		//DELETE
	};
	
	function GET(req, res, next) {
		console.log('POST v1/deaddrop/:deaddropid/drop');
		var deadDropId = req.params.deaddrop_id;
		var messageId = req.params.message_id;
		var readKey = req.query.readKey;
		
		try {
			//deaddropService.dropAMessage(deadDropId, publicKey, message);
			res.send(deaddropService.createSimpleResponse("success","not implemented"));
		}
		catch (e) {
			res.send(deaddropService.createSimpleResponse("error",e.message));
		}
	};
	
	function PUT(req, res, next) {
		console.log('POST v1/deaddrop/:deaddropid/drop');
		var deadDropId = req.params.deaddrop_id;
		var messageId = req.params.message_id;
		var readKey = req.query.readKey;
		
		try {
			//deaddropService.dropAMessage(deadDropId, publicKey, message);
			res.send(deaddropService.createSimpleResponse("success","not implemented"));
		}
		catch (e) {
			res.send(deaddropService.createSimpleResponse("error",e.message));
		}
	};
	function DELETE(req, res, next) {
		console.log('POST v1/deaddrop/:deaddropid/drop');
		var deadDropId = req.params.deaddrop_id;
		var messageId = req.params.message_id;
		var readKey = req.query.readKey;
		
		try {
			//deaddropService.dropAMessage(deadDropId, publicKey, message);
			res.send(deaddropService.createSimpleResponse("success","not implemented"));
		}
		catch (e) {
			res.send(deaddropService.createSimpleResponse("error",e.message));
		}
	};
	
	 GET.apiDoc = {}
	 PUT.apiDoc = {}
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