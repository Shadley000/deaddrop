

class ErrorDisplay {
	
	constructor(){
		this.name = "NAV_ERROR";
		this.audience='public'
		this.permission_required= undefined
		this.title='Error'
		this.Navbar=false 
	}
	
	display() {
		document.getElementById("article").innerHTML = "<h3>Something has gone horriblely wrong</h3>";
	}
}

var errorDisplay = new ErrorDisplay()



