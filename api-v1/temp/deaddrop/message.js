module.exports = function(deaddropService) {
	let operations = {
		POST
	};
	
	//adds the message to the requested box if it exists
	function POST(req, res, next) {
		console.log('POST v1/deaddrop/:deaddropid/drop');
		var deadDropId = req.deaddropid;
		var message = req.query.message;
		var publicKey = req.query.publicKey;
		
		try {
			deaddropService.dropAMessage(deadDropId, publicKey, message);
			res.send(deaddropService.createSimpleResponse("success","not implemented"));
		}
		catch (e) {
			res.send(deaddropService.createSimpleResponse("error",e.message));
		}
	};
	
	
	
	 POST.apiDoc = {
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