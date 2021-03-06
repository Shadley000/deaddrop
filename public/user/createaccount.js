
class CreateAccountDisplay {
	
	constructor(){
		this.name = "NAV_CREATE_ACCOUNT"
		this.audience='public_only'
		this.permission_required= undefined
		this.title= 'Create Account'
		this.Navbar='top'
	}

	 display() {
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
		html += '<button onclick="createAccountDisplay.createAccount()">Create Account</button>'
		document.getElementById("article").innerHTML = html;
	}

	 createAccount() {
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
		postUrl("/v1/user/login", userObj)
			.then(returnObj => {
				console.log(userObj);
				alert("user created successfully, please login");
				navigation.navigate(loginDisplay.name);
			})
			.catch(function(err) {
				console.log('error: ' + err);
				document.getElementById("article").innerHTML =  `<h3>Error</H3><p>${err}</p>`;;
			});
	}
}
var createAccountDisplay = new CreateAccountDisplay()

