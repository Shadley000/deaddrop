
let messages = [];


const messageService = {

	clearAll() {
		messages = [];
	},
	addMessage(messageObj) {
		messages.push(messageObj);
		if (messages.length > 20)
			messages.shift();
	},
	getMessages() {
		return messages;
	},
	createErrorMessage(message) {
		console.log("error: " + message);
		return {
			"status": "error",
			"message": message
		};
	},
	createSuccessMessage(message) {
		console.log("success: " + message);
		return {
			"status": "success",
			"message": message
		};
	}
};


module.exports = { messageService };