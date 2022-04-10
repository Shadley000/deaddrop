

var nodeService  = require('./api-v1/services/nodeService').nodeService;

var root_node_id = "Test Rig 1"

function getChildren(node_id, nodeList){
	return nodeList.filter((o) => {return o.parent_node_id == node_id && node_id != o.root_node_id})
}

function getNode(node_id, nodeList){
	return nodeList.filter((o) => {return o.node_id == node_id})
}

function displayNode(node_id, nodeList, stackDepth){
	var nodeObj = getNode(node_id, nodeList)
	if(!nodeObj) return;
	console.log(nodeObj.node_name);
	console.log("Stack depth:", stackDepth);
	if (stackDepth >5) return
	var children = getChildren(node_id, nodeList);
	
	for(i =0; i< children.length; i++) {
		displayNode(children[i].node_id, nodeList, stackDepth+1);
	}
}

nodeService.getFromRoot(root_node_id)
.then((nodeList) => {
	//console.log("final product:",results)
	
	rootnodeObj = nodeList[0];
	console.log("rootnodeObj:",rootnodeObj)
	var stackDepth = 0
	//console.log("children:",nodeService.getChildren(rootnodeObj.node_id, nodeList))
	displayNode("2", nodeList, stackDepth)
	
});

