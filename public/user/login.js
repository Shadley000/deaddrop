const NAV_LOGIN = "login"


function displayLogin() {
	var html = "<h3>Login</h3>"
	html += '<label for="user_id">user:</label>'
	html += '<input type="text" id="user_id" name="user_id" value="admin"><br>'
	html += '<label for="password">password:</label>'
	html += '<input type="password" id="password" name="password" value="password"><br>'
	html += '<button onclick="login()">Login</button>'
	html += `<button onclick="navigate('${NAV_CREATE_ACCOUNT}')">Create a New Account</button>`
	
	document.getElementById("article").innerHTML = html;
}

function login() {
	var user_id = document.getElementById("user_id").value.trim();
	var password = document.getElementById("password").value.trim();
	//console.log('login %s', user_id);
	initData();

	let url = `/v1/user/login?user_id=${user_id}&password=${password}&t=` + Math.random();

	getUrl(url)
	.then(function(userObj) {
		data.userObj = userObj;
		console.log("userObj: ", userObj)
		displayNav();
		navigate(NAV_DEADDROPS);
	})
	.catch(function(err) {
		console.log('error: ' + err);
		initData();
		displayNav();
		navigate(NAV_ERROR);
	});
}


displayList.push({ "name": NAV_LOGIN,
	"action": displayLogin,
	"audience":'public_only',
	'permission_required': undefined,
	'title': 'Login',
	'Navbar':'top'  });