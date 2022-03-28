

function displayNav() {
	var html = '<ul>';

	for (var i = 0; i < displayList.length; i++) {
		if (displayList[i].Navbar) {
			if (data && displayList[i].audience == 'private'
				&& data.userObj && data.userObj.authentication_token
				&& displayList[i].permission_required 
				&& validatePermission(displayList[i].permission_required, data.userObj.permissions)) {
				html += `<li><button onclick="navigate('${displayList[i].name}')">${displayList[i].title}</button></li>`					
				
			} else if (displayList[i].audience == 'public_only' 
					&& (!data.userObj || !data.userObj.authentication_token)) {
					html += `<li><button onclick="navigate('${displayList[i].name}')">${displayList[i].title}</button></li>`
				} 
			else if (displayList[i].audience == 'public') {
				html += `<li><button onclick="navigate('${displayList[i].name}')">${displayList[i].title}</button></li>`
			}
		}
	}
	html += '</ul>'
	document.getElementById("nav").innerHTML = html;
}	

