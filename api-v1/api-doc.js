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
		"Contact": {
			"type": 'object',
			"properties": {
				"contact_user_id": {
					"description": 'The user_id for the contact',
					"type": 'string'
				},
				"user_id": {
					"description": 'The user_id.',
					"type": 'string'
				}
			}
		},
		"Deaddrop": {
			"type": 'object',
			"properties": {
				"deaddrop_id": {
					"description": 'The name of the deaddrop.',
					"type": 'string'
				},
				"title": {
					"description": 'The display name of the deaddrop.',
					"type": 'string'
				},"messages": {
					"description": "array of messages",
					"type": "array",
					"items": {
						"$ref": "#/definitions/Message"
					}
				}
			}
		},
		"Invite": {
			"type": 'object',
			"properties": {
				"inviter_user_id": {
					"description": 'The user_id making the invitation',
					"type": 'string'
				},
				"invitee_user_id": {
					"description": 'The user_id of the user being invited.',
					"type": 'string'
				},
				"deaddrop_id": {
					"description": 'The name of the deaddrop.',
					"type": 'string'
				},
				"detail": {
					"description": 'permission details.',
					"type": 'string'
				},
				
			}
		},
		"Message": {
			"type": 'object',
			"properties": {
				"user_id": {
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
		"Node": {
			"type": "object",
			"properties": {
				"node_id": {
					"description": 'The permission id.',
					"type": 'string'
				},
				"parent_node_id": {
					"description": 'The permission name.',
					"type": 'string'
				},
				"root_node_id": {
					"description": 'The permission key.',
					"type": 'string'
				},
				"node_name": {
					"description": 'tags',
					"type": 'string'
				},
				"node_type": {
					"description": 'tags',
					"type": 'string'
				},
				"creater_user_id": {
					"description": 'tags',
					"type": 'string'
				},
				"publish_date": {
					"description": 'tags',
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
		"Permission": {
			"type": "object",
			"properties": {
				"permission_id": {
					"description": 'The permission id.',
					"type": 'string'
				},
				"permission_name": {
					"description": 'The permission name.',
					"type": 'string'
				},
				"permission_key": {
					"description": 'The permission key.',
					"type": 'string'
				},
				"tags": {
					"description": 'tags',
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
				"display_name": {
					"description": 'display_name',
					"type": 'string'
				},
				"authentication_token": {
					"description": 'authentication_token',
					"type": 'string'
				},
				"permissions":{
					"description": 'list of permission objects',
					"type": "array",
					"items": {
						"$ref": "#/definitions/Permission"
					}
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