/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/rpc/http/actions/checkorigin');


describe('rpc/http/actions/checkorigin', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@action']).to.equal('checkOrigin');
    expect(factory['@singleton']).to.be.undefined;
  });
  
});
