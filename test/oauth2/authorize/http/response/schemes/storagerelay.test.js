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
        var v = scheme('storagerelay://http/example.com?id=auth304970');
        expect(v).to.deep.equal('http://example.com');
      }); // should verify redirect URI with http scheme
      
      it('should verify redirect URI with http scheme and port', function() {
        var v = scheme('storagerelay://http/example.com:8888?id=auth304970');
        expect(v).to.deep.equal('http://example.com:8888');
      }); // should verify redirect URI with http scheme and port
      
      it('should verify redirect URI with https scheme', function() {
        var v = scheme('storagerelay://https/example.com?id=auth304970');
        expect(v).to.deep.equal('https://example.com');
      }); // should verify redirect URI with https scheme
      
      it('should verify redirect URI with https scheme and port', function() {
        var v = scheme('storagerelay://https/example.com:8888?id=auth304970');
        expect(v).to.deep.equal('https://example.com:8888');
      }); // should verify redirect URI with https scheme
      
      it('should verify redirect URI with chrome-extension scheme', function() {
        var v = scheme('storagerelay://chrome-extension/example?id=auth304970');
        expect(v).to.deep.equal('chrome-extension://example');
      }); // should verify redirect URI with chrome-extension scheme
      
      it('should verify example redirect URI', function() {
        var v = scheme('storagerelay://https/rp.com?id=auth304970');
        expect(v).to.deep.equal('https://rp.com');
      }); // should verify example redirect URI
    
    }); // #verify
    
  }); // scheme
  
});
