
function displayLogout() {
	var html = "";
	html += "<h3>logout</h3>"
	html += '<button onclick="logout()">Logout</button>'
	document.getElementById("article").innerHTML = html;
}
function logout() {
	console.log('logout ');
	initData();
	initAdminData();
	displayNav();
	displayArticle();

	deleteUrl("/v1/logout?t=" + Math.random())
		.then(data => {
			initData();
			initAdminData();
			displayNav();
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}


function displayLogin() {
	var html = "<h3>Login</h3>"
	html += '<label for="user_id">user:</label>'
	html += '<input type="text" id="user_id" name="user_id" value="Anonymous"><br>'
	html += '<label for="password">password:</label>'
	html += '<input type="text" id="password" name="password" value="password"><br>'
	html += '<button onclick="login()">Login</button>'
	document.getElementById("article").innerHTML = html;
}

function login() {
	var user_id = document.getElementById("user_id").value.trim();
	var password = document.getElementById("password").value.trim();
	//console.log('login %s', user_id);
	initData();

	getUrl("/v1/login?user_id=" + user_id + "&password=" + password + "&t=" + Math.random())
		.then(function(userObj) {
			data.userObj = userObj;
			data.articleState = "deaddrops";
			displayNav();
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
			initData();
			initAdminData();
			displayNav();
			displayArticle();
		});
}

function displayCreateAccount() {
	var html = "<h3>Create New Account</h3>"
	html += '<label for="user_id">user:</label>'
	html += '<input type="text" id="user_id" name="user_id" value="Anonymous"><br>'
	html += '<label for="password">password:</label>'
	html += '<input type="text" id="password" name="password" value="password"><br>'
	html += '<label for="confirm_password">confirm password:</label>'
	html += '<input type="text" id="confirm_password" name="confirm_password" value="password"><br>'
	html += '<label for="email">email:</label>'
	html += '<input type="text" id="email" name="email" value="Anonymous@anywhere.com"><br>'
	html += '<button onclick="createAccount()">Create Account</button>'
	document.getElementById("article").innerHTML = html;
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


function displayAccount() {
	var html = "";
	html += "<h3>account</h3>"
	html += '<label for="email">email:</label>'
	html += '<input type="text" id="email" name="email" value="Anonymous@anywhere.com"><br>'
	html += '<label for="password">password:</label>'
	html += '<input type="text" id="password" name="password" value="password"><br>'
	html += "<button onclick='deleteAccount()'>Delete this account</button>"
	document.getElementById("article").innerHTML = html;
}

function deleteAccount() {
	var user_id = data.userObj.user_id;
	var password = document.getElementById("password").value;

	deleteUrl("/v1/user/" + user_id + "?password=" + password + "&t=" + Math.random())
		.then(data => {
			initData();
			displayNav();
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}
