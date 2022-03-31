
function displayInviteDeaddrop() {
	if (data && data.userObj && data.userObj.permissions) {

		if (!data.selected_deaddrop_id) {
			const aDeaddropPermissionObj = data.userObj.permissions.find(permission => permission.tags.includes(SYS_TAGS_DEADDROP));
			if (aDeaddropPermissionObj) {
				data.selected_deaddrop_id = aDeaddropPermissionObj.permission_id.trim();
				console.log("defaulting deaddrop_id:", data.selected_deaddrop_id)
			}
		}
		var html = ""
		html += "<DIV id='div_deaddrop_select'></DIV>"
		html += `<input type="checkbox" id="CREATE" name="CREATE" value="CREATE" checked>`
		html += `<label for="CREATE">Allows user to add new messages to this deaddrop</label><br>`

		html += `<input type="checkbox" id="READ" name="READ" value="READ" checked>`
		html += `<label for="READ">allows user to read all messages in the deaddrop</label><br>`

		//html += `<input type="checkbox" id="UPDATE" name="UPDATE" value="UPDATE">`
		//html += `<label for="UPDATE">Update deaddrop information</label><br>`

		html += `<input type="checkbox" id="DELETE" name="DELETE" value="DELETE">`
		html += `<label for="DELETE">Allows user to delete their own messages (not recommended)</label><br>`

		html += `<input type="checkbox" id="ADMIN" name="ADMIN" value="ADMIN">`
		html += `<label for="ADMIN">Allows deleting other users messages, add or remove users from the deaddrop or delete the entire deaddrop (not recommended)</label><br>`

		html += "<DIV id='contactList_div'></DIV>"
		document.getElementById("article").innerHTML = html;

		displayDeaddropSelect("selectInviteDeadDrop")
		displayInviteContactList()
	}
}
function displayInviteContactList() {

	if (data.selected_deaddrop_id) {
		const aDeaddropPermissionObj = getPermissionObj(data.selected_deaddrop_id)
		console.log("aDeaddropPermissionObj", aDeaddropPermissionObj)
		if (aDeaddropPermissionObj && aDeaddropPermissionObj.details.includes(SYS_DETAILS_ADMIN)) {
			getUrl(`/v1/user/${data.userObj.user_id}/contacts/contacts`)
				.then(contacts => {
					console.log("displayContactList", contacts)
					var html = "<TABLE>";

					for (var i = 0; i < contacts.length; i++) {
						var userObj = contacts[i];

						html += `<TR>`
						html += `<TD>${userObj.user_id}</TD>`
						html += `<TD>${userObj.display_name}</TD>`
						html += `<TD><button onclick='inviteContact("${userObj.user_id}")'>invite</button></TD>`
						html += '</TR>';

					}
					html += "</TABLE>";

					document.getElementById("contactList_div").innerHTML = html;
				})
				.catch(function(err) {
					console.log('error: ' + err);
					html = "<h3>Error</H3>";
					html += "<p>" + err + "</p>";
					document.getElementById("contactList_div").innerHTML = html;
				});
		} else {
			document.getElementById("contactList_div").innerHTML = `<h3>not authorized to send invites for ${data.selected_deaddrop_id}</h3>`
		}
	}
}

function selectInviteDeadDrop() {
	data.selected_deaddrop_id = document.getElementById("deaddrops").value;
	console.log("selectDeadDrop " + data.selected_deaddrop_id);
	displayInviteContactList()
}

function inviteContact(invitee_user_id) {

	var deaddrop_id = document.getElementById("deaddrops").value;

	var details = "";
	if (document.getElementById("CREATE").checked)
		details += "CREATE ";
	if (document.getElementById("READ").checked)
		details += "READ ";
	if (document.getElementById("DELETE").checked)
		details += "DELETE ";
	if (document.getElementById("ADMIN").checked)
		details += "ADMIN ";

	var inviteObj = {
		"invitee_user_id": invitee_user_id,
		"inviter_user_id": data.userObj.user_id,
		"deaddrop_id": deaddrop_id,
		"details": details
	}

	console.log(inviteObj);


	postUrl(`/v1/user/${invitee_user_id}/invite`, inviteObj)
		.then(() => {
			console.log("contact invited")

		})
		.catch(function(err) {
			console.log('error: ' + err);
			html = "<h3>Error</H3>";
			html += "<p>" + err + "</p>";
			document.getElementById("article").innerHTML = html;
		});

}