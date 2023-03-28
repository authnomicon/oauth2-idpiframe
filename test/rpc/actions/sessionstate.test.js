/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../com/rpc/actions/sessionstate');


describe('rpc/actions/sessionstate', function() {
  
  it('should be annotated', function() {
    expect(factory['@action']).to.equal('sessionState');
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
            action: 'sessionState',
            login_hint: 'AJMrCA...',
            origin: 'https://client.example.com'
          };
        })
        .finish(function() {
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({
            activeHints: {
              'AJMrCA...': {
                extraQueryParams: { authuser: '0' }
              }
            }
          });
          done();
        })
        .listen();
    }); // should respond when origin is valid
    
  });
  
});
