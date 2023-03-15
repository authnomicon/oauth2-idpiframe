/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../../../com/oauth2/authorize/http/response/schemes/storagerelay');


describe('oauth2/authorize/http/response/schemes/storagerelay', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme');
    expect(factory['@scheme']).to.equal('storagerelay');
  });
  
  describe('resolve', function() {
    var resolve = factory();
    
    it('should verify redirect URI with http scheme', function() {
      var v = resolve('storagerelay://http/example.com?id=auth304970');
      expect(v).to.deep.equal('http://example.com');
    }); // should verify redirect URI with http scheme
    
    it('should verify redirect URI with http scheme and port', function() {
      var v = resolve('storagerelay://http/example.com:8888?id=auth304970');
      expect(v).to.deep.equal('http://example.com:8888');
    }); // should verify redirect URI with http scheme and port
    
    it('should verify redirect URI with https scheme', function() {
      var v = resolve('storagerelay://https/example.com?id=auth304970');
      expect(v).to.deep.equal('https://example.com');
    }); // should verify redirect URI with https scheme
    
    it('should verify redirect URI with https scheme and port', function() {
      var v = resolve('storagerelay://https/example.com:8888?id=auth304970');
      expect(v).to.deep.equal('https://example.com:8888');
    }); // should verify redirect URI with https scheme
    
    it('should verify redirect URI with chrome-extension scheme', function() {
      var v = resolve('storagerelay://chrome-extension/example?id=auth304970');
      expect(v).to.deep.equal('chrome-extension://example');
    }); // should verify redirect URI with chrome-extension scheme
    
    it('should verify example redirect URI', function() {
      var v = resolve('storagerelay://https/rp.com?id=auth304970');
      expect(v).to.deep.equal('https://rp.com');
    }); // should verify example redirect URI
    
  }); // resolve
  
});
