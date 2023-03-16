/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../com/rpc/actions/listsessions');


describe('rpc/http/actions/listsessions', function() {
  
  it('should be annotated', function() {
    expect(factory['@action']).to.equal('listSessions');
  });
  
  
  function authenticate() {
    return function(req, res, next) {
      next();
    };
  }
  
  // TODO: Review this
  it('should create handler', function() {
    var authenticateSpy = sinon.spy(authenticate);
    
    var handler = factory(null, null, { authenticate: authenticateSpy });
    
    expect(authenticateSpy).to.be.calledOnce;
    expect(authenticateSpy).to.be.calledWithExactly([ 'session', 'anonymous' ], { multi: true });
  });
  
  describe('handler', function() {
    
    it('should list no sessions', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(loginHint, clients, { authenticate: authenticate });
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'listSessions',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.com',
            scope: 'profile email',
            ss_domain: 'https://client.example.com'
          };
        })
        .finish(function() {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          expect(loginHint.generate).to.not.be.called;
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({
            sessions: []
          });
          done();
        })
        .listen();
    }); // should list no sessions
    
    it('should list single session', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(loginHint, clients, { authenticate: authenticate });
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'listSessions',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.com',
            scope: 'profile email',
            ss_domain: 'https://client.example.com'
          };
          req.user = {
            id: '248289761001',
            displayName: 'Jane Doe'
          }
          req.authInfo =  {
            sessionSelector: '0'
          }
        })
        .finish(function() {
          expect(loginHint.generate).to.be.calledOnceWith(
            '248289761001',
            {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              webOrigins: [ 'https://client.example.com' ]
            }
          );
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({
            sessions: [
              { login_hint: 'AJMrCA...', session_state: { extraQueryParams: { authuser: '0' } } }
            ]
          });
          done();
        })
        .listen();
    }); // should list single session
    
    it('should respond to client that has no registered origins', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client'
      });
      
      var handler = factory(loginHint, clients, { authenticate: authenticate });
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'listSessions',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.net',
            scope: 'profile email',
            ss_domain: 'https://client.example.com'
          };
          req.user = {
            id: '248289761001',
            displayName: 'Jane Doe'
          }
          req.authInfo =  {
            sessionSelector: '0'
          }
        })
        .finish(function() {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          expect(loginHint.generate.callCount).to.equal(0);
          
          expect(this).to.have.status(403);
          expect(this).to.have.body({
            error: 'access_denied',
            error_description: 'Invalid client for this origin.'
          });
          done();
        })
        .listen();
    }); // should respond to client that has no registered origins
    
    it('should respond to client using invalid origin', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(loginHint, clients, { authenticate: authenticate });
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'listSessions',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.net',
            scope: 'profile email',
            ss_domain: 'https://client.example.com'
          };
          req.user = {
            id: '248289761001',
            displayName: 'Jane Doe'
          }
          req.authInfo =  {
            sessionSelector: '0'
          }
        })
        .finish(function() {
          expect(loginHint.generate.callCount).to.equal(0);
          
          expect(this).to.have.status(403);
          expect(this).to.have.body({
            error: 'access_denied',
            error_description: 'Invalid client for this origin.'
          });
          done();
        })
        .listen();
    }); // should respond to client using invalid origin
    
    it('should next with error when client is not found', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      var handler = factory(loginHint, clients, { authenticate: authenticate });
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'listSessions',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.com',
            scope: 'profile email',
            ss_domain: 'https://client.example.com'
          };
          req.user = {
            id: '248289761001',
            displayName: 'Jane Doe'
          }
          req.authInfo =  {
            sessionSelector: '0'
          }
        })
        .next(function(err) {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          expect(loginHint.generate).to.not.be.called;
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('The OAuth client was not found.');
          expect(err.code).to.equal('invalid_client');
          expect(err.status).to.equal(401);
          done();
        })
        .listen();
    }); // should respond to unknown client
    
    it('should respond when missing client id parameter', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      var handler = factory(loginHint, clients, { authenticate: authenticate });
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'listSessions',
            origin: 'https://client.example.com',
            scope: 'profile email',
            ss_domain: 'https://client.example.com'
          };
          req.user = {
            id: '248289761001',
            displayName: 'Jane Doe'
          }
          req.authInfo =  {
            sessionSelector: '0'
          }
        })
        .finish(function() {
          expect(loginHint.generate.callCount).to.equal(0);
          
          expect(this).to.have.status(400);
          expect(this).to.have.body({
            error: 'invalid_request',
            error_description: 'Missing required parameter: client_id'
          });
          done();
        })
        .listen();
    }); // should respond when missing client id parameter
    
    it('should respond when missing origin parameter', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      var handler = factory(loginHint, clients, { authenticate: authenticate });
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'listSessions',
            client_id: 's6BhdRkqt3',
            scope: 'profile email',
            ss_domain: 'https://client.example.com'
          };
          req.user = {
            id: '248289761001',
            displayName: 'Jane Doe'
          }
          req.authInfo =  {
            sessionSelector: '0'
          }
        })
        .finish(function() {
          expect(loginHint.generate.callCount).to.equal(0);
          
          expect(this).to.have.status(400);
          expect(this).to.have.body({
            error: 'invalid_request',
            error_description: 'Missing required parameter: origin'
          });
          done();
        })
        .listen();
    }); // should respond when missing origin parameter
    
  }); // handler
  
});
