exports = module.exports = function(authenticate) {
  
  
  /*
  
   *
   * https://accounts.google.com/o/oauth2/iframerpc?action=listSessions&scope=profile%20email&client_id=4833673.apps.googleusercontent.com&ss_domain=http%3A%2F%2Fexamplerp.com&origin=http%3A%2F%2Fexamplerp.com
   *
   */
  
  /*
  {"id":"599-211931.20572639475","result":{"sessions":[{"session_state":{"extraQueryParams":{"authuser":"0"}}}],"first_issued_at":1492461376535,"expires_at":null,"scope":"profile email"},"rpcToken":"8462679"}
  {"id":"599-211931.20572639475","result":{"scope":"profile email","sessions":[]},"rpcToken":"8462679"}
  */
  
  function listSessions(req, res, next) {
    console.log('LIST SESSIONS!');
    console.log(req.headers)
    console.log(req.query)
    console.log(req.user)
    
    // TODO: Implement this properly
    
    res.locals.sessions = [];
    
    var users = [ req.user ];

    // XXX: remove this
    users = [ { id: '1' } ]
    
    var user
      , session
      , i = 0;
  
    (function iter(err) {
      if (err) { return next(err); }
      
      user = users[i++];
      if (!user) { return next(); }
      
      session = {};
      
      // FIXME: encode this on some per-domain/per-origin basis???
      session.login_hint = user.id;
      // TODO: check existing autorization for email, displayName, photoUrl
      
      res.locals.sessions.push(session);
      iter();
    })();
  }
  
  function respond(req, res, next) {
    res.json({ sessions: res.locals.sessions });
  }
  
  
  return [
    authenticate([ 'session', 'anonymous' ]),
    listSessions,
    respond
  ];
  
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/authenticate'
];
