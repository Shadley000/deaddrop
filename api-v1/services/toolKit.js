

var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const toolKit = {

	validateAdminPassword(admin_password)
	{
		if(ADMIN_PASSWORD != admin_password)
			throw new Error("invalid admin_password");
	},
	validateDeadDropId(deadDropId) {
		if (!deadDropId) throw new Error("invalid deadDropId: undefined");
		if (deadDropId.length < 16) throw new Error("deadDropId must be at least 16 characters");
	},

	validateKey(key) {
		if (!key) throw new Error("invalid key: undefined");
		if (key.length < 16) throw new Error("key must be at least 16 characters");
	},

	validateUsername(username) {
		if (!username) throw new Error("invalid username: undefined");
		if (username.length < 8) throw new Error("username must be at least 8 characters");
	},

	validateMessage(message) {
		if (!message) throw new Error("invalid message: undefined");
		if (message.length < 1) throw new Error("message must not be empty");
	},

	validateMessageObj(messageObj) {
		if (!messageObj) throw new Error("invalid message: undefined");
		if (!messageObj.message) throw new Error("invalid message: undefined");
		if (messageObj.message.length < 1) throw new Error("message must not be empty");
		if (!messageObj.user) throw new Error("invalid username: undefined");
		if (messageObj.user.length < 8) throw new Error("username must be at least 8 characters");
	},

	createSimpleResponse(status, message) {
		var response = {
			"status": status,
			"message": message
		}
		console.log(response);
		return;
	}
}
module.exports = { toolKit };