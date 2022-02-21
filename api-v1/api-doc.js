
const apiDoc = {
	"swagger": '2.0',
	"basePath": '/v1/',
	"info": {
		"title": 'DeadDrop API.',
		"version": '1.0.0'
	},
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