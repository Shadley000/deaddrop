
function initData() {
	return {
		articleState: "login",
		deaddrops: [],
		//selectedDeaddrop: "public",
		selectedDeaddropObj: undefined,
		userObj: undefined
	};
}

var data = initData();
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
			loadDeadDrops(displayArticle);
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

function deleteAccount() {
	var user_id = data.userObj.user_id;
	var password = document.getElementById("password").value;

	deleteUrl("/v1/user/" + user_id + "?password=" + password + "&t=" + Math.random())
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
function loadDeadDrops(callback) {
	getUrl("/v1/deaddrop?" + "&t=" + Math.random())
		.then(function(deaddrops) {
			data.deaddrops = deaddrops;
			if (data.selectedDeaddropObj) {
				console.log(".loadDeadDrops using existing selected deaddrop ",data.selectedDeaddropObj)
				loadMessages(data.selectedDeaddropObj.deaddrop_id, callback);
			}
			else if (data.deaddrops.length > 0) {
				if (data.deaddrops.includes("public")){
					console.log(".loadDeadDrops defaulting to public deaddrop ")
					loadMessages("public", callback);
					
				}
				else {
					console.log(".loadDeadDrops defaulting to first deaddrop ", data.deaddrops[0])
					loadMessages(data.deaddrops[0], callback);
				}
					
			}
			else { 
				console.log(".loadDeadDrops skipping message loading ", data.deaddrops[0])
				callback(); 
			}
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function loadMessages(deaddrop_id, callback) {
	console.log("loadMessages " + deaddrop_id)
	getUrl("/v1/deaddrop/" + deaddrop_id + "?" + "&t=" + Math.random())
		.then(function(deaddropObj) {
			data.selectedDeaddropObj = deaddropObj;
			//document.getElementById("deaddrops").value = deaddropObj.deaddrop_id;
			callback();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function selectDeadDrop() {
	var deaddrop_id = document.getElementById("deaddrops").value;
	console.log("selectDeadDrop " + deaddrop_id)

	loadMessages(deaddrop_id, displayArticle)
}

function addMessage() {
	console.log("addMessage")
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
			loadMessages(messageObj.deaddrop_id, displayArticle);
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function deleteMessage(message_id) {
	console.log("deleteMessage ",message_id)
	var deaddrop_id = data.selectedDeaddropObj.deaddrop_id;
	deleteUrl("/v1/deaddrop/" + deaddrop_id + "/" + message_id)
		.then(data => {
			loadMessages(deaddrop_id,displayArticle);
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
			loadDeadDrops(displayArticle)
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
	//console.log(options)
	if (postData)
		options.body = JSON.stringify(postData) // body data type must match "Content-Type" header
	return options;
}

async function getUrl(url) {
	console.log("GET url %s", url)
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
