
class NodeDisplay {
	
	constructor(){
		this.name = "NAV_NODES";
		
		this.audience='private'
		this.permission_required='NODE_USER'
		this.title='Nodes'
		this.Navbar='top'
		this.nodeData = undefined
	}
	
	 display() {
		var root_node_name = "Test Rig 1";
		
		getUrl(`/v1/node/${root_node_name}`)
		.then(newNodeData => {
			console.log(newNodeData);
			newNodeData.nodeObjList.forEach(nodeObj => {
				var oldNodeObj = this.getNode(nodeObj.node_id);
				if(oldNodeObj) {
					nodeObj.isExpanded = oldNodeObj.isExpanded;
				}
			});
			this.nodeData = newNodeData;
			
			var html = ""
			html += `<img src="./images/refresh32x32.jpg" float="left" onclick='clickRefresh()'>`
			html += `<DIV id='node_tree_div'></DIV>`
			document.getElementById("article").innerHTML = html;
			
			if(this.nodeData && this.nodeData.nodeObjList && this.nodeData.nodeObjList.length>0){
				document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
			}
		})
		.catch(function(err) {
			console.log('error: ' + err);
			document.getElementById("article").innerHTML = `<h3>Error</H3><p>${err}</p>`;
		});
	}

	 addEquipmentAdminButtons(nodeObj){
		
		var html = `<button onclick='deleteEquipment("${nodeObj.node_id}")'>Delete Equipment</button>`
		+ `<button onclick='nodeDisplay.addEquipment("${nodeObj.node_id}")'>Add Equipment</button>`
		return html;	
	}

	 addOrganizationAdminButtons(nodeObj){
		var html = `<button onclick='nodeDisplay.deleteOrganization("${nodeObj.node_id}")'>Delete Organization</button>`
		+ `<button onclick='nodeDisplay.addOrganization("${nodeObj.node_id}")'>Add Organization</button><br>`
		return html;	
	}

	 addAcceptanceAdminButtons(nodeObj){
		var html = `<button onclick='nodeDisplay.deleteAcceptance("${nodeObj.node_id}")'>Delete Acceptance</button>`
				 + `<button onclick='nodeDisplay.addAcceptance("${nodeObj.node_id}")'>Add Acceptance</button><br>`
		return html;	
	}

	 addPhotoCommentButtons(nodeObj){
		var html = `<img src="./images/photo16x16.jpg" float="left" onclick='nodeDisplay.addPicture("${nodeObj.node_id}")'>`
				+ `<img src="./images/comment16x16.jpg" float="left" onclick='nodeDisplay.addComment("${nodeObj.node_id}")'>`
		return html;	
	}

	 addDeficiencyButtons(nodeObj){
		var html = `<img src="./images/deficiency16x16.jpg" float="left" onclick='nodeDisplay.addDeficiency("${nodeObj.node_id}")'>`
		return html;	
	}

	 displayNode(nodeObj){
		//console.log(`nodeObj.node_id:${nodeObj.node_id}`);
		
		var html =  `<DIV id="${nodeObj.node_id}_div" >`
		html += `${nodeObj.node_name}<BR>`;
		if(nodeObj.isExpanded) {
			html += `<img src="./images/collapse16x16.jpg" alt="deaddrop" float="left" onclick='nodeDisplay.collapseNode("${nodeObj.node_id}")'>`
			
			var nodeParameters = this.getParameters(nodeObj.node_id);
			
			if(nodeObj.node_type == 'Root') {
			} else if(nodeObj.node_type == 'Installation') {
				html += "<BR>"
				html += this.addOrganizationAdminButtons(nodeObj)
				html += this.addPhotoCommentButtons(nodeObj)
			} else if(nodeObj.node_type == 'Organization') {
				html += "<BR>"
				html += this.addEquipmentAdminButtons(nodeObj)
				html += this.addOrganizationAdminButtons(nodeObj)
				html += this.addPhotoCommentButtons(nodeObj)
				html += this.addDeficiencyButtons(nodeObj)
				// REPORT of child Acceptances
				// REPORT of child deficiencies
			} else if(nodeObj.node_type == 'Equipment') {
				html += "<BR>"
				html += `<TABLE>`
				html += `<TR><TH>Manufacturer</TH><TD>${nodeDisplay.getParameterName("Manufacturer", nodeParameters)}</TD></TR>`
				html += `<TR><TH>Model Number</TH><TD>${nodeDisplay.getParameterName("Model Number", nodeParameters)}</TD></TR>`
				html += `<TR><TH>Serial Number</TH><TD>${nodeDisplay.getParameterName("Serial Number", nodeParameters)}</TD></TR>`
				html += `<TR><TH>Name</TH><TD>${nodeDisplay.getParameterName("Name", nodeParameters)}</TD></TR>`
				html += `<TR><TH>Location</TH><TD>${nodeDisplay.getParameterName("Location", nodeParameters)}</TD></TR>`
				html += `</TABLE>`
				html += this.addAcceptanceAdminButtons(nodeObj)
				html += this.addPhotoCommentButtons(nodeObj)
				html += this.addDeficiencyButtons(nodeObj)
				// REPORT of child Acceptances
				// REPORT of child deficiencies
			} else if(nodeObj.node_type == 'Acceptance') {
				var statusImage
				if(acceptance_status == "PASS")			statusImage = `"/images/pass16x16.jpg`
				else if (acceptance_status == "FAIL")	statusImage = `./images/fail16x16.jpg`
				else if (acceptance_status == "N/A")	statusImage = `./images/notapplicable16x16.jpg`
				else 									statusImage = `./images/open16x16.jpg`
				html += "<BR>"
				var acceptance_status = this.getParameterName("Status", nodeParameters)
				html += `<TABLE>`
				html += `<TR><TD colspan=2><img src="${statusImage}" float="left"'></TD></TR>`
				html += `<TR><TD ${descriptionObj.publish_date}</TD><TD>${descriptionObj.creater_user_id}</TD></TR>`
				html += `<TR><TD colspan=2>${descriptionObj.parameter_value}</TD></TR>`
				html += `</TABLE>`
				html += this.addPhotoCommentButtons(nodeObj)
				html += this.addDeficiencyButtons(nodeObj)
				
				//user id
				//update status  PASS, FAIL, N/A, OPEN    INSPECTOR_ONLY
			} else if(nodeObj.node_type == 'Deficiency') {
				html += "<BR>"
				var descriptionObj = this.getParameterName("description", nodeParameters)
				var statusObj = this.getParameterName("status", nodeParameters)
				var criticalityObj = this.getParameterName("criticality", nodeParameters)
				html += `<TABLE>`
				html += `<TR><TD ${descriptionObj.publish_date}</TD><TD>${descriptionObj.creater_user_id}</TD></TR>`
				html += `<TR><TD>${statusObj.parameter_value}</TD><TD>${criticalityObj.parameter_value}</TD></TR>`
				html += `<TR><TD colspan=2>${descriptionObj.parameter_value}</TD></TR>`
				html += `</TABLE>`
				//update status  OPEN CLOSED    INSPECTOR_ONLY
				html += this.addPhotoCommentButtons(nodeObj)
			} else if(nodeObj.node_type == 'Comment') {
				var descriptionObj = this.getParameterName("descriptionObj", nodeParameters)
				
				html += `<TABLE>`
				html += `<TR><TD ${descriptionObj.publish_date}</TD><TD>${descriptionObj.creater_user_id}</TD></TR>`
				html += `<TR><TD colspan=2>${descriptionObj.parameter_value}</TD></TR>`
				html += `</TABLE>`
				
				html += this.addPhotoCommentButtons(nodeObj)
			} else if(nodeObj.node_type == 'Photograph') {
				var photoUrlObj = this.getParameterName("photoUrl", nodeParameters)
				var captionObj = this.getParameterName("caption", nodeParameters)
				
				html += `<TABLE>`
				html += `<TR><TD colspan=2><img src="${photoUrlObj.parameter_value}" float="left"'></TD></TR>`
				html += `<TR><TD ${photoUrlObj.publish_date}</TD><TD>${photoUrlObj.creater_user_id}</TD></TR>`
				html += `<TR><TD colspan=2>${captionObj.parameter_value}</TD></TR>`
				html += `</TABLE>`
				html += this.addPhotoCommentButtons(nodeObj)
			}
		} else {
			html += `<img src="./images/expand16x16.jpg" alt="deaddrop" float="left" onclick='nodeDisplay.expandNode("${nodeObj.node_id}")'>`
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
			this.getChildren(nodeObj.node_id).forEach(childObj => {
				html += `<LI>${nodeDisplay.displayNode(childObj)}</LI>`
			});
			html += `</UL>`;
		}
		html+= "</DIV>"
		return html;
	}

	 clickRefresh(){
		this.displayNodes()
	}

	 getParameterName(parameter_name, nodeParameters){
		if(!nodeParameters) return [];
		return nodeParameters.find((o) => {return o.parameter_name === parameter_name})
	}

	 getParameters(node_id){
		if(!this.nodeData || !this.nodeData.parameterList) return [];
		return this.nodeData.parameterList.filter((o) => {return o.node_id === node_id})
	}

	 getChildren(parent_node_id){
		if(!this.nodeData || !this.nodeData.nodeObjList) return [];
		return this.nodeData.nodeObjList.filter((o) => {return o.parent_node_id === parent_node_id && o.node_id != o.parent_node_id})
	}

	 getNode(node_id){
		if(!this.nodeData || !this.nodeData.nodeObjList) return undefined;
		return this.nodeData.nodeObjList.find((o) => {return o.node_id == node_id})
	}

	 getRoot() { if(this.nodeData) return this.nodeData.nodeObjList[0]; else return undefined;}

	 expandNode(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("expandNode",node_id,nodeObj);
		nodeObj.isExpanded = true;
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 collapseNode(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("collapseNode",node_id,nodeObj);
		nodeObj.isExpanded = false;
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 addInstallation(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("addInstallation",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 addOrganization(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("addOrganization",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 deleteOrganization(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("deleteOrganization",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 addEquipment(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("addEquipment",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 deleteEquipment(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("deleteEquipment",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 deleteAcceptance(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("deleteAcceptance",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 addAcceptance(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("addAcceptance",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 updateAcceptance(node_id,newstatus){
		var nodeObj = this.getNode(node_id)
		console.log("updateAcceptance",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 addDeficiency(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("addDeficiency",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}
	 updateDeficiency(node_id,newstatus){
		var nodeObj = this.getNode(node_id)
		console.log("updateDeficiency",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 addPicture(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("addPicture",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}

	 addComment(node_id){
		var nodeObj = this.getNode(node_id)
		console.log("addComment",node_id,nodeObj);
		document.getElementById("node_tree_div").innerHTML = this.displayNode(this.getRoot())
	}
}

var nodeDisplay = new NodeDisplay()

