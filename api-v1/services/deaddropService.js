var toolKit = require('./toolKit').toolKit;
let deadDrops = [];

const deaddropService = {

	createDeadDropObj(deadDropId, key) {
		return {
			"deadDropId": deadDropId,
			"key": key,
			"messages": []
		}
	},
	createNewDeadDrop(deadDropId, key) {
		var deadDrop = findDeadDrop(deadDropId);
		if (deadDrop) throw new Error("deaddrop already exists");
		toolKit.validateDeadDropId(deadDropId);
		toolKit.validateKey(key);

		deadDrop = {
			"deadDropId": deadDropId,
			"key": key,
			"messages": []
		}
		deadDrops.push(deadDrop);
	},

	addDeaddropMessage(deadDropId, key, message) {
		toolKit.validateMessageObj(message)
		toolKit.validateKey(key)
		var deadDrop = findDeadDrop(deadDropId)
		if (!deadDrop) throw new Error("deaddrop not found");
		if (key != deadDrop.key) throw new Error("deaddrop key does not match");
		deadDrop.messages.push(message);
	},

	getDeadDropMessages(deadDropId, key) {
		toolKit.validateKey(key)

		var deadDrop = findDeadDrop(deadDropId)
		if (!deadDrop) throw new Error("deaddrop not found");
		if (deadDrop.key != key) throw new Error("deaddrop key does not match");
		return deadDrop.messages;
	},

	deleteDeadDrop(deadDropId, key) {
		toolKit.validateKey(key)

		var deadDrop = findDeadDrop(deadDropId)
		if (!deadDrop) throw new Error("deaddrop not found");
		if (deadDrop.key != key) throw new Error("deaddrop key does not match");

		var newDeadDrops = [];
		deadDrops.forEach(function(adeadDrop) {
			if (deadDropId != adeadDrop.deadDropId)
				newDeadDrops.push(adeadDrop);
		});
		deadDrops = newDeadDrops;
	},

	getAccessableDeadDrops(keys) {
		var accessableDeadDrops = []
		deadDrops.forEach(function(deadDrop) {

			if (keys.indexOf(deadDrop.key) > -1) {
				accessableDeadDrops.push(deadDrop);
			}
		});
		return accessableDeadDrops
	}
};
function findDeadDrop(deadDropId) {
	return deadDrops.find(element => element.deadDropId == deadDropId);
}

module.exports = { deaddropService };