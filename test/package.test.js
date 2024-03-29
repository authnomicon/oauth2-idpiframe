/* global describe, it */

var expect = require('chai').expect;


describe('@authnomicon/oauth2-idpiframe', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('org.authnomicon/oauth2/idpiframe');
      
      expect(json.assembly.components).to.deep.equal([
        'loginhintservice',
        'oauth2/parameters',
        'oauth2/grants/permission',
        'oauth2/schemes/storagerelay',
        'oauth2/authorize/http/response/modes/iframerpc',
        'iframe/service',
        'rpc/service'
      ]);
    });
  });
  
});
