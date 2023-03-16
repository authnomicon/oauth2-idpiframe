/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../com/rpc/actions/checkorigin');


describe('rpc/actions/checkorigin', function() {
  
  it('should be annotated', function() {
    expect(factory['@action']).to.equal('checkOrigin');
  });
  
  describe('handler', function() {
    
    it('should respond when origin is valid', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(clients);
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'checkOrigin',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.com'
          };
        })
        .finish(function() {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({ valid: true });
          done();
        })
        .listen();
    }); // should respond when origin is valid
    
    it('should respond when origin is invalid', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(clients);
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'checkOrigin',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.net'
          };
        })
        .finish(function() {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({ valid: false, blocked: false });
          done();
        })
        .listen();
    }); // should respond when origin is invalid
    
    it('should respond when client has no registered origins', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client'
      });
      
      var handler = factory(clients);
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'checkOrigin',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.com'
          };
        })
        .finish(function() {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({ valid: false, blocked: false });
          done();
        })
        .listen();
    }); // should respond when client has no registered origins
    
    it('should respond to unknown client', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      var handler = factory(clients);
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'checkOrigin',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.net'
          };
        })
        .next(function(err) {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('The OAuth client was not found.');
          expect(err.code).to.equal('invalid_client');
          expect(err.status).to.equal(401);
          done();
        })
        .listen();
    }); // should respond to unknown client
    
    it('should respond when missing client id parameter', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(clients);
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'checkOrigin',
            origin: 'https://client.example.com'
          };
        })
        .finish(function() {
          expect(this).to.have.status(403);
          expect(this).to.have.body({ error: 'invalid_request' });
          done();
        })
        .listen();
    }); // should respond when missing client id parameter
    
    it('should respond when missing origin parameter', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(clients);
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'checkOrigin',
            client_id: 's6BhdRkqt3'
          };
        })
        .finish(function() {
          expect(this).to.have.status(403);
          expect(this).to.have.body({ error: 'invalid_request' });
          done();
        })
        .listen();
    }); // should respond when missing origin parameter
    
  }); // action
  
});
