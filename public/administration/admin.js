
class UserAdminDisplay {
	
	constructor(){
		this.name = "NAV_USER_ADMIN";
		this.audience='private';
		this.permission_required='SYS_ADMINISTRATOR';
		this.title='User Administration';
		this.Navbar='top';
		this.selectedUserObj = undefined;
		this.selected_user_id = undefined;
	}

	display() {
		if (global.userObj.validatePermission(SYS_ADMINISTRATOR)) {
			getUrl("/v1/administration/administration?" + "&t=" + Math.random())
				.then((userObjs) => {
					console.log("displayUserAdmin", userObjs);
					console.log("selected_user_id", this.selected_user_id);
					
					if (userObjs) {
						var html = `<h3>User Administration</h3>`
						if(!this.selected_user_id){
							this.selected_user_id = userObjs[0].user_id
						}
						this.selectedUserObj = userObjs.find(o => o.user_id === this.selected_user_id);

						
						html += `<label for="users">Users:</label>`
						html += `<select id='users' onchange='userAdminDisplay.selectUser()'>`
						for (var i = 0; i < userObjs.length; i++) {
							var selected = "";
							if (this.selected_user_id && userObjs[i].user_id == this.selected_user_id) {
								selected = `selected`;
							}
							html += `<option value='${userObjs[i].user_id}'  ${selected}>${userObjs[i].user_id}</option>`;
						}
						html += "</select>";
						if (this.selectedUserObj) {
							html += "</ul>";
							html += `<li>User: ${this.selectedUserObj.user_id}</li>`;
							html += `<li>Email: ${this.selectedUserObj.email}</li>`;
							html += `<button onclick="userAdminDisplay.adminDeactivateUser()">Deactivate User</button>`
							html += `<button onclick="userAdminDisplay.adminDeleteUser()">Delete User</button>`
							html += `<button onclick="userAdminDisplay.adminResetUserPassword()">Reset User password</button>`
							html += `</ul>`;
							html += `<DIV id='div_user_permissions'></DIV>`;
							html += `<DIV id='div_availible_permissions'></DIV>`;


							userAdminDisplay.displayUserPermissions(this.selectedUserObj.user_id);
						}
						document.getElementById("article").innerHTML = html;
					} else {
						document.getElementById("article").innerHTML = `<h4>No Data</h4>`;
					}
					
				})
				.catch((err) => {
					console.log('error: ' + err);
					document.getElementById("article").innerHTML = `<h4>Error</h4><P>${err}</P>`;
				});
		} else {
			console.log("user does not have permission");
			document.getElementById("article").innerHTML = "<h4>you dont belong here</h4>";
		}
	}

	displayUserPermissions(user_id) {
		getUrl(`/v1/administration/${user_id}?t=` + Math.random())
			.then((selectedUserObj) => {
				this.selectedUserObj = selectedUserObj;
				console.log("displayUserPermissions selectedUserObj", selectedUserObj);
				var html = `<h4>Permissions</h4>`
				html += `<table>`
				for (var j = 0; j < selectedUserObj.permissions.length; j++) {
					var permissionObj = selectedUserObj.permissions[j];
					html += `<TR>`
					html += `<TD><button onclick='userAdminDisplay.deleteUserPermission("${selectedUserObj.user_id}", "${permissionObj.permission_id}")'>delete</button></TD>`;
					html += `<TD>${permissionObj.tags}</TD>`
					html += `<TD>${permissionObj.permission_id }</TD>`
					html += `<TD>${permissionObj.permission_name}</TD>`
					html += `<TD>${permissionObj.details}<button onclick='userAdminDisplay.updateUserPermission("${selectedUserObj.user_id}", "${permissionObj.permission_id}", "${permissionObj.details}")'>update</button></TD>`;				
					html += `</TR>`;
				}
				html += `</table>`
				document.getElementById("div_user_permissions").innerHTML = html;

				getUrl(`/v1/administration/permissions?t=` + Math.random())
					.then((availablePermissions) => {

						var existingPermissions = selectedUserObj.permissions;
						var html = `<h4>All Permissions</h4>`
						html += `<table>`
						for (var j = 0; j < availablePermissions.length; j++) {
							var permission = availablePermissions[j]
							if (existingPermissions && existingPermissions.find(o => o.permission_id === permission.permission_id))  {

							}
							else {
								html += `<TR>`
								html += `<TD><button onclick='userAdminDisplay.addUserPermission("${selectedUserObj.user_id}", "${permission.permission_id}")'>add</button></TD>`
								html += `<TD>${permission.tags}</TD>`
								html += `<TD>${permission.permission_id}</TD>`
								html += `<TD>${permission.permission_name}</TD>`
								html += `</li>`;
							}
						}
						html += `</table>`
						document.getElementById("div_availible_permissions").innerHTML = html;
					});
			});
	}

	deleteUserPermission(user_id, permission_id) {
		console.log("deleteUserPermission");
		deleteUrl(`/v1/administration/${user_id}/${permission_id}`)
			.then(() => {
				if(user_id == global.userObj.user_id) {
					refreshPermissions()
				}
				this.displayUserPermissions(user_id) 
			})
	}
	addUserPermission(user_id, permission_id) {
		console.log("addUserPermission")
		let details = window.prompt("Enter permission details to continue","")
		if(!details)
			details = "";
		postUrl(`/v1/administration/${user_id}/${permission_id}?details=${details}`)
			.then(() => {
				if(user_id == global.userObj.user_id) {refreshPermissions()}
				this.displayUserPermissions(user_id) 
			})
	}
	updateUserPermission(user_id, permission_id, details) {
		console.log("updateUserPermission");
		let newdetails = window.prompt("Enter permission details to continue",details)
		if(!newdetails)
			newdetails = "";
		putUrl(`/v1/administration/${user_id}/${permission_id}?details=${newdetails}`)
			.then(() => {
				if(user_id == global.userObj.user_id) {refreshPermissions()}
				this.displayUserPermissions(user_id) 
			})
	}

	selectUser() {
		var user_id = document.getElementById("users").value;
		console.log("selectUser " + user_id)
		this.selected_user_id = user_id;
		this.display();
	}

	adminResetUserPassword() {
		if (global.userObj.validatePermission(SYS_ADMINISTRATOR)) {
			console.log(`not implemented`)
		} else {
			console.log("user does not have permission");
		}
	}

	adminDeactivateUser() {
		if (global.userObj.validatePermission(SYS_ADMINISTRATOR)) {
			console.log(`not implemented`)
		} else {
			console.log("user does not have permission");
		}
	}

	adminDeleteUser() {
		if (global.userObj.validatePermission(SYS_ADMINISTRATOR)) {
			console.log(`not implemented`)
		} else {
			console.log("user does not have permission");
		}
	}
}

var userAdminDisplay = new UserAdminDisplay();

