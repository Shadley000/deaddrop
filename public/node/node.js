const NAV_NODES = "nodes";

console.log(NAV_NODES);

function displayNodes() {
	var root_node_name = "Test Rig 1";
	
	getUrl(`/v1/node/${root_node_name}`)
	.then(newNodeData => {
		console.log(newNodeData);
		newNodeData.nodeObjList.forEach(nodeObj => {
			var oldNodeObj = getNode(nodeObj.node_id);
			if(oldNodeObj) {
				nodeObj.isExpanded = oldNodeObj.isExpanded;
			}
		});
		data.nodeData = newNodeData;
		
		var html = ""
		html += `<img src="./images/refresh32x32.jpg" float="left" onclick='clickRefresh()'>`
		html += `<DIV id='node_tree_div'></DIV>`
		document.getElementById("article").innerHTML = html;
		
		if(data.nodeData && data.nodeData.nodeObjList && data.nodeData.nodeObjList.length>0){
			document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
		}
	})
	.catch(function(err) {
		console.log('error: ' + err);
		document.getElementById("article").innerHTML = `<h3>Error</H3><p>${err}</p>`;
	});
}

function addEquipmentAdminButtons(nodeObj){
	//const nodePermissionObj = data.userObj.permissions.find(permission => permission.tags.includes(SYS_TAGS_DEADDROP));
			
	//if (nodePermissionObj) {
	//	data.selected_deaddrop_id = nodePermissionObj.permission_id.trim();
	//}
	var html = `<button onclick='deleteEquipment("${nodeObj.node_id}")'>Delete Equipment</button>`
	+ `<button onclick='addEquipment("${nodeObj.node_id}")'>Add Equipment</button>`
	return html;	
}

function addOrganizationAdminButtons(nodeObj){
	var html = `<button onclick='deleteOrganization("${nodeObj.node_id}")'>Delete Organization</button>`
	+ `<button onclick='addOrganization("${nodeObj.node_id}")'>Add Organization</button><br>`
	return html;	
}

function addAcceptanceAdminButtons(nodeObj){
	var html = `<button onclick='deleteAcceptance("${nodeObj.node_id}")'>Delete Acceptance</button>`
			 + `<button onclick='addAcceptance("${nodeObj.node_id}")'>Add Acceptance</button><br>`
	return html;	
}

function addPhotoCommentButtons(nodeObj){
	var html = `<img src="./images/photo16x16.jpg" float="left" onclick='addPicture("${nodeObj.node_id}")'>`
			+ `<img src="./images/comment16x16.jpg" float="left" onclick='addComment("${nodeObj.node_id}")'>`
	return html;	
}

function addDeficiencyButtons(nodeObj){
	var html = `<img src="./images/deficiency16x16.jpg" float="left" onclick='addDeficiency("${nodeObj.node_id}")'>`
	return html;	
}

function displayNode(nodeObj){
	//console.log(`nodeObj.node_id:${nodeObj.node_id}`);
	
	var html =  `<DIV id="${nodeObj.node_id}_div" >`
	html += `${nodeObj.node_name}<BR>`;
	if(nodeObj.isExpanded) {
		html += `<img src="./images/collapse16x16.jpg" alt="deaddrop" float="left" onclick='collapseNode("${nodeObj.node_id}")'>`
		
		var nodeParameters = getParameters(nodeObj.node_id);
		
		if(nodeObj.node_type == 'Root') {
		} else if(nodeObj.node_type == 'Installation') {
			html += "<BR>"
			html += addOrganizationAdminButtons(nodeObj)
			html += addPhotoCommentButtons(nodeObj)
		} else if(nodeObj.node_type == 'Organization') {
			html += "<BR>"
			html += addEquipmentAdminButtons()
			html += addOrganizationAdminButtons(nodeObj)
			html += addPhotoCommentButtons(nodeObj)
			html += addDeficiencyButtons(nodeObj)
			// REPORT of child Acceptances
			// REPORT of child deficiencies
		} else if(nodeObj.node_type == 'Equipment') {
			html += "<BR>"
			html += `<TABLE>`
			html += `<TR><TH>Manufacturer</TH><TD>${getParameterName("Manufacturer", nodeParameters)}</TD></TR>`
			html += `<TR><TH>Model Number</TH><TD>${getParameterName("Model Number", nodeParameters)}</TD></TR>`
			html += `<TR><TH>Serial Number</TH><TD>${getParameterName("Serial Number", nodeParameters)}</TD></TR>`
			html += `<TR><TH>Name</TH><TD>${getParameterName("Name", nodeParameters)}</TD></TR>`
			html += `<TR><TH>Location</TH><TD>${getParameterName("Location", nodeParameters)}</TD></TR>`
			html += `</TABLE>`
			html += addAcceptanceAdminButtons(nodeObj)
			html += addPhotoCommentButtons(nodeObj)
			html += addDeficiencyButtons(nodeObj)
			// REPORT of child Acceptances
			// REPORT of child deficiencies
		} else if(nodeObj.node_type == 'Acceptance') {
			var statusImage
			if(acceptance_status == "PASS")			statusImage = `"/images/pass16x16.jpg`
			else if (acceptance_status == "FAIL")	statusImage = `./images/fail16x16.jpg`
			else if (acceptance_status == "N/A")	statusImage = `./images/notapplicable16x16.jpg`
			else 									statusImage = `./images/open16x16.jpg`
			html += "<BR>"
			var acceptance_status = getParameterName("Status", nodeParameters)
			html += `<TABLE>`
			html += `<TR><TD colspan=2><img src="${statusImage}" float="left"'></TD></TR>`
			html += `<TR><TD ${descriptionObj.publish_date}</TD><TD>${descriptionObj.creater_user_id}</TD></TR>`
			html += `<TR><TD colspan=2>${descriptionObj.parameter_value}</TD></TR>`
			html += `</TABLE>`
			html += addPhotoCommentButtons(nodeObj)
			html += addDeficiencyButtons(nodeObj)
			
			//user id
			//update status  PASS, FAIL, N/A, OPEN    INSPECTOR_ONLY
		} else if(nodeObj.node_type == 'Deficiency') {
			html += "<BR>"
			var descriptionObj = getParameterName("description", nodeParameters)
			var statusObj = getParameterName("status", nodeParameters)
			var criticalityObj = getParameterName("criticality", nodeParameters)
			html += `<TABLE>`
			html += `<TR><TD ${descriptionObj.publish_date}</TD><TD>${descriptionObj.creater_user_id}</TD></TR>`
			html += `<TR><TD>${statusObj.parameter_value}</TD><TD>${criticalityObj.parameter_value}</TD></TR>`
			html += `<TR><TD colspan=2>${descriptionObj.parameter_value}</TD></TR>`
			html += `</TABLE>`
			//update status  OPEN CLOSED    INSPECTOR_ONLY
			html += addPhotoCommentButtons(nodeObj)
		} else if(nodeObj.node_type == 'Comment') {
			var descriptionObj = getParameterName("descriptionObj", nodeParameters)
			
			html += `<TABLE>`
			html += `<TR><TD ${descriptionObj.publish_date}</TD><TD>${descriptionObj.creater_user_id}</TD></TR>`
			html += `<TR><TD colspan=2>${descriptionObj.parameter_value}</TD></TR>`
			html += `</TABLE>`
			
			html += addPhotoCommentButtons(nodeObj)
		} else if(nodeObj.node_type == 'Photograph') {
			var photoUrlObj = getParameterName("photoUrl", nodeParameters)
			var captionObj = getParameterName("caption", nodeParameters)
			
			html += `<TABLE>`
			html += `<TR><TD colspan=2><img src="${photoUrlObj.parameter_value}" float="left"'></TD></TR>`
			html += `<TR><TD ${photoUrlObj.publish_date}</TD><TD>${photoUrlObj.creater_user_id}</TD></TR>`
			html += `<TR><TD colspan=2>${captionObj.parameter_value}</TD></TR>`
			html += `</TABLE>`
			html += addPhotoCommentButtons(nodeObj)
		}
	} else {
		html += `<img src="./images/expand16x16.jpg" alt="deaddrop" float="left" onclick='expandNode("${nodeObj.node_id}")'>`
	}
	
	if(nodeParameters){
		html += `<table>`;
		nodeParameters.forEach(p => {
			html += `<TR>`;
			html += `<TD>${p.parameter_name}</TD>`;
			html += `<TD>${p.parameter_value}</TD>`;
			html += `<TD>${p.creater_user_id}</TD>`;
			html += `<TD>${p.publish_date}</TD>`;
			html += `<TR>`;
		});
		html += `<table>`;
	} 
	else {
		html += `no parameters`;
	}
	
	if(nodeObj.isExpanded) {
		html += `<UL>`;
		getChildren(nodeObj.node_id).forEach(childObj => {
			html += `<LI>${displayNode(childObj)}</LI>`
		});
		html += `</UL>`;
	}
	html+= "</DIV>"
	return html;
}

function clickRefresh(){
	displayNodes()
}

function getParameterName(parameter_name, nodeParameters){
	if(!nodeParameters) return [];
	return nodeParameters.find((o) => {return o.parameter_name === parameter_name})
}

function getParameters(node_id){
	if(!data.nodeData || !data.nodeData.parameterList) return [];
	return data.nodeData.parameterList.filter((o) => {return o.node_id === node_id})
}

function getChildren(parent_node_id){
	if(!data.nodeData || !data.nodeData.nodeObjList) return [];
	return data.nodeData.nodeObjList.filter((o) => {return o.parent_node_id === parent_node_id && o.node_id != o.parent_node_id})
}

function getNode(node_id){
	if(!data.nodeData || !data.nodeData.nodeObjList) return undefined;
	return data.nodeData.nodeObjList.find((o) => {return o.node_id == node_id})
}

function getRoot() { if(data.nodeData) return data.nodeData.nodeObjList[0]; else return undefined;}

function expandNode(node_id){
	var nodeObj = getNode(node_id)
	console.log("expandNode",node_id,nodeObj);
	nodeObj.isExpanded = true;
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function collapseNode(node_id){
	var nodeObj = getNode(node_id)
	console.log("collapseNode",node_id,nodeObj);
	nodeObj.isExpanded = false;
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function addInstallation(node_id){
	var nodeObj = getNode(node_id)
	console.log("addInstallation",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function addOrganization(node_id){
	var nodeObj = getNode(node_id)
	console.log("addOrganization",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function deleteOrganization(node_id){
	var nodeObj = getNode(node_id)
	console.log("deleteOrganization",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function addEquipment(node_id){
	var nodeObj = getNode(node_id)
	console.log("addEquipment",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function deleteEquipment(node_id){
	var nodeObj = getNode(node_id)
	console.log("deleteEquipment",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function deleteAcceptance(node_id){
	var nodeObj = getNode(node_id)
	console.log("deleteAcceptance",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function addAcceptance(node_id){
	var nodeObj = getNode(node_id)
	console.log("addAcceptance",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function updateAcceptance(node_id,newstatus){
	var nodeObj = getNode(node_id)
	console.log("updateAcceptance",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function addDeficiency(node_id){
	var nodeObj = getNode(node_id)
	console.log("addDeficiency",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}
function updateDeficiency(node_id,newstatus){
	var nodeObj = getNode(node_id)
	console.log("updateDeficiency",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function addPicture(node_id){
	var nodeObj = getNode(node_id)
	console.log("addPicture",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

function addComment(node_id){
	var nodeObj = getNode(node_id)
	console.log("addComment",node_id,nodeObj);
	document.getElementById("node_tree_div").innerHTML = displayNode(getRoot())
}

displayList.push({ "name": NAV_NODES, 
	"action": displayNodes,
	"audience":'private', 
	'permission_required': NODE_USER,	
	'title': 'Nodes', 
	'Navbar':'top'});