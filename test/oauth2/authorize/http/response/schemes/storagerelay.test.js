/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../../../com/oauth2/authorize/http/response/schemes/storagerelay');


describe('oauth2/authorize/http/response/schemes/storagerelay', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme');
    expect(factory['@scheme']).to.equal('storagerelay');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  var scheme = factory();
  
  describe('scheme', function() {
    
    describe('#verify', function() {
      
      it('should verify redirect URI with http scheme', function() {
        var client = {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          webOrigins: [ 'http://example.com' ]
        };
        
        var v = scheme.verify(client, 'storagerelay://http/example.com?id=auth304970');
        expect(v).to.deep.equal([ 'storagerelay://http/example.com?id=auth304970', 'http://example.com' ]);
      }); // should verify redirect URI with http scheme
      
      it('should verify redirect URI with http scheme and port', function() {
        var client = {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          webOrigins: [ 'http://example.com:8888' ]
        };
        
        var v = scheme.verify(client, 'storagerelay://http/example.com:8888?id=auth304970');
        expect(v).to.deep.equal([ 'storagerelay://http/example.com:8888?id=auth304970', 'http://example.com:8888' ]);
      }); // should verify redirect URI with http scheme and port
      
      it('should verify redirect URI with https scheme', function() {
        var client = {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          webOrigins: [ 'https://example.com' ]
        };
        
        var v = scheme.verify(client, 'storagerelay://https/example.com?id=auth304970');
        expect(v).to.deep.equal([ 'storagerelay://https/example.com?id=auth304970', 'https://example.com' ]);
      }); // should verify redirect URI with https scheme
      
      it('should verify redirect URI with https scheme and port', function() {
        var client = {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          webOrigins: [ 'https://example.com:8888' ]
        };
        
        var v = scheme.verify(client, 'storagerelay://https/example.com:8888?id=auth304970');
        expect(v).to.deep.equal([ 'storagerelay://https/example.com:8888?id=auth304970', 'https://example.com:8888' ]);
      }); // should verify redirect URI with https scheme
      
      it('should verify redirect URI with chrome-extension scheme', function() {
        var client = {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          webOrigins: [ 'chrome-extension://example' ]
        };
        
        var v = scheme.verify(client, 'storagerelay://chrome-extension/example?id=auth304970');
        expect(v).to.deep.equal([ 'storagerelay://chrome-extension/example?id=auth304970', 'chrome-extension://example' ]);
      }); // should verify redirect URI with chrome-extension scheme
      
      it('should verify example redirect URI', function() {
        var client = {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          webOrigins: [ 'https://rp.com' ]
        };
        
        var v = scheme.verify(client, 'storagerelay://https/rp.com?id=auth304970');
        expect(v).to.deep.equal([ 'storagerelay://https/rp.com?id=auth304970', 'https://rp.com' ]);
      }); // should verify example redirect URI
      
      it('should not verify when no registered origins', function() {
        var client = {
          id: 's6BhdRkqt3',
          name: 'My Example Client'
        };
        
        var v = scheme.verify(client, 'storagerelay://https/rp.com?id=auth304970');
        expect(v).to.be.false;
      }); // should not verify when no registered origins
      
      it('should not verify unregistered origin', function() {
        var client = {
          id: 's6BhdRkqt3',
          name: 'My Example Client',
          webOrigins: [ 'https://rp.net' ]
        };
        
        var v = scheme.verify(client, 'storagerelay://https/rp.com?id=auth304970');
        expect(v).to.be.false;
      }); // should not verify unregistered origin
    
    }); // #verify
    
  }); // scheme
  
});
