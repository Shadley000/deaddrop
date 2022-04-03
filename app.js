var express = require('express');
const session = require('express-session')
var initialize = require('express-openapi').initialize;
var swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
var fs = require('fs');
var https = require('https');

var deaddropService = require('./api-v1/services/deaddropService').deaddropService;
var userService = require('./api-v1/services/userService').userService;
var permissionService = require('./api-v1/services/permissionService').permissionService;
var user2PermissionService = require('./api-v1/services/user2PermissionService').user2PermissionService;
var messageService = require('./api-v1/services/messageService').messageService;
var sessionService = require('./api-v1/services/sessionService').sessionService;
var contactsService  = require('./api-v1/services/contactsService').contactsService;
var inviteService  = require('./api-v1/services/inviteService').inviteService;
var nodeService  = require('./api-v1/services/nodeService').nodeService;
var nodeParameterService  = require('./api-v1/services/nodeParameterService').nodeParameterService;

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
	secret: '97b95gbffbgfjSome_Super_Secret_Key',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 1800000 }
}));

sessionService.deleteAllSessions();

app.use(express.static(__dirname + '/public'));

app.use(ensureAuthenticated)

initialize({
	app,
	apiDoc: v1ApiDoc,
	dependencies: {
		deaddropService: deaddropService,
		userService: userService,
		permissionService: permissionService,
		user2PermissionService: user2PermissionService,
		messageService: messageService,
		sessionService: sessionService,
		contactsService: contactsService,
		inviteService:inviteService,
		treenodeService: treenodeService,
		nodeParameterService: nodeParameterService,
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


async function ensureAuthenticated(req, res, next) {
	console.log(req.method + " " + req.url);
	if (req.url.startsWith('/index.html')
		|| req.url.startsWith('/v1/user/login')
		|| req.url.startsWith('/v1/user/logout')
		|| req.url.startsWith('/v1/health')
		|| req.method === 'OPTIONS' // skip the preflight checks
	) {
		next();
	} else if (req.headers && req.headers.authentication_token && req.headers.user_id) {
		var authentication_token = await sessionService.getSession(req.headers.user_id);

		if (authentication_token && authentication_token == req.headers.authentication_token) {
			//console.log("ensureAuthenticated passed");
			req.session.user_id = req.headers.user_id;
			sessionService.updateSession();
			sessionService.deleteExpiredSessions();

			user2PermissionService.getUserPermissions(req.headers.user_id)
				.then( (permissions) => {
					req.session.permissions = permissions;
					next();
				})

		} else {
			console.log("ensureAuthenticated failed, token mismatch ", authentication_token, req.headers.authentication_token);

			//console.log("ensureAuthenticated failed: %s %s %s",req.url, req.headers.user_id,req.headers.authentication_token,);
			req.session.authentication_token = undefined;
			req.session.user_id = undefined;
			return res.json({ "status": "error", "message": "authentication error" })
		}

	} else {
		console.log("ensureAuthenticated failed, no headers");

		//console.log("ensureAuthenticated failed: %s %s %s",req.url, req.headers.user_id,req.headers.authentication_token,);
		req.session.authentication_token = undefined;
		req.session.user_id = undefined;
		return res.json({ "status": "error", "message": "authentication error" })

	}
}
