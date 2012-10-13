var express = require('express'),
    authentication = require('./authentication.js'),
    routes = require('./routes.js'),
    path = require('path'),
    flash = require('connect-flash'),
    engine = require('ejs-locals')

var server = {};

var app = express();

server.app = app;

function configure() {
var dirname = path.dirname(__dirname);
 app.engine('ejs', engine); 
 app.set('port', process.env.PORT || 8080);
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
 app.use(require('stylus').middleware(dirname + '/public'));
 app.use(express.static(path.join(dirname, '/public')));
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
  app.listen(app.get('port'), function() {
  console.log("Listening on " + app.get('port'));
});
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


module.exports = server;
