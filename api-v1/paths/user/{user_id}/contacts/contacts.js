module.exports = function(toolKit, userService, user2PermissionService, permissionService, sessionService, deaddropService, messageService, contactsService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {
		try {

			var user_id = req.params.user_id;

			if (user_id == req.session.user_id) {

				contactsService.getContacts(user_id)
					.then((contactsList) => {
						res.status(200).json(contactsList);
					})

			} else {
				res.status(403).json(toolKit.createSimpleResponse("error", "can only retrieve contacts for yourself"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get a users contacts",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			}
		],
		"responses": {
			"200": {
				"description": "a list of contacts",
				"schema": {
					"$ref": "#/definitions/Contact"
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