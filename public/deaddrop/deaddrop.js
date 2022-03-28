


function displayDeaddrop() {
	if (data && data.userObj && data.userObj.permissions) {

		if (!data.selected_deaddrop_id) {
			const aDeaddropPermissionObj = data.userObj.permissions.find(permission => permission.tags.includes(SYS_TAGS_DEADDROP));
			if (aDeaddropPermissionObj) {
				data.selected_deaddrop_id = aDeaddropPermissionObj.permission_id.trim();
				console.log("defaulting deaddrop_id:",data.selected_deaddrop_id)	
			}
		}
		//console.log("data.selected_deaddrop_id:",data.selected_deaddrop_id)
		
		var html = ""
		html += '<label for="deaddrops">Deaddrop:</label>'
		html += "<select id='deaddrops' onchange='selectDeadDrop()'>"
		var permissions = data.userObj.permissions;
		for (var i = 0; i < permissions.length; i++) {
			var permission = permissions[i];
			
			var selected = "";
			if( data.selected_deaddrop_id && data.selected_deaddrop_id == permission.permission_id) {
				selected = 'selected';
			}
			if (permission.tags.includes(SYS_TAGS_DEADDROP)){	
				html += "<option value='" + permission.permission_id + "' " + selected + ">" + permission.permission_name + "</option>";
			}
			
			//console.log("selected_deaddrop_id:'%s' selected:'%s' permission_id:'%s'",data.selected_deaddrop_id, selected, permission.permission_id)
		}
		html += "</select>";
		html += "<div id=div_messages></div>"
		document.getElementById("article").innerHTML = html;
		
		if (data.selected_deaddrop_id) {
			getUrl("/v1/deaddrop/" + data.selected_deaddrop_id + "?" + "&t=" + Math.random())
				.then(function(deaddropObj) {
					if (deaddropObj) {
						var html = ""
						if (deaddropObj.messages) {
							html += "<table>"
							for (var j = 0; j < deaddropObj.messages.length; j++) {
								var messageObj = deaddropObj.messages[j];
								html += `<TR><TH>${messageObj.user_id}</TH><TH>${messageObj.publish_date}</TH>` 
								if (messageObj.user_id == data.userObj.user_id)
									html += "<TD><button onclick='deleteMessage(" + messageObj.message_id + ")'>delete</button></TD>"
								else
									html += `<TD></TD>`
								html += `</TR><TR>`
								html += `<TH colspan="3">${messageObj.title}</TH>`
								html += `</TR><TR>`
								html += `<TD colspan="3">${messageObj.message}</TD>`;
								html += `</TR>`;
							}
							html += "</table>"
						}
						html += "<button onclick='displayDeaddrop()'>refresh</button><BR>"
						html += '<label for="title">Title:</label>'
						html += '<input type="text" id="title" name="title" value=""><br>'
						//html += '<label for="message">Message:</label>'
						//html += '<input type="text" id="message" name="message" value=""><br>'
						html += `<textarea id="message" name="message" rows ="10" cols="50" maxlength="2048"></textarea>`
						html += "<button onclick='addMessage()'>Send</button>"
						document.getElementById("div_messages").innerHTML = html;
					} else {
						var html = "<h3>"+data.selected_deaddrop_id+" not found</h3>"
						document.getElementById("div_messages").innerHTML = html;
					}
				})
				.catch(function(err) {
					console.log('error: ' + err);
					var html = "<h3>Error</H3><p>" + err + "</p>";
					document.getElementById("div_messages").innerHTML = html;
				});
		} else {
			var html = "<h3>select a deaddrop</h3>"
			document.getElementById("div_messages").innerHTML = html;
		}
	}
}

function selectDeadDrop() {
	data.selected_deaddrop_id = document.getElementById("deaddrops").value;
	console.log("selectDeadDrop " + data.selected_deaddrop_id);
	displayDeaddrop();
}


function addMessage() {
	console.log("addMessage")
	var messageObj = {
		"message_id": "newmesssage",
		"user_id": data.userObj.user_id,
		"deaddrop_id": data.selected_deaddrop_id,
		"title": document.getElementById("title").value,
		"message": document.getElementById("message").value
	};
	document.getElementById('title').value = "";
	document.getElementById('message').value = "";
	//console.log(messageObj)
	postUrl("/v1/deaddrop/" + messageObj.deaddrop_id + "/" + messageObj.message_id, messageObj)
		.then(data => {
			displayDeaddrop();
		})
		.catch(function(err) {
			console.log('error: ' + err);
			html = "<h3>Error</H3>";
			html += "<p>" + err + "</p>";
			document.getElementById("article").innerHTML = html;
		});
}

function deleteMessage(message_id) {
	console.log("deleteMessage ", message_id)
	var deaddrop_id = data.selected_deaddrop_id;
	deleteUrl("/v1/deaddrop/" + deaddrop_id + "/" + message_id)
		.then(data => {
			displayDeaddrop();
		})
		.catch(function(err) {
			console.log('error: ' + err);
			html = "<h3>Error</H3>";
			html += "<p>" + err + "</p>";
			document.getElementById("article").innerHTML = html;
		});
}


