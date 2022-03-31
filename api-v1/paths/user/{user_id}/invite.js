module.exports = function(toolKit, inviteService, user2PermissionService) {
	let operations = {
		GET,
		PUT,
		POST,
		DELETE
	};

	function GET(req, res, next) {
		try {

			var invitee_user_id = req.params.user_id;

			if (invitee_user_id != req.session.user_id) {
				res.status(403).json(toolKit.createSimpleResponse("error", "can only retrieve invites for yourself"));
				return
			}
			inviteService.getInvites(invitee_user_id)
			.then((invites) => {
				res.status(200).json(invites);
			})
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	GET.apiDoc = {
		"summary": "Get my invites ",
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
				"description": "a list of a users invites",
				"schema": {
					"$ref": "#/definitions/Invite"
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
	
	function PUT(req, res, next) {
		try {
			var invitee_user_id = req.params.user_id;
			var inviteObj = req.body;
			
			if (invitee_user_id != req.session.user_id) {
				res.status(403).json(toolKit.createSimpleResponse("error", "can only accept invites for yourself"));
				return
			}
			inviteService.getInvite(inviteObj.inviter_user_id, invitee_user_id, inviteObj.deaddrop_id)
			.then((aInviteObj) => {
				if(aInviteObj){
					console.log(aInviteObj)
					user2PermissionService.addUserPermission(aInviteObj.invitee_user_id, aInviteObj.deaddrop_id, aInviteObj.details)
					.then(()=>{
						inviteService.deleteInvite(aInviteObj.inviter_user_id, aInviteObj.invitee_user_id, aInviteObj.deaddrop_id)
						res.status(200).json(toolKit.createSimpleResponse("success", "Invite accepted"));
					})
				} else {
					console.log("unable to locate this invite ",inviteObj)
					res.status(404).json(toolKit.createSimpleResponse("error", "Unable to locate this invite"));
				}
			})
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	PUT.apiDoc = {
		"summary": "Accept an invite, if successful the invite will be deleted",
		"parameters": [
		{
			"in": 'path',
			"name": 'user_id',
			"type": 'string',
			"required": true
		},
		{
			"in": "body",
			"name": "body",
			"description": "invite object that needs to be accepted",
			"required": true,
			"schema": {
				"$ref": "#/definitions/Invite"
			}
		}
		],
		"responses": {
			"200": {
				"description": "success/error",
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
	

	function POST(req, res, next) {
		try {
			var invitee_user_id = req.params.user_id;
			var inviteObj = req.body;
			//console.log(req.session.user_id);
			//console.log(inviteObj);

			if (!user2PermissionService.isCacheUserPermission(req, inviteObj.deaddrop_id, toolKit.getConstants().SYS_DETAILS_ADMIN)) {
				res.status(403).json(toolKit.createSimpleResponse("error", "user must have admin privleges for this deaddrop to invite other users"));
				return;
			}
			if (invitee_user_id == req.session.user_id) {
				res.status(403).json(toolKit.createSimpleResponse("error", "can only post invites for other users"));
				return;
			}
			if (inviteObj.inviter_user_id != req.session.user_id) {
				res.status(403).json(toolKit.createSimpleResponse("error", "must only post invites from yourself"));
				return;
			}
			inviteService.getInvite(inviteObj.inviter_user_id, invitee_user_id, inviteObj.deaddrop_id)
			.then((existingInviteObj) => {
				if (!existingInviteObj) {
					inviteService.addInvite(inviteObj.inviter_user_id, inviteObj.invitee_user_id, inviteObj.deaddrop_id, inviteObj.details)
					.then((contactsList) => {
						res.status(200).json(contactsList);
					})
				} else {
					res.status(401).json(toolKit.createSimpleResponse("error", "duplicate invitation exists"));
				}
			})
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	POST.apiDoc = {
		"summary": "Send this user an invite ",
		"parameters": [
		{
			"in": 'path',
			"name": 'user_id',
			"type": 'string',
			"required": true
		},
		{
			"in": "body",
			"name": "body",
			"description": "invite object that needs to be added",
			"required": true,
			"schema": {
				"$ref": "#/definitions/Invite"
			}
		}
		],
		"responses": {
			"200": {
				"description": "success/error",
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
		try {
			var invitee_user_id = req.params.user_id;
			var inviteObj = req.body;

			if (invitee_user_id != req.session.user_id) {
				res.status(403).json(toolKit.createSimpleResponse("error", "can only delete invites for yourself"));
				return;
			}
			inviteService.deleteInvite(inviteObj.inviter_user_id, invitee_user_id, inviteObj.deaddrop_id)
			.then((contactsList) => {
				res.status(200).json(contactsList);
			})
		}
		catch (e) {
			res.status(500).json(toolKit.createSimpleResponse("error", e.message));
		}
	};

	DELETE.apiDoc = {
		"summary": "delete an invite ",
		"parameters": [
		{
			"in": 'path',
			"name": 'user_id',
			"type": 'string',
			"required": true
		},
		{
			"in": "body",
			"name": "body",
			"description": "invite object that needs to be delete",
			"required": true,
			"schema": {
				"$ref": "#/definitions/Invite"
			}
		}
		],
		"responses": {
			"200": {
				"description": "success/error",
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