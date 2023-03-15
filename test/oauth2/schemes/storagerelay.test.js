/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../com/oauth2/schemes/storagerelay');


describe('oauth2/schemes/storagerelay', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:@authnomicon/oauth2.resolveRedirectURISchemeFn');
    expect(factory['@scheme']).to.equal('storagerelay');
  });
  
  describe('resolve', function() {
    var resolve = factory();
    
    it('should resolve URL with http scheme', function() {
      var url = resolve('storagerelay://http/example.com?id=auth304970');
      expect(url).to.deep.equal('http://example.com');
    }); // should resolve URL with http scheme
    
    it('should resolve URL with http scheme and port', function() {
      var url = resolve('storagerelay://http/example.com:8080?id=auth304970');
      expect(url).to.deep.equal('http://example.com:8080');
    }); // should resolve URL with http scheme and port
    
    it('should resolve URL with https scheme', function() {
      var url = resolve('storagerelay://https/example.com?id=auth304970');
      expect(url).to.deep.equal('https://example.com');
    }); // should resolve URL with https scheme
    
    it('should resolve URL with https scheme and port', function() {
      var url = resolve('storagerelay://https/example.com:8080?id=auth304970');
      expect(url).to.deep.equal('https://example.com:8080');
    }); // should resolve URL with https scheme and port
    
    it('should resolve URL with chrome-extension scheme', function() {
      var url = resolve('storagerelay://chrome-extension/example?id=auth304970');
      expect(url).to.deep.equal('chrome-extension://example');
    }); // should resolve URL with chrome-extension scheme
    
    it('should resolve example URI from specification', function() {
      var url = resolve('storagerelay://https/rp.com?id=auth304970');
      expect(url).to.deep.equal('https://rp.com');
    }); //should resolve example URI from specification
    
  }); // resolve
  
});
