module.exports = function(toolKit,  nodeService, nodeParameterService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {
		try {
			var user_id = req.session.user_id;
			var root_node_name = req.params.root_node_name;
			
			nodeService.getFromRoot(root_node_name)
			.then((nodeData) => {
				if (nodeData) {
					res.status(200).json(nodeData);
				} else {
					res.status(404).json(toolKit.createSimpleResponse("error", "root not found:" + root_node_name));
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
			"name": 'root_node_name',
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