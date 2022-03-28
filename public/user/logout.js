
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
	navigate(NAV_BLANK);

	deleteUrl("/v1/logout?t=" + Math.random())
		.then(data => {
			initData();
			displayNav();
			navigate(NAV_LOGIN);
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}