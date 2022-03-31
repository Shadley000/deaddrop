const NAV_BLANK = "BLANK"

function displayBlank() {
	document.getElementById("article").innerHTML = "";
	
}

displayList.push({ "name": NAV_BLANK, 			
	"action": displayBlank,					
	"audience":'public', 		
	'permission_required': undefined,		
	'title': 'Blank', 
	'Navbar':false  })
	