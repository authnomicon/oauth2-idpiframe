/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../com/id/loginhint');


describe('id/loginhint', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.true;
  });
  
});
