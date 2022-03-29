
function displayContacts() {

	getUrl(`/v1/user/${data.userObj.user_id}/contacts/contacts`)
		.then(contacts => {
			var html = "";
			html += `<h3>Contacts</h3>`
			html += `<TD><button onclick='displayUserSearch()'>find</button></TD>`

			html += "<table id='contactListTable'></table>"
			document.getElementById("article").innerHTML = html;
			displayContactList(contacts)
		})
		.catch(function(err) {
			console.log('error: ' + err);
			html = "<h3>Error</H3>";
			html += "<p>" + err + "</p>";
			document.getElementById("article").innerHTML = html;
		});
}

function displayContactList(contacts) {
	var html = "";

	for (var i = 0; i < contacts.length; i++) {
		var userObj = contacts[i];

		html += `<TR>`
		html += `<TD>${userObj.user_id}</TD>`
		html += `<TD>${userObj.display_name}</TD>`
		html += `<TD><button onclick='viewContact("${userObj.user_id}")'>view</button><button onclick='deleteContact("${userObj.user_id}")'>delete</button></TD>`
		html += '</TR>';

	}

	document.getElementById("contactListTable").innerHTML = html;
}

function deleteContact(contact_user_id) {

	deleteUrl(`/v1/user/${data.userObj.user_id}/contacts/${contact_user_id}`)
		.then(() => {
			getUrl(`/v1/user/${data.userObj.user_id}/contacts/contacts`)
				.then(contacts => {
					displayContactList(contacts);
				})
		})
}


function viewContact(contact_user_id) {
	getUrl(`/v1/user/${data.userObj.user_id}/contacts/${contact_user_id}`)
		.then(contacts => {
			navigate(NAV_CONTACTS)

		})
}


