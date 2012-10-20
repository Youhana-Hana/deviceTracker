var database = process.env.EXPRESS_COV
  ? require('./../lib-cov/database.js')
  : require('./../lib/database.js');

  var should = require('should');

describe('database', function() {
  describe('client', function() {
    it('should set client to undefined', function() {
      should.not.exist(database.client);
     });

    it('should not be undefined after open', function(completed) {
      database.open('testdb', 'localhost', 27017, function(err, client) {
     		should.not.exist(err);
        should.exist(client);
 			  database.close(function(err, done) {
          should.not.exist(err);
          done.should.be.true;
          completed();
        });
		  });     
    });
      
    it('should set client to undefined after close', function(completed) {
      database.open('testdb', 'localhost', 27017, function(err, client) {
         		should.not.exist(err);
            should.exist(client);
     			  database.close(function(err, done) {
              should.not.exist(err);
              done.should.be.true;
              completed();
            });

     			  should.not.exist(database.client);
    	});     
    });

    it('should gives error for unreachable host', function() {
      database.open('testdb', '123', 27017, function(err, client) {
        should.exist(err);
      });     
    });
  
    it('should gives error when close none open database', function(completed) {
      database.close(function(err, done) {
        should.exist(err);
        done.should.be.false;
        completed();
      });     
    });
  });

describe('insert', function() {
    it('should increment count after insert', function(completed) {
        database.open('testdb', 'localhost', 27017, function(err, client) {
          should.not.exist(err);
          should.exist(client);
          
          database.getCollection('mycollection', function(err, collection) {
            database.insert(collection, {firstName: 'youhana', lastname: 'Hana'}, 
              function(err, records) {
                should.exist(records[0]._id);
                database.count(collection, function(err, count) {
                  should.not.exist(err);
                  should.exist(count);
                  (1).should.be.equal(count);
                  completed();
              });
            });
          });
          
          database.close(function(err, done) {
          should.not.exist(err);
          done.should.be.true;  
        });
     });
  });

  it('should error if record exits', function() {
        database.open('testdb', 'localhost', 27017, function(err, client) {
          should.not.exist(err);
          should.exist(client);
          
          database.getCollection('mycollection', function(err, collection) {
            database.insert(collection, {_id: 1}, 
              function(err, records) {
                  should.exist(err);
                  database.errorAlreadyinserted(err).should.be.true;
            });
          });
          
          database.close(function(err, done) {
          should.not.exist(err);
          done.should.be.true;  
        });
     });
  });
});


describe('find', function() {
    it('should return empty documents for none exist documents', function() {
        database.open('testdb', 'localhost', 27017, function(err, client) {
          should.not.exist(err);
          should.exist(client);
          
          database.getCollection('mycollection', function(err, collection) {
            database.find(collection, {firstName: 'firstName', lastname: 'lastName'}, {}, 
              function(err, docs) {
                should.not.exist(err);
                (0).shoud.be.docs.length;   
            });
          });
          
          database.close(function(err, done) {
          should.not.exist(err);
          done.should.be.true;  
        });
     });
  });

  it('should return found document', function() {
        database.open('testdb', 'localhost', 27017, function(err, client) {
          should.not.exist(err);
          should.exist(client);
          
          database.getCollection('mycollection', function(err, collection) {
            database.insert(collection, {firstName: 'firstName', lastname: 'lastName'}, 
              function(err, records) {
                database.find(collection, {firstName: 'firstName', lastname: 'lastName'}, {}, 
                function(err, docs) {
                  should.exist(docs);
                  (1).shoud.be.docs.length;
                  'firstName'.should.be.equal(docs[0].firstName);
                  'lastName'.should.be.equal(docs[0].lastName);   
              });     
            });
          });
          
          database.close(function(err, done) {
          should.not.exist(err);
          done.should.be.true;  
        });
     });
  });
});

describe('update', function() {
  it('should update exist document', function() {
        database.open('testdb', 'localhost', 27017, function(err, client) {
          should.not.exist(err);
          should.exist(client);
          database.getCollection('mycollection', function(err, collection) {
            database.insert(collection, {firstName: 'firstName', lastname: 'lastName'}, 
              function(err, records) {
                database.update(collection, {firstName: '1111', lastname: '2222'}, {firstName: 'firstName2', lastname: 'lastName2'}, 
                function(err, done) {
                  console.log(done);
                  done.should.be.true;
                 
              });     
            });
          });
          
          database.close(function(err, done) {
          should.not.exist(err);
          done.should.be.true;  
        });
     });
  });
});

after(function() {
  database.drop(function(err, done) {
  });   
});

});
