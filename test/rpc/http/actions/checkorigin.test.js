/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/rpc/http/actions/checkorigin');


describe('rpc/http/actions/checkorigin', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@action']).to.equal('checkOrigin');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('action', function() {
    
    it('should respond with valid origin', function(done) {
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
          expect(this).to.have.status(200);
          expect(this).to.have.body({ valid: true });
          done();
        })
        .listen();
    }); // should respond with valid origin
    
    it('should respond with invalid origin', function(done) {
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
          expect(this).to.have.status(403);
          expect(this).to.have.body({ error: 'invalid_request' });
          done();
        })
        .listen();
    }); // should respond with invalid origin
    
    it('should respond with unknown client', function(done) {
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
        .finish(function() {
          expect(this).to.have.status(403);
          expect(this).to.have.body({ error: 'invalid_request' });
          done();
        })
        .listen();
    }); // should respond with unknown client
    
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
