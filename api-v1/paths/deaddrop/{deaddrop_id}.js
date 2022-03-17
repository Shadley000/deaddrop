module.exports = function(toolKit, userService, deaddropService, keyService) {
	let operations = {
		GET,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		console.log('GET /deaddrop/{deaddrop_id}');
		try {
			var user_id =  req.session.user_id;
			var deaddrop_id = req.params.deaddrop_id;

			if (req.session.authentication_token == req.query.authentication_token) {
				deaddropService.getDeadDrop(user_id,deaddrop_id, (deaddrops) =>{
					res.status(200).json(deaddrops);
				})
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
		console.log('POST /deaddrop/{deaddrop_id}');
		try {
			var user_id =  req.session.user_id;
			var deaddrop_id = req.params.deaddrop_id;
			var deaddrop_key = req.query.deaddrop_key;
			
			if (req.session.authentication_token == req.query.authentication_token) {
				deaddropService.createNewDeadDrop(deaddrop_id, deaddrop_key, () =>{
					
					keyService.add(user_id,deaddrop_id,deaddrop_key)
					
					res.status(200).json(toolKit.createSimpleResponse("success", "deaddrop added"));
				})	
				
			}
			else {
				res.status(404).json(toolKit.createSimpleResponse("error", "authorization failure"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	function DELETE(req, res, next) {
		console.log('DELETE /deaddrop/{deaddrop_id}');
		try {
			var user_id =  req.session.user_id;
			var deaddrop_id = req.params.deaddrop_id;
			if (req.session.authentication_token == req.query.authentication_token) {
				deaddropService.deleteDeadDrop(user_id,deaddrop_id, () =>{
					res.status(200).json(toolKit.createSimpleResponse("success", "deaddrop removed"));
				})	
			}
			else {
				res.status(404).json(toolKit.createSimpleResponse("error", "authorization failure"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get a deaddrops messages",
		"parameters": [
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
		"summary": "creates a new deaddrop",
		"consumes": ["application/json"],
		"produces": ["application/json"],
		"parameters": [
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