module.exports = function(toolKit, userService, keyService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {
		console.log('GET /deaddrop');
		try {
			var user_id = req.session.user_id;
			if (req.session.authentication_token == req.query.authentication_token) {
				getDeadDrops(user_id, (deaddrops) =>{
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

	GET.apiDoc = {
		"summary": "Get a users deaddrop data",
		"parameters": [
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