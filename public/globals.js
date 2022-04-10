const SYS_LOGIN = "SYS_LOGIN";
const SYS_ADMINISTRATOR = "SYS_ADMINISTRATOR";
const SYS_TAGS = "SYSTEM DEADDROP MAILDROP";
const SYS_TAGS_SYSTEM = "SYSTEM";
const SYS_TAGS_DEADDROP = "DEADDROP";
const SYS_TAGS_MAILDROP = "MAILDROP";
const SYS_DETAILS_ALL = "CREATE READ UPDATE DELETE ADMIN";
const DEADDROP_ADMIN = "DEADDROP_ADMIN";
const NODE_ADMIN = "NODE_ADMIN";
const SYS_DETAILS_CREATE = "CREATE";
const SYS_DETAILS_READ = "READ";
const SYS_DETAILS_UPDATE = "UPDATE";
const SYS_DETAILS_DELETE = "DELETE";
const SYS_DETAILS_ADMIN = "ADMIN";

function initData() {
	data = {
		articleState: "login",
		permissions: [],
		selected_deaddrop_id: undefined,
		userObj: undefined,
		selected_user_id: undefined
	};
}

var data;
initData();
var displayList = [];


function navigate(destination) {
	if (destination)
	data.articleState = destination;
	//if (!data.articleState)
	//	data.articleState = NAV_BLANK;
	var displayItem = displayList.find(o => o.name === data.articleState)
	
	if(displayItem) displayItem.action();
	//else navigate(NAV_ERROR)
}	

function refreshPermissions() 	{
	return new Promise(function(resolve, reject) {
		getUrl("/v1/user/" + data.userObj.user_id)
		.then(function(userObj) {
			data.userObj = userObj;
			resolve()
		})
		.catch(function(err) {
			console.log('error: ' + err);
			reject(err)
		});
	})
}

function getPermissionObj(permission_id){
	return (data.userObj.permissions.find(o => o.permission_id === permission_id))
}

function validatePermission(permission_id, permissions) {
	if (!permissions || permissions.length == 0) {
		return undefined;
	}
	if(!permission_id) return true;
	return (permissions.find(o => o.permission_id === permission_id))
}

function getFetchOptions(method, postData) {
	var authentication_token = "";
	var user_id = "";
	if (data && data.userObj) {
		authentication_token = data.userObj.authentication_token;
		user_id = data.userObj.user_id;
	}

	var options = {
method: method, // *GET, POST, PUT, DELETE, etc.
mode: 'cors', // no-cors, *cors, same-origin
cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
credentials: 'same-origin', // include, *same-origin, omit
headers: {
			'Content-Type': 'application/json',
			'authentication_token': authentication_token,
			'user_id': user_id
		},
redirect: 'follow', // manual, *follow, error
referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	}
	if (postData)
	options.body = JSON.stringify(postData) // body data type must match "Content-Type" header
	return options;
}

async function getUrl(url) {
	console.log("GET url %s", url)
	const response = await fetch(url, getFetchOptions('GET', undefined));

	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
}

async function postUrl(url, postData = {}) {
	console.log("POST url %s %j", url, postData)
	const response = await fetch(url, getFetchOptions('POST', postData));
	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
}

async function putUrl(url, postData = {}) {
	console.log("PUT url %s %j", url, postData)
	const response = await fetch(url, getFetchOptions('PUT', postData));
	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
}

async function deleteUrl(url, postData = {}) {
	console.log("DELETE url %s", url)
	const response = await fetch(url, getFetchOptions('DELETE', postData));
	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
}