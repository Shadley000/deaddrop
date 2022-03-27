console.log("loadding admin.js")

function displayUserAdmin() {
	if (validatePermission(SYS_ADMINISTRATOR, data.userObj.permissions)) {
		getUrl("/v1/administration?" + "&t=" + Math.random())
			.then(function(userObjs) {
				console.log("displayUserAdmin", userObjs);
				if (userObjs) {
					if(!data.selected_user_id){
						data.selected_user_id = userObjs[0].user_id
					}
					var selectedUserObj = userObjs.find(o => o.user_id === data.selected_user_id);

					var html = "<h3>User Administration</h3>"
					html += '<label for="users">Users:</label>'
					html += "<select id='users' onchange='selectUser()'>"
					for (var i = 0; i < userObjs.length; i++) {
						var selected = "";
						if (data.selected_user_id && userObjs[i].user_id == data.selected_user_id) {
							selected = "selected";
						}
						html += `<option value='${userObjs[i].user_id}'  ${selected}>${userObjs[i].user_id}</option>`;
					}
					html += "</select>";
					if (selectedUserObj) {
						html += "</ul>";
						html += `<li>User: ${selectedUserObj.user_id}</li>`;
						html += `<li>Email: ${selectedUserObj.email}</li>`;
						html += '<button onclick="adminDeactivateUser()">Deactivate User</button>'
						html += '<button onclick="adminDeleteUser()">Delete User</button>'
						html += '<button onclick="adminResetUserPassword()">Reset User password</button>'
						html += "</ul>";
						html += "<DIV id='div_user_permissions'>";
						html += "</DIV>";
						html += "<DIV id='div_availible_permissions'>";
						html += "</DIV>";


						displayUserPermissions(selectedUserObj.user_id);
					}
					document.getElementById("article").innerHTML = html;
				} else {
					var html = "<h4>No Data</h4>"
					document.getElementById("article").innerHTML = html;
				}
			})
			.catch(function(err) {
				console.log('error: ' + err);
				var html = `<h4>Error</h4><P>${err}</P>`
				document.getElementById("article").innerHTML = html;
			});
	} else {
		console.log("user does not have permission");
		var html = "<h4>you dont belong here</h4>"
		document.getElementById("article").innerHTML = html;
	}
}

function displayUserPermissions(user_id) {
	getUrl(`/v1/administration/${user_id}?t=` + Math.random())
		.then(function(selectedUserObj) {
			console.log("displayUserPermissions selectedUserObj", selectedUserObj);
			var html = "<h4>Permissions</h4>"
			html += "<table>"
			for (var j = 0; j < selectedUserObj.permissions.length; j++) {
				var permissionObj = selectedUserObj.permissions[j];
				html += `<TR>`
				html += `<TD><button onclick='deleteUserPermission("${selectedUserObj.user_id}", "${permissionObj.permission_id}")'>delete</button></TD>`;
				html += `<TD>${permissionObj.tags}</TD>`
				html += `<TD>${permissionObj.permission_id }</TD>`
				html += `<TD>${permissionObj.permission_name}</TD>`
				html += `<TD>${permissionObj.details}<button onclick='updateUserPermission("${selectedUserObj.user_id}", "${permissionObj.permission_id}", "${permissionObj.details}")'>update</button></TD>`;				
				html += '</TR>';
			}
			html += "</table>"
			document.getElementById("div_user_permissions").innerHTML = html;

			getUrl(`/v1/administration/permissions?t=` + Math.random())
				.then(function(availablePermissions) {

					var existingPermissions = selectedUserObj.permissions;
					var html = "<h4>All Permissions</h4>"
					html += "<table>"
					for (var j = 0; j < availablePermissions.length; j++) {
						var permission = availablePermissions[j]
						if (existingPermissions && existingPermissions.find(o => o.permission_id === permission.permission_id))  {

						}
						else {
							html += `<TR>`
							html += `<TD><button onclick='addUserPermission("${selectedUserObj.user_id}", "${permission.permission_id}")'>add</button></TD>`
							html += `<TD>${permission.tags}</TD>`
							html += `<TD>${permission.permission_id}</TD>`
							html += `<TD>${permission.permission_name}</TD>`
							html += '</li>';
						}
					}
					html += "</table>"
					document.getElementById("div_availible_permissions").innerHTML = html;
				});
		});
}

function deleteUserPermission(user_id, permission_id) {
	console.log("deleteUserPermission");
	deleteUrl(`/v1/administration/${user_id}/${permission_id}`)
		.then(function() {
			if(user_id == data.userObj.user_id) {refreshPermissions()}
			
			displayUserPermissions(user_id) 
		})
}
function addUserPermission(user_id, permission_id) {
	console.log("addUserPermission")
	let details = window.prompt("Enter permission details to continue","")
	if(!details)
		details = "";
	postUrl(`/v1/administration/${user_id}/${permission_id}?details=${details}`)
		.then(function() {
			if(user_id == data.userObj.user_id) {refreshPermissions()}
			
			displayUserPermissions(user_id) 
		})
}
function updateUserPermission(user_id, permission_id, details) {
	console.log("updateUserPermission");
	let newdetails = window.prompt("Enter permission details to continue",details)
	if(!newdetails)
		newdetails = "";
	putUrl(`/v1/administration/${user_id}/${permission_id}?details=${newdetails}`)
		.then(function() {
			if(user_id == data.userObj.user_id) {refreshPermissions()}
			
			displayUserPermissions(user_id) 
		})
}

function selectUser() {
	var user_id = document.getElementById("users").value;
	console.log("selectUser " + user_id)
	data.selected_user_id = user_id;
	displayUserAdmin();
}

function adminResetUserPassword() {
	if (validatePermission(SYS_ADMINISTRATOR, data.userObj.permissions)) {
	} else {
		console.log("user does not have permission");
	}
}

function adminDeactivateUser() {
	if (validatePermission(SYS_ADMINISTRATOR, data.userObj.permissions)) {
	} else {
		console.log("user does not have permission");
	}
}

function adminDeleteUser() {
	if (validatePermission(SYS_ADMINISTRATOR, data.userObj.permissions)) {
	} else {
		console.log("user does not have permission");
	}
}

