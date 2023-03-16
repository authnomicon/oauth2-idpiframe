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
    
    it('should next with error when client is not found', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      var handler = factory(clients);
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'checkOrigin',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.com'
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
    }); // should next with error when client is not found
    
    it('should next with error when read from client directory fails', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
      var handler = factory(clients);
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'checkOrigin',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.com'
          };
        })
        .next(function(err) {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('something went wrong');
          done();
        })
        .listen();
    }); // should next with error when read from client directory fails
    
    it('should next with error when request is missing origin parameter', function(done) {
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
        .next(function(err) {
          expect(clients.read).to.not.be.called;
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Missing required parameter: origin');
          expect(err.code).to.equal('invalid_request');
          expect(err.status).to.equal(400);
          done();
        })
        .listen();
    }); // should next with error when request is missing origin parameter
    
    it('should next with error when request is missing client_id parameter', function(done) {
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
        .next(function(err) {
          expect(clients.read).to.not.be.called;
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Missing required parameter: client_id');
          expect(err.code).to.equal('invalid_request');
          expect(err.status).to.equal(400);
          done();
        })
        .listen();
    }); // should next with error when request is missing client_id parameter
    
  }); // handler
  
});
