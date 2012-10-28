var passport = require('passport'),
	localStrategy = require('passport-local').Strategy
	users = require('./users.js');

var authentication = {};

authentication.passport = passport;

passport.serializeUser(function(user, done){
 	return done(null, user._id);
 });

passport.deserializeUser(function(id, done) {
 users.findById(id, function (err, user){
   if (err) {throw err;}
   return done(err, user);
  });
 });

passport.use(new localStrategy(
function(username, password, done) {
 	users.authenticate(username, password, function (err, user) {
 		return done(err, user);	
 	});
 	
}));

module.exports = authentication;
