exports = module.exports = function(authenticate) {
  
  
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
      , session, i;
    for (i = 0; i < users.length; ++i) {
      // TODO: Filter this list to only accounts the client has been granted access to
      
      session = { login_hint: 'TODO' }
      if (infos[i].sessionSelector) {
        session.session_state = {
          extraQueryParams: {
            ss: req.authInfo.sessionSelector
          }
        };
      }
      
      sessions.push(session);
    }
    
    res.json({
      sessions: sessions
    });
  }
  
  
  return [
    authenticate([ 'session', 'anonymous' ], { multi: true }),
    list
  ];
};

exports['@action'] = 'listSessions';
exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/authenticate'
];
