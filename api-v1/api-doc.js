const apiDoc = {
	"swagger": "2.0",
	"basePath": '/v1/',
	"info": {
		"title": 'DeadDrop API',
		"description": "This is a deaddrop message server.",
		"version": '1.0.0'
	},
	"consumes": ["application/json"],
	"produces": ["application/json"],
	"definitions": {
		"Message": {
			"type": 'object',
			"properties": {
				"user": {
					"description": 'The name of the sender.',
					"type": 'string'
				},
				"title": {
					"description": 'The message title.',
					"type": 'string'
				},
				"message": {
					"description": 'The contents of the message.',
					"type": 'string'
				},
				"publish_date": {
					"description": 'The date message was created.',
					"type": 'string'
				},
				"id": {
					"description": 'unique message id.',
					"type": 'string'
				}
			}
		},
		"Messages": {
			"type": "array",
			"items": {
				"$ref": "#/definitions/Message"
			}
		},
		"Deaddrop": {
			"type": 'object',
			"properties": {
				"deaddrop_id": {
					"description": 'The name of the deaddrop.',
					"type": 'string'
				},
				"messages": {
					"description": "array of messages",
					"type": "array",
					"items": {
						"$ref": "#/definitions/Message"
					}
				}
			}
		},
		"SimpleResponse": {
			"type": 'object',
			"properties": {
				"status": {
					"description": 'The status.',
					"type": 'string'
				},
				"message": {
					"description": 'The message.',
					"type": 'string'
				}
			}
		},
		"User": {
			"type": 'object',
			"properties": {
				"user_id": {
					"description": 'The name of the user.',
					"type": 'string'
				},
				"password": {
					"description": 'Password',
					"type": 'string'
				},
				"email": {
					"description": 'email',
					"type": 'string'
				},
				"authentication_token": {
					"description": 'authentication_token',
					"type": 'string'
				}
			}
		},
		"Error": {
			"type": 'object',
			"properties": {
				"status": {
					"description": 'The status.',
					"type": 'string'
				},
				"message": {
					"description": 'The message.',
					"type": 'string'
				}
			}
		}
	},
	"paths": {}
};

module.exports = { apiDoc };