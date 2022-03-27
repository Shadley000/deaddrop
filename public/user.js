
function displayLogout() {
	var html = "";
	html += "<h3>logout</h3>"
	html += '<button onclick="logout()">Logout</button>'
	document.getElementById("article").innerHTML = html;
}

function logout() {
	console.log('logout ');
	initData();
	displayNav();
	displayArticle();

	deleteUrl("/v1/logout?t=" + Math.random())
		.then(data => {
			initData();
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
	html += '<input type="text" id="user_id" name="user_id" value="admin"><br>'
	html += '<label for="password">password:</label>'
	html += '<input type="password" id="password" name="password" value="password"><br>'
	html += '<button onclick="login()">Login</button>'
	document.getElementById("article").innerHTML = html;
}

function login() {
	var user_id = document.getElementById("user_id").value.trim();
	var password = document.getElementById("password").value.trim();
	//console.log('login %s', user_id);
	initData();

	let url = `/v1/login?user_id=${user_id}&password=${password}&t=` + Math.random();

	getUrl(url)
		.then(function(userObj) {
			data.userObj = userObj;
			console.log("userObj: ", userObj)
			data.articleState = "deaddrops";
			displayNav();
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
			initData();
			displayNav();
			displayArticle();
		});
}

function displayCreateAccount() {
	var html = "<h3>Create New Account</h3>"
	html += '<label for="user_id">user:</label>'
	html += '<input type="text" id="user_id" name="user_id" value="Anonymous"><br>'
	html += '<label for="password">password:</label>'
	html += '<input type="password" id="password" name="password" value="password"><br>'
	html += '<label for="confirm_password">confirm password:</label>'
	html += '<input type="password" id="confirm_password" name="confirm_password" value="password"><br>'
	html += '<label for="email">email:</label>'
	html += '<input type="text" id="email" name="email" value="Anonymous@anywhere.com"><br>'
	html += '<label for="display_name">display name:</label>'
	html += '<input type="text" id="display_name" name="display_name" value="timidtiger"><br>'
	html += '<button onclick="createAccount()">Create Account</button>'
	document.getElementById("article").innerHTML = html;
}

function createAccount() {
	var password = document.getElementById("password").value.trim();
	var confirm_password = document.getElementById("confirm_password").value.trim();
	var user_id = document.getElementById("user_id").value.trim();
	var email = document.getElementById("email").value.trim();
	var display_name = document.getElementById("display_name").value.trim();

	if (password != confirm_password) { alert("passwords do not match"); }
	if (password.length < 8) { alert("password must be at least 8 characters"); }
	if (user_id.length < 8) { alert("user_id must be at least 8 characters"); }
	if (display_name.length < 8) { alert("display_name must be at least 8 characters"); }

	var userObj = {
		"user_id": user_id,
		"password": password,
		"email": email,
		"display_name": display_name,
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
	html += `<h3>${data.userObj.user_id}</h3>`
	html += '<label for="email">email:</label>'
	html += `<input type="text" id="email" name="email" value="${data.userObj.email}"><br>`
	//html += '<label for="password">password:</label>'
	//html += '<input type="password" id="password" name="password" value="password"><br>'

	if (data.userObj.permissions) {
		if (data.userObj.permissions.length > 0) {
			html += "<table>"
			for (var j = 0; j < data.userObj.permissions.length; j++) {
				var permissionObj = data.userObj.permissions[j];
				if (permissionObj.tags == 'DEADDROP') {
					html += `<TR><TD>${permissionObj.permission_id}</TD><TD>${permissionObj.permission_name}</TD>`
					html += `<TD>${permissionObj.tags}</TD><TD>${permissionObj.details}</TD>`;
					if (data.userObj.user_id == "admin" && permissionObj.permission_id == "public deaddrop") {
						html += `<TD></TD>`
					} else {
						html += `<TD><button onclick='deletePermission("${permissionObj.permission_id}")'>delete</button></TD>`
					}
					html += '</TR>';
				}
			} html += "</table>"
		} else {
			html += '<h4>no messages</h4>';
		}

	}
	if (data.userObj.user_id != "admin") { html += "<button onclick='deleteAccount()'>Delete this account</button>" }

	document.getElementById("article").innerHTML = html;
}

function deleteAccount() {
	let password = window.prompt("Are you sure you want to delete your account? Enter password to continue", "")
	if (password) {
		var user_id = data.userObj.user_id;
		let url = `/v1/user/${user_id}?password=${password}`;
		deleteUrl(url)
			.then(data => {
				initData();
				displayNav();
				displayArticle();
			})
			.catch(function(err) {
				console.log('error: ' + err);
			});
	}
}

function deletePermission(permission_id) {
	var user_id = data.userObj.user_id;
	console.log("deletePermission %s %s", permission_id, user_id);

	let url = `/v1/user/${user_id}/${permission_id}`;
	console.log(url);
	deleteUrl(url)
		.then(deletedata => {
			getUrl("/v1/user/" + data.userObj.user_id)
				.then(function(userObj) {
					data.userObj = userObj;
					//console.log("got new userObj: ",userObj)
					data.articleState = "deaddrops";
					displayNav();
					displayArticle();
				})
				.catch(function(err) {
					console.log('error: ' + err);
				});

		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function validatePermission(permission, permissions) {
	if (!permissions || permissions.length == 0) {
		return undefined;
	}
	return (permissions.find(o => o.permission_id === permission))
}
