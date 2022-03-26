console.log("loadding admin.js")

function displayUserAdmin() {
	if (validatePermission('sys_administrator', data.userObj.permissions)) {
		getUrl("/v1/admin?" + "&t=" + Math.random())
			.then(function(userObjs) {
				console.log("adminLoadUserObjs", userObjs);
				data.userObjs = userObjs;
				var html = "<h3>User Administration</h3>"
				if (data && data.userObjs) {
					html += '<label for="users">Users:</label>'
					html += "<select id='users' onchange='selectUser()'>"
					for (var i = 0; i < data.userObjs.length; i++) {
						console.log(data.userObjs[i])
						if (data.selected_user_id && data.userObjs[i].user_id == data.selected_user_id) {
							html += "<option value='" + data.userObjs[i].user_id + "'  selected>" + data.userObjs[i].user_id + "</option>";
							data.selectedUserObj = data.userObjs[i];
						} else {
							html += "<option value='" + data.userObjs[i].user_id + "'>" + data.userObjs[i].user_id + "</option>";
						}
					}
					html += "</select>";
					if (data.selectedUserObj) {
						html += "</ul>";
						html += "<li>User: " + data.selectedUserObj.user_id + "</li>";
						html += "<li>Email: " + data.selectedUserObj.email + "</li>";
						html += '<button onclick="adminDeactivateUser()">Deactivate User</button>'
						html += '<button onclick="adminDeleteUser()">Delete User</button>'
						html += '<button onclick="adminResetUserPassword()">Reset User password</button>'
						html += "</ul>";

						html += "<ul>"
						if (data.selectedUserObj.permissions.length > 0) {
							for (var j = 0; j < data.selectedUserObj.permissions.length; j++) {
								var permissionObj = data.selectedUserObj.permissions[j];
								html += '<li>' + permissionObj.permission_id + '<BR>'
									+ permissionObj.permission_name + '<BR>'
									+ permissionObj.tags + '<BR>'
									+ permissionObj.details;
								html += "<button onclick='deleteUserPermission(" + data.selectedUserObj.user_id +  ", " +  permissionObj.permission_id + ")'>delete</button>"
								html += '</li>';
							}
						} else {
							html += '<li>no messages</li>';
						}
						html += "</ul>"
					}
				} else {
					html += "<h4>No Data</h4>"
				}
				document.getElementById("article").innerHTML = html;
			})
			.catch(function(err) {
				console.log('error: ' + err);
			});
	} else {
		console.log("user does not have permission");
		html += "<h4>you dont belong here</h4>"
	}
}

function adminResetUserPassword() {
	if (validatePermission('sys_administrator', data.userObj.permissions)) {
	} else {
		console.log("user does not have permission");
	}
}

function adminDeactivateUser() {
	if (validatePermission('sys_administrator', data.userObj.permissions)) {
	} else {
		console.log("user does not have permission");
	}
}

function adminDeleteUser() {
	if (validatePermission('sys_administrator', data.userObj.permissions)) {
	} else {
		console.log("user does not have permission");
	}
}

function selectUser() {
	var user_id = document.getElementById("users").value;
	console.log("selectUser " + user_id)
	data.selected_user_id = user_id;
	adminLoadUserObjs(displayArticle)
}