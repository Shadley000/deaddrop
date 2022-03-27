module.exports = function(toolKit, user2PermissionService, permissionService) {
	let operations = {
		GET
	};

	function GET(req, res, next) {
		if (user2PermissionService.validatePermission(toolKit.getConstants().SYS_ADMINISTRATOR, req.session.permissions)) {
			try {
				permissionService.getPermissions()
					.then(function(permissions) {
						res.status(200).json(permissions);
					});
			}
			catch (e) {
				res.status(401).json(toolKit.createSimpleResponse("error", e.message));
			}
		} else {
			res.status(401).json(toolKit.createSimpleResponse("error", 'user does not have administrative privileges'));
		}
	};

	GET.apiDoc = {
		"summary": "Administrator Only: Get a list of permissions",
		"parameters": [
		],
		"responses": {
			"200": {
				"description": "a user",
				"schema": {
					"$ref": "#/definitions/Permission"
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