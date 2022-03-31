
function displayDeaddropSelect(onchange){
		var html = '<label for="deaddrops">Deaddrop:</label>'
		html += `<select id='deaddrops' onchange='${onchange}()'><BR>`
		//html += `<select id='deaddrops' onchange='selectDeadDrop()'><BR>`
		var permissions = data.userObj.permissions;
		for (var i = 0; i < permissions.length; i++) {
			var permission = permissions[i];

			var selected = "";
			if (data.selected_deaddrop_id && data.selected_deaddrop_id == permission.permission_id) {
				selected = 'selected';
			}
			if (permission.tags.includes(SYS_TAGS_DEADDROP)) {
				html += "<option value='" + permission.permission_id + "' " + selected + ">" + permission.permission_name + "</option>";
			}
		}
		html += "</select><BR>";
		
		document.getElementById("div_deaddrop_select").innerHTML = html;
}