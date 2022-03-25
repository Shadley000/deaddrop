
function displayUserAdmin() {
	var html = "<h3>User Administration</h3>"
	if (adminData && adminData.userObjs) {
		html += '<label for="users">Users:</label>'
		html += "<select id='users' onchange='selectUser()'>"
		for (var i = 0; i < adminData.userObjs.length; i++) {
			console.log(adminData.userObjs[i])
			if (adminData.selected_user_id && adminData.userObjs[i].user_id == adminData.selected_user_id) {
				html += "<option value='" + adminData.userObjs[i].user_id + "'  selected>" + adminData.userObjs[i].user_id + "</option>";
				adminData.selectedUserObj = adminData.userObjs[i];
			} else {
				html += "<option value='" + adminData.userObjs[i].user_id + "'>" + adminData.userObjs[i].user_id + "</option>";
			}
		}
		html += "</select>";
		if (adminData.selectedUserObj) {
			html += "</ul>";
			html += "<li>User: " + adminData.selectedUserObj.user_id + "</li>";
			html += "<li>Email: " + adminData.selectedUserObj.email + "</li>";
			html += '<button onclick="adminDeactivateUser()">Deactivate User</button>'
			html += '<button onclick="adminDeleteUser()">Delete User</button>'
			html += '<button onclick="adminResetUserPassword()">Reset User password</button>'
			html += "</ul>";
		}

	} else {
		html += "<h4>No Data</h4>"
	}
	document.getElementById("article").innerHTML = html;
}


function adminResetUserPassword() {
	
}

function adminDeactivateUser() {
	
}

function adminDeleteUser() {

}

//******************************************************************************************************8 */

function adminLoadUserObjs(callback) {
	getUrl("/v1/admin?" + "&t=" + Math.random())
		.then(function(userObjs) {
			
			console.log("adminLoadUserObjs",userObjs);
			adminData.userObjs = userObjs;
			callback();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function selectUser() {
	var user_id = document.getElementById("users").value;
	console.log("selectUser " + user_id)
	adminData.selected_user_id = user_id;
	adminLoadUserObjs(displayArticle)
}