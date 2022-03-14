module.exports = function(toolKit, userService, keyService) {
	let operations = {
		DELETE
	};

	function DELETE(req, res, next) {
		console.log('DELETE /user/{user_id}/logout');
		try {
			var user_id = req.params.user_id;

			req.session.destroy(function(error) {
				console.log("Session Destroyed")
			});
		}
		catch (e) {
			res.json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	DELETE.apiDoc = {
		"summary": "logout",
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