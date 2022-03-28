
function displayCreateDeaddrop() {
	var html = "";
	if (validatePermission(DEADDROP_ADMIN, data.userObj.permissions)) {
		html += "<h3>Create New DeadDrop</h3>"
		html += "<label for='deaddrop_id'>DeadDrop:</label> "
		html += "<input	type='text' id='deaddrop_id' name='deaddrop_id'	value='16 digit minimum name'><br> "
		html += "<label for='title'>Title:</label> "
		html += "<input	type='text' id='title' name='title'	value='16 digit minimum title'><br> "
		html += "<label for='deaddrop_key'>Key:</label>"
		html += "<input type='text' id='deaddrop_key' name='deaddrop_key' value='password'><br>"
		html += "<button onclick='createDeadDrop()'>Create</button>"
	} else {
		html += "<h3>You do not have permission to be here</h3>"
	}
	document.getElementById("article").innerHTML = html;
}

function createDeadDrop() {
	if (validatePermission(DEADDROP_ADMIN, data.userObj.permissions)) {
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
				refreshPermissions()
				.then(function() {
						data.selected_deaddrop_id = undefined;
						navigate(NAV_DEADDROPS);
					})
					.catch(function(err) {
						console.log('error: ' + err);
					});
			})
			.catch(function(err) {
				console.log('error: ' + err);
				document.getElementById("article").innerHTML = `<h4>Error</h4><P>${err}</P>`;
			});
	}
}
