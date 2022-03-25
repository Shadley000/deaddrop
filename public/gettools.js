
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
	//return response.json(); // parses JSON response into native JavaScript objects
}

async function postUrl(url, postData = {}) {
	console.log("POST url %s %j", url, postData)
	const response = await fetch(url, getFetchOptions('POST', postData));
	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
	//return response.json(); // parses JSON response into native JavaScript objects
}

async function putUrl(url, postData = {}) {
	console.log("PUT url %s %j", url, postData)
	const response = await fetch(url, getFetchOptions('PUT', postData));
	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
	//return response.json(); // parses JSON response into native JavaScript objects
}

async function deleteUrl(url, postData = {}) {
	console.log("DELETE url %s", url)
	const response = await fetch(url, getFetchOptions('DELETE', postData));
	const string = await response.text();
	const json = string === "" ? {} : JSON.parse(string);
	return json;
	//return response.json(); // parses JSON response into native JavaScript objects
}
