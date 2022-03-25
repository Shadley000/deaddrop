

function displayCreateDeaddrop() {
	var html = "";
	html += "<h3>Create New DeadDrop</h3>"
	html += "<label for='deaddrop_id'>DeadDrop:</label> "
	html += "<input	type='text' id='deaddrop_id' name='deaddrop_id'	value='16 digit minimum name'><br> "
	html += "<label for='deaddrop_key'>Key:</label>"
	html += "<input type='text' id='deaddrop_key' name='deaddrop_key' value='16 digit minimum key'><br>"
	html += "<button onclick='createDeadDrop()'>Create</button>"
	document.getElementById("article").innerHTML = html;
}

function createDeadDrop() {
	var deaddrop = {
		"deaddrop_id": document.getElementById("deaddrop_id").value,
		"deaddrop_key": document.getElementById("deaddrop_key").value
	};
	console.log("createDeadDrop")
	postUrl("/v1/deaddrop/" + deaddrop.deaddrop_id + "?deaddrop_key=" + deaddrop.deaddrop_key, deaddrop)
		.then(data => {
			loadDeadDrops(displayArticle)
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

// ************************************************************* 

function displayDeaddrop() {
	var html = ""
	if (data && data.deaddrops) {
		html += '<label for="deaddrops">Deaddrop:</label>'
		html += "<select id='deaddrops' onchange='selectDeadDrop()'>"
		for (var i = 0; i < data.deaddrops.length; i++) {
			if (data.selectedDeaddropObj && data.deaddrops[i].deaddrop_id == data.selectedDeaddropObj.deaddrop_id) {
				html += "<option value='" + data.deaddrops[i].deaddrop_id + "'  selected>" + data.deaddrops[i].title + "</option>";
			} else {
				html += "<option value='" + data.deaddrops[i].deaddrop_id + "'>" + data.deaddrops[i].title + "</option>";
			}
		}
		html += "</select>";
		html += "<button onclick='loadDeadDrops()'>Refresh</button><br>"

		if (data.selectedDeaddropObj) {
			var deaddropObj = data.selectedDeaddropObj;
			if (deaddropObj.messages) {
				html += "<ul>"
				if (deaddropObj.messages.length > 0) {
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
				} else {
					html += '<li>no messages</li>';
				}
				html += "</ul>"
			}
			html += "<button onclick='loadMessages(" + deaddropObj.deaddrop_id + ", displayArticle)'>refresh</button><BR>"
			html += '<label for="title">Title:</label>'
			html += '<input type="text" id="title" name="title" value=""><br>'
			html += '<label for="message">Message:</label>'
			html += '<input type="text" id="message" name="message" value=""><br>'
			html += "<button onclick='addMessage()'>Send</button>"
		} else {
			html += "<h3>select a deaddrop</h3>"
		}
	} else {
		html += "<h3>you have no permissions to any deaddrops</h3>"
	}
	document.getElementById("article").innerHTML = html;
}


// ************************************************************* 

function loadDeadDrops(callback) {
	getUrl("/v1/deaddrop?" + "&t=" + Math.random())
		.then(function(deaddrops) {
			data.deaddrops = deaddrops;
			if (data.selectedDeaddropObj) {
				console.log(".loadDeadDrops using existing selected deaddrop ",data.selectedDeaddropObj)
				loadMessages(data.selectedDeaddropObj.deaddrop_id, callback);
			} else if (data.deaddrops.length > 0) {
				if (data.deaddrops.includes("public")){
					console.log(".loadDeadDrops defaulting to public deaddrop ")
					loadMessages("public", callback);					
				} else {
					console.log(".loadDeadDrops defaulting to first deaddrop ", data.deaddrops[0])
					loadMessages(data.deaddrops[0].deaddrop_id, callback);
				}					
			} else { 
				console.log(".loadDeadDrops skipping message loading ", data.deaddrops[0])
				callback(); 
			}
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function loadMessages(deaddrop_id, callback) {
	console.log("loadMessages " + deaddrop_id)
	getUrl("/v1/deaddrop/" + deaddrop_id + "?" + "&t=" + Math.random())
		.then(function(deaddropObj) {
			data.selectedDeaddropObj = deaddropObj;
			callback();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function selectDeadDrop() {
	var deaddrop_id = document.getElementById("deaddrops").value;
	console.log("selectDeadDrop " + deaddrop_id)

	loadMessages(deaddrop_id, displayArticle)
}


function addMessage() {
	console.log("addMessage")
	var messageObj = {
		"message_id": "newmesssage",
		"user_id": data.userObj.user_id,
		"deaddrop_id": data.selectedDeaddropObj.deaddrop_id,
		"title": document.getElementById("title").value,
		"message": document.getElementById("message").value
	};
	document.getElementById('title').value = "";
	document.getElementById('message').value = "";
	console.log(messageObj)
	postUrl("/v1/deaddrop/" + messageObj.deaddrop_id + "/" + messageObj.message_id, messageObj)
		.then(data => {
			loadMessages(messageObj.deaddrop_id, displayArticle);
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function deleteMessage(message_id) {
	console.log("deleteMessage ",message_id)
	var deaddrop_id = data.selectedDeaddropObj.deaddrop_id;
	deleteUrl("/v1/deaddrop/" + deaddrop_id + "/" + message_id)
		.then(data => {
			loadMessages(deaddrop_id,displayArticle);
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}


