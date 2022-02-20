const express = require('express')
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/apache-selfsigned.key', 'utf8');
var certificate = fs.readFileSync('sslcert/apache-selfsigned.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const path = require('path');
const bodyParser = require("body-parser");
const app = express()
const PORT = process.env.PORT || 80
const HTTPS_PORT = process.env.HTTPS_PORT || 443
const MAX_MESSAGES = process.env.MAX_MESSAGES || 20;

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

var httpsServer = https.createServer(credentials, app);
var httpServer = http.createServer(app);

//httpServer.listen(PORT,function() {	console.log("server started on " + PORT);});

httpsServer.listen(HTTPS_PORT,function() {	console.log("server started on " + HTTPS_PORT);});

function extractMessage(req){
	return {"user":req.body.user, 
		"message":req.body.message}
}

