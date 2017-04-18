exports = module.exports = function(server, validateClient, processTransaction, completeTransaction, authenticate) {
  
  
  /*
  
   * https://accounts.google.com/o/oauth2/iframerpc?action=issueToken&response_type=token%20id_token&scope=profile%20email&client_id=4833673.apps.googleusercontent.com&login_hint=AJMrCA...&ss_domain=http%3A%2F%2Fexamplerp.com&origin=http%3A%2F%2Fexamplerp.com  
   */
  
  var internals = {};
  
  internals.parse = function(req) {
    console.log('PARSE IT!');
    console.log(req.query)
    
    return {
      iframe: true,
      prompt: [ 'none' ],
      responseMode: '.iframe-rpc+json'
    }
  }
  
  
  
  function debug(req, res, next) {
    console.log('ISSUE TOKEN!');
    console.log(req.headers)
    console.log(req.query)
    console.log(req.user)
    
    req.user = { id: '5001x' }
    
    next();
  }
  
  function respond(req, res, next) {
    console.log('OH NO, WE GOT HERE....');
    console.log(req.oauth2)
    
    
    /*
    if (req.query.scope) { res.locals.scope = req.query.scope; }
    
    res.json(res.locals);
    */
  }
  
  
  return [
    authenticate([ 'session', 'anonymous' ]),
    debug,
    server.authorization(
      { parse: internals.parse },
      validateClient,
      processTransaction,
      completeTransaction
    ),
    respond
  ];
  
};

exports['@require'] = [
  'http://schemas.authnomicon.org/js/aaa/oauth2/Server',
  'oauth2/handlers/authorize/validateclient',
  'oauth2/handlers/authorize/processtransaction',
  'oauth2/handlers/authorize/completetransaction',
  'http://i.bixbyjs.org/http/middleware/authenticate'
];
