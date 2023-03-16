var oauth2orize = require('oauth2orize');

exports = module.exports = function(loginHint, clients, authenticator) {
  
  function validateClient(req, res, next) {
    var clientID = req.query.client_id;
    var origin = req.query.origin;
    
    if (!clientID) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'Missing required parameter: client_id' });
    }
    if (!origin) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'Missing required parameter: origin' });
    }
    
    clients.read(clientID, function(err, client) {
      if (err) { return next(err); }
      
      if (!client) {
        return next(new oauth2orize.TokenError('The OAuth client was not found.', 'invalid_client'));
      }
      if (!client.webOrigins || client.webOrigins.indexOf(origin) == -1) {
        return next(new oauth2orize.TokenError('Invalid client for this origin.', 'access_denied', null, 403));
      }
      
      res.locals.client = client;
      next();
    });
  }
  
  function list(req, res, next) {
    console.log('LIST SESSIONS')
    console.log(req.query);
    console.log(req.user);
    console.log(req.authInfo);
    
    // TODO: 404 with empty sessions if not authenticated?
    
    
    var users = req.user;
    if (!Array.isArray(users)) {
      users = [ users ];
    }
    var infos = req.authInfo;
    if (!Array.isArray(infos)) {
      infos = [ infos ];
    }
    
    
    var sessions = []
      , i = 0;
    (function iter(err) {
      if (err) { return next(err); }
      
      var user = users[i++];
      if (!user) {
        return res.json({
          sessions: sessions
        });
      }
      
      // NOTE: In Google's implementation, it appears that login_hint is being
      // generated based on ss_domain parameter.  Investigate this.
      
      // TODO: load client details here
      loginHint.generate(user.id, res.locals.client, function(err, hint) {
        if (err) { return iter(err); }
      
        var session = { login_hint: hint }
        if (infos[i - 1].sessionSelector) {
          session.session_state = {
            extraQueryParams: {
              authuser: infos[i - 1].sessionSelector
            }
          };
        }
      
        // TODO: Filter this list to only accounts the client has been granted access to
      
        sessions.push(session);
        iter();
      });
    })();
  }
  
  
  return [
    authenticator.authenticate([ 'session', 'anonymous' ], { multi: true }),
    validateClient,
    list
  ];
};

exports['@action'] = 'listSessions';
exports['@require'] = [
  'module:@authnomicon/oauth2-idpiframe.LoginHintService',
  'http://i.authnomicon.org/oauth2/ClientDirectory',
  'module:@authnomicon/session.Authenticator'
];
