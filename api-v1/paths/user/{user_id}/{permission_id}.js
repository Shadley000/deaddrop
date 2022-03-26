module.exports = function(toolKit, userService, user2PermissionService) {
	let operations = {
		DELETE
	};
	
	function DELETE(req, res, next) {
		try {
			var user_id = req.params.user_id;
			var permission_id = req.params.permission_id;
			console.log('DELETE /user/%s/%s', user_id,permission_id);

			if(user_id == 'admin'){
				res.status(401).json(toolKit.createSimpleResponse("error", "administrator is blocked from deleting its own permissions"));
			}
			else if (user_id == req.session.user_id) {
				user2PermissionService.deleteUserPermission(user_id, permission_id,() => {
					res.status(200).json(toolKit.createSimpleResponse("success", "permission deleted"))
				});
			}
			else {
				res.status(401).json(toolKit.createSimpleResponse("error", "cannot delete other user"));
			}
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	DELETE.apiDoc = {
		"summary": "Delete a users permission",
		"parameters": [
			{
				"in": 'path',
				"name": 'user_id',
				"type": 'string',
				"required": true
			},
			{
				"in": 'path',
				"name": 'permission_id',
				"type": 'string',
				"required": true
			},
		],
		"responses": {
			"200": {
				"description": "success or error",
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