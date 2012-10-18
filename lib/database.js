
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
	return callback(null, true)
}

database.drop = function(callback){
	if(database.client === undefined) {
		return callback(new Error('database not ready'), false);
	}

	database.client.dropDatabase(function(err, done) {
		if (err) {
			return callback(err, done);
		}

		return callback(null, done);	
	});
}

database.find = function (collectionName, query, options) {
 	var collection = new mongodb.Collection(database.client, collectionName); 
 	collection.find(query, options, function(err, cursor) {
        if (err) console.warn(err.message);
        if (cursor === null) return {};
        cursor.toArray(function(err, docs){
        	if (err) console.warn(err.message);
        	return docs;
        	});
      });
}

database.insert = function (collectionName, record, callback) {
 	var collection = new mongodb.Collection(database.client, collectionName); 
 	collection.insert(record, { safe: true }, function(err, records) {
 		if (err) {
 			console.warn(err.message);
 			return (err, records);	
 		}

 		return callback(null, records);
 	});
}

database.update = function (collectionName, record, updatedRecord) {
 	var collection = new mongodb.Collection(database.client, collectionName); 
 	collection.update(record, updatedRecord, {safe:true}, function(err) {
 		if (err) console.warn(err.message);
 	});
}

database.remove = function (collectionName, query, options) {
 	var collection = new mongodb.Collection(database.client, collectionName); 
 	collection.remove(query, function(err, result) {
        if (err) console.warn(err.message);
        return result;
      });
}

database.count = function (collectionName, callback) {
 	var collection = new mongodb.Collection(database.client, collectionName); 
 	collection.count(function(err, count) { 
 		if (err) {
 			return callack(err, count);
 		}

 		return cakkback(null, count); 
 	});
}

database.errorAlreadyinserted = function(err) {
	if (err && err.message.indexOf('E11000 ') !== -1) {
 		 	return true;
 		}

 		return false;
}
	
module.exports = database;