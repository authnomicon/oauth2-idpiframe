/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/rpc/service');


describe('rpc/service', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.bixbyjs.org/http/Service');
    expect(factory['@path']).to.equal('/oauth2/iframerpc');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  it('should construct service', function() {
    var router = new Object();
    router.handle = function(){};
    sinon.stub(router.handle, 'bind').returnsThis();
    
    var service = factory(router);
    
    expect(service).to.be.a('function');
    expect(service.length).to.equal(3);
    expect(router.handle.bind).to.be.calledOnceWith(router);
  });
  
});
