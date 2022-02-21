var express = require('express');

var initialize = require('express-openapi').initialize;
var swaggerUi = require("swagger-ui-express");
const path = require('path');
const bodyParser = require("body-parser");
var fs = require('fs');
var https = require('https');

var deaddropService = require('./api-v1/services/deaddropService');
var messageService = require('./api-v1/services/messageService');
var v1ApiDoc = require('./api-v1/api-doc');

const app = express();

var privateKey = fs.readFileSync('sslcert/apache-selfsigned.key', 'utf8');
var certificate = fs.readFileSync('sslcert/apache-selfsigned.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate };
var PORT = process.env.PORT || 443;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/index.js', function(req, res) {
	res.sendFile(path.join(__dirname, '/public/index.js'));
});

initialize({
	app,
	apiDoc: v1ApiDoc.apiDoc,
	dependencies: {
		deaddropService: deaddropService.deaddropService,
		messageService: messageService.messageService
	},
	consumesMiddleware: {
		'application/json': bodyParser.json()
	},
	paths: './api-v1/paths'
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(v1ApiDoc.apiDoc));

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, function() {
	console.log("server started on " + PORT);
});


