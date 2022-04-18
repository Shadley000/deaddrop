class AccountDisplay {
	
	constructor(){
		this.name = "NAV_ACCOUNT";
		
		this.audience = 'private'
		this.permission_required= 'SYS_LOGIN'
		this.title= 'Account Management'
		this.Navbar='top'
	}
	
	display() {
		var html = "";
		html += `<h3>${global.userObj.user_id}</h3>`
		html += '<label for="email">email:</label>'
		html += `<input type="text" id="email" name="email" value="${global.userObj.email}"><br>`
		//html += '<label for="password">password:</label>'
		//html += '<input type="password" id="password" name="password" value="password"><br>'
		html += `<button onclick='navigation.navigate("${contactsDisplay.name}")'>Contact List</button>`

		if (global.userObj.permissions) {
			if (global.userObj.permissions.length > 0) {
				html += "<table>"
				for (var j = 0; j < global.userObj.permissions.length; j++) {
					var permissionObj = global.userObj.permissions[j];
					if (permissionObj.tags.indexOf(SYS_TAGS_DEADDROP) > -1) {
						html += `<TR><TD>${permissionObj.permission_id}</TD><TD>${permissionObj.permission_name}</TD>`
						html += `<TD>${permissionObj.tags}</TD><TD>${permissionObj.details}</TD>`;
						if (global.userObj.user_id == "admin" && permissionObj.permission_id == "public deaddrop") {
							html += `<TD></TD>`
						} else {
							html += `<TD><button onclick='accountDisplay.deletePermission("${permissionObj.permission_id}")'>delete</button></TD>`
						}
						html += '</TR>';
					}
				} html += "</table>"
			} else {
				html += '<h4>no messages</h4>';
			}
		}
		if (global.userObj.user_id != "admin") { html += "<button onclick='deleteAccount()'>Delete this account</button>" }

		html += `<button onclick='navigation.navigate("${manualAddPermissionDisplay.name}")'>Manually Add a Permission</button>`
		
		document.getElementById("article").innerHTML = html;
	}

	deleteAccount() {
		let password = window.prompt("Are you sure you want to delete your account? Enter password to continue", "")
		if (password) {
			var user_id = global.userObj.user_id;
			let url = `/v1/user/${user_id}?password=${password}`;
			deleteUrl(url)
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

	deletePermission(permission_id) {
		var user_id = global.userObj.user_id;
		console.log("deletePermission %s %s", permission_id, user_id);

		let url = `/v1/user/${user_id}/${permission_id}`;
		console.log(url);
		deleteUrl(url)
		.then(data => {
			refreshPermissions()
			.then(function() {
				navigation.display();
				navigation.navigate(accountDisplay.name);
			})
			.catch(function(err) {
				console.log('error: ' + err);
				document.getElementById("article").innerHTML =  `<h3>Error</H3><p>${err}</p>`;;
			});

		})
		.catch(function(err) {
			console.log('error: ' + err);
			document.getElementById("article").innerHTML =  `<h3>Error</H3><p>${err}</p>`;;
		});
	}
}

var accountDisplay = new AccountDisplay()