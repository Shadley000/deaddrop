module.exports = function(toolKit, userService,user2PermissionService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {
		console.log('GET /admin');
		if (user2PermissionService.validatePermission('sys_administration', req.session.permissions)) {
			try {
				var user_id = req.session.user_id;

				if (user_id == "admin") {
					userService.getUsers((users) => {
						res.status(200).json(users)
					});
				}
			}
			catch (e) {
				res.status(500).json(toolKit.createSimpleResponse("error", e.message));
			}
		} else {
			res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
		}

	};

	GET.apiDoc = {
		"summary": "Administrator Only: Get all users",
		"parameters": [
		],
		"responses": {
			"200": {
				"description": "List of users",
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