var userService = require('../api-v1/services/userService').userService;

var username = "chuckie3";
var password = "stabbystabby";
var email = "chuckiehorror.com";



function deleteUser(username, callback) {
	userService.deleteUser(username, () => {
		userService.deleteUserKeys(username, callback);
	});
}
function buildUser(username, password, callback) {
	userService.createUser(username, password, email, () => {
		userService.addUserKey(username, Math.random(), () => {
			userService.addUserKey(username, Math.random(), () => {
				callback(username, (userObj) => { console.log(userObj) })
			});
		});
	});
}

function retrieveUser(username, callback) {
	userService.getUser(username, (userObj) => {
		userService.getUserKeys(userObj.user, (keys) => {
			userObj.keys = keys;
			callback(userObj)
		});
	});
}


deleteUser(username, buildUser(username, password, retrieveUser));


//userService.deleteUser(username);
//userService.getUser(username, (userObj) => {console.log("getUser 004",userObj)});
