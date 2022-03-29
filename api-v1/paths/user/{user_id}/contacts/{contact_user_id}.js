module.exports = function(toolKit, userService, user2PermissionService, permissionService, sessionService, deaddropService, messageService, contactsService) {
	let operations = {
		GET,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		try {

			var user_id = req.params.user_id;
			var contact_user_id = req.params.contact_user_id;


			if (user_id == req.session.user_id) {

				contactsService.getContact(user_id, contact_user_id)
					.then((contactObj) => {
						res.status(200).json(contactObj);
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
		"summary": "Get a users contact",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'path',
				"name": 'contact_user_id',
				"type": 'string',
				"required": true
			}
		],
		"responses": {
			"200": {
				"description": "a users contact",
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

	function POST(req, res, next) {
		try {
			var user_id = req.params.user_id;
			var contact_user_id = req.params.contact_user_id;

			if (user_id == req.session.user_id) {
				contactsService.getContact(user_id, contact_user_id)
					.then((userObj) =>  {
						if (!userObj) {
							contactsService.addContact(user_id, contact_user_id)
								.then((contactObj) => {
									res.status(200).json(contactObj);
								})
						} else {
							res.status(401).json(toolKit.createSimpleResponse("error", "duplicate contact"));
						}

					})

			} else {
				res.status(403).json(toolKit.createSimpleResponse("error", "can only add contacts for yourself"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	POST.apiDoc = {
		"summary": "add a users contact",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'path',
				"name": 'contact_user_id',
				"type": 'string',
				"required": true
			}
		],
		"responses": {
			"200": {
				"description": "success",
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
	function DELETE(req, res, next) {
		try {

			var user_id = req.params.user_id;
			var contact_user_id = req.params.contact_user_id;


			if (user_id == req.session.user_id) {

				contactsService.deleteContact(user_id, contact_user_id)
					.then(() => {
						res.status(200).json(toolKit.createSimpleResponse("success", "contact deleted"));
					})

			} else {
				res.status(403).json(toolKit.createSimpleResponse("error", "can only delete your own contacts"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	DELETE.apiDoc = {
		"summary": "delete a contact",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'path',
				"name": 'contact_user_id',
				"type": 'string',
				"required": true
			}
		],
		"responses": {
			"200": {
				"description": "success",
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