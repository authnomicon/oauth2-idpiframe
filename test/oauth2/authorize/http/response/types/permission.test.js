/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../../../com/oauth2/authorize/http/response/types/permission');


describe('oauth2/authorize/http/response/types/permission', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/ResponseType');
    expect(factory['@type']).to.equal('permission');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  
  var logger = {
    emergency: function(){},
    alert: function(){},
    critical: function(){},
    error: function(){},
    warning: function(){},
    notice: function(){},
    info: function(){},
    debug: function(){}
  };
  
  it('should create response type without response modes', function(done) {
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
    
    var permissionSpy = sinon.stub();
    var factory = $require('../../../../../../com/oauth2/authorize/http/response/types/permission', {
      'oauth2orize-permission': {
        grant: { permission: permissionSpy }
      }
    });
    
    factory(logger, container)
      .then(function(type) {
        expect(permissionSpy).to.be.calledOnce;
        expect(permissionSpy).to.be.calledWith({ modes: {} });
        done();
      })
      .catch(done);
  }); // should create response type without response modes
  
});
