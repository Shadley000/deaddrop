use deaddrop;
select * from users;

select * from user2deaddrop;

select * from deaddrop;

select * from session_store;

select * from message;

select * from permissions;

select * from deaddrop_invite;

select * from node;

select * from node where parent_node_id = 2

SELECT *  FROM node where node_name = "Test Rig 1" and node_id = root_node_id order by node_id

select * from node_parameter;


SELECT node_id,parent_node_id, root_node_id, node_name, node_type,  creater_user_id, publish_date 
			 FROM node where node_name = "Test Rig 1" AND root_node_id = 2;
             
             
-- INSERT into node_parameter ( parameter_name,node_id,parameter_value,creater_user_id)  VALUES ("Description", 2, "a really nice rig", "admin")

-- update node set node_type = "Installation" where node_id = 2
