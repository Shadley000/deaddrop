const NAV_SEND_PRIVATE_MESSAGE = "sendprivatemessage"


function displayAbout() {
	var html = "";
	html += "<h3>About DeadDrop</h3>"
	html += "<p>Deaddrop is an anonymous and secure message hosting service</p>"
	document.getElementById("article").innerHTML = html;
}

displayList.push({ "name": NAV_ABOUT, 			
	"action": displayAbout,					
	"audience":'public', 		
	'permission_required': undefined,		
	'title': 'About', 
	'Navbar':'top'  })