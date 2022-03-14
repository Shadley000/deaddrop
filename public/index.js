
function initData() {
	return {
		articleState: "login",
		deaddrops: [],
		selectedDeadDrop: "public",
		userObj: undefined
	};
}

var data = initData();

function buildDisplay() {
	displayHeader();
	displayNav();
	displayArticle();
	displayFooter();
}

function displayHeader() {
	document.getElementById("header").innerHTML = "<h2>DeadDrop</h2>"
}

function displayFooter() {
	document.getElementById("footer").innerHTML = "<h4>DeadDrop</h4>"
}

function navigate(destination) {
	//console.log('navigate:', destination);
	data.articleState = destination;
	displayArticle();
}

function displayNav() {
	var html = '<ul>';

	if (data.userObj && data.userObj.authentication_token) {
		html += '<li><button onclick="navigate(`deaddrops`)">DeadDrops</button></li>'
		html += '<li><button onclick="navigate(`createdeaddrop`)">Create DeadDrop</button></li>'
		html += '<li><button onclick="navigate(`account`)">Account</button></li>'
		html += '<li><button onclick="navigate(`about`)">About</button></li>'
		html += '<li><button onclick="navigate(`logout`)">Logout</button></li>'
	}
	else {
		html += '<li><button onclick="navigate(`login`)">Login</button></li>'
		html += '<li><button onclick="navigate(`createaccount`)">Create Account</button></li>'
		html += '<li><button onclick="navigate(`about`)">About</button></li>'
	}
	html += '</ul>'
	document.getElementById("nav").innerHTML = html;
}

function displayArticle() {
	var html = "";

	if (data.userObj && data.userObj.authentication_token) {
		//items only availble in the logged in state

		if (data.articleState == "logout") {
			html += "<h3>logout</h3>"
			html += '<button onclick="logout()">Logout</button>'
		}
		else if (data.articleState == "deaddrops") {
			var currentDeadDropObj;
			html += "<select id='deaddrops' onchange='selectDeadDrop()'>"
			for (var i = 0; i < data.deaddrops.length; i++) {
				if (data.deaddrops[i].deaddrop_id == data.selectedDeadDrop) {
					html += "<option value='" + data.deaddrops[i].deaddrop_i + "'  selected>" + data.deaddrops[i].deaddrop_id + "</option>";
					currentDeadDropObj = data.deaddrops[i];
				} else {
					html += "<option value='" + data.deaddrops[i].deaddrop_id + "'>" + data.deaddrops[i].deaddrop_id + "</option>";
				}
			}
			html += "</select>";
			if (currentDeadDropObj) {
				html += "<ul>"
				for (var j = 0; j < currentDeadDropObj.messages.length; j++) {
					var messageObj = currentDeadDropObj.messages[j];
					html += '<li>' + messageObj.user_id + '<BR>' + messageObj.publish_date + '<BR>' + messageObj.message + '</li>';
				}
				html += "</ul>"
			}
			html += "<button onclick='loadDeadDrops()'>Refresh</button>"
			html += '<input type="text" id="message" name="message" value=""><br>'
			html += "<button onclick='addMessage()'>Send</button>"
		}
		else if (data.articleState == "createdeaddrop") {
			html += "<h3>Create New DeadDrop</h3>"
			html += "<label for='deaddrop_id'>DeadDrop:</label> "
			html += "<input	type='text' id='deaddrop_id' name='deaddrop_id'	value='16 digit minimum name'><br> "
			html += "<label for='key'>Key:</label>"
			html += "<input type='text' id='key' name='key' value='16 digit minimum key'><br>"
			html += "<button onclick='createDeadDrop()'>Create</button>"
		}
		else if (data.articleState == "account") {
			html += "<h3>account</h3>"
			html += '<label for="email">email:</label>'
			html += '<input type="text" id="email" name="email" value="Anonymous@anywhere.com"><br>'
		}
	}
	else {
		//items only availble in the logged out state
		if (data.articleState == "login") {
			html += "<h3>Login</h3>"
			html += '<label for="user_id">user:</label>'
			html += '<input type="text" id="user_id" name="user_id" value="Anonymous"><br>'
			html += '<label for="password">password:</label>'
			html += '<input type="text" id="password" name="password" value="password"><br>'
			html += '<button onclick="login()">Login</button>'
		}
		else if (data.articleState == "createaccount") {
			html += "<h3>Create New Account</h3>"
			html += '<label for="user_id">user:</label>'
			html += '<input type="text" id="user_id" name="user_id" value="Anonymous"><br>'
			html += '<label for="password">password:</label>'
			html += '<input type="text" id="password" name="password" value="password"><br>'
			html += '<label for="confirm_password">confirm password:</label>'
			html += '<input type="text" id="confirm_password" name="confirm_password" value="password"><br>'
			html += '<label for="email">email:</label>'
			html += '<input type="text" id="email" name="email" value="Anonymous@anywhere.com"><br>'
			html += '<button onclick="createAccount()">Create Account</button>'
		}
	}
	if (data.articleState == "about") {
		html += "<h3>About DeadDrop</h3>"
		html += "<p>Deaddrop is an anonymous and secure message hosting service</p>"
	}
	document.getElementById("article").innerHTML = html;
}

function selectDeadDrop() {
	data.selectedDeadDrop = document.getElementById("deaddrops").value;
	console.log("selectDeadDrop " + data.selectedDeadDrop)
	displayArticle();
}
// ************************************************************* 

function login() {
	var user_id = document.getElementById("user_id").value.trim();
	var password = document.getElementById("password").value.trim();
	//console.log('login %s', user_id);
	data = initData();

	fetch("/v1/user/" + user_id + "?password=" + password + "&t=" + Math.random())
		.then(function(response) {
			return response.json();
		})
		.then(function(userObj) {
			//console.log('login successful: %s', userObj);
			data.userObj = userObj;
			data.articleState = "deaddrops";
			displayNav();
			displayArticle();
			loadDeadDrops();
		})
		.catch(function(err) {
			console.log('error: ' + err);
			data = initData();
		});
}

function createAccount() {
	var password = document.getElementById("password").value;
	var confirm_password = document.getElementById("confirm_password").value;
	var user_id = document.getElementById("user_id").value;
	var email = document.getElementById("email").value;

	if (password != confirm_password) { alert("passwords do not match"); }
	if (password.trim().length < 8) { alert("password must be at least 8 characters"); }
	if (user_id.trim().length < 8) { alert("user_id must be at least 8 characters"); }

	var userObj = {
		"user_id": user_id.trim(),
		"password": password.trim(),
		"email": email.trim()
	};
	console.log("createDeadDrop")
	postUrl("/v1/user/" + userObj.user_id, userObj)
		.then(returnObj => {
			alert("user created successfully, please login");
			data.articleState = "login";
			displayArticle();
		});
}


function logout() {
	console.log('logout ');
	data = initData();
	displayNav();
	displayArticle();
}


function loadDeadDrops() {
	fetch("/v1/user/" + data.userObj.user_id + "/deaddrop?authentication_token=" + data.userObj.authentication_token + "&t=" + Math.random())
		.then(function(response) {
			return response.json();
		})
		.then(function(deaddrops) {
			data.deaddrops = deaddrops;
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);		
		});
}

function addMessage() {
	console.log("addMessageToDeadDrop")
	var message = {
		"user_id": data.userObj.user_id,
		"deaddropid": data.selectedDeadDrop,
		"message": document.getElementById("message").value
	};
	document.getElementById('message').value = "";

	postUrl("/v1/user/"+message.user_id+"/" + message.deaddrop_id , message)
		.then(data => {
			 loadDeadDrops()
		});
}
//******************************************************************************************************8 */

function createDeadDrop() {
	var deaddrop = {
		"deaddrop_id": document.getElementById("deaddrop_id").value,
		"key": document.getElementById("key").value
	};
	console.log("createDeadDrop")
	postUrl("/v1/deaddrop/" + deaddrop_id, deaddrop)
		.then(data => {
			 loadDeadDrops()
		});
}

function getDeadDrop() {
	console.log("getDeadDrop")
	var deaddrop_id = document.getElementById("deaddropid").value
	var key = document.getElementById("key").value

	fetch("/v1/deaddrop/" + deaddrop_id + "?key=" + key + "&t=" + Math.random())
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			console.log('appendData: ' + data);
			var mainContainer = document.getElementById("divDeadDropMessages");
			mainContainer.innerHTML = "";
			for (var i = 0; i < data.length; i++) {
				var message = data[i];
				var div = document.createElement("div");
				div.innerHTML = message.user + ': ' + message.message + '<BR>';
				mainContainer.appendChild(div);
			}
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function clearDeadDrop() {
	console.log("clearDeadDrop")
	var deaddrop_id = document.getElementById("deaddropid").value
	var key = document.getElementById("key").value
	document.getElementById("divDeadDropMessages").value = "";

	deleteUrl("/v1/deaddrop/" + deaddrop_id + "?key=" + key, message)
		.then(data => {
			getDeadDrop();
		});
}



// ************************************************************* 

async function postUrl(url, data = {}) {
	console.log("post url %s %j", url, data)
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	console.log("post url %j", response)
	return response.json(); // parses JSON response into native JavaScript objects
}


async function deletUrl(url, data = {}) {
	console.log("delete url %s", url)
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}
