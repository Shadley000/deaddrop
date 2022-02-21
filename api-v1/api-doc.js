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
				"message": {
					"description": 'The contents of the message.',
					"type": 'string'
				}
			}
		},
		"DeadDrop": {
			"type": 'object',
			"properties": {
				"deaddrop_id": {
					"description": 'The name of the deaddrop.',
					"type": 'string'
				},
				"read_key": {
					"description": 'The read key.',
					"type": 'string'
				},
				"write_key": {
					"description": 'The write key.',
					"type": 'string'
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