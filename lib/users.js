//var mongodClient = require('./mongodClient.js');

var users = {};

var list = [
{ id: 1, username: 'user1', password: 'password1', email: 'email1@mail.com'},
{ id: 2, username: 'user2', password: 'password2', email: 'email2@mail.com'}
];

// users.add = function(user, callback) {
// ongodClient.open(function(err, client) {
//   if (err) {return callback(err, null);}
  
//   database.getCollection('users', function(err, collection) {
//     database.insert(collection, user, 
//       function(err, records) {
//   		if (err) {return callback(err, null);}      
//         return callback (null, records[0]._id);
//       });
//     });
  
//   mongodClient.close(function(err, done){
// 		if (err) {return callback(err, 0);}
//   	});
//  });
// }

users.findById = function(id, callback) {
 for(var index = 0; index < list.length; ++index)
 {
	if (id === list[index].id)
	 return callback(null, list[index]);
 }

 return callback(new Error('user ' + id + 'does not exist'));
}

users.findByUsername = function(username, callback) {
 for(var index = 0; index < list.length; ++index)
 {
	if (username === list[index].username)
	 return callback(null, list[index]);
 }

 	return callback(null, null);
}

users.authenticate = function(username, password, callback) {
 users.findByUsername(username, function(err, user) {
  if (err) { return callback(err)}
  if (!user) {return callback(null, false, {message : 'unknown user ' + username})}
  if (user.password != password) {return callback(null, false, {message: 'invalid password'})}
  return callback(null, user);
 });
}


module.exports = users
