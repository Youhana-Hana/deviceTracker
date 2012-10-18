var server = process.env.EXPRESS_COV
  ? require('./../lib-cov/server.js')
  : require('./../lib/server.js');

var assert = require('assert'),
    sinon = require('sinon')

describe('deviceTracker', function() {

  before(function(){
    sinon.spy(server, 'start');
  });

  after(function(){
  server.start.restore();		  
  });

  describe('require', function() {
    it('should start server', function() {
      var deviceTracker = process.env.EXPRESS_COV
  	? require('./../lib-cov/deviceTracker.js')
  	: require('./../lib/deviceTracker.js');

      assert(server.start.calledOnce);
     });
  });

});

