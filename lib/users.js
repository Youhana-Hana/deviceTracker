var users = {};

var list = [
{ id: 1, username: 'user1', password: 'password1', email: 'email1@mail.com'},
{ id: 2, username: 'user2', password: 'password2', email: 'email2@mail.com'}
];

users.findById = function(id, fn) {
 for(var index = 0; index < list.length; ++index)
 {
	if (id === list[index].id)
	 return fn(null, list[index]);
 }

fn(new Error('user ' + id + 'does not exist'));
}

users.findByUsername = function(username, fn) {
 for(var index = 0; index < list.length; ++index)
 {
	if (username === list[index].username)
	 return fn(null, list[index]);
 }

 return fn(null, null);
}

users.authenticate = function(username, password, done) {
 users.findByUsername(username, function(err, user) {
  if (err) { return done(err)}
  if (!user) {return done(null, false, {message : 'unknown user ' + username})}
  if (user.password != password) {return done(null, false, {message: 'invalid password'})}
  return done(null, user);
 });
}


module.exports = users
