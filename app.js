const express = require('express')
const path = require('path');
const bodyParser = require("body-parser");
const app = express()
const PORT = process.env.PORT
const MAX_MESSAGES = process.env.MAX_MESSAGES;

var messages = [];

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/deaddrop.js', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/deaddrop.js'));
});

app.post('/message', function (req, res) {
	console.log('POST /message ');
	var message = extractMessage(req);
	messages.push(message);
	if(messages.length>MAX_MESSAGES) 
		messages.shift();
});

app.get('/message', function (req, res) {
	console.log('GET /message');
	res.send(messages)
});

app.get('/clearqueue', function (req, res) {
	console.log('GET /clearqueue');
	messages = [];
	res.send(messages)
});

app.listen(PORT,function() {
	console.log("server started on " + PORT);
});

function extractMessage(req){
	return {"user":req.body.user, 
		"message":req.body.message}
}

