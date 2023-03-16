/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../com/rpc/router');
var actions = require('../../lib/iframerpc')


describe('rpc/router', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct router', function() {
    function checkOrigin() {};
    function issueToken() {};
    function listSessions() {};
    
    var router = factory(checkOrigin, issueToken, listSessions);
    
    expect(router).to.be.an.instanceof(actions.Router);
  });
  
});
