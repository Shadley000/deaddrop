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

app.use((req, res, next) => {
	var origin = req.headers.origin;
	
	if (origin != null && origin.length > 0) {
		res.setHeader("Access-Control-Allow-Origin", origin); // allows response
	}
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,HEAD,PATCH, OPTIONS"); // allows
	res.setHeader("Access-Control-Allow-Headers", "Origin, content-type, Accept, x-requested-with, Authorization");
	res.setHeader('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
});

app.use(bodyParser.json());
app.use(session({
	secret: 'Some_Secret_Key',
    resave: true,
  	saveUninitialized: true, 
	cookie: { maxAge: 1800000 }
}))

app.use(express.static(__dirname + '/public'));

app.use(ensureAuthenticated)

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


function ensureAuthenticated(req, res, next) {
	if (req.url.startsWith('/index.html') 
		|| req.url.startsWith('/v1/login')
		|| req.method === 'OPTIONS' // skip the preflight checks
	) {
		//console.log("ensureAuthenticated: Unprotected url %s %s",req.method,req.url);
		next();
	} else if (req.headers && req.headers.authentication_token 
			&& req.session.authentication_token == req.headers.authentication_token
			&& req.session.user_id == req.headers.user_id) {
		//console.log("ensureAuthenticated passed");
		next();
	} else {
		console.log("ensureAuthenticated failed: Redirecting to Login page:");
		
		//console.log("ensureAuthenticated failed: %s %s %s",req.url, req.headers.user_id,req.headers.authentication_token,);
		req.session.authentication_token = undefined;
		req.session.user_id = undefined;
		return res.json({"status":"error", "message":"authentication error"})
		//return res.redirect('/index.html');
	}
}
