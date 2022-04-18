
class Navigation {
	
	constructor(){
		this.displayList = [];
		this.articleState= "login"
		
	}

	display() {
		var html = '<ul style="list-style-type:none">';
		console.log(this.displayList)
		if(this.displayList.length==0){
			html += `<li>Such Empty</li>`
		}
		for (var i = 0; i < this.displayList.length; i++) {
			var displayObj = this.displayList[i].action
			if (displayObj.Navbar) {
				if (global && displayObj.audience == 'private'
					&& global.userObj && global.userObj.authentication_token
					&& displayObj.permission_required 
					&& global.userObj.validatePermission(displayObj.permission_required)) {
					html += `<li onclick="navigation.navigate('${displayObj.name}')">${displayObj.title}</li>`					
					
				} else if (displayObj.audience == 'public_only' 
						&& (!global.userObj || !global.userObj.authentication_token)) {
						html += `<li onclick="navigation.navigate('${displayObj.name}')">${displayObj.title}</li>`
				} 
				else if (displayObj.audience == 'public') {
					html += `<li onclick="navigation.navigate('${displayObj.name}')">${displayObj.title}</li>`
				}
			}
		}
		html += '</ul>'
		document.getElementById("nav").innerHTML = html;
	}	

	register(displayObj){
		console.log("register ",displayObj.name);
		this.displayList.push({ 
			"name": displayObj.name,
			"action": displayObj
		});
	}

	navigate(destination) {
		if (destination){
			this.articleState = destination;
		}
		var displayObj = this.displayList.find(o => o.name === this.articleState).action
		
		if(displayObj) displayObj.display();
	}	


}