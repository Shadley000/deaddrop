module.exports = function(toolKit, userService, keyService) {
	let operations = {
		DELETE
	};

	function DELETE(req, res, next) {
		console.log('DELETE /user/{user_id}/logout');
		try {
			var user_id = req.params.user_id;

			if (user_id == req.session.user_id &&
				req.session.authentication_token == req.query.authentication_token) {
				req.session.destroy(function(error) {
					console.log("Session Destroyed")
				});
			}
			else {
				res.status(403).json(toolKit.createSimpleResponse("error", "authentication_token mismatch"));
			}
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