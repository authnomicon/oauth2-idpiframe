exports = module.exports = function(authenticate) {
  
  
  function go(req, res, next) {
    console.log('GOT RPC REQUEST')
    console.log(req.query);
    console.log(req.user);
  }
  
  
  return [
    authenticate([ 'session', 'anonymous' ], { multi: true }),
    go
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/authenticate'
];
