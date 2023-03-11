/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../com/loginhintservice');


describe('loginhintservice', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:@authnomicon/oauth2-idpiframe.LoginHintService');
    expect(factory['@singleton']).to.be.true;
  });
  
  describe('default behavior', function() {
    var lhs = factory();
    
    describe('#generate', function() {
      
      it('should yield user ID', function(done) {
        var user = {
          id: '248289761001',
          displayName: 'Jane Doe'
        };
        var client = {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          redirectURIs: [ 'https://client.example.com/cb' ]
        };
        
        lhs.generate(user, client, function(err, hint) {
          if (err) { return done(err); }
          expect(hint).to.equal('248289761001')
          done();
        });
      }); // should yield user ID
      
    }); // #generate
    
  }); // default behavior
  
});
