var Db = require('mongodb').Db,
	Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;

var database = {};

database.client = undefined;

database.port = 27017;
database.host = 'localhost';

database.open = function(name, callback) {
	if(database.client !== undefined) {
		return callback(null, client);
	}

	var server = new Server(database.host, database.port, { auto_reconnect: true });
	var db = new Db(name, server, { safe:true });
	db.open(function(err, client) {
		if (err) {	return callback(err, client); }
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
        	return callback(null, docs);
        	});
      });
}

database.insert = function (collection, document, callback) {
 	collection.insert(document, { safe: true }, function(err, records) {
 		if (err) { return callback(err, records); }
 		return callback(null, records);
 	});
}

database.update = function (collection, document, updated, callback) {
 	collection.update(document, { $set: updated }, { safe: true }, function(err) {
 		if (err) { return callback(err, false); }
 		return callback(null, true);
 	});
}

database.remove = function (collection, document, callback) {
 	collection.remove(document, function(err, result) {
        if (err) { return callback(err, result); }
        return callback(null, result);
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