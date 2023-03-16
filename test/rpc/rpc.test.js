/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../com/rpc/rpc');
var iframerpc = require('../../lib/iframerpc')


describe('rpc/rpc', function() {
  
  it('should construct router', function() {
    function checkOrigin() {};
    function issueToken() {};
    function listSessions() {};
    
    var router = factory(checkOrigin, issueToken, listSessions);
    
    expect(router).to.be.an.instanceof(iframerpc.Router);
  });
  
  describe('router', function() {
    
    it('should dispatch checkOrigin action', function(done) {
      var checkOrigin = sinon.spy(function(req, res, next) {
        res.json({ valid: true });
      });
      var issueToken = sinon.spy();
      var listSessions = sinon.spy();
    
      var router = factory(checkOrigin, issueToken, listSessions);
    
      chai.express.use(router.handle.bind(router))
        .request(function(req, res) {
          req.query = {
            action: 'checkOrigin'
          };
        })
        .finish(function() {
          expect(checkOrigin).to.have.been.calledOnce;
          expect(issueToken).to.not.have.been.called;
          expect(listSessions).to.not.have.been.calledOnce;
          
          expect(this).to.have.status(200);
          expect(this).to.have.body({ valid: true });
          done();
        })
        .next(done)
        .listen();
    }); // should dispatch checkOrigin action
    
    it('should respond with error when request is missing action parameter', function(done) {
      var checkOrigin = sinon.spy();
      var issueToken = sinon.spy();
      var listSessions = sinon.spy();
    
      var router = factory(checkOrigin, issueToken, listSessions);
    
      chai.express.use(router.handle.bind(router))
        .request(function(req, res) {
          req.query = {};
        })
        .finish(function() {
          expect(checkOrigin).to.not.have.been.called;
          expect(issueToken).to.not.have.been.called;
          expect(listSessions).to.not.have.been.calledOnce;
          
          expect(this).to.have.status(400);
          expect(this).to.have.body({
            error: 'invalid_request',
            error_description: 'No action specified!'
          });
          done();
        })
        .next(done)
        .listen();
    }); // should respond with error when request is missing action parameter
    
  }); // router
  
});
