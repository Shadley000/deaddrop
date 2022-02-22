
function clearMessages() {
	//console.log('clearQueue');
	fetch("/v1/message", { method: 'DELETE' })
		.then(function(response) {
			loadMessages()
		})
}

function loadMessages() {
	console.log('loadMessages');
	fetch("/v1/message?t=" + Math.random())
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			//console.log('appendData: ' + data);
			var mainContainer = document.getElementById("divAnonMessages");
			mainContainer.innerHTML = "";
			for (var i = 0; i < data.length; i++) {
				var message = data[i];
				var div = document.createElement("div");
				div.innerHTML = message.user + ': ' + message.message + '<BR>';
				mainContainer.appendChild(div);
			}
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});

}

function addMessages() {
	var message = {
			"user": document.getElementById("anon_user").value,
			"message": document.getElementById("anon_message").value
	};
	document.getElementById('anon_message').value = "";
	
	postData("/v1/message", message)
		.then(data => {
			loadMessages();
		});
}
// ************************************************************* 

function createDeadDrop() {
	var deaddrop = {
			"deaddrop_id": document.getElementById("deaddropid").value,
			"key": document.getElementById("key").value
	};
	
	postData("/v1/deaddrop", deaddrop)
		.then(data => {
			getDeadDrop();
		});
}

function getDeadDrop() {
	var deaddrop_id = document.getElementById("deaddropid").value
	var key =  document.getElementById("key").value
	
	fetch("/v1/deaddrop/"+deaddrop_id+"?key="+key+"&t="+Math.random())
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			console.log('appendData: ' + data);
			var mainContainer = document.getElementById("divDeadDropMessages");
			mainContainer.innerHTML = "";
			for (var i = 0; i < data.length; i++) {
				var message = data[i];
				var div = document.createElement("div");
				div.innerHTML = message.user + ': ' + message.message + '<BR>';
				mainContainer.appendChild(div);
			}
		})
		.catch(function(err) {
			console.log('error: ' + err);
		});
}

function clearDeadDrop() {
	var deaddrop_id = document.getElementById("deaddropid").value
	var key =  document.getElementById("key").value
	
}

function addMessageToDeadDrop(){
	var deaddrop_id = document.getElementById("deaddropid").value
	var key =  document.getElementById("key").value
	var message = {
			"user": document.getElementById("user").value,
			"message": document.getElementById("message").value
	};
	document.getElementById('message').value = "";
	
	postData("/v1/deaddrop/"+deaddrop_id+"?key="+key, message)
		.then(data => {
			loadMessages();
		});
}


// ************************************************************* 


async function postData(url = '', data = {}) {
	// Default options are marked with *
	const response = await fetch(url, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		mode: 'cors', // no-cors, *cors, same-origin
		cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
		credentials: 'same-origin', // include, *same-origin, omit
		headers: {
			'Content-Type': 'application/json'
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: 'follow', // manual, *follow, error
		referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data) // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
}