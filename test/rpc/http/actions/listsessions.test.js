/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/rpc/http/actions/listsessions');


describe('rpc/http/actions/listsessions', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@action']).to.equal('listSessions');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  
  function authenticate() {
    return function(req, res, next) {
      next();
    };
  }
  
  it('should create handler', function() {
    var authenticateSpy = sinon.spy(authenticate);
    
    var handler = factory(null, authenticateSpy);
    
    expect(authenticateSpy).to.be.calledOnce;
    expect(authenticateSpy).to.be.calledWithExactly([ 'session', 'anonymous' ], { multi: true });
  });
  
  describe('handler', function() {
    
    it('should list single session', function(done) {
      var loginHint = new Object();
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      
      var handler = factory(loginHint, authenticate);
    
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
          expect(this).to.have.status(200);
          expect(this).to.have.body({
            sessions: [
              { login_hint: 'AJMrCA...', session_state: { extraQueryParams: { ss: '0' } } }
            ]
          });
          done();
        })
        .listen();
    }); // should list single session
    
  }); // handler
  
});
