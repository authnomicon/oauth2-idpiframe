var oauth2orize = require('oauth2orize');

// This is triggered by a call to monitorClient from within the IDP Iframe.
exports = module.exports = function(clients) {
  
  function check(req, res, next) {
    var clientID = req.query.client_id;
    var origin = req.query.origin;
    
    if (!origin) {
      return next(new oauth2orize.TokenError('Missing required parameter: origin', 'invalid_request'));
    }
    if (!clientID) {
      return next(new oauth2orize.TokenError('Missing required parameter: client_id', 'invalid_request'));
    }
    
    clients.read(clientID, function(err, client) {
      if (err) { return next(err); }
      if (!client) {
        return next(new oauth2orize.TokenError('The OAuth client was not found.', 'invalid_client'));
        //return res.status(403).json({ error: 'invalid_request' });
      }
      if (!client.webOrigins || client.webOrigins.indexOf(origin) == -1) {
        
        // NOTE: Google's response is as follows.  What is surpressed?
        // {"valid":false,"blocked":true,"suppressed":false}
        // or
        // {"valid":false,"blocked":false,"suppressed":false}
        // blocked seems to indicate the client doesn't have this feature
        
        return res.json({ valid: false, blocked: false });
        
        //return res.status(403).json({ error: 'invalid_request' });
      }
      
      // NOTE: Google responds with `blocked` and `supressed`, although it is unclear
      // what those parameters do.
      // {valid: true, blocked: false, suppressed: false}
      return res.json({ valid: true });
    });
  }
  
  
  return [
    check
  ];
};

exports['@action'] = 'checkOrigin';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/ClientDirectory'
];
