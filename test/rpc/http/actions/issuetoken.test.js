/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/rpc/http/actions/issuetoken');


describe('rpc/http/actions/issuetoken', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@action']).to.equal('issueToken');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  
  function evaluate(req, res, next) {
    res.json({ access_token: '2YotnFZFEjr1zCsicMWpAA', token_type: 'example' });
  };
  
  var server = {
    authorization: function(validate, immediate) {
      return function(req, res, next) {
        validate(req.query.client_id, req.query.redirect_uri, function(err, client, redirectURI, webOrigin) {
          if (err) { return next(err); }
          req.oauth2 = {
            client: client,
            redirectURI: redirectURI,
            webOrigin: webOrigin
          };
        
          immediate(req.oauth2, function(err, allow) {
            if (err) { return next(err); }
            if (allow) { return res.redirect(req.oauth2.redirectURI); }
            return next();
          })
        })
      };
    },
    
    authorizationError: function() {
      return function(err, req, res, next) {
        next(err);
      };
    }
  };
  
  function authenticate() {
    return function(req, res, next) {
      next();
    };
  }
  
  function state() {
    return function(req, res, next) {
      next();
    };
  }
  
  describe('handler', function() {
    
  }); // handler
  
});
