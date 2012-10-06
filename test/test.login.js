var server = process.env.EXPRESS_COV
  ? require('./../lib-cov/server.js')
  : require('./../lib/server.js');

var assert = require('assert'),
    sinon = require('sinon')

describe('login', function() {

  before(function(){
    sinon.spy(server, 'start');
  });

  after(function(){
  server.start.restore();		  
  });

  describe('require', function() {
    it('should start server', function() {
      var login = process.env.EXPRESS_COV
  	? require('./../lib-cov/login.js')
  	: require('./../lib/login.js');

      assert(server.start.calledOnce);
     });
  });

});

