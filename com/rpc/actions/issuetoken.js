var iframerpc = require('../../../lib/iframerpc')
  , aaa = require('triplea');

exports = module.exports = function(service, evaluate, clients, server, authenticator, store) {
  var oauth2orize = require('oauth2orize');
  
  // TODO: Evaluate is going to need to process login hint and/or id token to select appropriate user
  //.   Maybe even reject requests without it.
  
  // WIP: look at jarm response mode
  
  return [
    function(req, res, next) {
      console.log('ISSUE TOKEN BODY');
      console.log(req.query);
      next();
    },
    ////state({ external: true }), // FIXME: is store argument to component needed?
    require('flowstate')({ external: true, store: store }), // TODO: can this be removed
    function(req, res, next) {
      // Inspired by https://expressjs.com/en/4x/api.html#req.xhr
      req.iframerpc = true;
      next();
    },
    authenticator.authenticate([ 'session', 'anonymous' ], { multi: true }),
    server.authorization(
      function validateClient(areq, cb) {
        console.log('IDP IFRAME VALIDATE CLIENT');
        console.log(areq);
        //console.log(redirectURI);
      
        // TODO: Implement this properly
      
        clients.read(areq.clientID, function(err, client) {
        //clients.read('1', function(err, client) {
          console.log('READ CLIENT');
          console.log(err);
          console.log(client);
        
          if (err) { return cb(err); }
          if (!client) {
            return cb(new oauth2orize.TokenError('The OAuth client was not found.', 'invalid_client'));
          }
          if (!client.webOrigins || client.webOrigins.indexOf(areq.origin) == -1) {
            return cb(new oauth2orize.TokenError('Invalid client for this origin.', 'access_denied', null, 403));
          }
        
          return cb(null, client);
        });
      },
      function(txn, cb) {
        console.log('IMMEDIATE MODE IFRAME!');
        console.log(txn);
        
        
        /* Responses seen
404
{
  "error" : "invalid_request",
  "error_description" : "invalid login_hint."
}
        
// this is the response from iframerpc in google    
200 {"error":"IMMEDIATE_FAILED","detail":"Request could not be auto-approved."}
// and translated to this on the client
id: "T7OGGTMR"
result {error: 'immediate_failed', detail: 'Request could not be auto-approved.', thrown_by: 'server'}
rpcToken:  "cfjh_jzcXhhT7mLM"
        */
        
      
        var zreq = new aaa.Request(txn.client, txn.req, txn.user);
        service(zreq, function(err, zres) {
          console.log(err);
          console.log(zres);
          
          if (err) { return cb(err); }
          
          if (zres.allow === true) {
            var ares = {};
            ares.scope = zres.grant;
            
            // FIXME: remove this
            ares.issuer = 'http://localhost:8085'
            
            /*
            // TODO: put a normalized grant on here, if it exists
            // TODO: normalize this into standard grant object.
            // https://openid.bitbucket.io/fapi/oauth-v2-grant-management.html
            //if (Array.isArray(zres.grant) // TODO: check for array of strings only.
            
            grant.scopes = [ { scope: zres.grant } ];
            console.log(grant)
            */
            
            return cb(null, true, ares);
          } else {
            // Matches Google's response
            return cb(new iframerpc.IFrameRPCError('Request could not be auto-approved.', 'IMMEDIATE_FAILED', 200));
          }
        });
      
      
      
        //return cb(null, false);
      }
    ),
    function(req, res, next) {
      if (!req.user) {
        // matches Google's response, even though non-standard
        return res.status(200).json({ error: 'USER_LOGGED_OUT', detail: 'No active session found.' });
      }
      
      // TODO: Select user based on login hint, or make sure its the authed user
      
      
      console.log('OVERRIDE IDP IFRAME STUFF');
      req.oauth2.req.responseMode = '.iframerpc';
      req.oauth2.req.prompt = [ 'none' ];
        
      
      next();
    },
    function(err, req, res, next) {
      if (err.constructor.name !== 'IFrameRPCError') { return next(err); }
      return res.status(err.status || 500).json({ error: err.code, detail: err.message });
    }
    
    // TODO: Add error handling middleware here
    // TODO: Check that this is right and not reloading the txn
    //server.authorizationError()
  ];
};

exports['@action'] = 'issueToken';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/AuthorizationService',
  'org.authnomicon/oauth2/authorize/http/middleware/evaluate',
  'http://i.authnomicon.org/oauth2/ClientDirectory',
  'org.authnomicon/oauth2/http/server',
  'module:@authnomicon/session.Authenticator',
  'module:flowstate.Store'
];
