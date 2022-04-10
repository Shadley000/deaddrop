const NAV_NODES = "nodes";

console.log(NAV_NODES);

function displayNodes() {
	var root_node_name = "Test Rig 1";
	
	getUrl(`/v1/node/${root_node_name}`)
	.then(nodeList => {
		var html = "";
		console.log(nodeList.length);
		if(nodeList.length>0){
			html += displayNode(nodeList[0], nodeList)
		}
		document.getElementById("article").innerHTML = html;
		
	})
	.catch(function(err) {
		console.log('error: ' + err);
		document.getElementById("article").innerHTML = `<h3>Error</H3><p>${err}</p>`;
	});
}

function displayNode(nodeObj, nodeList){
	console.log(`nodeObj.node_id:${nodeObj.node_id}`);
	
	var html =  `<DIV id="${nodeObj.node_id}_div" onclick="divClick(${nodeObj.node_id})">`
	html += `${nodeObj.node_id} ${nodeObj.node_name} ${nodeObj.parent_node_id}`;
	
	
	html += `<UL>`;
	getChildren(nodeObj.node_id, nodeList).forEach(childObj => {
		html += `<LI>${displayNode(childObj, nodeList)}</LI>`
	});
	html += `</UL>`;

	html+= "</DIV>"
	return html;
}


function getChildren(parent_node_id, nodeList){
	return nodeList.filter((o) => {return o.parent_node_id === parent_node_id && o.node_id != o.parent_node_id})
}

function getNode(node_id, nodeList){
	return nodeList.find((o) => {return o.node_id === node_id})
}

function divClick(node_id){
	console.log(node_id);
}

displayList.push({ "name": NAV_NODES, 
	"action": displayNodes,
	"audience":'private', 
	'permission_required': NODE_ADMIN,	
	'title': 'Nodes', 
	'Navbar':'top'});