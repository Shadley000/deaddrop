
class InviteDeaddropDisplay {
	
	constructor(){
		this.name = "NAV_INVITE_DEADDROP"
		this.audience='private'
		this.permission_required= 'DEADDROP_ADMIN'
		this.title='Invite Deaddrop'
		this.Navbar=true
		
		this.selected_deaddrop_id= undefined
		
	}

	display() {
		if (global && global.userObj && global.userObj.permissions) {

			if (!this.selected_deaddrop_id) {
				const aDeaddropPermissionObj = global.userObj.permissions.find(permission => permission.tags.includes(SYS_TAGS_DEADDROP));
				if (aDeaddropPermissionObj) {
					this.selected_deaddrop_id = aDeaddropPermissionObj.permission_id.trim();
					console.log("defaulting deaddrop_id:", this.selected_deaddrop_id)
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
			html += `<label for="DELETE">(not recommended) Allows user to delete their own messages </label><br>`

			html += `<input type="checkbox" id="ADMIN" name="ADMIN" value="ADMIN">`
			html += `<label for="ADMIN">(not recommended) Allows deleting other users messages, add or remove users from the deaddrop or delete the entire deaddrop </label><br>`

			html += "<DIV id='contactList_div'></DIV>"
			document.getElementById("article").innerHTML = html;

			this.displayDeaddropSelect("inviteDeaddropDisplay.selectInviteDeadDrop")
			this.displayInviteContactList()
		}
	}
	
	displayInviteContactList() {

		if (this.selected_deaddrop_id) {
			const aDeaddropPermissionObj = global.userObj.getPermissionObj(this.selected_deaddrop_id)
			console.log("aDeaddropPermissionObj", aDeaddropPermissionObj)
			if (aDeaddropPermissionObj && aDeaddropPermissionObj.details.includes(SYS_DETAILS_ADMIN)) {
				getUrl(`/v1/user/${global.userObj.user_id}/contacts/contacts`)
					.then(contacts => {
						console.log("displayContactList", contacts)
						var html = "<TABLE>";

						for (var i = 0; i < contacts.length; i++) {
							var userObj = contacts[i];

							html += `<TR>`
							html += `<TD>${userObj.user_id}</TD>`
							html += `<TD>${userObj.display_name}</TD>`
							html += `<TD><button onclick='inviteDeaddropDisplay.inviteContact("${userObj.user_id}")'>invite</button></TD>`
							html += '</TR>';

						}
						html += "</TABLE>";

						document.getElementById("contactList_div").innerHTML = html;
					})
					.catch(function(err) {
						console.log('error: ' + err);
						html = `<h3>Error</H3><p>${err}</p>`;
						document.getElementById("contactList_div").innerHTML = html;
					});
			} else {
				document.getElementById("contactList_div").innerHTML = `<h3>not authorized to send invites for ${this.selected_deaddrop_id}</h3>`
			}
		}
	}
	 displayDeaddropSelect(onchange){
			var html = '<label for="deaddrops">Deaddrop:</label>'
			html += `<select id='deaddrops' onchange='${onchange}()'><BR>`
			//html += `<select id='deaddrops' onchange='selectDeadDrop()'><BR>`
			var permissions = global.userObj.permissions;
			for (var i = 0; i < permissions.length; i++) {
				var permission = permissions[i];

				var selected = "";
				if (this.selected_deaddrop_id && this.selected_deaddrop_id == permission.permission_id) {
					selected = 'selected';
				}
				if (permission.tags.includes(SYS_TAGS_DEADDROP)) {
					html += "<option value='" + permission.permission_id + "' " + selected + ">" + permission.permission_name + "</option>";
				}
			}
			html += "</select><BR>";
			
			document.getElementById("div_deaddrop_select").innerHTML = html;
	}

	selectInviteDeadDrop() {
		this.selected_deaddrop_id = document.getElementById("deaddrops").value;
		console.log("selectDeadDrop " + this.selected_deaddrop_id);
		displayInviteContactList()
	}

	inviteContact(invitee_user_id) {

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
			"inviter_user_id": global.userObj.user_id,
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
				document.getElementById("article").innerHTML =  `<h3>Error</H3><p>${err}</p>`;
			});
	}
}

var inviteDeaddropDisplay = new InviteDeaddropDisplay()
