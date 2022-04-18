
class AcceptInviteDisplay {
	
	constructor(){
		this.name = "NAV_ACCEPT_INVITE";
		this.audience='private', 
		this.permission_required= 'DEADDROP_ADMIN',	
		this.title= 'Accept Invites', 
		this.Navbar=true
	}

	 display() {
		if (global && global.userObj ) {

			var html = ""
			html += "<h2>Invites</h2>"
			html += "<DIV id='inviteList_div'></DIV>"
			document.getElementById("article").innerHTML = html;

			this.displayActiveInvites()
			
		}
	}


	 displayActiveInvites(){
		
		getUrl(`/v1/user/${global.userObj.user_id}/invite`)
		.then(invites => {
			var html = "<TABLE>";

			for (var i = 0; i < invites.length; i++) {
				var inviteObj = invites[i];

				html += `<TR>`
				html += `<TD>${inviteObj.inviter_user_id}</TD>`
				html += `<TD>${inviteObj.deaddrop_id}</TD>`
				html += `<TD><button onclick='acceptInviteDisplay.acceptInvite("${inviteObj.inviter_user_id}", "${inviteObj.deaddrop_id}")'>Accept</button></TD>`
				html += `<TD><button onclick='acceptInviteDisplay.refuseInvite("${inviteObj.inviter_user_id}", "${inviteObj.deaddrop_id}")'>Refuse</button></TD>`
				html += '</TR>';
			}
			html += "</TABLE>";

			document.getElementById("inviteList_div").innerHTML = html;
		})
		
	}


	 acceptInvite(inviter_user_id, deaddrop_id){
		console.log("acceptInvite",inviter_user_id, deaddrop_id);
		
		var inviteObj = {
			"inviter_user_id":inviter_user_id,
			"invitee_user_id":global.userObj.user_id,
			"deaddrop_id":deaddrop_id,
			"details": ""
		}
		console.log(inviteObj)
		putUrl(`/v1/user/${global.userObj.user_id}/invite`, inviteObj)
		.then(() => {
			refreshPermissions()
			.then(()=> {
				this.displayActiveInvites()
			})
			
		})
		
	}


	 refuseInvite(inviter_user_id, deaddrop_id){
		console.log("refuseInvite",inviter_user_id, deaddrop_id);
		var inviteObj = {
			"inviter_user_id":inviter_user_id,
			"invitee_user_id":global.userObj.user_id,
			"deaddrop_id":deaddrop_id,
			"details": ""
		}
		
		deleteUrl(`/v1/user/${global.userObj.user_id}/invite`, inviteObj)
		.then(() => {
			this.displayActiveInvites()
		})
	}
}
var acceptInviteDisplay = new AcceptInviteDisplay()

