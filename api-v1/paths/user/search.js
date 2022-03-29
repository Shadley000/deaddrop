module.exports = function(toolKit, userService, user2PermissionService, permissionService, sessionService, deaddropService, messageService, contactsService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {
		try {

			var searchString = req.query.searchstring;

			userService.search(searchString)
					.then((contactsList) => {
						res.status(200).json(contactsList);
					})

		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "search users for a matching user_id",
		"parameters": [
			{
				"in": 'query',
				"name": 'searchstring',
				"type": 'string',
				"required": true
			}
		],
		"responses": {
			"200": {
				"description": "a list of userObjs",
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
	return operations;

}