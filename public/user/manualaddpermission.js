

function displayManualAddPermission() {
	var html = "";
	html += "<h3>Manual Permission Addition</h3>"
	html += "<label for='permission_id'>Permission ID:</label> "
	html += "<input	type='text' id='permission_id' name='permission_id'	value=''><br> "
	html += "<label for='permission_key'>Permission Key:</label>"
	html += "<input type='text' id='permission_key' name='permission_key' value=''><br>"
	html += "<label for='details'>Details:</label>"
	html += `<input type='text' id='details' name='details' value='${SYS_DETAILS_ALL}'><br>`
	html += "<button onclick='addManualPermission()'>Add</button>"

	document.getElementById("article").innerHTML = html;
}


function addManualPermission() {
	var permission_id = document.getElementById("permission_id").value
	var permission_key = document.getElementById("permission_key").value
	var details = document.getElementById("details").value;

	postUrl(`/v1/user/${data.userObj.user_id}/${permission_id}?permission_key=${permission_key}&details=${details}`, {})
		.then(function() {
			refreshPermissions()
				.then(() => {
					data.selected_deaddrop_id = permission_id;
					navigate(NAV_DEADDROPS);
				})
		})
		.catch(function(err) {
			console.log('error: ' + err);
			document.getElementById("article").innerHTML = `<h4>Error</h4><P>${err}</P>`;
		});

}
