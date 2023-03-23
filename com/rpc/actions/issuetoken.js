var iframerpc = require('../../../lib/iframerpc')
  , aaa = require('aaatrio');

exports = module.exports = function(service, clients, server, authenticator, store) {
  var oauth2orize = require('oauth2orize');
  
  // TODO: Evaluate is going to need to process login hint and/or id token to select appropriate user
  //.   Maybe even reject requests without it.
  
  // WIP: look at jarm response mode
  
  return [
    function(req, res, next) {
      // Inspired by https://expressjs.com/en/4x/api.html#req.xhr
      req.iframerpc = true;
      next();
    },
    // TODO: authenticate by login_hint
    // TODO: Select user based on login hint, or make sure its the authed user
    authenticator.authenticate([ 'session', 'anonymous' ], { multi: true }),
    server.authorization(
      function validateClient(areq, cb) {
        clients.read(areq.clientID, function(err, client) {
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
        
        // TODO: Put this back
        /*
      if (!req.user) {
        // matches Google's response, even though non-standard
        return res.status(200).json({ error: 'USER_LOGGED_OUT', detail: 'No active session found.' });
      }
        */
        
      
        var zreq = new aaa.Request(txn.client);
        zreq.user = txn.user;
        
        service(zreq, function(err, zres) {
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
      }
    ),
    function(err, req, res, next) {
      if (err.constructor.name !== 'IFrameRPCError') { return next(err); }
      return res.status(err.status || 500).json({ error: err.code, detail: err.message });
    }
  ];
};

exports['@action'] = 'issueToken';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/AuthorizationService',
  'http://i.authnomicon.org/oauth2/ClientDirectory',
  'org.authnomicon/oauth2/http/server',
  'module:@authnomicon/session.Authenticator',
  'module:flowstate.Store'
];
