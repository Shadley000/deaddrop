
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
	createSimpleResponse(status, message) {
		var response = {
			"status": status,
			"message": message
		}
		console.log(response);
		return ;
	}
};


module.exports = { messageService };