
class ContactsDisplay {
	constructor(){
		this.name = "NAV_CONTACTS"
		this.audience='private'
		this.permission_required= 'SYS_LOGIN'
		this.title= 'Contacts'
		this.Navbar='top'
		
		this.isUserSearchOn = false;
		this.searchstring = undefined;

	}

	display() {

		getUrl(`/v1/user/${global.userObj.user_id}/contacts/contacts`)
			.then(contacts => {
				var html = "";
				html += `<h3>Contacts</h3>`
				html += `<DIV id='user_search_div'></DIV>`
				html += "<DIV id='contactList_div'></DIV>"
				document.getElementById("article").innerHTML = html;
				this.displayUserSearch()
				this.displayContactList(contacts)
			})
			.catch(function(err) {
				console.log('error: ' + err);
				document.getElementById("article").innerHTML =  `<h3>Error</H3><p>${err}</p>`;;
			});
	}

	 toggleUserSearch() {
		this.isUserSearchOn = !this.isUserSearchOn;
		this.displayUserSearch()
	}

	 displayUserSearch() {
		console.log("displayUserSearch")
		var html = "";
		if (this.isUserSearchOn) {
			html += `<input type="text" id="searchstring" name="searchstring" value="${this.searchstring}">`
			html += `<button onclick='contactsDisplay.userSearch()'>Search</button>`
			html += "<DIV id='search_list_DIV'></DIV>"
		}
		else {
			html += `<button onclick='contactsDisplay.toggleUserSearch()'>Find</button>`
		}
		document.getElementById("user_search_div").innerHTML = html;
	} 

	 displayUserIdListTable(userObjs) {
		console.log("displayUserIdListTable ",userObjs)
		var html = "<TABLE>";
		if (userObjs) {
			for (var i = 0; i < userObjs.length; i++) {
				var userObj = userObjs[i];

				html += `<TR>`
				html += `<TD>${userObj.user_id}</TD>`
				html += `<TD>${userObj.display_name}</TD>`
				html += `<TD><button onclick='contactsDisplay.addContact("${userObj.user_id}")'>add</button></TD>`
				html += '</TR>';
			}
		}
		html += "</TABLE>";
		document.getElementById("search_list_DIV").innerHTML = html;
	}

	 displayContactList(contacts) {
		console.log("displayContactList", contacts)
		var html = "<TABLE>";

		for (var i = 0; i < contacts.length; i++) {
			var userObj = contacts[i];

			html += `<TR>`
			html += `<TD>${userObj.user_id}</TD>`
			html += `<TD>${userObj.display_name}</TD>`
			html += `<TD><button onclick='contactsDisplay.viewContact("${userObj.user_id}")'>view</button>`
			html += `<button onclick='contactsDisplay.messageContact("${userObj.user_id}")'>message</button>`
			html += `<button onclick='contactsDisplay.deleteContact("${userObj.user_id}")'>delete</button></TD>`
			html += '</TR>';
		}
		html += "</TABLE>";

		document.getElementById("contactList_div").innerHTML = html;
	}

	 messageContact(contact_user_id) {
		this.selected_user_id = contact_user_id;
		navigation.navigate(sendPrivateMessageDisplay.name);
	}

	 addContact(contact_user_id) {
		postUrl(`/v1/user/${global.userObj.user_id}/contacts/${contact_user_id}`)
			.then(contacts => {
				getUrl(`/v1/user/${global.userObj.user_id}/contacts/contacts`)
					.then(contacts => {
						this.isUserSearchOn = false;
						this.displayUserSearch();
						this.displayContactList(contacts)
					})
			})
			.catch(function(err) {
				console.log('error: ' + err);
				document.getElementById("article").innerHTML =  `<h3>Error</H3><p>${err}</p>`;;
			});
	}


	 userSearch() {
		this.searchstring = document.getElementById("searchstring").value;
		getUrl(`/v1/user/search?searchstring=${searchstring}`)
			.then(userObjs => {
				this.displayUserIdListTable(userObjs)
			})
			.catch(function(err) {
				console.log('error: ' + err);
				document.getElementById("article").innerHTML =  `<h3>Error</H3><p>${err}</p>`;;
			});
	}


	 deleteContact(contact_user_id) {

		deleteUrl(`/v1/user/${global.userObj.user_id}/contacts/${contact_user_id}`)
			.then(() => {
				getUrl(`/v1/user/${global.userObj.user_id}/contacts/contacts`)
					.then(contacts => {
						this.displayContactList(contacts);
					})
			})
			.catch(function(err) {
						console.log('error: ' + err);
						document.getElementById("article").innerHTML =  `<h3>Error</H3><p>${err}</p>`;;
					});
	}


	 viewContact(contact_user_id) {
		/*getUrl(`/v1/user/${global.userObj.user_id}/contacts/${contact_user_id}`)
			.then(contacts => {
				navigation.navigate(contacts.name)

			})*/
	}


}

var contactsDisplay = new ContactsDisplay()




