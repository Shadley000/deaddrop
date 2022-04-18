
class LogoutDisplay {
	
	constructor(){
		this.name = "NAV_LOGOUT"
		this.audience= 'private'
		this.permission_required= 'SYS_LOGIN'
		this.title= 'Logout'
		this.Navbar='top'

	}

	display() {
		var html = "";
		html += "<h3>logout</h3>"
		html += '<button onclick="logoutDisplay.logout()">Logout</button>'
		document.getElementById("article").innerHTML = html;
	}

	logout() {
		console.log('logout ');
		initData();
		navigation.display();
		navigation.navigate(blankDisplay.name);

		deleteUrl("/v1/logout?t=" + Math.random())
		.then(data => {
			initData();
			navigation.display();
			navigation.navigate(loginDisplay.name);
		})
		.catch(function(err) {
			console.log('error: ' + err);
			document.getElementById("article").innerHTML =  `<h3>Error</H3><p>${err}</p>`;;
		});
	}
}

var logoutDisplay = new LogoutDisplay()

