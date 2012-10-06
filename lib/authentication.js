var passport = require('passport'),
	localStrategy = require('passport-local').Strategy
	users = require('./users.js')

var authentication = {};

authentication.passport = passport;

passport.serializeUser(function(user, done){
 done(null, user.id);
 });

passport.deserializeUser(function(id, done) {
 users.findById(id, function (err, user){
   done(err, user);
  });
 });

passport.use(new localStrategy(
function(username, password, done) {
 return users.authenticate(username, password, done);
}));

module.exports = authentication;
