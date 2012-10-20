
var Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;

var database = {};

database.client = undefined;

database.open = function(name, host, port, callback) {
	var server = new Server(host, port, { auto_reconnect: true });
	var db = new Db(name, server, { safe:true });
	db.open(function(err, client) {
		if (err) {
  			return callback(err, client);
  		}
  		database.client = client;
		return callback(null, client);
	});
}

database.close = function(callback) {
	if(database.client === undefined) {
		return callback(new Error('database not ready'), false);
	}

	database.client.close();
	database.client = undefined;
	return callback(null, true);
}

database.getCollection = function (collectionName, callback) {
	if(database.client === undefined) {
		return callback(new Error('database not ready'), false);
	}

	database.client.createCollection(collectionName, function(err, collection) {
         if (err) { return callback(err, collection); }
		 return callback(null, collection);
	});
}

database.drop = function(callback){
	if(database.client === undefined) {
		return callback(new Error('database not ready'), false);
	}

	database.client.dropDatabase(function(err, done) {
		if (err) { return callback(err, done); }
		return callback(null, done);	
	});
}

database.find = function (collection, query, options, callback) {
 	collection.find(query, options, function(err, cursor) {
        if (err) { return callback(err, cursor); }
        if (cursor === null) { return callback(null, {}); }
        cursor.toArray(function(err, docs) {
        	if (err) { return callback(err, docs); }
        	return ( null, docs);
        	});
      });
}

database.insert = function (collection, document, callback) {
 	collection.insert(document, { safe: true }, function(err, records) {
 		if (err) { return (err, records); }
 		return callback(null, records);
 	});
}

database.update = function (collection, document, updated, callback) {
 	collection.update(document, updated, { safe:true }, function(err) {
 		if (err) { return callback(err, false) };
 		return callback(null, true);
 	});
}

database.remove = function (collection, query, options) {
 	collection.remove(query, function(err, result) {
        if (err) console.warn(err.message);
        return result;
      });
}

database.count = function (collection, callback) {
 	collection.count(function(err, count) { 
 		if (err) { return callack(err, count); }
 		return callback(null, count); 
 	});
}

database.errorAlreadyinserted = function(err) {
	if (err && err.message.indexOf('E11000 ') !== -1) {
 		 	return true;
 		}

 		return false;
}
	
module.exports = database;