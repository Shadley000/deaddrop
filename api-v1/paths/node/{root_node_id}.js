module.exports = function(toolKit,  nodeService, nodeParameterService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {
		try {
			var user_id = req.session.user_id;
			var root_node_id = req.path.root_node_id;
			
			nodeService.getFromRoot(root_node_id)
			.then((rootnodeObj) => {
				if (deaddropObj) {
					res.status(200).json(rootnodeObj);
				} else {
					res.status(404).json(toolKit.createSimpleResponse("error", "root not found:" + deaddrop_id));
				}
			});
			
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get a full node tree starting from the root",
		"parameters": [
		{
			"in": 'path',
			"name": 'root_node_id',
			"type": 'string',
			"required": true
		}
		],
		"responses": {
			"200": {
				"description": "a root node",
				"schema": {
					"$ref": "#/definitions/Node"
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