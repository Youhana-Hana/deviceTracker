var users = require('./users.js');

var routes = {};

routes.home = function(req, res){
  res.render('index', { user: req.user });
}

routes.account = function(req, res){
 res.render('account', { user: req.user });
}

routes.logout = function(req, res){
 req.logout();
 res.redirect('/');
}

routes.getLogin = function(req, res){
 res.render('login', { user: req.user, message: req.flash('error')});
}

routes.postLogin = function(req, res){
   res.redirect('/');
 }

routes.getRegister = function(req, res){
 res.render('register', { user: req.user, message: null});
}

routes.postRegister = function(req, res){
var user = {	
      firstName : req.param('FirstName')
    , lastName : req.param('LastName')
    , email : req.param('Email')
    , password : req.param('Password')
    };

 users.add(user, function(err, userid) {
	if (err) { 
		console.log(err);
		return res.render('register', { user: req.user, message: err.message});}
	res.redirect('/');
 	});
 }

module.exports = routes;


