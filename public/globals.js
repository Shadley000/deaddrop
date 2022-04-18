const SYS_LOGIN = "SYS_LOGIN";
const SYS_ADMINISTRATOR = "SYS_ADMINISTRATOR";
const SYS_TAGS = "SYSTEM DEADDROP MAILDROP";
const SYS_TAGS_SYSTEM = "SYSTEM";
const SYS_TAGS_DEADDROP = "DEADDROP";
const SYS_TAGS_MAILDROP = "MAILDROP";
const SYS_DETAILS_ALL = "CREATE READ UPDATE DELETE ADMIN";
const DEADDROP_ADMIN = "DEADDROP_ADMIN";
const NODE_USER = "NODE_USER";
const SYS_DETAILS_CREATE = "CREATE";
const SYS_DETAILS_READ = "READ";
const SYS_DETAILS_UPDATE = "UPDATE";
const SYS_DETAILS_DELETE = "DELETE";
const SYS_DETAILS_ADMIN = "ADMIN";

function initData() {
	global = {
		userObj: undefined
	};
}

var global;
initData();


function getFetchOptions(method, data) {
	var authentication_token = "";
	var user_id = "";
	if (global && global.userObj) {
		authentication_token = global.userObj.authentication_token;
		user_id = global.userObj.user_id;
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
	if (data)
	options.body = JSON.stringify(data) // body data type must match "Content-Type" header
	return options;
}

async function getUrl(url) {
	console.log("GET url %s", url)
	const response = await fetch(url, getFetchOptions('GET', undefined));
	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
}

async function postUrl(url, data = {}) {
	console.log("POST url %s %j", url, data)
	const response = await fetch(url, getFetchOptions('POST', data));
	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
}

async function putUrl(url, data = {}) {
	console.log("PUT url %s %j", url, data)
	const response = await fetch(url, getFetchOptions('PUT', data));
	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
}

async function deleteUrl(url, data = {}) {
	console.log("DELETE url %s", url)
	const response = await fetch(url, getFetchOptions('DELETE', data));
	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
}