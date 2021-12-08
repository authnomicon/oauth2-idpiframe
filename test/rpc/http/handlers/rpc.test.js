/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/rpc/http/handlers/rpc');


describe('rpc/http/handlers/rpc', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should dispatch action', function(done) {
    var actions = new Object();
    actions.dispatch = sinon.spy(function(action, req, res, next) {
      expect(action).to.equal('checkOrigin');
      res.json({ valid: true });
    });
    
    var handler = factory(actions);
    
    chai.express.use(handler)
      .request(function(req, res) {
        req.query = {
          action: 'checkOrigin'
        };
      })
      .finish(function() {
        expect(this).to.have.status(200);
        expect(this).to.have.body({ valid: true });
        done();
      })
      .listen();
  }); // should dispatch action
  
});
