const NAV_ACCOUNT = "account"



function displayAccount() {
	var html = "";
	html += `<h3>${data.userObj.user_id}</h3>`
	html += '<label for="email">email:</label>'
	html += `<input type="text" id="email" name="email" value="${data.userObj.email}"><br>`
	//html += '<label for="password">password:</label>'
	//html += '<input type="password" id="password" name="password" value="password"><br>'
	html += `<button onclick='navigate("${NAV_CONTACTS}")'>Contact List</button>`

	if (data.userObj.permissions) {
		if (data.userObj.permissions.length > 0) {
			html += "<table>"
			for (var j = 0; j < data.userObj.permissions.length; j++) {
				var permissionObj = data.userObj.permissions[j];
				if (permissionObj.tags.indexOf(SYS_TAGS_DEADDROP) > -1) {
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

	html += `<button onclick='navigate("${NAV_ADD_PERMISSON}")'>Manually Add a Permission</button>`
	
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
				navigate(NAV_LOGIN);
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
			refreshPermissions()
				.then(function() {
					displayNav();
					navigate(NAV_ACCOUNT);
				})
				.catch(function(err) {
					console.log('error: ' + err);
				});

		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}
displayList.push({ "name": NAV_ACCOUNT, 
	"action": displayAccount, 
	"audience":'private', 
	'permission_required': SYS_LOGIN,			
	'title': 'Account Management', 
	'Navbar':'top'}
);