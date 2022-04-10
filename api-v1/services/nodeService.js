var toolKit = require('./toolKit').toolKit;

const nodeService = {
	createRoot(user_id, node_name){
		return new Promise(function(resolve, reject) {
			var nodeObj = {
				'parent_node_id': 1, 
				'root_node_id':1, 
				'node_name':node_name, 
				'node_type':"Root",  
				'creater_user_id':user_id
			}
			var sql = 'insert into node SET ?';
			
			var connection = toolKit.getConnection();
			connection.query(sql, nodeObj, 
			function(error, results, fields) {
				if (error) {
					return reject(error);
				}
				if(results){
					var node_id = results.insertId;
					updateANode(user_id, node_id, node_id, node_id, node_name, "Root")
					.then(() => {
						resolve(node_id);
					})
				} else {
					resolve();
				}
			});
			connection.end();
		});
	},
	
	getFromRoot(root_node_name){
		
		return new Promise(function(resolve, reject) {
			var sql = 'SELECT *  FROM node where node_name = ? and node_id = root_node_id order by node_id'
			
			var connection = toolKit.getConnection();
			connection.query(sql, [root_node_name], function(error, results, fields) {
				if (error) {
					return reject(error);
				}
				if(results && results.length>0){
						sql = 'SELECT * FROM node where root_node_id = ? order by node_id'
						connection.query(sql, [results[0].root_node_id], function(error, results, fields) {
							if (error) {
								return reject(error);
							}
							resolve(results);
							connection.end();
						});
				} else {
					console.log("ERROR no results for ",root_node_name);
					resolve();
				}
			});
			
		});
	},
	
	findNodeByName(root_node_id, node_name){
		return new Promise(function(resolve, reject) {
			var sql = 'SELECT node_id,parent_node_id, root_node_id, node_name, node_type,  creater_user_id, publish_date '
			+' FROM node where node_name = ? AND root_node_id = ?'
			
			var connection = toolKit.getConnection();
			connection.query(sql, [node_name, root_node_id], 
			function(error, results, fields) {
				if (error) {
					return reject(error);
				}
				if(results && results.length>0){
					resolve(results[0]);
				} else {
					resolve();
				}
			});
			connection.end();
		});
	},
	
	addNode(user_id, parent_node_id, root_node_id, node_name, node_type) {
		return new Promise(function(resolve, reject) {
			var nodeObj = {
				'parent_node_id': parent_node_id, 
				'root_node_id':root_node_id, 
				'node_name':node_name, 
				'node_type':node_type,  
				'creater_user_id':user_id
			}
			var sql = 'insert into node SET ?';
			
			var connection = toolKit.getConnection();
			connection.query(sql, nodeObj, 
			function(error, results, fields) {
				if (error) {
					return reject(error);
				}
				if(results) resolve(results.insertId);
				else resolve();
			});
			connection.end();
		});
	},
	
	getNode(node_id){
		return getANode(node_id);
	},
	
	updateNode(user_id, node_id, parent_node_id, root_node_id, node_name, node_type) {
		return updateANode(node_id, parent_node_id, root_node_id, node_name, node_type, user_id)
	},
	
	getChildren(parent_node_id, nodeList){
	return nodeList.filter((o) => {return o.parent_node_id == parent_node_id})
}

	
};

function getChildren(parent_node_id, nodeList){
	return nodeList.filter((o) => {return o.parent_node_id == parent_node_id})
}

function findANode(node_id, rootNodeObj){
	return undefined;
}

function updateANode(user_id, node_id, parent_node_id, root_node_id, node_name, node_type) {
	return new Promise(function(resolve, reject) {
		
		var sql = 'UPDATE node SET parent_node_id =?, root_node_id =?, node_name=?, node_type=?, creater_user_id=?, '
		+' publish_date = now() WHERE node_id = ?';
		
		var connection = toolKit.getConnection();
		connection.query(sql, [parent_node_id, root_node_id, node_name, node_type, user_id, node_id], 
		function(error, results, fields) {
			if (error) {
				return reject(error);
			}
			resolve();
			
		});
		connection.end();
	});
}

function getANode(node_id){
	return new Promise(function(resolve, reject) {
		var sql = 'SELECT node_id,parent_node_id, root_node_id, node_name, node_type,  creater_user_id, publish_date '
		+' FROM node where node_id = ?'
		
		var connection = toolKit.getConnection();
		connection.query(sql, [node_id], 
		function(error, results, fields) {
			if (error) {
				return reject(error);
			}
			if(results&& results.length>0){
				resolve(results[0]);
			} else {
				resolve();
			}
		});
		connection.end();
	});
}

module.exports = { nodeService };