use deaddrop;
select * from users;

select * from user2deaddrop;

select * from deaddrop;

select * from message;

SELECT    d.deaddrop_id, m.user_id, m.message_id, m.title, m.message, m.publish_date
FROM    user2deaddrop k,    deaddrop d,    message m
WHERE
    k.deaddrop_id = m.deaddrop_id
    AND k.deaddrop_id = d.deaddrop_id
    AND k.user_id = 'admin'
order by d.deaddrop_id, m.publish_date
        

