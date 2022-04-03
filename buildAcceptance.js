const fs = require('fs'); 
const csv= require('fast-csv');
var nodeService  = require('./api-v1/services/nodeService').nodeService;
var nodeParameterService  = require('./api-v1/services/nodeParameterService').nodeParameterService;

async function loadCSV(filePath, rootnode_name){
	var stream = fs.createReadStream(filePath);
	var line=0;
	var user_id = "admin"
	var rows = [];

	nodeService.createRoot(user_id, rootnode_name)
	.then((root_node_id) => {
		console.log("root_node_id", root_node_id);
		
		csv.parseStream(stream, {headers : true})
		.on("data", function(data){
			//console.log(line, data);
			rows.push({
				"user_id": user_id, 
				"root_node_id": root_node_id, 
				"parent_node_name": data.parent_node_name.trim(),
				"node_name": data.node_name.trim(), 
				"node_type" : data.node_type.trim()
			});
			line++;
		})
		.on("end", () => {
			console.log("done loading data");
			//one_by_one(rows,buildNode );
			
		});
	})
	
	await new Promise(resolve => setTimeout(resolve, 1000));
	
	for(i=0; i<rows.length; i++){
		await buildNode(rows[i])
		await new Promise(resolve => setTimeout(resolve, 200));
	}
}

async function buildNode(row){
	return nodeService.findNodeByName(row.root_node_id, row.parent_node_name)
	.then((parentNodeObj) => {
		if(parentNodeObj){
			nodeService.addNode(row.user_id, parentNodeObj.node_id, row.root_node_id, row.node_name, row.node_type)
			.then((node_id)=>{
				console.log(`inserted node_id:'${node_id} node_name:'${row.node_name}'`);
				if(node_id){
					if(row.node_type == "Acceptance"){
						var parameter_name = "Status";
						var parameter_value = "Open";
						console.log("inserted parameter :",row.user_id,parameter_name, node_id, parameter_value);
						nodeParameterService.addParameter(row.user_id,parameter_name, node_id, parameter_value)
					}
				}
				
			})
		} else {
			console.log("Error", `root_node_id:'${row.root_node_id}' parent_node_name:'${row.parent_node_name}' not found`);
		}
		
	})
	
	.catch(err => {
		console.log("Error", err, row);
	})
}

function one_by_one(objects_array, iterator, callback) {
	var start_promise = objects_array.reduce(function (prom, object) {
		return prom.then(function () {
			return iterator(object);
		});
	}, Promise.resolve()); // initial
	if(callback){
		start_promise.then(callback);
	}else{
		return start_promise;
	}
}



console.log(process.argv);
var filePath = process.argv[2]
var rootnode_name = process.argv[3].trim()
loadCSV(filePath, rootnode_name)