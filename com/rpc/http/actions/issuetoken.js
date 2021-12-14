exports = module.exports = function(evaluate, clients, server, authenticate, state) {
  var oauth2orize = require('oauth2orize');
  
  // TODO: Evaluate is going to need to process login hint and/or id token to select appropriate user
  //.   Maybe even reject requests without it.
  
  return [
    function(req, res, next) {
      console.log('ISSUE TOKEN BODY');
      console.log(req.query);
      next();
    },
    state({ external: true }),
    authenticate([ 'session', 'anonymous' ], { multi: true }),
    server.authorization(
      function validateClient(clientID, redirectURI, cb) {
        console.log('IDP IFRAME VALIDATE CLIENT');
        console.log(clientID);
        console.log(redirectURI);
        
        // TODO: Implement this properly
        
        clients.read(clientID, function(err, client) {
        //clients.read('1', function(err, client) {
          console.log('READ CLIENT');
          console.log(err);
          console.log(client);
          
          if (err) { return cb(err); }
          if (!client) {
            return cb(new oauth2orize.AuthorizationError('The OAuth client was not found.', 'invalid_client', undefined, 401));
          }
          
          return cb(null, client);
        });
      },
      function(txn, cb) {
        return cb(null, false);
      }
    ),
    function(req, res, next) {
      var origin = req.query.origin;
      var loginHint = req.query.login_hint;
      
      if (!origin) {
        return next(new oauth2orize.AuthorizationError('Missing required parameter: origin', 'invalid_request'));
      }
      if (!loginHint) {
        return next(new oauth2orize.AuthorizationError('Missing required parameter: login_hint', 'invalid_request'));
      }
      
      var client = req.oauth2.client;
      if (!client.webOrigins || client.webOrigins.indexOf(origin) == -1) {
        return next(new oauth2orize.AuthorizationError('Invalid client for this origin.', 'access_denied'));
      }
      
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
    evaluate,
    
    // TODO: Add error handling middleware here
    // TODO: Check that this is right and not reloading the txn
    server.authorizationError()
  ];
};

exports['@action'] = 'issueToken';
exports['@require'] = [
  'org.authnomicon/oauth2/authorize/http/middleware/evaluate',
  'http://i.authnomicon.org/oauth2/ClientDirectory',
  'org.authnomicon/oauth2/http/server',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/state'
];
