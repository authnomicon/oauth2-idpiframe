/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../../../com/oauth2/authorize/http/response/modes/iframerpc');


describe('oauth2/authorize/http/response/modes/iframerpc', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode');
    expect(factory['@mode']).to.equal('.iframerpc');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should create response mode', function() {
    var mode = factory();
    expect(mode).to.be.a('function');
  }); // should create response mode
  
  describe('extend', function() {
    var loginHint = new Object();
    
    var iframerpcrmSpy = sinon.spy();
    var factory = $require('../../../../../../com/oauth2/authorize/http/response/modes/iframerpc', {
      'oauth2orize-iframerpcrm': iframerpcrmSpy
    });
    
    var mode = factory();
    //expect(iframerpcrmSpy).to.be.calledOnce;
    
    var extend = iframerpcrmSpy.getCall(0).args[0];
    
    it('should extend with session state', function(done) {
      var txn = {
        client: {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          redirectURIs: [ 'https://client.example.com/cb' ]
        },
        redirectURI: 'https://client.example.com/cb',
        req: {
          type: 'token id_token',
          clientID: 's6BhdRkqt3',
          redirectURI: 'https://client.example.com/cb'
        },
        user: {
          id: '248289761001',
          displayName: 'Jane Doe'
        },
        res: {
          allow: true,
          authContext: {
            sessionID: 'FyBCzClUrj7h3dn4tB-6jCqAvqgID6A9',
            sessionSelector: '0'
          }
        }
      };
      
      extend(txn, function(err, params) {
        if (err) { return done(err); }
        expect(params).to.deep.equal({
          session_state: {
            extraQueryParams: {
              ss: '0'
            }
          }
        });
        done();
      });
    }); // should extend with session state
    
  }); // extend
  
});
