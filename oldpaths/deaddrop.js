
module.exports = function(deaddropService, toolKit, messageService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {

		console.log('GET /deaddrop');
		try {
			var keys = req.query.keys.split(',');
			res.status(200).json(deaddropService.getAccessableDeadDrops(keys));
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	

	GET.apiDoc = {
		"summary": "Get all available private messages",
		"parameters": [
			{
				"in": 'query',
				"name": 'keys',
				"type": 'string'
			}
		],
		"responses": {
			"200": {
				"description": "List of DeadDrop",
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
