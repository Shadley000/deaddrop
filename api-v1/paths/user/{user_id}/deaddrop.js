module.exports = function(toolKit, userService, keyService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {
		console.log('GET /user/{user_id}/deaddrop');
		try {
			var user_id = req.params.user_id;
			if (req.session.authentication_token == req.query.authentication_token) {
				var deaddrops = [
					{
						'deaddrop_id': 'public',
						'messages': [
							{ "user_id": "anon", "message": "a message", "publish_date": "2022-03-13" },
							{ "user_id": "anon", "message": "a public message", "publish_date": "2022-03-13" }
						]
					},
					{
						'deaddrop_id': 'private1',
						'messages': [
							{ "user_id": "anonw", "message": "another message", "publish_date": "2022-03-13" }
						]
					}
				];
				res.status(200).json(deaddrops);
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
		"summary": "Get a users deaddrop data",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
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
				"description": "a list of deaddropObjects",
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
	return operations;

}