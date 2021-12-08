// WIP: action dispatching

exports = module.exports = function(authenticate) {
  
  
  function go(req, res, next) {
    console.log('ISSUE TOKEN')
    console.log(req.query);
    console.log(req.user);
  }
  
  
  return [
    authenticate([ 'session', 'anonymous' ], { multi: true }),
    go
  ];
};

exports['@action'] = 'issueToken';
exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/authenticate'
];
