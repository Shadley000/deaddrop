
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
		if (validatePermission(DEADDROP_ADMIN, data.userObj.permissions)) {
			html += '<li><button onclick="navigate(`createdeaddrop`)">Create DeadDrop</button></li>'
		}
		html += '<li><button onclick="navigate(`account`)">Account</button></li>'
		html += '<li><button onclick="navigate(`about`)">About</button></li>'
		html += '<li><button onclick="navigate(`logout`)">Logout</button></li>'
		if (validatePermission(SYS_ADMINISTRATOR, data.userObj.permissions)) {
			html += '<li><button onclick="navigate(`useradmin`)">User Administration</button></li>'
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
	if (data) {
		console.log("displayArticle ", data.articleState);
		if (data.userObj && data.userObj.authentication_token) {
			if (data.articleState == "logout") {
				displayLogout()
			} else if (data.articleState == "deaddrops") {
				displayDeaddrop();
			} else if (data.articleState == "createdeaddrop") {
				displayCreateDeaddrop();
			} else if (data.articleState == "account") {
				displayAccount()
			} else if (data.articleState == "useradmin") {
				displayUserAdmin();
			}
		}
		else {
			if (data.articleState == "login") {
				displayLogin()
			} else if (data.articleState == "createaccount") {
				displayCreateAccount()
			}
		}
		if (data.articleState == "about") {
			displayAbout()
		}
	}
	else {
		document.getElementById("article").innerHTML = "<h3>Something has gone wrong</h3>";
	}
}

function displayAbout() {
	var html = "";
	html += "<h3>About DeadDrop</h3>"
	html += "<p>Deaddrop is an anonymous and secure message hosting service</p>"
	document.getElementById("article").innerHTML = html;
}


