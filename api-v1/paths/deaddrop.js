module.exports = function(toolKit, deaddropService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {
		console.log('GET /deaddrop');
		try {
			var user_id = req.session.user_id;
			deaddropService.getDeadDrops(user_id, (deaddrops) => {
				res.status(200).json(deaddrops);
			})
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get a users deaddrop list",
		"parameters": [
		],
		"responses": {
			"200": {
				"description": "a list of deaddrop_id",
				"schema": {
					"type": "array",
					"items": {
						"$ref": "#/definitions/Deaddrop"
					}
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