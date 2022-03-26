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
    is_verified int,
    PRIMARY KEY (user_id)
);

CREATE TABLE session_store (
    session_id INT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(64) NOT NULL,
    authentication_token  VARCHAR(64) NOT NULL,
    touch_date TIMESTAMP DEFAULT NOW(),
    CONSTRAINT PRIMARY KEY (session_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE permissions (
	permission_id VARCHAR(64) NOT NULL,
    permission_name VARCHAR(64) NOT NULL,
    tags VARCHAR(256) default NULL,
    CONSTRAINT PRIMARY KEY (permission_id)
);

CREATE TABLE user_id2permission_id (
    user_id VARCHAR(64) NOT NULL,
    permission_id VARCHAR(64) NOT NULL,
    details VARCHAR(64) NOT NULL,
    CONSTRAINT PRIMARY KEY (user_id , permission_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE deaddrop (
    deaddrop_id VARCHAR(64) NOT NULL,
    title VARCHAR(64) DEFAULT NULL,    
    deaddrop_key VARCHAR(64) DEFAULT NULL, 
    CONSTRAINT PRIMARY KEY (deaddrop_id)
);

CREATE TABLE message (
    message_id INT NOT NULL AUTO_INCREMENT,
    deaddrop_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    publish_date DATETIME DEFAULT NOW(),
    title VARCHAR(64),
    message VARCHAR(2048),
    CONSTRAINT PRIMARY KEY (message_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (deaddrop_id) REFERENCES deaddrop(deaddrop_id)
);

insert into users (user_id, user_password, email) values ('admin', 'password', 'stephenjhadley@gmail.com');
insert into users (user_id, user_password, email) values ('guest', 'password', 'guest@anywhere.com');
insert into users (user_id, user_password, email) values ('testuser', 'password', 'somewhere@nowhere.com');
insert into users (user_id, user_password, email) values ('banneduser', 'password', 'cubical666@inferno.com');

INSERT INTO permissions (permission_id,permission_name,tags) values ('sys_administrator','System adminstration','SYSTEM');
INSERT INTO permissions (permission_id,permission_name,tags) values ('sys_login','is the user allowed to login','SYSTEM');
INSERT INTO permissions (permission_id,permission_name,tags) values ('sys_create_deaddrop','is the user allowed to create a deaddrop','SYSTEM');

INSERT INTO permissions (permission_id,permission_name,tags) values ('administration deaddrop','access to admin deaddrop','DEADDROP');
INSERT INTO permissions (permission_id,permission_name,tags) values ('public deaddrop','access to public deaddrop','DEADDROP');
INSERT INTO permissions (permission_id,permission_name,tags) values ('some random deaddrop','access to some random deaddrop','DEADDROP');

insert into deaddrop (deaddrop_id, title,deaddrop_key) values ('administration deaddrop', 'title administration deaddrop', 'supersecretpassword');
insert into deaddrop (deaddrop_id, title,deaddrop_key) values ('public deaddrop', 'title public deaddrop', 'password');
insert into deaddrop (deaddrop_id, title,deaddrop_key) values ('some random deaddrop', 'title some random deaddrop', 'password');

insert into message(deaddrop_id, user_id,publish_date,title,message) values ('administration deaddrop', 'admin', now(),'Admin Only', 'Welcome Admin');
insert into message(deaddrop_id, user_id,publish_date,title,message) values ('public deaddrop', 'admin', now(),'Welcome to Public Deaddrop', 'This deaddrop is open to all users. Messages posted here are visible to all users');
insert into message(deaddrop_id, user_id,publish_date,title,message) values ('some random deaddrop', 'admin', now(),'Welcome to Random Deaddrop', 'play nice');


insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'sys_administrator','');
insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'sys_login','');
insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'sys_create_deaddrop','');
insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'public deaddrop','');
insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'administration deaddrop','');

insert into user_id2permission_id(user_id, permission_id, details) values ('guest', 'sys_login','');
insert into user_id2permission_id(user_id, permission_id, details) values ('guest', 'public deaddrop','');

insert into user_id2permission_id(user_id, permission_id, details) values ('testuser', 'sys_login','');
insert into user_id2permission_id(user_id, permission_id, details) values ('testuser', 'public deaddrop','');
insert into user_id2permission_id(user_id, permission_id, details) values ('testuser', 'some random deaddrop','');







