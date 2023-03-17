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
    
    var handler = factory(null, null, null, { authenticate: authenticateSpy });
    
    expect(authenticateSpy).to.be.calledOnce;
    expect(authenticateSpy).to.be.calledWithExactly([ 'session', 'anonymous' ], { multi: true });
  });
  
  describe('handler', function() {
    
    it('should list no sessions', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null);
      var grants = new Object();
      grants.find = sinon.stub().yieldsAsync(null);
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
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
          expect(grants.find).to.not.be.called;
          expect(loginHint.generate).to.not.be.called;
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({
            sessions: []
          });
          done();
        })
        .listen();
    }); // should list no sessions
    
    it('should include email-related claims when already approved', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var grants = new Object();
      grants.find = sinon.stub().yieldsAsync(null, {
        scopes: [ {
          scope: [ 'email' ]
        } ]
      });
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
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
            displayName: 'Jane Doe',
            emails: [ { value: 'janedoe@example.com' } ]
          }
          req.authInfo =  {
            sessionSelector: '0'
          }
        })
        .finish(function() {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          expect(grants.find).to.be.calledOnceWith(
            {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              webOrigins: [ 'https://client.example.com' ]
            },
            {
              id: '248289761001',
              displayName: 'Jane Doe',
              emails: [ { value: 'janedoe@example.com' } ]
            }
          );
          expect(loginHint.generate).to.be.calledOnceWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe',
              emails: [ { value: 'janedoe@example.com' } ]
            },
            {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              webOrigins: [ 'https://client.example.com' ]
            }
          );
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({
            sessions: [
              { login_hint: 'AJMrCA...',
                email: 'janedoe@example.com',
                session_state: { extraQueryParams: { authuser: '0' } }
              }
            ]
          });
          done();
        })
        .listen();
    }); // should include email-related claims when already approved
    
    it('should include profile-related claims when already approved', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var grants = new Object();
      grants.find = sinon.stub().yieldsAsync(null, {
        scopes: [ {
          scope: [ 'profile' ]
        } ]
      });
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
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
            displayName: 'Jane Doe',
            photos: [ { value: 'http://example.com/janedoe/me.jpg' } ]
          }
          req.authInfo =  {
            sessionSelector: '0'
          }
        })
        .finish(function() {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          expect(grants.find).to.be.calledOnceWith(
            {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              webOrigins: [ 'https://client.example.com' ]
            },
            {
              id: '248289761001',
              displayName: 'Jane Doe',
              photos: [ { value: 'http://example.com/janedoe/me.jpg' } ]
            }
          );
          expect(loginHint.generate).to.be.calledOnceWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe',
              photos: [ { value: 'http://example.com/janedoe/me.jpg' } ]
            },
            {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              webOrigins: [ 'https://client.example.com' ]
            }
          );
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({
            sessions: [
              { login_hint: 'AJMrCA...',
                displayName: 'Jane Doe',
                photoUrl: 'http://example.com/janedoe/me.jpg',
                session_state: { extraQueryParams: { authuser: '0' } }
              }
            ]
          });
          done();
        })
        .listen();
    }); // should include profile-related claims when already approved
    
    it('should not include claims when not already approved', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var grants = new Object();
      grants.find = sinon.stub().yieldsAsync(null);
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
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
            displayName: 'Jane Doe',
            emails: [ { value: 'janedoe@example.com' } ]
          }
          req.authInfo =  {
            sessionSelector: '0'
          }
        })
        .finish(function() {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          expect(grants.find).to.be.calledOnceWith(
            {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              webOrigins: [ 'https://client.example.com' ]
            },
            {
              id: '248289761001',
              displayName: 'Jane Doe',
              emails: [ { value: 'janedoe@example.com' } ]
            }
          );
          expect(loginHint.generate).to.not.be.called;
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({
            sessions: [
              { session_state: { extraQueryParams: { authuser: '0' } }
              }
            ]
          });
          done();
        })
        .listen();
    }); // should not include claims when not already approved
    
    it('should list multiple sessions', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub();
      loginHint.generate.onCall(0).yieldsAsync(null, 'AJMrCA...');
      loginHint.generate.onCall(1).yieldsAsync(null, 'AJMrCB...');
      var grants = new Object();
      grants.find = sinon.stub();
      grants.find.onCall(0).yieldsAsync(null, {
        scopes: [ {
          scope: [ 'email' ]
        } ]
      });
      grants.find.onCall(1).yieldsAsync(null, {
        scopes: [ {
          scope: [ 'profile' ]
        } ]
      });
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'listSessions',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.com',
            scope: 'profile email',
            ss_domain: 'https://client.example.com'
          };
          req.user = [ {
            id: '248289761001',
            displayName: 'Jane Doe',
            emails: [ { value: 'janedoe@example.com' } ]
          }, {
            id: '703887',
            displayName: 'Mork Hashimoto',
            emails: [ { value: 'mhashimoto-04@plaxo.com' } ]
          } ]
          req.authInfo =  [ {
            sessionSelector: '0'
          }, {
            sessionSelector: '1'
          } ]
        })
        .finish(function() {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          expect(grants.find).to.be.calledTwice;
          expect(grants.find.getCall(0)).to.be.calledWith(
            {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              webOrigins: [ 'https://client.example.com' ]
            },
            {
              id: '248289761001',
              displayName: 'Jane Doe',
              emails: [ { value: 'janedoe@example.com' } ]
            }
          );
          expect(grants.find.getCall(1)).to.be.calledWith(
            {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              webOrigins: [ 'https://client.example.com' ]
            },
            {
              id: '703887',
              displayName: 'Mork Hashimoto',
              emails: [ { value: 'mhashimoto-04@plaxo.com' } ]
            }
          );
          expect(loginHint.generate.getCall(0)).to.be.calledWith(
            {
              id: '248289761001',
              displayName: 'Jane Doe',
              emails: [ { value: 'janedoe@example.com' } ]
            },
            {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              webOrigins: [ 'https://client.example.com' ]
            }
          );
          expect(loginHint.generate.getCall(1)).to.be.calledWith(
            {
              id: '703887',
              displayName: 'Mork Hashimoto',
              emails: [ { value: 'mhashimoto-04@plaxo.com' } ]
            },
            {
              id: 's6BhdRkqt3',
              name: 'My Example Client',
              webOrigins: [ 'https://client.example.com' ]
            }
          );
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({
            sessions: [
              { login_hint: 'AJMrCA...',
                email: 'janedoe@example.com',
                session_state: { extraQueryParams: { authuser: '0' } }
              },
              { login_hint: 'AJMrCB...',
                displayName: 'Mork Hashimoto',
                session_state: { extraQueryParams: { authuser: '1' } }
              }
            ]
          });
          done();
        })
        .listen();
    }); // should list multiple sessions
    
    it('should next with error when client is not found', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null);
      var grants = new Object();
      grants.find = sinon.stub().yieldsAsync(null);
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
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
          expect(grants.find).to.not.be.called;
          expect(loginHint.generate).to.not.be.called;
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('The OAuth client was not found.');
          expect(err.code).to.equal('invalid_client');
          expect(err.status).to.equal(401);
          done();
        })
        .listen();
    }); // should next with error when client is not found
    
    it('should next with error when origin is invalid', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null);
      var grants = new Object();
      grants.find = sinon.stub().yieldsAsync(null);
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
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
        .next(function(err) {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          expect(grants.find).to.not.be.called;
          expect(loginHint.generate).to.not.be.called;
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Invalid client for this origin.');
          expect(err.code).to.equal('access_denied');
          expect(err.status).to.equal(403);
          done();
        })
        .listen();
    }); // should next with error when origin is invalid
    
    it('should next with error when client has no registered origins', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null);
      var grants = new Object();
      grants.find = sinon.stub().yieldsAsync(null);
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client'
      });
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
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
        .next(function(err) {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          expect(grants.find).to.not.be.called;
          expect(loginHint.generate).to.not.be.called;
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Invalid client for this origin.');
          expect(err.code).to.equal('access_denied');
          expect(err.status).to.equal(403);
          done();
        })
        .listen();
    }); // should next with error when client has no registered origins
    
    it('should next with error when read from client directory fails', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null);
      var grants = new Object();
      grants.find = sinon.stub().yieldsAsync(null);
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
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
        .next(function(err) {
          expect(clients.read).to.be.calledOnceWith('s6BhdRkqt3');
          expect(grants.find).to.not.be.called;
          expect(loginHint.generate).to.not.be.called;
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('something went wrong');
          done();
        })
        .listen();
    }); // should next with error when read from client directory fails
    
    it('should next with error when request is missing client_id parameter', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null);
      var grants = new Object();
      grants.find = sinon.stub().yieldsAsync(null);
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
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
        .next(function(err) {
          expect(clients.read).to.not.be.called;
          expect(grants.find).to.not.be.called;
          expect(loginHint.generate).to.not.be.called;
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Missing required parameter: client_id');
          expect(err.code).to.equal('invalid_request');
          expect(err.status).to.equal(400);
          done();
        })
        .listen();
    }); // should next with error when request is missing client_id parameter
    
    it('should next with error when request is missing origin parameter', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      var grants = new Object();
      grants.find = sinon.stub().yieldsAsync(null);
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      var handler = factory(loginHint, grants, clients, { authenticate: authenticate });
    
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
        .next(function(err) {
          expect(clients.read).to.not.be.called;
          expect(grants.find).to.not.be.called;
          expect(loginHint.generate).to.not.be.called;
          
          expect(err).to.be.an.instanceOf(Error);
          expect(err.message).to.equal('Missing required parameter: origin');
          expect(err.code).to.equal('invalid_request');
          expect(err.status).to.equal(400);
          done();
        })
        .listen();
    }); // should next with error when request is missing origin parameter
    
  }); // handler
  
});
