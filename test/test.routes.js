var routes = process.env.EXPRESS_COV
  ? require('./../lib-cov/routes.js')
  : require('./../lib/routes.js');

var sinon = require('sinon'),
    mocha = require('mocha'),
    should = require('should')

describe('routes', function() {
  var req = {};
  var res = {};
  var user = {};

  beforeEach(function(){
   req.user = user;    
   req.logout = sinon.stub();   
   req.flash = sinon.stub();
   res.render = sinon.stub();
   res.redirect = sinon.stub();
  });

 afterEach(function(){
   req.logout.reset();
   req.flash.reset();
   res.redirect.reset();
   res.render.reset();
  });

  describe('home', function() {
    it('should render index with user', function() {
      routes.home(req, res);
	res.render.calledOnce.should.be.true;
	res.render.calledWith('index', {user: user}).should.be.true;
     });
  });

  describe('account', function() {
    it('should render account with user', function() {
      routes.account(req, res);
	res.render.calledOnce.should.be.true;
	res.render.calledWith('account', {user: user}).should.be.true;
     });
   });

  describe('getLogin', function() {
    it('should render login with error', function() {
      routes.getLogin(req, res);
	res.render.calledOnce.should.be.true;
	req.flash.calledWith('error').should.be.true;
	res.render.calledWith('login', {user: user, message: req.flash('error')}).should.be.true;
     });
   });

 describe('logout', function() {
    it('should logout and redirect to /', function() {
      routes.logout(req, res);
	req.logout.calledOnce.should.be.true;
	res.redirect.calledWith('/').should.be.true;
     });
   });

 describe('postLogin', function() {
    it('should redirect to /', function() {
      routes.logout(req, res);
	res.redirect.calledWith('/').should.be.true;
     });
   });

});

