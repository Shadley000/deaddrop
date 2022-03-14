drop database deaddrop;
CREATE DATABASE deaddrop;
USE deaddrop;
drop user 'deaddrop'@'localhost';
create user 'deaddrop'@'localhost' identified by 'deaddroppassword';
GRANT all privileges  ON deaddrop . * TO 'deaddrop'@'localhost';
ALTER USER 'deaddrop'@'localhost' IDENTIFIED WITH mysql_native_password BY 'deaddroppassword';
FLUSH PRIVILEGES;

show grants for 'deaddrop'@'localhost';

CREATE TABLE users (
    user_id VARCHAR(64) NOT NULL,
    user_password VARCHAR(64) NOT NULL,
    email VARCHAR(64),
    PRIMARY KEY (user_id)
);

CREATE TABLE user2deaddrop (
    user_id VARCHAR(64) NOT NULL,
    deaddrop_id VARCHAR(64) NOT NULL,
    CONSTRAINT PRIMARY KEY (user_id , deaddrop_id)
);

CREATE TABLE deaddrop (
    deaddrop_id VARCHAR(64) NOT NULL,
    deaddrop_key VARCHAR(64) NOT NULL,
    CONSTRAINT PRIMARY KEY (deaddrop_id , deaddrop_key)
);

CREATE TABLE message (
    message_id INT NOT NULL AUTO_INCREMENT,
    deaddrop_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    publish_date DATETIME DEFAULT NOW(),
    title VARCHAR(64),
    message VARCHAR(2048),
    CONSTRAINT PRIMARY KEY (message_id)
);

insert into users (user_id, user_password, email) values ('admin', '0verl00k!2', 'stephenjhadley@gmail.com');
insert into user2key(user_id, deaddrop_id) values ('admin', 'public');
insert into user2key(user_id, deaddrop_id) values ('admin', 'adminbox');

insert into deaddrop (deaddrop_id, deaddrop_key) values ('adminbox', '3.1415926');
insert into message(deaddrop_id, user_id,publish_date,title,message) values ('adminbox', 'admin', now(),'Admin Only', 'Welcome Admin');

insert into deaddrop (deaddrop_id, deaddrop_key) values ('public', 'password');
insert into message(deaddrop_id, user_id,publish_date,title,message) values ('public', 'admin', now(),'Welcome to Deaddrop', 'Messages posted here are visible to all users');

insert into users (user_id, user_password, email) values ('anonymous', 'password', '');
insert into user2key(user_id, deaddrop_id, user_key) values ('anonymous', 'public');