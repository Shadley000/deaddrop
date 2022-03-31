const NAV_ERROR = "ERROR"

function displayError() {
	document.getElementById("article").innerHTML = "<h3>Something has gone wrong</h3>";
}

displayList.push({ "name": NAV_ERROR, 			
	"action": displayError,					
	"audience":'public', 		
	'permission_required': undefined,		
	'title': 'Error', 
	'Navbar':false  })