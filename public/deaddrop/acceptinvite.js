const NAV_ACCEPT_INVITE = "acceptinvitedeaddrop"


function displayAcceptInvite() {
	if (data && data.userObj && data.userObj.permissions) {

		var html = ""
		html += "<h2>Invites</h2>"
		html += "<DIV id='inviteList_div'></DIV>"
		document.getElementById("article").innerHTML = html;

		displayActiveInvites()
		
	}
}


function displayActiveInvites(){
	
	getUrl(`/v1/user/${data.userObj.user_id}/invite`)
	.then(invites => {
		var html = "<TABLE>";

		for (var i = 0; i < invites.length; i++) {
			var inviteObj = invites[i];

			html += `<TR>`
			html += `<TD>${inviteObj.inviter_user_id}</TD>`
			html += `<TD>${inviteObj.deaddrop_id}</TD>`
			html += `<TD><button onclick='acceptInvite("${inviteObj.inviter_user_id}", "${inviteObj.deaddrop_id}")'>Accept</button></TD>`
			html += `<TD><button onclick='refuseInvite("${inviteObj.inviter_user_id}", "${inviteObj.deaddrop_id}")'>Refuse</button></TD>`
			html += '</TR>';

		}
		html += "</TABLE>";

		document.getElementById("inviteList_div").innerHTML = html;
	})
	
}


function acceptInvite(inviter_user_id, deaddrop_id){
	console.log("acceptInvite",inviter_user_id, deaddrop_id);
	
	var inviteObj = {
		"inviter_user_id":inviter_user_id,
		"invitee_user_id":data.userObj.user_id,
		"deaddrop_id":deaddrop_id,
		"details": ""
	}
	console.log(inviteObj)
	putUrl(`/v1/user/${data.userObj.user_id}/invite`, inviteObj)
	.then(() => {
		refreshPermissions()
		.then(()=> {
			displayActiveInvites()
		})
		
	})
	
}


function refuseInvite(inviter_user_id, deaddrop_id){
	console.log("refuseInvite",inviter_user_id, deaddrop_id);
	var inviteObj = {
		"inviter_user_id":inviter_user_id,
		"invitee_user_id":data.userObj.user_id,
		"deaddrop_id":deaddrop_id,
		"details": ""
	}
	
	deleteUrl(`/v1/user/${data.userObj.user_id}/invite`, inviteObj)
	.then(() => {
		displayActiveInvites()
	})
}


displayList.push({ "name": NAV_ACCEPT_INVITE, 	
	"action": displayAcceptInvite,			
	"audience":'private', 
	'permission_required': DEADDROP_ADMIN,	
	'title': 'Accept Invites', 
	'Navbar':true   },
);
