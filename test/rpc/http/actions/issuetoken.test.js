/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/rpc/http/actions/issuetoken');
var oauth2orize = require('oauth2orize');


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
          req.oauth2.req = {
            type: req.query.response_type,
            scope: req.query.scope && req.query.scope.split(' ')
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
    
    it('should evaluate request', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(evaluate, clients, server, authenticate, state);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'issueToken',
            response_type: 'token id_token',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.com',
            scope: 'profile email',
            login_hint: 'AJMrCA...',
            ss_domain: 'https://client.example.com'
          };
        })
        .finish(function() {
          expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
          expect(this.req.oauth2.client).to.deep.equal({
            id: 's6BhdRkqt3',
            name: 'My Example Client',
            webOrigins: [ 'https://client.example.com' ]
          });
          expect(this.req.oauth2.redirectURI).to.be.undefined;
          expect(this.req.oauth2.webOrigin).to.be.undefined;
          expect(this.req.oauth2.req).to.deep.equal({
            type: 'token id_token',
            responseMode: '.iframerpc',
            scope: [ 'profile', 'email' ],
            prompt: [ 'none' ]
          });
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({
            access_token: '2YotnFZFEjr1zCsicMWpAA',
            token_type: 'example'
          });
          done()
        })
        .listen();
    }); // should evaluate request
    
    it('should reject request from unregistered client', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      var handler = factory(evaluate, clients, server, authenticate, state);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'issueToken',
            response_type: 'token id_token',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.com',
            scope: 'profile email',
            login_hint: 'AJMrCA...',
            ss_domain: 'https://client.example.com'
          };
        })
        .next(function(err, req, res) {
          expect(err).to.be.an.instanceOf(oauth2orize.AuthorizationError);
          expect(err.message).to.equal('The OAuth client was not found.');
          expect(err.code).to.equal('invalid_client');
          expect(err.status).to.equal(401);
          
          expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
          done();
        })
        .listen();
    }); // should reject request from unregistered client
    
    it('should reject request from client using unregistered origin', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(evaluate, clients, server, authenticate, state);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'issueToken',
            response_type: 'token id_token',
            client_id: 's6BhdRkqt3',
            origin: 'https://client.example.net',
            scope: 'profile email',
            login_hint: 'AJMrCA...',
            ss_domain: 'https://client.example.com'
          };
        })
        .next(function(err, req, res) {
          expect(err).to.be.an.instanceOf(oauth2orize.AuthorizationError);
          expect(err.message).to.equal('Invalid client for this origin.');
          expect(err.code).to.equal('access_denied');
          expect(err.status).to.equal(403);
          
          expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
          done();
        })
        .listen();
    }); // should reject request from client using unregistered origin
    
    it('should reject request when missing origin parameter', function(done) {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      var handler = factory(evaluate, clients, server, authenticate, state);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.query = {
            action: 'issueToken',
            response_type: 'token id_token',
            client_id: 's6BhdRkqt3',
            scope: 'profile email',
            login_hint: 'AJMrCA...',
            ss_domain: 'https://client.example.com'
          };
        })
        .next(function(err, req, res) {
          expect(err).to.be.an.instanceOf(oauth2orize.AuthorizationError);
          expect(err.message).to.equal('Missing required parameter: origin');
          expect(err.code).to.equal('invalid_request');
          expect(err.status).to.equal(400);
          
          expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
          done();
        })
        .listen();
    }); // should reject request when missing origin parameter
    
  }); // handler
  
});
