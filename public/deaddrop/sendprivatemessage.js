
class SendPrivateMessageDisplay {
	
	constructor(){
		this.name = "NAV_SEND_PRIVATE_MESSAGE"
		this.audience='private'
		this.permission_required= undefined
		this.title= 'Private Message'
		this.Navbar='top'
		
		this.selected_user_id=undefined
	}

	display() {
		var html = "";
		html += "<DIV id='div_workarea'></DIV>"
		
		document.getElementById("article").innerHTML = html;
		if(this.selected_user_id){
			this.displayPrivateMessageEdit(this.selected_user_id)
		}else{
			this.displayAContactList();
		}
	}


	displayPrivateMessageEdit(user_id) {
		var html = "";
		html += `<h3>${user_id}</h3>`
		html += `<button onclick='sendPrivateMessageDisplay.displayAContactList()'>select a different user</button><BR>`
		html += '<label for="title">Title:</label>'
		html += '<input type="text" id="title" name="title" value=""><br>'
		html += `<textarea id="message" name="message" rows ="10" cols="50" maxlength="2048"></textarea><BR>`
		html += `<button onclick='sendPrivateMessageDisplay.addPrivateMessage("${user_id}")'>Post Message</button>`
		
		document.getElementById("div_workarea").innerHTML = html;
	}

	displayAContactList(){
		getUrl(`/v1/user/${global.userObj.user_id}/contacts/contacts`)
		.then(contacts => {
			var html = "";
			html += `<h3>Contacts</h3>`
			html += `<TABLE>`;

			for (var i = 0; i < contacts.length; i++) {
				var userObj = contacts[i];
				html += `<TR>`
				html += `<TD>${userObj.user_id}</TD>`
				html += `<TD>${userObj.display_name}</TD>`
				html += `<TD><img src="./images/message32x32.jpg" alt="deaddrop" float="left" onclick='sendPrivateMessageDisplay.displayPrivateMessageEdit("${userObj.user_id}")'></TD>`
				html += `</TR>`;
			}
			html += `</TABLE>`;
			document.getElementById("div_workarea").innerHTML = html;
		})
		.catch(function(err) {
			console.log('error: ' + err);
			document.getElementById("div_workarea").innerHTML = `<h3>Error</H3><p>${err}</p>`;
		});
	}

	addPrivateMessage(user_id) {
		console.log("addPrivateMessage ",user_id);
		var messageObj = {
			"message_id": "newmesssage",
			"user_id": global.userObj.user_id,
			"deaddrop_id": user_id + " maildrop",
			"title": document.getElementById("title").value,
			"message": document.getElementById("message").value
		};
		postUrl("/v1/deaddrop/" + messageObj.deaddrop_id + "/" + messageObj.message_id, messageObj)
		.then(()=>{
			this.displayAContactList();
		})
		
	}
}

var sendPrivateMessageDisplay = new SendPrivateMessageDisplay()

