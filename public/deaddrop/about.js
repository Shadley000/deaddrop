
class AboutDisplay {
	
	constructor(){
		this.name = "NAV_ABOUT";
		this.audience='public'
		this.permission_required= undefined
		this.title= 'About'
		this.Navbar='top'
	}

	 display() {
		var html = "";
		html += "<h3>About DeadDrop</h3>"
		html += "<p>Deaddrop is an secure message hosting service</p>"
		html += "<p>Create an anonymous account and a password protected deaddrop</p>"
		html += "<p>Post messages to your deaddrop</p>"
		html += "<p>invite other users to your deaddrop where they can read and write messages</p>"
		html += "<p>send other users private message</p>"
		
		document.getElementById("article").innerHTML = html;
	}
}
var aboutDisplay = new AboutDisplay()
