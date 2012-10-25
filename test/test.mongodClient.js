var database = process.env.EXPRESS_COV
  ? require('./../lib-cov/mongodClient.js')
  : require('./../lib/mongodClient.js');

var should = require('should');

describe('database', function() {
  describe('client', function() {
    it('should set client to undefined', function() {
      should.not.exist(database.client);
     });

    it('should not be undefined after open', function(completed) {
      database.open('testdb', function(err, client) {
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
      database.open('testdb', function(err, client) {
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
        database.open('testdb', function(err, client) {
          should.not.exist(err);
          should.exist(client);
          
          database.getCollection('mycollection', function(err, collection) {
            database.insert(collection, {_id: 'id', firstName: 'firstName', lastname: 'lastname'}, 
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

  it('should error if record exits', function(done) {
        database.open('testdb', function(err, client) {
          should.not.exist(err);
          should.exist(client);
          
          database.getCollection('mycollection', function(err, collection) {
            database.insert(collection, {_id:'id', firstName: 'firstName', lastname: 'lastname'}, 
              function(err, records) {
                  should.exist(err);
                  database.errorAlreadyinserted(err).should.be.true;
                  done();
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
    it('should return empty documents for none exist documents', function(completed) {
        database.open('testdb', function(err, client) {
          should.not.exist(err);
          should.exist(client);
          
          database.getCollection('mycollection', function(err, collection) {
            database.find(collection, {firstName: 'firstName', lastname: 'lastName'}, {limit: 1}, 
              function(err, docs) {
                should.not.exist(err);
                ([]).should.be.docs;
                docs.should.be.empty;   
                completed();
            });
          });
          
          database.close(function(err, done) {
          should.not.exist(err);
          done.should.be.true;  
        });
     });
  });

  it('should return found document', function(completed) {
        database.open('testdb', function(err, client) {
          should.not.exist(err);
          should.exist(client);
          
          database.getCollection('mycollection', function(err, collection) {
            database.insert(collection, {firstName: 'firstName', lastName: 'lastName'}, 
              function(err, records) {
                database.find(collection, {firstName: 'firstName', lastName: 'lastName'}, {}, 
                function(err, docs) {
                  should.exist(docs);
                  docs.should.have.length(1);
                  'firstName'.should.be.equal(docs[0].firstName);
                  'lastName'.should.be.equal(docs[0].lastName);
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
});

describe('update', function() {
  it('should update exist document', function(completed) {
        database.open('testdb',function(err, client) {
          should.not.exist(err);
          should.exist(client);
          database.getCollection('mycollection', function(err, collection) {
            database.insert(collection, {firstName: 'firstName', lastName: 'lastName'}, 
              function(err, records) {
                database.update(collection, {firstName: 'firstName', lastName: 'lastName'}, {firstName: 'firstName3', lastName: 'lastName3'}, 
                function(err, done) {
                  done.should.be.true;
                  
                  database.find(collection, {firstName: 'firstName3', lastName: 'lastName3'}, {}, 
                  function(err, docs) {
                    should.exist(docs);
                    //docs.should.have.length(1);
                    'firstName3'.should.be.equal(docs[0].firstName);
                    'lastName3'.should.be.equal(docs[0].lastName);
                    completed();   
                 });
                  
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

describe('remove', function() {
  it('should remove matched documents', function(completed) {
        database.open('testdb',function(err, client) {
          should.not.exist(err);
          should.exist(client);
          database.getCollection('mycollection', function(err, collection) {
            database.insert(collection, {firstName: 'firstName', lastName: 'lastName'}, 
              function(err, records) {
                database.remove(collection, {firstName: 'firstName', lastName: 'lastName'}, 
                function(err, result) {
                  (2).should.be.equal.result;
                  
                    database.count(collection, 
                    function(err, docs) {
                      should.not.exist(err);
                      (0).should.be.count;
                      completed();   
                 });
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


before(function(completed) {
  database.open('testdb', function(err, client) {
      should.not.exist(err);
      should.exist(client);
      database.drop(function(err, done) {
        database.close(function (err, done) {
        completed();
      });
    });
  });
});

after(function(completed) {
    database.open('testdb', function(err, client) {
    database.drop(function(err, done) {
    database.close( function (err, done) {
        completed();
      });
    });
  });
});

});
