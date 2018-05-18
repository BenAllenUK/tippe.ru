'use strict';

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let db = require('sqlite');
const request = require('request');

let index = require('./routes/index');
let users = require('./routes/users');
let authenticate = require('./routes/authenticate');
let posts = require('./routes/posts');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(session({
	secret: 'keyboard cat',
	cookie: { maxAge: 60000 },
	resave: false,
	saveUninitialized: true
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const dbPromise = Promise.resolve()
	.then(() => db.open('./database.db', { Promise }))
	.then(db => db.migrate({ force: 'last' }));

app.use('/', index);
app.use('/api/users', users);
app.use('/api/authenticate', authenticate);
app.use('/api/posts', posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.redirect("/");
});

var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: 40510})
wss.on('connection', function (ws) {
	ws.on('message', function (message) {
		console.log('received: %s', message);

		request('https://icanhazdadjoke.com/', { json: true }, (err, res, body) => {
			if (err) { return console.log(err); }
			ws.send(res.body.joke);
		});
	});
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
