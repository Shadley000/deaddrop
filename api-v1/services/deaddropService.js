var toolKit = require('./toolKit').toolKit;
let deadDrops = [];

const deaddropService = {

	createNewDeadDrop(deadDropId, writeKey, readKey) {
		var deadDrop = findDeadDrop(deadDropId);
		if (deadDrop) throw new Error("deaddrop already exists");
		toolKit.validateDeadDropId(deadDropId);
		toolKit.validateKey(writeKey);
		toolKit.validateKey(readKey);

		deadDrop = {
			"deadDropId": deadDropId,
			"readKey": readKey,
			"writeKey": writeKey,
			"messages": []
		}
		deadDrops.push(deadDrop);
	},

	addDeaddropMessage(deadDropId, writeKey, message) {
		toolKit.validateMessageObj(message)
		toolKit.validateKey(writeKey)
		var deadDrop = findDeadDrop(deadDropId)
		if (!deadDrop) throw new Error("deaddrop not found");
		if (writeKey != deadDrop.writeKey) throw new Error("deaddrop writeKey does not match");
		deadDrop.messages.push(message);
	},

	getDeadDropMessages(deadDropId, readKey) {
		toolKit.validateKey(readKey)

		var deadDrop = findDeadDrop(deadDropId)
		if (!deadDrop) throw new Error("deaddrop not found");
		if (deadDrop.readKey != readKey) throw new Error("deaddrop readKey does not match");
		return deadDrop.messages;
	},
	
	deleteDeadDrop(deadDropId, readKey) {
		toolKit.validateKey(readKey)

		var deadDrop = findDeadDrop(deadDropId)
		if (!deadDrop) throw new Error("deaddrop not found");
		if (deadDrop.readKey != readKey) throw new Error("deaddrop readKey does not match");
		
		var newDeadDrops = [];
		deadDrops.forEach(function(adeadDrop) {
			if(deadDropId != adeadDrop.deadDropId)
			newDeadDrops.push(adeadDrop);
		});
		deadDrops = newDeadDrops; 
	},

	getAccessableDeadDrops(writeKeys, readKeys) {
		var accessableDeadDrops = []
		deadDrops.forEach(function(deadDrop) {

			if (readKeys.indexOf(deadDrop.readKey) > -1) {
				if (writeKeys.indexOf(deadDrop.writeKey) > -1) {
					//has both read and write keys
					accessableDeadDrops.push(deadDrop);
				}
				else {	//has only read access
					var deadDropCopy = {
						"deadDropId": deadDrop.deadDropId,
						"readKey": deadDrop.readKey,
						"writeKey": "",
						"messages": deadDrop.messages
					}
					accessableDeadDrops.push(deadDropCopy);
				}
			}
			else if (writeKeys.indexOf(deadDrop.writeKey) > -1) {
				//has only write access
				var deadDropCopy = {
					"deadDropId": deadDrop.deadDropId,
					"readKey": "",
					"writeKey": deadDrop.writeKey,
					"messages": deadDrop.messages
				}
				accessableDeadDrops.push(deadDropCopy);
			}
		});
		return accessableDeadDrops
	}
};
function findDeadDrop(deadDropId) {
	return deadDrops.find(element => element.deadDropId == deadDropId);
}

module.exports = { deaddropService };