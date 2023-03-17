var oauth2orize = require('oauth2orize');

exports = module.exports = function(loginHint, grants, clients, authenticator) {
  
  function validateClient(req, res, next) {
    var clientID = req.query.client_id;
    var origin = req.query.origin;
    
    if (!clientID) {
      return next(new oauth2orize.TokenError('Missing required parameter: client_id', 'invalid_request'));
    }
    if (!origin) {
      return next(new oauth2orize.TokenError('Missing required parameter: origin', 'invalid_request'));
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
      
      
      
      // https://openid.bitbucket.io/fapi/oauth-v2-grant-management.html
      grants.find(res.locals.client, user, function(err, grant) {
        if (err) { return iter(err); }
        
        var scope = grant.scopes.find(function(e) { return !e.resource; });
      
        
      
      // NOTE: In Google's implementation, it appears that login_hint is being
      // generated based on ss_domain parameter.  Investigate this.
      
      // TODO: load client details here
      loginHint.generate(user, res.locals.client, function(err, hint) {
        if (err) { return iter(err); }
      
        var session = { login_hint: hint }
        if (infos[i - 1].sessionSelector) {
          session.session_state = {
            extraQueryParams: {
              authuser: infos[i - 1].sessionSelector
            }
          };
        }
        
        
        if (scope.scope.indexOf('profile') != -1) {
          session.displayName = user.displayName;
        }
        
      
        // TODO: Filter this list to only accounts the client has been granted access to
      
        sessions.push(session);
        iter();
      });
      
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
  'module:@authnomicon/oauth2.GrantService',
  'http://i.authnomicon.org/oauth2/ClientDirectory',
  'module:@authnomicon/session.Authenticator'
];
