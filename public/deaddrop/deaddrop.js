const NAV_DEADDROPS = "deaddrops"



function displayDeaddrop() {
	if (data && data.userObj && data.userObj.permissions) {

		if (!data.selected_deaddrop_id) {
			const aDeaddropPermissionObj = data.userObj.permissions.find(permission => permission.tags.includes(SYS_TAGS_DEADDROP));
			if (aDeaddropPermissionObj) {
				data.selected_deaddrop_id = aDeaddropPermissionObj.permission_id.trim();
				console.log("defaulting deaddrop_id:", data.selected_deaddrop_id)
			}
		}
		var html = ""
		html += "<DIV id='div_deaddrop_select'></DIV>"
		//html += "<button onclick='displayDeaddrop()'>refresh</button>"
		html += `<img src="./images/refresh32x32.jpg" alt="deaddrop" float="left" onclick='displayDeaddrop()'>`
		html += `<img src="./images/add32x32.jpg" alt="deaddrop" float="left" onclick='navigate("${NAV_CREATE_DEADDROP}")'>`
	
		//html += `<button onclick='navigate("${NAV_CREATE_DEADDROP}")'>Create a new Deaddrop</button><br>`

		html += "<DIV id='div_messages'></DIV>"
		html += "<DIV id='div_create_new_message'></DIV>"
		document.getElementById("article").innerHTML = html;
		
		displayDeaddropSelect("selectDeadDrop")
		displayDeadDropMessages();
		displayCreateNewDeadDropMessage();
	}
}

function displayCreateNewDeadDropMessage(deaddropObj) {
	var html = ""
	
	const aDeaddropPermissionObj = data.userObj.permissions.find(permission => permission.tags.includes(SYS_TAGS_DEADDROP));
	if (aDeaddropPermissionObj) {
		data.selected_deaddrop_id = aDeaddropPermissionObj.permission_id.trim();
		console.log("defaulting deaddrop_id:", data.selected_deaddrop_id)
	}
	if (deaddropObj) {
		html += '<h4>New Deaddrop Message</h4>'
		html += '<input type="text" id="title" name="title" value="" style="width: 100%"  maxlength="64"></input><br>'
		html += `<textarea id="message" name="message" rows ="10" style="width: 100%" maxlength="2048"></textarea><BR>`
		html += "<button onclick='addMessage()'>Post Message</button>"
		document.getElementById("div_create_new_message").innerHTML = html;
	}
	else {
		document.getElementById("div_create_new_message").innerHTML = "";
	}
}

function displayDeadDropMessages() {
	if (data.selected_deaddrop_id) {
		getUrl("/v1/deaddrop/" + data.selected_deaddrop_id + "?" + "&t=" + Math.random())
		.then(function(deaddropObj) {
			if (deaddropObj && deaddropObj.messages) {
				var html = "";
				for (var j = 0; j < deaddropObj.messages.length; j++) {
					var messageObj = deaddropObj.messages[j];
					html+= displayMessage(messageObj)
					
				}
				document.getElementById("div_messages").innerHTML = html;
			}
			displayCreateNewDeadDropMessage(deaddropObj)
		})
	} else {
		var html = "<h3>please select a deaddrop</h3>"
		document.getElementById("div_messages").innerHTML = html;
	}
}

function displayMessage(messageObj){
	var html = `<DIV id='${messageObj.message_id_div}'>`
	
	html += `<table style="width: 100%">`
	html += `<TR>`
	html += `<TH style="text-align:left">`
	html += `${messageObj.user_id}`
	html += `<img src="./images/message16x16.jpg" alt="deaddrop" float="left" onclick='messageContact("${messageObj.user_id}")'>`
	html += `<img src="./images/delete16x16.jpg" alt="deaddrop" float="left" onclick='deleteMessage("${messageObj.message_id}")'>`
	html += `</TH>`
	html += `<TH style="text-align:right">${messageObj.publish_date}</TH></TR>`
	html += `</TR>`
	html += `<TR><TH colspan="2" style="text-align:left">${messageObj.title}</TH></TR>`
	html += `<TR><TD colspan="2" style="text-align:left">${messageObj.message}</TD></TR>`
	
	
	//if (messageObj.user_id == data.userObj.user_id)
	//html += `<TR><TD><button >delete</button></TD><TD></TD></TR>`
	//html += `<TR><TD></TD><TD></TD></TR>`
	html += "</table>"
	html += "<BR>"
	html += "</DIV>"
	return html;
}

function messageContact(contact_user_id) {
	data.selected_user_id = contact_user_id;
	navigate(NAV_SEND_PRIVATE_MESSAGE);
}

function selectDeadDrop() {
	data.selected_deaddrop_id = document.getElementById("deaddrops").value;
	console.log("selectDeadDrop " + data.selected_deaddrop_id);
	displayDeadDropMessages()
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
		displayDeadDropMessages()
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


displayList.push({ "name": NAV_DEADDROPS, 
	"action": displayDeaddrop,				
	"audience":'private', 
	'permission_required': DEADDROP_ADMIN,	
	'title': 'DeadDrops', 
	'Navbar':'top'});