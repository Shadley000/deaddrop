
function displayContacts() {

	getUrl(`/v1/user/${data.userObj.user_id}/contacts/contacts`)
		.then(contacts => {
			var html = "";
			html += `<h3>Contacts</h3>`

			if (contacts) {
				html += "<table>"
				for (var i = 0; i < contacts.length; i++) {
					var contactObj = contacts[i];

					html += `<TR>`
					html += `<TD>${contactObj.user_id}</TD>`
					html += `<TD><button onclick='viewContact("${contactObj.user_id}")'>view</button></TD>`
					html += `<TD><button onclick='deleteContact("${contactObj.user_id}")'>delete</button></TD>`
					html += '</TR>';

				}
				html += "</table>"
			}
			document.getElementById("article").innerHTML = html;
		})
		.catch(function(err) {
			console.log('error: ' + err);
			html = "<h3>Error</H3>";
			html += "<p>" + err + "</p>";
			document.getElementById("article").innerHTML = html;
		});
}


function deleteContact(contact_user_id) {

	deleteUrl(`/v1/user/${data.userObj.user_id}/contacts/${contact_user_id}`)
		.then(contacts => {
			navigate(NAV_CONTACTS)
		})
}


function viewContact(contact_user_id) {
	getUrl(`/v1/user/${data.userObj.user_id}/contacts/${contact_user_id}`)
		.then(contacts => {
			navigate(NAV_CONTACTS)
		})
}

