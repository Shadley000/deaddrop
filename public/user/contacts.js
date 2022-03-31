const NAV_CONTACTS = "contacts"



var isUserSearchOn = false;

function displayContacts() {

	getUrl(`/v1/user/${data.userObj.user_id}/contacts/contacts`)
		.then(contacts => {
			var html = "";
			html += `<h3>Contacts</h3>`
			html += `<DIV id='user_search_div'></DIV>`
			html += "<DIV id='contactList_div'></DIV>"
			document.getElementById("article").innerHTML = html;
			displayUserSearch()
			displayContactList(contacts)
		})
		.catch(function(err) {
			console.log('error: ' + err);
			html = "<h3>Error</H3>";
			html += "<p>" + err + "</p>";
			document.getElementById("article").innerHTML = html;
		});
}

function toggleUserSearch() {
	isUserSearchOn = !isUserSearchOn;
	displayUserSearch()
}

function displayUserSearch() {
	console.log("displayUserSearch")

	var html = "";

	if (isUserSearchOn) {
		html += `<input type="text" id="searchstring" name="searchstring" value="${data.searchstring}">`
		html += `<button onclick='userSearch()'>Search</button>`
		html += "<DIV id='search_list_DIV'></DIV>"
	}
	else {
		html += `<button onclick='toggleUserSearch()'>Find</button>`
	}


	document.getElementById("user_search_div").innerHTML = html;

}

function displayUserIdListTable(userObjs) {
	console.log("displayUserIdListTable ",userObjs)
	var html = "<TABLE>";
	if (userObjs) {
		for (var i = 0; i < userObjs.length; i++) {
			var userObj = userObjs[i];

			html += `<TR>`
			html += `<TD>${userObj.user_id}</TD>`
			html += `<TD>${userObj.display_name}</TD>`
			html += `<TD><button onclick='addContact("${userObj.user_id}")'>add</button></TD>`
			html += '</TR>';
		}
	}
	html += "</TABLE>";
	document.getElementById("search_list_DIV").innerHTML = html;
}

function displayContactList(contacts) {
	console.log("displayContactList", contacts)
	var html = "<TABLE>";

	for (var i = 0; i < contacts.length; i++) {
		var userObj = contacts[i];

		html += `<TR>`
		html += `<TD>${userObj.user_id}</TD>`
		html += `<TD>${userObj.display_name}</TD>`
		html += `<TD><button onclick='viewContact("${userObj.user_id}")'>view</button><button onclick='deleteContact("${userObj.user_id}")'>delete</button></TD>`
		html += '</TR>';

	}
	html += "</TABLE>";

	document.getElementById("contactList_div").innerHTML = html;
}

function addContact(contact_user_id) {
	postUrl(`/v1/user/${data.userObj.user_id}/contacts/${contact_user_id}`)
		.then(contacts => {
			getUrl(`/v1/user/${data.userObj.user_id}/contacts/contacts`)
				.then(contacts => {
					isUserSearchOn = false;
					displayUserSearch();
					displayContactList(contacts)
				})
		})
}


function userSearch() {
	var searchstring = document.getElementById("searchstring").value;
	getUrl(`/v1/user/search?searchstring=${searchstring}`)
		.then(userObjs => {
			displayUserIdListTable(userObjs)
		})
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
	/*getUrl(`/v1/user/${data.userObj.user_id}/contacts/${contact_user_id}`)
		.then(contacts => {
			navigate(NAV_CONTACTS)

		})*/
}

displayList.push({ "name": NAV_CONTACTS,
	"action": displayContacts,
	"audience":'private', 
	'permission_required': SYS_LOGIN,
	'title': 'Contacts', 
	'Navbar':'top'});


