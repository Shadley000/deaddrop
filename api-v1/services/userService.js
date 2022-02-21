
var users = [];

const userService = {

	createUserObj(username, password) {
		return {
			"user": username,
			"password": password,
			"keys": []
		};
	},

	createUser(userObj) {
		var userObj = findUser(updateUserObj.user);
		if (userObj) throw new Error("user already exists");

		users.push(userObj)
	},

	updateUser(updateUserObj) {
		var userObj = findUser(updateUserObj.user);
		if (!userObj) throw new Error("user not found");
		if( updateUserObj.password)
			userObj.password = updateUserObj.password;
		if( updateUserObj.keys)
			userObj.keys = updateUserObj.keys;
	},

	deleteUser(username) {
		var newUsers = [];
		users.forEach(function(aUser) {
			if(username != aUser.username)
				newUsers.push(aUser);
		});
		users = newUsers; 
	},

	getUser(username) {
		var userObj = findUser(username);
		if (!userObj) throw new Error("user not found");
		return userObj
	},

	addUserKey(username, key) {
		var userObj = findUser(username);
		if (!userObj) throw new Error("user not found");
		if(userObj.keys.indexof(key)>-1) throw new Error("user already has this key");
		
		userObj.keys.push(key);
	},

};

function findUser(username) {
	return users.find(element => element.username == username);
}


module.exports = { userService };