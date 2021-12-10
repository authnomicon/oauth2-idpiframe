exports = module.exports = function(loginHint, clients, authenticate) {
  
  function validateClient(req, res, next) {
    var clientID = req.query.client_id;
    var origin = req.query.origin;
    
    clients.read(clientID, function(err, client) {
      if (err) { return next(err); }
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
      
      // TODO: load client details here
      loginHint.generate(user.id, res.locals.client, function(err, hint) {
        if (err) { return iter(err); }
      
        var session = { login_hint: hint }
        if (infos[i - 1].sessionSelector) {
          session.session_state = {
            extraQueryParams: {
              ss: infos[i - 1].sessionSelector
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
    authenticate([ 'session', 'anonymous' ], { multi: true }),
    validateClient,
    list
  ];
};

exports['@action'] = 'listSessions';
exports['@require'] = [
  '../../../id/loginhint',
  'http://i.authnomicon.org/oauth2/ClientDirectory',
  'http://i.bixbyjs.org/http/middleware/authenticate'
];
