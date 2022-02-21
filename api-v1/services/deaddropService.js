
let deadDrops = [];


const deaddropService = {

	createNewDeadDrop(deadDropId, publicKey, privateKey) {
		if (findDeadDrop(deadDropId)) throw new Error("deaddrop already exists");
		var newBox = {
			"deadDropId": deadDropId,
			"privateKey": privateKey,
			"publicKey": publicKey,
			"messages": []
		}
		deadDrops.push(newBox);
	},

	dropAMessage(deadDropId, message) {
		if (!message) throw new Error("invalid message");
		var deadDrop = findDeadDrop(deadDropId)
		if (!deadDrop) throw new Error("deaddrop does not exists");
		deadDrop.messages.push(message);
	},

	getDeadDrop(deadDropId, privateKey) {
		var deadDrop = findDeadDrop(deadDropId)
		if (!deadDrop) throw new Error("deaddrop does not exists");
		if (deadDrop.privateKey != privateKey) throw new Error("deaddrop key does not match");
		return deadDrops.messages;
	},
	
	 findDeadDrop(deadDropId) {
		return deadDrops.find(element => element.deadDropId == deadDropId);
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

module.exports = { deaddropService};