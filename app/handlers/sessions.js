exports = module.exports = function(server) {
  
  function listSessions(req, res, next) {
    console.log('LIST SESSIONS!');
    console.log(req.headers)
    
    // TODO: Implement this properly
    
    var sessions = [
      { login_hint: 'Some-login-Hint', 
        session_state: {
          extraQueryParams: {
            authuser: "0"
          }
        }
      }
    ];
    res.locals.sessions = sessions;
    next();
  }
  
  function respond(req, res, next) {
    res.json({ sessions: res.locals.sessions });
  }
  
  
  return [
    listSessions,
    respond
  ];
  
};

exports['@require'] = [];
