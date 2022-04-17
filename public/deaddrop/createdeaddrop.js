const NAV_CREATE_DEADDROP = "createdeaddrop"

function generatePassword() {
	var length = 16,
	charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
	retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.random() * n);
	}
	return retVal;
}

function displayCreateDeaddrop() {
	var html = "";
	if (validatePermission(DEADDROP_ADMIN, data.userObj.permissions)) {
		html += "<h3>Create New DeadDrop</h3>"
		html += `<UL style="list-style-type:none">`
		html += "<LI><label for='deaddrop_id'>DeadDrop:</label> "
		html += `<input	type='text' id='deaddrop_id' name='deaddrop_id'	minlength="8"></LI> `
		html += "<LI><label for='title'>Title:</label> "
		html += `<input	type='text' id='title' name='title'	minlength="8"></LI>`
		html += "<LI><label for='deaddrop_key'>Key:</label>"
		html += `<input type='text' id='deaddrop_key' name='deaddrop_key' value='${generatePassword()}'><br></LI>`
		html += "<LI><button onclick='createDeadDrop()'>Create</button></LI>"
		html += "</UL>"
		
	} else {
		html += "<h3>You do not have permission to be here</h3>"
	}
	document.getElementById("article").innerHTML = html;
}

function createDeadDrop() {
	if (validatePermission(DEADDROP_ADMIN, data.userObj.permissions)) {
		var deaddropObj = {
			"deaddrop_id": document.getElementById("deaddrop_id").value.trim(),
			"deaddrop_key": document.getElementById("deaddrop_key").value.trim(),
			"title": document.getElementById("title").value.trim(),
		};
		
		if(!deaddropObj.deaddrop_id || deaddropObj.deaddrop_id.length<8){
			alert("deaddrop name must be at least 8 characters");
			return;
		}
		if(!deaddropObj.title || deaddropObj.title.length==0){
			deaddropObj.title = deaddropObj.deaddrop_id
			
		}
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

displayList.push({ "name": NAV_CREATE_DEADDROP, 
	"action": displayCreateDeaddrop,		
	"audience":'private', 
	'permission_required': DEADDROP_ADMIN,	
	'title': 'Create Deaddrop', 
	'Navbar':false   });