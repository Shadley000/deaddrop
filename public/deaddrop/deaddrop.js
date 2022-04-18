

class DeaddropDisplay {
	
	constructor(){
		this.name = "NAV_DEADDROP"
		this.audience = 'private'
		this.permission_required = 'DEADDROP_ADMIN'
		this.title = 'DeadDrops'
		this.Navbar ='top'
		
		this.selected_deaddrop_id = undefined
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
			html += `<img src="./images/refresh32x32.jpg" alt="deaddrop" float="left" onclick='deaddropDisplay.display()'>`
			html += `<img src="./images/add32x32.jpg" alt="deaddrop" float="left" onclick='navigation.navigate("${createDeaddropDisplay.name}")'>`
		
			html += "<DIV id='div_messages'></DIV>"
			html += "<DIV id='div_create_new_message'></DIV>"
			document.getElementById("article").innerHTML = html;
			
			this.displayDeaddropSelect()
			this.displayDeadDropMessages();
			this.displayCreateNewDeadDropMessage();
		}
	}

	displayCreateNewDeadDropMessage(deaddropObj) {
		var html = ""
		
		const aDeaddropPermissionObj = global.userObj.permissions.find(permission => permission.tags.includes(SYS_TAGS_DEADDROP));
		if (aDeaddropPermissionObj) {
			this.selected_deaddrop_id = aDeaddropPermissionObj.permission_id.trim();
			console.log("defaulting deaddrop_id:", this.selected_deaddrop_id)
		}
		if (deaddropObj) {
			html += '<h4>New Deaddrop Message</h4>'
			html += '<input type="text" id="title" name="title" value="" style="width: 100%"  maxlength="64"></input><br>'
			html += `<textarea id="message" name="message" rows ="10" style="width: 100%" maxlength="2048"></textarea><BR>`
			html += "<button onclick='deaddropDisplay.addMessage()'>Post Message</button>"
			document.getElementById("div_create_new_message").innerHTML = html;
		}
		else {
			document.getElementById("div_create_new_message").innerHTML = "";
		}
	}

	displayMessage(messageObj){
		var html = `<DIV id='${messageObj.message_id_div}'>`
		
		html += `<table style="width: 100%">`
		html += `<TR>`
		html += `<TH style="text-align:left">`
		html += `${messageObj.user_id}`
		html += `<img src="./images/message16x16.jpg" alt="deaddrop" float="left" onclick='deaddropDisplay.messageContact("${messageObj.user_id}")'>`
		html += `<img src="./images/delete16x16.jpg" alt="deaddrop" float="left" onclick='deaddropDisplay.deleteMessage("${messageObj.message_id}")'>`
		html += `</TH>`
		html += `<TH style="text-align:right">${messageObj.publish_date}</TH></TR>`
		html += `</TR>`
		html += `<TR><TH colspan="2" style="text-align:left">${messageObj.title}</TH></TR>`
		html += `<TR><TD colspan="2" style="text-align:left">${messageObj.message}</TD></TR>`
		
		
		html += "</table>"
		html += "<BR>"
		html += "</DIV>"
		return html;
	}

	displayDeadDropMessages() {
		console.log(this)
		if (this.selected_deaddrop_id) {
			getUrl("/v1/deaddrop/" + this.selected_deaddrop_id + "?" + "&t=" + Math.random())
			.then(function(deaddropObj) {
				if (deaddropObj && deaddropObj.messages) {
					var html = "";
					for (var j = 0; j < deaddropObj.messages.length; j++) {
						var messageObj = deaddropObj.messages[j];
						html+= deaddropDisplay.displayMessage(messageObj);
					}
					document.getElementById("div_messages").innerHTML = html;
				}
				deaddropDisplay.displayCreateNewDeadDropMessage(deaddropObj)
			})
		} else {
			var html = "<h3>please select a deaddrop</h3>"
			document.getElementById("div_messages").innerHTML = html;
		}
	}
	
	
	displayDeaddropSelect(){
			var html = '<label for="deaddrops">Deaddrop:</label>'
			html += `<select id='deaddrops' onchange='deaddropDisplay.selectDeadDrop()'><BR>`
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

	messageContact(contact_user_id) {
		sendPrivateMessageDisplay.selected_user_id = contact_user_id;
		navigation.navigate(sendPrivateMessageDisplay.name);
	}

	selectDeadDrop() {
		this.selected_deaddrop_id = document.getElementById("deaddrops").value;
		console.log("selectDeadDrop " + this.selected_deaddrop_id);
		this.displayDeadDropMessages()
	}


	addMessage() {
		console.log("addMessage")
		var messageObj = {
			"message_id": "newmesssage",
			"user_id": global.userObj.user_id,
			"deaddrop_id": this.selected_deaddrop_id,
			"title": document.getElementById("title").value,
			"message": document.getElementById("message").value
		};
		document.getElementById('title').value = "";
		document.getElementById('message').value = "";
		//console.log(messageObj)
		postUrl("/v1/deaddrop/" + messageObj.deaddrop_id + "/" + messageObj.message_id, messageObj)
		.then(data => {
			this.displayDeadDropMessages()
		})
		.catch(function(err) {
			console.log('error: ' + err);
			document.getElementById("article").innerHTML = `<h3>Error</H3><p>${err}</p>`;
		});
	}

	deleteMessage(message_id) {
		console.log("deleteMessage ", message_id)
		var deaddrop_id = this.selected_deaddrop_id;
		deleteUrl("/v1/deaddrop/" + deaddrop_id + "/" + message_id)
		.then(data => {
			this.display();
		})
		.catch(function(err) {
			console.log('error: ' + err);
			document.getElementById("article").innerHTML = `<h3>Error</H3><p>${err}</p>`;
		});
	}

}

var deaddropDisplay = new DeaddropDisplay()
