var express = require('express');
const session = require('express-session')
var initialize = require('express-openapi').initialize;
var swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
var fs = require('fs');
var https = require('https');

var deaddropService = require('./api-v1/services/deaddropService').deaddropService;
var userService = require('./api-v1/services/userService').userService;
var keyService = require('./api-v1/services/keyService').keyService;
var toolKit = require('./api-v1/services/toolKit').toolKit;
var v1ApiDoc = require('./api-v1/api-doc').apiDoc;


var privateKey = fs.readFileSync('sslcert/apache-selfsigned.key', 'utf8');
var certificate = fs.readFileSync('sslcert/apache-selfsigned.crt', 'utf8');

var credentials = { key: privateKey, cert: certificate };
var PORT = process.env.PORT || 443;

const app = express();

app.use(bodyParser.json());
app.use(session({
	secret: 'Some_Secret_Key',
    resave: true,
  	saveUninitialized: true, 
	cookie: { maxAge: 60000 }
}))

app.use(express.static(__dirname + '/public'));

initialize({
	app,
	apiDoc: v1ApiDoc,
	dependencies: {
		deaddropService: deaddropService,
		userService: userService,
		keyService: keyService,
		toolKit: toolKit
	},
	consumesMiddleware: {
		'application/json': bodyParser.json()
	},
	paths: './api-v1/paths'
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(v1ApiDoc));

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, function() {
	console.log("server started on " + PORT);
});


