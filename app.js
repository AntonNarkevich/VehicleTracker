'use strict';

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var less = require('less-middleware');
var passport = require('passport');

var rekuire = require('rekuire');
var logger = rekuire('logger');
var keysConfig = rekuire('keys.config');
var authStrategy = rekuire('authStrategy');
var roleStrategy = rekuire('roleStrategy');

var routes = require('./src/routes/index');
var positions = require('./src/routes/positions');
var init = require('./src/routes/init');
var register = require('./src/routes/register');
var login = require('./src/routes/login');
var logout = require('./src/routes/logout');
var profile = require('./src/routes/profile');
var membershipTest = require('./src/membership/membershipTestRoute');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(session({
	secret: keysConfig.cookieSessionSecret,
	key: 'vt-session'
}));

passport.use(authStrategy.passportStrategy);
app.use(passport.initialize());

passport.serializeUser(authStrategy.serializeUser);
passport.deserializeUser(authStrategy.deserializeUser);
app.use(passport.session());

app.use(roleStrategy.middleware());

app.use(less({
	src: path.join(__dirname, 'public'),
	paths: [__dirname]
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/positions', positions);
app.use('/init', init);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/profile', profile);
app.use('/m', membershipTest);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;