var mongodClient = require('./mongodClient.js');
var _ = require('underscore'),
    ObjectID = require('mongodb').ObjectID;

var users = {};

users.add = function(user, callback) {
  users.findByEmail(user.email, function(err, record) {
  console.log(record);
  if (err) { return callback(err)}
  if (!_.isNull(record)) {return callback(new Error('user already exist'), null); }
  console.log('inserting user');
  mongodClient.getCollection('users', function(err, collection) {
    mongodClient.insert(collection, user, 
      function(err, records) {
  		if (err) {return callback(err, null);}      
        return callback (null, records[0]._id);
      });
    });
  });
}

users.findById = function(id, callback) {
  mongodClient.getCollection('users', function(err, collection) {
    console.log("findById" + id);
    mongodClient.find(collection, {_id: new ObjectID(id) }, {}, 
      function(err, records) {
        console.log(records);
  		if (err) { return callback(err, null); }  
  		if (_.isNull(records) || _.isUndefined(records) || _.size(records) === 0) {
  		  console.log("no record found");
      	return callback (null, null);
  		}   

        return callback (null, records[0]);
      });
    });
}

users.findByEmail = function(email, callback) {
 mongodClient.getCollection('users', function(err, collection) {
    mongodClient.find(collection, {'email': email}, {limit:1},
      function(err, records) {
  		if (err) { return callback(err, null); }  
  		if (_.isNull(records) || _.isUndefined(records) || _.size(records) === 0) {
  			return callback (null, null);
  		}   
  		  return callback (null, records[0]);
      });
    });
}

users.authenticate = function(email, password, callback) {
 users.findByEmail(email, function(err, user) {
  if (err) { return callback(err)}
  if (!user) {return callback(null, false, {message : 'unknown user ' + email})}
  if (user.password != password) {return callback(null, false, {message: 'invalid password'})}
  return callback(null, user);
 });
}


module.exports = users
