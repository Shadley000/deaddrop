class BlankDisplay {
	
	constructor(){
		this.name = "NAV_BLANK";
		this.audience='public'
		this.permission_required= undefined
		this.title='Blank'
		this.Navbar=false 
	}

	display() {
		document.getElementById("article").innerHTML = "<H2>This page left intentionally blank</h2>";
	}
}

var blankDisplay = new BlankDisplay()

