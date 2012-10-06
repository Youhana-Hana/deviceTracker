var express = require('express'),
    authentication = require('./authentication.js'),
    routes = require('./routes.js'),
    path = require('path'),
    flash = require('connect-flash')

var server = {};

var app = express();

server.app = app;

function configure() {
var dirname = path.dirname(__dirname);
 app.set('views', dirname + '/views');
 app.set('view engine', 'ejs');
 app.use(express.logger());
 app.use(express.cookieParser());
 app.use(express.bodyParser());
 app.use(express.methodOverride()); 
 app.use(express.session({ secret: 'login with me' }));
 app.use(authentication.passport.initialize());
 app.use(authentication.passport.session());
 app.use(flash());
 app.use(app.router);
}
 
server.start = function() {
  app.configure(configure);
  app.get('/', routes.home);
  app.get('/account', ensureAuthenticated, routes.account);
  app.get('/login',  routes.getLogin);
  app.get('/logout', routes.logout);
  app.post('/login', 
	authentication.passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}),
	routes.postLogin);
  app.listen(8090);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


module.exports = server;

