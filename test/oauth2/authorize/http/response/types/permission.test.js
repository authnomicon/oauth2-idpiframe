/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../../../com/oauth2/authorize/http/response/types/permission');


describe('oauth2/authorize/http/response/types/permission', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:oauth2orize.RequestProcessor');
    expect(factory['@type']).to.equal('permission');
  });
  
  // TODO: review this
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
  
  it('should create processor without responders', function(done) {
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:oauth2orize.Responder').returns([]);
    
    var permissionSpy = sinon.stub();
    var factory = $require('../../../../../../com/oauth2/authorize/http/response/types/permission', {
      'oauth2orize-permission': {
        grant: { permission: permissionSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(permissionSpy).to.be.calledOnceWith({
          modes: {}
        });
        done();
      })
      .catch(done);
  }); // should create response type without response modes
  
  it('should create processor with responders', function(done) {
    var fragmentResponder = function(){};
    var fragmentResponderComponent = new Object();
    fragmentResponderComponent.create = sinon.stub().resolves(fragmentResponder);
    fragmentResponderComponent.a = { '@mode': 'fragment' };
    var formPostResponder = function(){};
    var formPostResponderComponent = new Object();
    formPostResponderComponent.create = sinon.stub().resolves(formPostResponder);
    formPostResponderComponent.a = { '@mode': 'form_post' };
    
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:oauth2orize.Responder').returns([
      fragmentResponderComponent,
      formPostResponderComponent
    ]);
    
    var permissionSpy = sinon.stub();
    var factory = $require('../../../../../../com/oauth2/authorize/http/response/types/permission', {
      'oauth2orize-permission': {
        grant: { permission: permissionSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(permissionSpy).to.be.calledOnceWith({
          modes: {
            fragment: fragmentResponder,
            form_post: formPostResponder
          }
        });
        done();
      })
      .catch(done);
  }); // should create processor with responders
  
  it('should create processor with responders but excluding query responder', function(done) {
    var queryResponder = function(){};
    var queryResponderComponent = new Object();
    queryResponderComponent.create = sinon.stub().resolves(queryResponder);
    queryResponderComponent.a = { '@mode': 'query' };
    var fragmentResponder = function(){};
    var fragmentResponderComponent = new Object();
    fragmentResponderComponent.create = sinon.stub().resolves(fragmentResponder);
    fragmentResponderComponent.a = { '@mode': 'fragment' };
    
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:oauth2orize.Responder').returns([
      queryResponderComponent,
      fragmentResponderComponent
    ]);
    
    var permissionSpy = sinon.stub();
    var factory = $require('../../../../../../com/oauth2/authorize/http/response/types/permission', {
      'oauth2orize-permission': {
        grant: { permission: permissionSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(permissionSpy).to.be.calledOnceWith({
          modes: {
            fragment: fragmentResponder
          }
        });
        done();
      })
      .catch(done);
  }); // should create processor with responders but excluding query responder
  
  describe('default behavior', function() {
    var loginHint = new Object();
    
    var issue;
    
    beforeEach(function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:oauth2orize.Responder').returns([]);
      loginHint.generate = sinon.stub().yieldsAsync(null, 'AJMrCA...');
      
      var permissionSpy = sinon.stub();
      var factory = $require('../../../../../../com/oauth2/authorize/http/response/types/permission', {
        'oauth2orize-permission': {
          grant: { permission: permissionSpy }
        }
      });
      
      factory(loginHint, logger, container)
        .then(function(processor) {
          expect(permissionSpy).to.be.calledOnceWith({
            modes: {}
          });
          
          issue = permissionSpy.getCall(0).args[1];
          done();
        })
        .catch(done);
    });
    
    it('should issue login hint', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true
      }
      var areq = {
        type: 'permission',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.com/cb',
        state: 'xyz'
      }
      
      issue(client, user, ares, areq, {}, function(err, hint) {
        if (err) { return done(err); }
        
        expect(loginHint.generate.callCount).to.equal(1);
        expect(loginHint.generate.getCall(0).args[0]).to.equal('248289761001');
        expect(loginHint.generate.getCall(0).args[1]).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          redirectURIs: [ 'https://client.example.com/cb' ]
        });
        expect(hint).to.equal('AJMrCA...');
        done();
      });
    });
    
  }); // default behavior
  
});
