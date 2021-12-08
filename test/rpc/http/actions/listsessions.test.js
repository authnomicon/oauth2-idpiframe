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
    
    var handler = factory(authenticateSpy);
    
    expect(authenticateSpy).to.be.calledOnce;
    expect(authenticateSpy).to.be.calledWithExactly([ 'session', 'anonymous' ], { multi: true });
  });
  
  it('should do something', function(done) {
    var handler = factory(authenticate);
    
    chai.express.use(handler)
      .request(function(req, res) {
        req.query = {
          action: 'checkOrigin'
        };
      })
      .finish(function() {
        expect(this).to.have.status(200);
        expect(this).to.have.body({ beep: 'boop' });
        done();
      })
      .listen();
  }); // should dispatch action
  
});
