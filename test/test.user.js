var users = process.env.EXPRESS_COV
  ? require('./../lib-cov/users.js')
  : require('./../lib/users.js');

var should = require('should')
    mocha = require('mocha')

describe('users', function() {
  describe('findById()', function() {
    it('should throw error if user not exists', function() {
	users.findById(10, function(err, user) {
	  if(!err) { should.fail('user is not exist') }
	 });	
     });

    it('should find user if user exists', function() {
	users.findById(1, function(err, user) {
	  if(err) { throw err }
 	  should.exist(user);
	  (1).should.equal(user.id);
	  "user1".should.equal(user.username); 	
	 });	
     });
	
  });

  describe('findByUsername()', function() {
    it('should throw error if user not exists', function() {
	users.findByUsername('notexists', function(err, user) {
	   if(err) { throw err }	  
	   should.not.exist(user);
	 });	
     });

    it('should find user if user exists', function() {
	users.findByUsername('user2', function(err, user) {
	  if(err) { throw err }
 	  should.exist(user);
	  (2).should.equal(user.id);
	  "user2".should.equal(user.username); 	
	 });	
     });
	
  });

  describe('authenticate()', function() {
    it('should return false if invalid user', function() {
	users.authenticate('notexists', '', function(err, user, options) {
	   if(err) { throw err }	  
	   user.should.be.false;
	   options.message.should.equal('unknown user notexists');

	 });	
     });

    it('should return false if password not matching', function() {
	users.authenticate('user1', '', function(err, user, options) {
	   if(err) { throw err }	  
	   user.should.be.false;
	   options.message.should.equal('invalid password');
	 });	
     });
	
    it('should return user autenticated', function() {
	users.authenticate('user1', 'password1', function(err, user, options) {
	   if(err) { throw err }	  
	   should.exist(user);
	   (1).should.equal(user.id);
	   "user1".should.equal(user.username);
	 });	
     });

  });
});

