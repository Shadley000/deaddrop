const NAV_SEND_PRIVATE_MESSAGE = "sendprivatemessage"

function displaySendPrivateMessage() {
	var html = "";
	html += "<DIV id='div_workarea'></DIV>"
	
	document.getElementById("article").innerHTML = html;
	if(data.selected_user_id){
		displayPrivateMessageEdit(data.selected_user_id)
	}else{
		displayAContactList();
	}
}


function displayPrivateMessageEdit(user_id) {
	var html = "";
	html += `<h3>${user_id}</h3>`
	html += `<button onclick='displayAContactList()'>select a different user</button><BR>`
	html += '<label for="title">Title:</label>'
	html += '<input type="text" id="title" name="title" value=""><br>'
	html += `<textarea id="message" name="message" rows ="10" cols="50" maxlength="2048"></textarea><BR>`
	html += `<button onclick='addPrivateMessage("${user_id}")'>Post Message</button>`
	
	document.getElementById("div_workarea").innerHTML = html;
}

function displayAContactList(){
	getUrl(`/v1/user/${data.userObj.user_id}/contacts/contacts`)
	.then(contacts => {
		var html = "";
		html += `<h3>Contacts</h3>`
		html += "<TABLE>";

		for (var i = 0; i < contacts.length; i++) {
			var userObj = contacts[i];
			html += `<TR>`
			html += `<TD>${userObj.user_id}</TD>`
			html += `<TD>${userObj.display_name}</TD>`
			html += `<TD><button onclick='displayPrivateMessageEdit("${userObj.user_id}")'>Select</button></TD>`
			html += '</TR>';
		}
		html += "</TABLE>";
		document.getElementById("div_workarea").innerHTML = html;
	})
	.catch(function(err) {
		console.log('error: ' + err);
		html = "<h3>Error</H3>";
		html += "<p>" + err + "</p>";
		document.getElementById("div_workarea").innerHTML = html;
	});
}

function addPrivateMessage(user_id) {
	console.log("addPrivateMessage ",user_id);
	var messageObj = {
		"message_id": "newmesssage",
		"user_id": data.userObj.user_id,
		"deaddrop_id": user_id + " maildrop",
		"title": document.getElementById("title").value,
		"message": document.getElementById("message").value
	};
	postUrl("/v1/deaddrop/" + messageObj.deaddrop_id + "/" + messageObj.message_id, messageObj)
	.then(()=>{
		displayAContactList();
	})
	
}



displayList.push({ "name": NAV_SEND_PRIVATE_MESSAGE, 			
	"action": displaySendPrivateMessage,					
	"audience":'private', 		
	'permission_required': undefined,		
	'title': 'Private Message', 
	'Navbar':'top'  })