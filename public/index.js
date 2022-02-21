
function clearQueue() {
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
			var mainContainer = document.getElementById("myData");
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
	var body = {
			"user": document.getElementById("user").value,
			"message": document.getElementById("message").value
	
	};
	document.getElementById('message').value = "";

	//console.log('loadMessages %j', parameters);
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "/v1/message", true);
	xmlhttp.setRequestHeader("Content-type", "application/json");
	xmlhttp.onreadystatechange = loadMessages();
	xmlhttp.send(JSON.stringify(body));

}

var intervalId = setInterval(loadMessages(), 5000);