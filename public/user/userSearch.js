const NAV_USER_SEARCH = "userSearch"

function displayUserSearch() {

	var html = "";
	html += `<h3>User Search</h3>`
	html += `<input type="text" id="searchstring" name="searchstring" value="${data.searchstring}"><br`
	html += `<TD><button onclick='userSearch()'>Search</button></TD>`
	html += "<table id='user_id_list_table'></table>"

	document.getElementById("article").innerHTML = html;

}

function displayUserIdListTable(userObjs) {
	var html = "";
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
	document.getElementById("user_id_list_table").innerHTML = html;
}

function addContact(contact_user_id) {
	postUrl(`/v1/user/${data.userObj.user_id}/contacts/${contact_user_id}`)
	.then(contacts => {
		navigate(NAV_CONTACTS)
	})
}


function userSearch() {
	var searchstring = document.getElementById("searchstring").value;
	getUrl(`/v1/user/search?searchstring=${searchstring}`)
	.then(userObjs => {
		displayUserIdListTable(userObjs)
	})
}

displayList.push({ "name": NAV_USER_SEARCH, 		
	"action": displayUserSearch, 			
	"audience":'private', 
	'permission_required': SYS_LOGIN,			
	'title': 'User Search', 
	'Navbar':false   });
