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
  
  describe('issue', function() {
    var container = new Object();
    container.components = sinon.stub()
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
    var lhs = new Object();
    
    var permissionSpy = sinon.stub();
    var factory = $require('../../../../../../com/oauth2/authorize/http/response/types/permission', {
      'oauth2orize-permission': {
        grant: { permission: permissionSpy }
      }
    });
    
    var issue;
    
    beforeEach(function(done) {
      lhs.issue = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      
      //factory(lhs, logger, container)
      factory(logger, container)
        .then(function(type) {
          issue = permissionSpy.getCall(0).args[1];
          done();
        })
        .catch(done);
    });
    
    it('should issue login hint', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example Client'
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true
      }
      var areq = {
        type: 'id_token',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.com/cb',
        state: 'xyz'
      }
      
      issue(client, user, ares, areq, {}, function(err, hint) {
        if (err) { return done(err); }
        
        /*
        expect(idts.issue.callCount).to.equal(1);
        expect(idts.issue.getCall(0).args[0]).to.deep.equal({
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          }
        });
        */
        expect(hint).to.equal('A-LOGIN-HINT');
        done();
      });
    }); // should issue login hint
    
  }); // issue
  
});
