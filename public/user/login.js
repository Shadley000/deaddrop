

class LoginDisplay {
	
	constructor(){
		this.name = "NAV_LOGIN";
		this.audience = 'public_only'
		this.permission_required = undefined 
		this.title = 'Login'
		this.Navbar = 'top'
	}
	
	display() {
		var html = "<h3>Login</h3>"
		html += '<label for="user_id">user:</label>'
		html += '<input type="text" id="user_id" name="user_id" value="admin"><br>'
		html += '<label for="password">password:</label>'
		html += '<input type="password" id="password" name="password" value="password"><br>'
		html += '<button onclick="loginDisplay.login()">Login</button>'
		html += `<button onclick="navigation.navigate('${createAccountDisplay.name}')">Create a New Account</button>`
		
		document.getElementById("article").innerHTML = html;
	}

	login() {
		var user_id = document.getElementById("user_id").value.trim();
		var password = document.getElementById("password").value.trim();
		initData();

		let url = `/v1/user/login?user_id=${user_id}&password=${password}&t=` + Math.random();

		getUrl(url)
		.then(function(userObj) {
			
			userObj.refreshPermissions = function() {
					return new Promise(function(resolve, reject) {
						getUrl("/v1/user/" + global.userObj.user_id)
						.then(function(userObj) {
							global.userObj = userObj;
							resolve()
						})
						.catch(function(err) {
							console.log('error: ' + err);
							reject(err)
						});
					})
				}
				
			userObj.getPermissionObj = function (permission_id){
				return (global.userObj.permissions.find(o => o.permission_id === permission_id))
			}
		
			userObj.validatePermission = function (permission_id) {
				if (!userObj || !userObj.permissions || userObj.permissions.length == 0) {
					return undefined;
				}
				if(!permission_id) return true;
				return (userObj.permissions.find(o => o.permission_id === permission_id))
			}
				
			global.userObj = userObj;
			
			console.log("userObj: ", userObj)
			navigation.display();
			navigation.navigate(deaddropDisplay.name);
		})
		.catch(function(err) {
			console.log('error: ' + err);
			initData();
			navigation.display();
			navigation.navigate(errorDisplay.name);
		});
	}

}






var loginDisplay = new LoginDisplay()


