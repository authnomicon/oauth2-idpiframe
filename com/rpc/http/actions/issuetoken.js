// WIP: action dispatching

exports = module.exports = function(evaluate, clients, server, authenticate, state) {
  
  
  function debug(req, res, next) {
    console.log('ISSUE TOKEN RPC')
    console.log(req.query);
    console.log(req.user);
    next();
  }
  
  
  // TODO: Evaluate is going to need to process login hint and/or id token to select appropriate user
  //.   Maybe even reject requests without it.
  
  return [
    authenticate([ 'session', 'anonymous' ], { multi: true }),
    state({ external: true }),
    debug,
    server.authorization(
      function validateClient(clientID, redirectURI, cb) {
        console.log('IDP IFRAME VALIDATE CLIENT');
        console.log(clientID);
        console.log(redirectURI);
        
        // TODO: Implement this properly
        
        //clients.read(clientID, function(err, client) {
        clients.read('1', function(err, client) {
          console.log('READ CLIENT');
          console.log(err);
          console.log(client);
          
          return cb(null, client, redirectURI);
        });
      },
      function(txn, cb) {
        console.log('IDP IFRAME IMMEDIATE');
        console.log(txn)
        
        // check login_hint here?
        
        return cb(null, false);
      }
    ),
    function(req, res, next) {
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
