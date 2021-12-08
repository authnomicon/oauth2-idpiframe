exports = module.exports = function(authenticate) {
  
  
  function go(req, res, next) {
    console.log('LIST SESSIONS')
    console.log(req.query);
    console.log(req.user);
    console.log(req.authInfo);
    
    res.json({ beep: 'boop' });
  }
  
  
  return [
    authenticate([ 'session', 'anonymous' ], { multi: true }),
    go
  ];
};

exports['@action'] = 'listSessions';
exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/authenticate'
];
