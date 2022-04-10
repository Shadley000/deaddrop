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
    display_name VARCHAR(64) default null,
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
    permission_key VARCHAR(64) DEFAULT NULL, 
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

CREATE TABLE contacts (
	user_id VARCHAR(64) NOT NULL,
	contact_user_id VARCHAR(64) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (contact_user_id) REFERENCES users(user_id),
    PRIMARY KEY (user_id, contact_user_id)
);

CREATE TABLE deaddrop_invite (
	inviter_user_id VARCHAR(64) NOT NULL,
	invitee_user_id VARCHAR(64) NOT NULL,
    deaddrop_id VARCHAR(64) NOT NULL,
    details VARCHAR(64) NOT NULL,
    FOREIGN KEY (deaddrop_id) REFERENCES deaddrop(deaddrop_id),
    FOREIGN KEY (inviter_user_id) REFERENCES users(user_id),
    FOREIGN KEY (invitee_user_id) REFERENCES users(user_id),
    PRIMARY KEY (invitee_user_id,deaddrop_id)
);

insert into users (user_id, user_password, email, display_name) values ('admin', 'password', 'stephenjhadley@gmail.com', 'Administrator');
insert into users (user_id, user_password, email, display_name) values ('guest', 'password', 'guest@anywhere.com', 'A Guest');
insert into users (user_id, user_password, email, display_name) values ('testuser', 'password', 'somewhere@nowhere.com', 'TestUser');
insert into users (user_id, user_password, email, display_name) values ('banneduser', 'password', 'cubical666@inferno.com', 'Spanked');

insert into contacts (user_id, contact_user_id) values ('admin', 'testuser');
insert into contacts (user_id, contact_user_id) values ('admin', 'banneduser');
insert into contacts (user_id, contact_user_id) values ('testuser', 'banneduser');

INSERT INTO permissions (permission_id,permission_name,tags, permission_key) values ('SYS_ADMINISTRATOR','System adminstration','SYSTEM','password');
INSERT INTO permissions (permission_id,permission_name,tags, permission_key) values ('SYS_LOGIN','the most basic login priviledge','SYSTEM','password');
INSERT INTO permissions (permission_id,permission_name,tags, permission_key) values ('DEADDROP_ADMIN','is the user allowed to create a deaddrop','SYSTEM','password');
INSERT INTO permissions (permission_id,permission_name,tags, permission_key) values ('NODE_ADMIN','is the user allowed to administer node editor','SYSTEM','password');

INSERT INTO permissions (permission_id,permission_name,tags, permission_key) values ('admin maildrop','access to admin maildrop','DEADDROP MAILDROP','password');
INSERT INTO permissions (permission_id,permission_name,tags, permission_key) values ('public deaddrop','access to public deaddrop','DEADDROP','password');
INSERT INTO permissions (permission_id,permission_name,tags, permission_key) values ('some random deaddrop','access to some random deaddrop','DEADDROP','password');

insert into deaddrop (deaddrop_id, title) values ('admin maildrop', 'Administration Maildrop');
insert into deaddrop (deaddrop_id, title) values ('public deaddrop', 'Public Deaddrop');
insert into deaddrop (deaddrop_id, title) values ('some random deaddrop', 'Some Random Deaddrop');

insert into message(deaddrop_id, user_id,publish_date,title,message) values ('admin maildrop', 'admin', now(),'Admin Only', 'Welcome Admin');
insert into message(deaddrop_id, user_id,publish_date,title,message) values ('public deaddrop', 'admin', now(),'Welcome to Public Deaddrop', 'This deaddrop is open to all users. Messages posted here are visible to all users');
insert into message(deaddrop_id, user_id,publish_date,title,message) values ('some random deaddrop', 'admin', now(),'Welcome to Random Deaddrop', 'play nice');


insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'SYS_ADMINISTRATOR','CREATE READ UPDATE DELETE ADMIN');
insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'SYS_LOGIN','CREATE READ UPDATE DELETE ADMIN');
insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'DEADDROP_ADMIN','CREATE READ UPDATE DELETE ADMIN');
insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'NODE_ADMIN','CREATE READ UPDATE DELETE ADMIN');
insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'public deaddrop','CREATE READ UPDATE DELETE ADMIN');
insert into user_id2permission_id(user_id, permission_id, details) values ('admin', 'admin maildrop','CREATE READ UPDATE DELETE ADMIN');

insert into user_id2permission_id(user_id, permission_id, details) values ('guest', 'SYS_LOGIN','READ');
insert into user_id2permission_id(user_id, permission_id, details) values ('guest', 'public deaddrop','READ');

insert into user_id2permission_id(user_id, permission_id, details) values ('testuser', 'SYS_LOGIN','CREATE READ UPDATE DELETE');
insert into user_id2permission_id(user_id, permission_id, details) values ('testuser', 'DEADDROP_ADMIN','CREATE READ UPDATE DELETE');
insert into user_id2permission_id(user_id, permission_id, details) values ('testuser', 'public deaddrop','READ');
insert into user_id2permission_id(user_id, permission_id, details) values ('testuser', 'some random deaddrop','READ');

CREATE TABLE node_type (
    node_type VARCHAR(64),
    PRIMARY KEY (node_type)
);

insert into node_type( node_type) values ( "Root");
insert into node_type( node_type) values ( "Installation");
insert into node_type( node_type) values ( "Organization");
insert into node_type( node_type) values ( "Equipment");
insert into node_type( node_type) values ( "Acceptance");
insert into node_type( node_type) values ( "Deficiency");
insert into node_type( node_type) values ( "Status");
insert into node_type( node_type) values ( "Photograph");

CREATE TABLE node (
    node_id INT NOT NULL AUTO_INCREMENT,
    parent_node_id INT NOT NULL ,
    root_node_id INT NOT NULL ,
    node_name VARCHAR(256),
    node_type VARCHAR(64),
    creater_user_id VARCHAR(64) NOT NULL, 
    publish_date DATETIME DEFAULT NOW(),
    PRIMARY KEY (node_id),
	FOREIGN KEY (node_type)
        REFERENCES node_type (node_type)
  --  CONSTRAINT UC_Node UNIQUE (parent_node_id , node_name , node_type)
    );
insert into node (node_id, parent_node_id, root_node_id, node_name, node_type, creater_user_id) values (1,1,1,"Root", "Root", "admin");

ALTER table node Add FOREIGN KEY (parent_node_id)    REFERENCES node (node_id);
ALTER table node Add FOREIGN KEY (root_node_id)      REFERENCES node (node_id);
 
       
CREATE TABLE node_parameter (
    parameter_name VARCHAR(64) NOT NULL,
    node_id INT NOT NULL,
    parameter_value VARCHAR(2048),
    creater_user_id VARCHAR(64) NOT NULL, 
    publish_date DATETIME DEFAULT NOW(),
    PRIMARY KEY (node_id, parameter_name),
    FOREIGN KEY (node_id)
        REFERENCES node (node_id),
    CONSTRAINT UC_NodeParameter UNIQUE (node_id , parameter_name)
);



