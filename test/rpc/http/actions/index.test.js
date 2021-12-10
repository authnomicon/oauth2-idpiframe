/* global describe, it */

var expect = require('chai').expect;
var factory = require('../../../../com/rpc/http/actions/index');
var actions = require('../../../../lib/actions')


describe('rpc/http/actions/index', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct', function() {
    function checkOrigin() {};
    function issueToken() {};
    function listSessions() {};
    
    var router = factory(checkOrigin, issueToken, listSessions);
    
    expect(router).to.be.an.instanceof(actions.Router);
  });
  
});
