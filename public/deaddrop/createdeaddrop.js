
class CreateDeaddropDisplay {
	
	constructor(){
		this.name = "NAV_CREATE_DEADDROP";
		
		this.audience='private', 
		this.permission_required= 'DEADDROP_ADMIN',	
		this.title= 'Create Deaddrop', 
		this.Navbar=false  
	}
	
	 generatePassword() {
		var length = 16,
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		retVal = "";
		for (var i = 0, n = charset.length; i < length; ++i) {
			retVal += charset.charAt(Math.random() * n);
		}
		return retVal;
	}

	 display() {
		var html = "";
		if (global.userObj.validatePermission(DEADDROP_ADMIN)) {
			html += "<h3>Create New DeadDrop</h3>"
			html += `<UL style="list-style-type:none">`
			html += "<LI><label for='deaddrop_id'>DeadDrop:</label> "
			html += `<input	type='text' id='deaddrop_id' name='deaddrop_id'	minlength="8"></LI> `
			html += "<LI><label for='title'>Title:</label> "
			html += `<input	type='text' id='title' name='title'	minlength="8"></LI>`
			html += "<LI><label for='deaddrop_key'>Key:</label>"
			html += `<input type='text' id='deaddrop_key' name='deaddrop_key' value='${createDeaddropDisplay.generatePassword()}'><br></LI>`
			html += "<LI><button onclick='createDeaddropDisplay.createDeadDrop()'>Create</button></LI>"
			html += "</UL>"
			
		} else {
			html += "<h3>You do not have permission to be here</h3>"
		}
		document.getElementById("article").innerHTML = html;
	}

	 createDeadDrop() {
		if (global.userObj.validatePermission(DEADDROP_ADMIN)) {
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
			.then(data => {
				refreshPermissions()
				.then(function() {
					navigation.navigate(deaddropDisplay.name);
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
}
var createDeaddropDisplay = new CreateDeaddropDisplay();

