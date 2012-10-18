var database = process.env.EXPRESS_COV
  ? require('./../lib-cov/database.js')
  : require('./../lib/database.js');

  var should = require('should');

describe('database', function() {
  describe('client', function() {
    it('should set client to undefined', function() {
      should.not.exist(database.client);
     });

    it('should not be undefined after open', function() {
      database.open('testdb', 'localhost', 27017, function(err, client) {
     		should.not.exist(err);
        should.exist(client);
 			  database.close(function(err, done) {
          should.not.exist(err);
        });
		  });     
    });
      
    it('should set client to undefined after close', function() {
      database.open('testdb', 'localhost', 27017, function(err, client) {
         		should.not.exist(err);
            should.exist(client);
     			  database.close(function(err, done) {
              should.not.exist(err);
              done.should.be.true;  
            });

     			  should.not.exist(database.client);
    	});     
    });

    it('should gives error for unreachable host', function() {
      database.open('testdb', '123', 27017, function(err, client) {
        should.exist(err);
      });     
    });
  
    it('should gives error when close none open database', function() {
      database.close(function(err, done) {
        should.exist(err);
        done.should.be.false;
      });     
    });

  });

describe('insert', function() {
    it('should increment count after insert', function() {
        database.open('testdb', 'localhost', 27017, function(err, client) {
          should.not.exist(err);
          should.exist(client);
          
          database.insert('mycollection', {firstName: 'youhana', lastname: 'Hana'}, 
            function(err, records) {
              should.exist(records[0]._id);
              database.count('mycollection', function(err, count) {
                  (1).shoud.equal(count);
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
          
          database.insert('mycollection', {_id: 1}, 
            function(err, records) {
                should.exist(err);
                database.errorAlreadyinserted(err).should.be.true;
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
