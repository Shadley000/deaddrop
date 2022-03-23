
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
	//console.log("displayNav ");
	if (data && data.userObj && data.userObj.authentication_token) {
		html += '<li><button onclick="navigate(`deaddrops`)">DeadDrops</button></li>'
		html += '<li><button onclick="navigate(`createdeaddrop`)">Create DeadDrop</button></li>'
		html += '<li><button onclick="navigate(`account`)">Account</button></li>'
		html += '<li><button onclick="navigate(`about`)">About</button></li>'
		html += '<li><button onclick="navigate(`logout`)">Logout</button></li>'
		if(data.userObj.user_id == "admin")	{
			html += '<li><button onclick="navigate(`useradmin`)">Logout</button></li>'
		}
	} else {
		html += '<li><button onclick="navigate(`login`)">Login</button></li>'
		html += '<li><button onclick="navigate(`createaccount`)">Create Account</button></li>'
		html += '<li><button onclick="navigate(`about`)">About</button></li>'
	}
	html += '</ul>'
	document.getElementById("nav").innerHTML = html;
}

function displayArticle() {
	var html = "";
	if (data) {
		console.log("displayArticle ",data.articleState);
		if (data.userObj && data.userObj.authentication_token) {
			if (data.articleState == "logout") {
				html += displayLogout()
			} else if (data.articleState == "deaddrops") {
				html += displayDeaddrop();
			} else if (data.articleState == "createdeaddrop") {
				html += displayCreateDeaddrop()
			} else if (data.articleState == "account") {
				html += displayAccount()
			} else if(data.articleState == "useradmin"){
				html += displayUserAdmin();
			}
		}
		else {
			if (data.articleState == "login") {
				html += displayLogin()
			} else if (data.articleState == "createaccount") {
				html += displayCreateAccount()
			}
		}
		if (data.articleState == "about") {
			html += displayAbout()
		}
	}
	else {
		html += "<h3>Something has gone wrong</h3>"
	}
	document.getElementById("article").innerHTML = html;
}

function displayAbout() {
	var html = "";
	html += "<h3>About DeadDrop</h3>"
	html += "<p>Deaddrop is an anonymous and secure message hosting service</p>"
	return html;
}

function displayLogout() {
	var html = "";
	html += "<h3>logout</h3>"
	html += '<button onclick="logout()">Logout</button>'
	return html;
}

function displayCreateDeaddrop() {
	var html = "";
	html += "<h3>Create New DeadDrop</h3>"
	html += "<label for='deaddrop_id'>DeadDrop:</label> "
	html += "<input	type='text' id='deaddrop_id' name='deaddrop_id'	value='16 digit minimum name'><br> "
	html += "<label for='deaddrop_key'>Key:</label>"
	html += "<input type='text' id='deaddrop_key' name='deaddrop_key' value='16 digit minimum key'><br>"
	html += "<button onclick='createDeadDrop()'>Create</button>"
	return html;
}
function displayAccount() {
	var html = "";
	html += "<h3>account</h3>"
	html += '<label for="email">email:</label>'
	html += '<input type="text" id="email" name="email" value="Anonymous@anywhere.com"><br>'
	html += '<label for="password">password:</label>'
	html += '<input type="text" id="password" name="password" value="password"><br>'
	html += "<button onclick='deleteAccount()'>Delete this account</button>"
	return html;
}

function displayLogin() {
	var html = "<h3>Login</h3>"
	html += '<label for="user_id">user:</label>'
	html += '<input type="text" id="user_id" name="user_id" value="Anonymous"><br>'
	html += '<label for="password">password:</label>'
	html += '<input type="text" id="password" name="password" value="password"><br>'
	html += '<button onclick="login()">Login</button>'
	return html;
}

function displayUserAdmin() {
	var html = "<h3>User Administration</h3>"
	html += '<H4>Under Construction</H4>'
	return html;
}

function displayCreateAccount() {
	var html = "<h3>Create New Account</h3>"
	html += '<label for="user_id">user:</label>'
	html += '<input type="text" id="user_id" name="user_id" value="Anonymous"><br>'
	l += '<label for="password">password:</label>'
	html += '<input type="text" id="password" name="password" value="password"><br>'
	html += '<label for="confirm_password">confirm password:</label>'
	html += '<input type="text" id="confirm_password" name="confirm_password" value="password"><br>'
	html += '<label for="email">email:</label>'
	html += '<input type="text" id="email" name="email" value="Anonymous@anywhere.com"><br>'
	html += '<button onclick="createAccount()">Create Account</button>'
	return html;
}

function displayDeaddrop() {
	var html = ""
	if (data && data.deaddrops) {
		html += '<label for="deaddrops">Deaddrop:</label>'
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
							+ messageObj.message;
						if(messageObj.user_id == data.userObj.user_id)
							html += "<button onclick='deleteMessage("+messageObj.message_id+")'>delete</button>"
						html += '</li>';
					}
				} else {
					html += '<li>no messages</li>';
				}
				html += "</ul>"
			}
			html += "<button onclick='loadMessages("+deaddropObj.deaddrop_id+", displayArticle)'>refresh</button><BR>"
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
	return html;
}

