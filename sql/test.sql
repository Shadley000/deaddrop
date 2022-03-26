use deaddrop;
select * from users;

select * from user2deaddrop;

select * from deaddrop;

select * from session_store;

select * from message;

SELECT    d.deaddrop_id, d.title
 FROM    user_id2permission_id p,    deaddrop d
			 WHERE   p.permission_id = d.deaddrop_id
			 AND p.user_id = 'admin'
			 AND d.deaddrop_id = 'administration deaddrop'