var oauth2orize = require('oauth2orize');


function primaryValue(values) {
  if (!values || values.length == 0) { return undefined; }
  
  var value = values.find(function(e) { return e.primary; });
  value = value || values[0];
  return value.value;
}


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
      var info = infos[i - 1];
      
      var session = {};
      
      if (info.sessionSelector) {
        session.session_state = {
          extraQueryParams: {
            authuser: info.sessionSelector
          }
        };
      }
      
      // https://openid.bitbucket.io/fapi/oauth-v2-grant-management.html
      grants.find(res.locals.client, user, function(err, grant) {
        if (err) { return iter(err); }
        if (!grant) {
          sessions.push(session);
          return iter();
        }
        
        var scope = grant.scopes.find(function(e) { return !e.resource; });
        
        // NOTE: In Google's implementation, it appears that login_hint is being
        // generated based on ss_domain parameter.  Investigate this.
        loginHint.generate(user, res.locals.client, function(err, hint) {
          if (err) { return iter(err); }
          
          session.login_hint = hint;
          
          // NOTE: Google does not seem to ever add `email`, `displayName` and `photoUrl`
          // claims, regardless of scope approved.
          var email, photo;
          if (scope.scope.indexOf('email') != -1) {
            email = primaryValue(user.emails);
            if (email) {
              session.email = email;
            }
          }
          if (scope.scope.indexOf('profile') != -1) {
            photo = primaryValue(user.photos);
            if (user.displayName) {
              session.displayName = user.displayName;
            }
            if (photo) {
              session.photoUrl = photo;
            }
          }
          
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
