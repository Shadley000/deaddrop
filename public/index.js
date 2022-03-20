
function initData() {
	return {
		articleState: "login",
		deaddrops: [],
		selectedDeaddropObj: "public",
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
	console.log("displayNav ");
	if (data && data.userObj && data.userObj.authentication_token) {
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
	console.log("displayArticle ");
	if (data) {
		if (data.userObj && data.userObj.authentication_token) {
			if (data.articleState == "logout") {
				html += "<h3>logout</h3>"
				html += '<button onclick="logout()">Logout</button>'
			}
			else if (data.articleState == "deaddrops") {
				if (data.deaddrops) {
					html += "<select id='deaddrops' onchange='selectDeadDrop()'>"
					for (var i = 0; i < data.deaddrops.length; i++) {
						if (data.selectedDeaddropObj && data.deaddrops[i] == data.selectedDeaddropObj.deaddrop_id) {
							html += "<option value='" + data.deaddrops[i] + "'  selected>" + data.deaddrops[i] + "</option>";
						} else {
							html += "<option value='" + data.deaddrops[i] + "'>" + data.deaddrops[i] + "</option>";
						}
					}
					html += "</select>";
					html += "<button onclick='loadDeadDrops()'>Refresh</button><br>"

					if (data.selectedDeaddropObj) {
						var deaddropObj = data.selectedDeaddropObj;
						if (deaddropObj.messages) {
							html += "<ul>"
							if (deaddropObj.messages.length > 0) {
								for (var j = 0; j < deaddropObj.messages.length; j++) {
									var messageObj = deaddropObj.messages[j];
									html += '<li>' + messageObj.user_id + '<BR>'
										+ messageObj.publish_date + '<BR>'
										+ messageObj.title + '<BR>'
									messageObj.message + '</li>';
								}
							} else {
								html += '<li>no messages</li>';
							}
							html += "</ul>"
						}
						html += '<label for="title">Title:</label>'
						html += '<input type="text" id="title" name="title" value=""><br>'
						html += '<label for="message">Message:</label>'
						html += '<input type="text" id="message" name="message" value=""><br>'
						html += "<button onclick='addMessage()'>Send</button>"
					} else {
						html += "<h3>select a deaddrop</h3>"
					}
				} else {
					html += "<h3>you have no permissions to any deaddrops</h3>"
				}
			}
			else if (data.articleState == "createdeaddrop") {
				html += "<h3>Create New DeadDrop</h3>"
				html += "<label for='deaddrop_id'>DeadDrop:</label> "
				html += "<input	type='text' id='deaddrop_id' name='deaddrop_id'	value='16 digit minimum name'><br> "
				html += "<label for='deaddrop_key'>Key:</label>"
				html += "<input type='text' id='deaddrop_key' name='deaddrop_key' value='16 digit minimum key'><br>"
				html += "<button onclick='createDeadDrop()'>Create</button>"
			}
			else if (data.articleState == "account") {
				html += "<h3>account</h3>"
				html += '<label for="email">email:</label>'
				html += '<input type="text" id="email" name="email" value="Anonymous@anywhere.com"><br>'
				html += '<label for="password">password:</label>'
				html += '<input type="text" id="password" name="password" value="password"><br>'
				html += "<button onclick='deleteAccount()'>Delete this account</button>"
			}
		}
		else {
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
	}
	else {
		html += "<h3>Something has gone wrong</h3>"
	}
	document.getElementById("article").innerHTML = html;
}



// ************************************************************* 

function login() {
	var user_id = document.getElementById("user_id").value.trim();
	var password = document.getElementById("password").value.trim();
	//console.log('login %s', user_id);
	data = initData();

	getUrl("/v1/login?user_id=" + user_id + "&password=" + password + "&t=" + Math.random())
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
			displayNav();
			displayArticle();
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
		"email": email.trim(),
		"authentication_token": ""
	};
	console.log("createAccount")
	postUrl("/v1/login", userObj)
		.then(returnObj => {
			alert("user created successfully, please login");
			data.articleState = "login";
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}


function logout() {
	console.log('logout ');
	data = initData();
	displayNav();
	displayArticle();

	deleteUrl("/v1/logout?t=" + Math.random())
		.then(data => {
			data = initData();
			displayNav();
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function deleteAccount(){
	var user_id = data.userObj.user_id;
	var password = document.getElementById("password").value;
	
	deleteUrl("/v1/user/"+user_id+"?password=" + password + "&t=" + Math.random())
		.then(data => {
			data = initData();
			displayNav();
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

//******************************************************************************************************8 */
function loadDeadDrops() {
	getUrl("/v1/deaddrop?" + "&t=" + Math.random())
		.then(function(deaddrops) {
			data.deaddrops = deaddrops;
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function loadMessages() {
	getUrl("/v1/deaddrop/" + data.selectedDeaddropObj.deaddrop_id  + "?" + "&t=" + Math.random())
		.then(function(deaddropObj) {
			data.selectedDeaddropObj = deaddropObj;
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function selectDeadDrop() {
	var deaddrop_id = document.getElementById("deaddrops").value;
	console.log("selectDeadDrop " + deaddrop_id)

	getUrl("/v1/deaddrop/" + deaddrop_id + "?t=" + Math.random())
		.then(function(deaddropObj) {
			data.selectedDeaddropObj = deaddropObj;
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function addMessage() {
	console.log("addMessageToDeadDrop")
	var messageObj = {
		"message_id": "newmesssage",
		"user_id": data.userObj.user_id,
		"deaddrop_id": data.selectedDeaddropObj.deaddrop_id,
		"title": document.getElementById("title").value,
		"message": document.getElementById("message").value
	};
	document.getElementById('title').value = "";
	document.getElementById('message').value = "";
	console.log(messageObj)
	postUrl("/v1/deaddrop/" + messageObj.deaddrop_id + "/" + messageObj.message_id, messageObj)
		.then(data => {
			loadMessages()
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function createDeadDrop() {
	var deaddrop = {
		"deaddrop_id": document.getElementById("deaddrop_id").value,
		"deaddrop_key": document.getElementById("deaddrop_key").value
	};
	console.log("createDeadDrop")
	postUrl("/v1/deaddrop/" + deaddrop.deaddrop_id + "?deaddrop_key=" + deaddrop.deaddrop_key, deaddrop)
		.then(data => {
			loadDeadDrops()
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function getDeadDrop() {
	console.log("getDeadDrop")
	var deaddrop_id = document.getElementById("deaddropid").value

	getUrl("/v1/deaddrop/" + deaddrop_id + "&t=" + Math.random())
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
	document.getElementById("divDeadDropMessages").value = "";

	deleteUrl("/v1/deaddrop/" + deaddrop_id, message)
		.then(data => {
			getDeadDrop();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

// ************************************************************* 

function getFetchOptions(method, postData) {
	var authentication_token = "";
	var user_id = "";
	if (data && data.userObj) {
		authentication_token = data.userObj.authentication_token;
		user_id = data.userObj.user_id;
	}

	var options = {
		method: method, // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json',
			'authentication_token': authentication_token,
			'user_id': user_id
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	}
	console.log(options)
	if (postData)
		options.body = JSON.stringify(postData) // body data type must match "Content-Type" header
	return options;
}

async function getUrl(url) {
	console.log("GET url %s %j", url)
	const response = await fetch(url, getFetchOptions('GET', undefined));
	
	const string = await response.text();
      const json = string === "" ? {} : JSON.parse(string);
      return json;
	//return response.json(); // parses JSON response into native JavaScript objects
}

async function postUrl(url, postData = {}) {
	console.log("POST url %s %j", url, postData)
	const response = await fetch(url, getFetchOptions('POST', postData));
	const string = await response.text();
      const json = string === "" ? {} : JSON.parse(string);
      return json;
	//return response.json(); // parses JSON response into native JavaScript objects
}

async function putUrl(url, postData = {}) {
	console.log("PUT url %s %j", url, postData)
	const response = await fetch(url, getFetchOptions('PUT', postData));
	const string = await response.text();
      const json = string === "" ? {} : JSON.parse(string);
      return json;
	//return response.json(); // parses JSON response into native JavaScript objects
}

async function deleteUrl(url, postData = {}) {
	console.log("DELETE url %s", url)
	const response = await fetch(url, getFetchOptions('DELETE', postData));
	const string = await response.text();
      const json = string === "" ? {} : JSON.parse(string);
      return json;
	//return response.json(); // parses JSON response into native JavaScript objects
}

