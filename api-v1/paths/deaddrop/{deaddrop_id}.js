module.exports = function(toolKit, deaddropService, messageService, permissionService) {
	let operations = {
		GET,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		console.log('GET /deaddrop/{deaddrop_id}');
		try {
			var user_id = req.session.user_id;
			var deaddrop_id = req.params.deaddrop_id;

			deaddropService.getDeadDrop(user_id, deaddrop_id, (deaddropObj) => {
				if (deaddropObj) { 
					messageService.getDeadDropMessages(user_id, deaddrop_id, (messages) => {
						deaddropObj.messages = messages;
						res.status(200).json(deaddropObj);
					});
				} else {
					res.status(404).json(toolKit.createSimpleResponse("error", "deaddrop not found:"+deaddrop_id));
				}
			});
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

GET.apiDoc = {
	"summary": "Get a deaddrops messages",
	"parameters": [
		{
			"in": 'path',
			"name": 'deaddrop_id',
			"type": 'string',
			"required": true
		}
	],
	"responses": {
		"200": {
			"description": "a deaddrop",
			"schema": {
				"$ref": "#/definitions/Deaddrop"
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
	console.log('POST /deaddrop/{deaddrop_id}');
	try {
		var user_id = req.session.user_id;
		var deaddrop_id = req.params.deaddrop_id;
		var deaddrop_key = req.query.deaddrop_key;

		deaddropService.createNewDeadDrop(deaddrop_id, deaddrop_key, () => {
			console.log('POST /deaddrop/{deaddrop_id} created');
			permissionService.addUserPermission(user_id, deaddrop_id, "", () => {
				console.log('POST /deaddrop/{deaddrop_id} link added');
				res.status(200).json(toolKit.createSimpleResponse("success", "deaddrop added"));
			})
		})
	}
	catch (e) {
		res.status(500).json(toolKit.createSimpleResponse("error", e.message));
	}
};

POST.apiDoc = {
	"summary": "creates a new deaddrop",
	"consumes": ["application/json"],
	"produces": ["application/json"],
	"parameters": [
		{
			"in": 'path',
			"name": 'deaddrop_id',
			"type": 'string',
			"required": true
		},
		{
			"in": 'query',
			"name": 'deaddrop_key',
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

function DELETE(req, res, next) {
	console.log('DELETE /deaddrop/{deaddrop_id}');
	try {
		var user_id = req.session.user_id;
		var deaddrop_id = req.params.deaddrop_id;
		deaddropService.deleteDeadDrop(user_id, deaddrop_id, () => {
			res.status(200).json(toolKit.createSimpleResponse("success", "deaddrop removed"));
		})
	}
	catch (e) {
		res.status(500).json(toolKit.createSimpleResponse("error", e.message));
	}
};

DELETE.apiDoc = {
	"summary": "Delete a deaddrop connection",
	"parameters": [
		{
			"in": 'path',
			"name": 'deaddrop_id',
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