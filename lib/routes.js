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
 res.render('register', { user: req.user });
}


module.exports = routes;


