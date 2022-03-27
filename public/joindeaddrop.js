
function displayCreateDeaddrop() {
	var html = "";
	if (validatePermission(DEADDROP_ADMIN, data.userObj.permissions)) {
		html += "<h3>Create New DeadDrop</h3>"
		html += "<label for='deaddrop_id'>DeadDrop:</label> "
		html += "<input	type='text' id='deaddrop_id' name='deaddrop_id'	value='16 digit minimum name'><br> "
		html += "<label for='title'>Title:</label> "
		html += "<input	type='text' id='title' name='title'	value='16 digit minimum title'><br> "
		html += "<label for='deaddrop_key'>Key:</label>"
		html += "<input type='text' id='deaddrop_key' name='deaddrop_key' value='16 digit minimum key'><br>"
		html += "<button onclick='createDeadDrop()'>Create</button>"
	} else {
		html += "<h3>You do not have permission to be here</h3>"
	}
	document.getElementById("article").innerHTML = html;
}

function createDeadDrop() {
	if (validatePermission(DEADDROP_ADMIN, data.userObj.permissions)) {
		//html += '<li><button onclick="navigate(`createdeaddrop`)">Create DeadDrop</button></li>'
		var deaddropObj = {
			"deaddrop_id": document.getElementById("deaddrop_id").value,
			"deaddrop_key": document.getElementById("deaddrop_key").value,
			"title": document.getElementById("title").value
		};
		//console.log("createDeadDrop")
		postUrl("/v1/deaddrop/" + deaddropObj.deaddrop_id, deaddropObj)
			.then(postdata => {
				data.selected_deaddrop_id = deaddropObj.deaddrop_id;
				//console.log("deaddrop created: ",data.selected_deaddrop_id)
				//reload the user object to refresh permissions			
				getUrl("/v1/user/" + data.userObj.user_id)
					.then(function(userObj) {
						data.userObj = userObj;
						data.articleState = "deaddrops";
						data.selected_deaddrop_id = undefined;
						displayArticle();
					})
					.catch(function(err) {
						console.log('error: ' + err);
					});
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


function displayJoinDeaddrop() {
	var html = "";
	html += "<h3>Join a DeadDrop</h3>"
	html += "<label for='deaddrop_id'>DeadDrop:</label> "
	html += "<input	type='text' id='deaddrop_id' name='deaddrop_id'	value='16 digit minimum name'><br> "
	html += "<label for='deaddrop_key'>Key:</label>"
	html += "<input type='text' id='deaddrop_key' name='deaddrop_key' value='16 digit minimum key'><br>"
	html += "<button onclick='joinDeadDrop()'>Create</button>"

	document.getElementById("article").innerHTML = html;
}


function joinDeadDrop() {
	var deaddrop_id = document.getElementById("deaddrop_id").value
	var permission_id = deaddrop_id
	var authorization_key = document.getElementById("deaddrop_key").value
	var details = "";
	
	postUrl(`/v1/user/${data.userObj.user_id}/${permission_id}?authorization_key=${authorization_key}&details=${details}`,permissionObj )
		.then(function(userObj) {
			data.userObj = userObj;
			data.articleState = "deaddrops";
			data.selected_deaddrop_id = undefined;
			displayArticle();
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});

}
