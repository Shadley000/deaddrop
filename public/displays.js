

function displayHeader() {
	document.getElementById("header").innerHTML = "<h2>DeadDrop</h2>"
}

function displayFooter() {
	document.getElementById("footer").innerHTML = "<h4>DeadDrop</h4>"
}

function displayNav() {
	var html = '<ul>';
	if (data && data.userObj && data.userObj.authentication_token) {
		if (validatePermission(DEADDROP_ADMIN, data.userObj.permissions)) {
			html += `<li><button onclick="navigate('${NAV_CREATE_DEADDROP}')">Create DeadDrop</button></li>`
		}
		html += `<li><button onclick="navigate('${NAV_DEADDROPS}')">DeadDrops</button></li>`
		html += `<li></li>`
		html += `<li><button onclick="navigate('${NAV_ACCOUNT}')">Account</button></li>`
		html += `<li></li>`
		html += `<li><button onclick="navigate('${NAV_ABOUT}')">About</button></li>`
		html += `<li><button onclick="navigate('${NAV_LOGOUT}')">Logout</button></li>`
		if (validatePermission(SYS_ADMINISTRATOR, data.userObj.permissions)) {
			html += `<li><button onclick="navigate('${NAV_USER_ADMIN}')">User Administration</button></li>`
		}
	} else {
		html += `<li><button onclick="navigate('${NAV_LOGIN}')">Login</button></li>`
		html += `<li><button onclick="navigate('${NAV_CREATE_ACCOUNT}')">Create Account</button></li>`
		html += `<li><button onclick="navigate('${NAV_ABOUT}')">About</button></li>`
	}
	html += '</ul>'
	document.getElementById("nav").innerHTML = html;
}

var screenList = [];
function buildDisplayData()
{
	screenList.push({
		
	});
}

function navigate(destination) {
	if(destination)
		data.articleState = destination;

	if (data) {
		if (data.userObj && data.userObj.authentication_token) {
			if (data.articleState == NAV_LOGOUT) {
				displayLogout()
			} else if (data.articleState == NAV_DEADDROPS) {
				displayDeaddrop();
			} else if (data.articleState == NAV_CREATE_DEADDROP) {
				displayCreateDeaddrop();
			} else if (data.articleState == NAV_ACCOUNT) {
				displayAccount()
			} else if (data.articleState == NAV_USER_ADMIN) {
				displayUserAdmin();
			}else if (data.articleState == NAV_ADD_PERMISSON) {
				displayManualAddPermission();
			}			
		}
		else {
			if (data.articleState == NAV_LOGIN) {
				displayLogin()
			} else if (data.articleState == NAV_CREATE_ACCOUNT) {
				displayCreateAccount()
			}
		}
		if (data.articleState == NAV_ABOUT) {
			displayAbout()
		}
		if (data.articleState == NAV_ERROR) {
			displayError()
		}
		if (data.articleState == NAV_BLANK) {
			document.getElementById("article").innerHTML = "";
		}
	}
	else {
		displayError();
	}
}



