module.exports = function(toolKit, userService, deaddropService, keyService) {
	let operations = {
		GET,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		console.log('GET /user/{user_id}/{deaddrop_id}');
		try {
			var user_id = req.params.user_id;
			var deaddrop_id = req.params.deaddrop_id;

			if (req.session.authentication_token == req.query.authentication_token) {
				res.status(200).json({
					'deaddrop_id': 'public',
					'messages': [
						{ "user_id": "anon", "message": "a message", "publish_date": "2022-03-13" },
						{ "user_id": "anon", "message": "a public message", "publish_date": "2022-03-13" }
					]
				});					
			}
			else {
				res.status(404).json(toolKit.createSimpleResponse("error", "authorization failure"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function POST(req, res, next) {
		console.log('POST /user/{user_id}/{deaddrop_id}');
		try {
			var user_id = req.params.user_id;
			var deaddrop_id = req.params.deaddrop_id;
			var key = req.query.new_password;
			
			if (req.session.authentication_token == req.query.authentication_token) {
				res.status(200).json(toolKit.createSimpleResponse("success", "deaddrop added"));
			}
			else {
				res.status(404).json(toolKit.createSimpleResponse("error", "authorization failure"));
			}
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function DELETE(req, res, next) {
		console.log('DELETE /user/{user_id}/{deaddrop_id}');
		try {
			var user_id = req.params.user_id;
			var deaddrop_id = req.params.deaddrop_id;
			if (req.session.authentication_token == req.query.authentication_token) {
				res.status(200).json(toolKit.createSimpleResponse("success", "deaddrop removed"));
			}
			else {
				res.status(404).json(toolKit.createSimpleResponse("error", "authorization failure"));
			}
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get a user",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'path',
				"name": 'deaddrop_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'authentication_token',
				"type": 'string',
				"required": true
			}
		],
		"responses": {
			"200": {
				"description": "a user",
				"schema": {
					"$ref": "#/definitions/User"
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
		"summary": "adds a new deaddrop key",
		"consumes": ["application/json"],
		"produces": ["application/json"],
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'path',
				"name": 'deaddrop_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'authentication_token',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'deadrop_key',
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
	};

	DELETE.apiDoc = {
		"summary": "Delete a deaddrop connection",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'path',
				"name": 'deaddrop_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'query',
				"name": 'authentication_token',
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
	};
	return operations;

}