

var nodeService  = require('./api-v1/services/nodeService').nodeService;

var root_node_id = "Test Rig 1"


function getChildren(parent_node_id, nodeList){
	return nodeList.filter((o) => {return o.parent_node_id === parent_node_id && o.node_id != o.parent_node_id})
}

function getNode(node_id, nodeList){
	return nodeList.find((o) => {return o.node_id === node_id})
}

function displayNode(nodeObj, nodeList, stackDepth){
	const indent = ''.padEnd(stackDepth*4);
	
	console.log(indent, nodeObj.node_name, nodeObj.node_id, nodeObj.parent_node_id);

	
	getChildren(nodeObj.node_id, nodeList).forEach(childObj => {
		displayNode(childObj, nodeList, stackDepth+1);
	});
}

nodeService.getFromRoot(root_node_id)
.then((nodeList) => {
	//console.log("final product:",results)
	
	rootnodeObj = nodeList[0];
	console.log("rootnodeObj:",rootnodeObj)
	var stackDepth = 0
	//console.log("children:",nodeService.getChildren(rootnodeObj.node_id, nodeList))
	displayNode(rootnodeObj, nodeList, stackDepth)
	
});

