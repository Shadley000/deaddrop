

function displayCreateDeaddrop() {
	var html = "";
	if (validatePermission('sys_create_deaddrop', data.userObj.permissions)) {
		html += "<h3>Create New DeadDrop</h3>"
		html += "<label for='deaddrop_id'>DeadDrop:</label> "
		html += "<input	type='text' id='deaddrop_id' name='deaddrop_id'	value='16 digit minimum name'><br> "
		html += "<label for='deaddrop_key'>Key:</label>"
		html += "<input type='text' id='deaddrop_key' name='deaddrop_key' value='16 digit minimum key'><br>"
		html += "<button onclick='createDeadDrop()'>Create</button>"
	} else {
		html += "<h3>You do not have permission to be here</h3>"
	}
	document.getElementById("article").innerHTML = html;
}

function createDeadDrop() {
	if (validatePermission('sys_create_deaddrop', data.userObj.permissions)) {
		html += '<li><button onclick="navigate(`createdeaddrop`)">Create DeadDrop</button></li>'
		var deaddrop = {
			"deaddrop_id": document.getElementById("deaddrop_id").value,
			"deaddrop_key": document.getElementById("deaddrop_key").value
		};
		console.log("createDeadDrop")
		postUrl("/v1/deaddrop/" + deaddrop.deaddrop_id + "?deaddrop_key=" + deaddrop.deaddrop_key, deaddrop)
			.then(data => {
				displayDeaddrop()
			})
			.catch(function(err) {
				console.log('error: ' + err);
				html = "<h3>Error</H3>";
				html += "<p>" + err + "</p>";
				document.getElementById("article").innerHTML = html;
			});
	}
}

// ************************************************************* 

function displayDeaddrop() {
	if (data && data.userObj && data.userObj.permissions) {

		if (!data.selected_deaddrop_id) {
			const aDeaddropPermissionObj = data.userObj.permissions.find(permission => permission.tags.includes("DEADDROP"));
			if (aDeaddropPermissionObj) {
				data.selected_deaddrop_id = aDeaddropPermissionObj.permission_id.trim();	
			}
		}
		//console.log("data.selected_deaddrop_id:",data.selected_deaddrop_id)
		
		var html = ""
		html += '<label for="deaddrops">Deaddrop:</label>'
		html += "<select id='deaddrops' onchange='selectDeadDrop()'>"
		var permissions = data.userObj.permissions;
		for (var i = 0; i < permissions.length; i++) {
			var permission = permissions[i];
			//console.log("permission", permission)
			var selected = "";
			if (permission.tags.includes("DEADDROP")){
				if( data.selected_deaddrop_id && data.selected_deaddrop_id == permission.permissions_id) {
					selected = 'selected';
				}
				html += "<option value='" + permission.permission_id + "'' " + selected + "'>" + permission.permission_name + "</option>";
			}
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
							html += "<ul>"
							for (var j = 0; j < deaddropObj.messages.length; j++) {
								var messageObj = deaddropObj.messages[j];
								html += '<li>' + messageObj.user_id + '<BR>'
									+ messageObj.publish_date + '<BR>'
									+ messageObj.title + '<BR>'
									+ messageObj.message;
								if (messageObj.user_id == data.userObj.user_id)
									html += "<button onclick='deleteMessage(" + messageObj.message_id + ")'>delete</button>"
								html += '</li>';
							}
							html += "</ul>"
						}
						html += "<button onclick='displayDeaddrop()'>refresh</button><BR>"
						html += '<label for="title">Title:</label>'
						html += '<input type="text" id="title" name="title" value=""><br>'
						html += '<label for="message">Message:</label>'
						html += '<input type="text" id="message" name="message" value=""><br>'
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


