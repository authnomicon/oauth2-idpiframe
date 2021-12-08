exports = module.exports = function() {
  
  
  function go(req, res, next) {
    console.log('LIST SESSIONS')
    console.log(req.query);
    console.log(req.user);
    
    res.json({ beep: 'boop' });
  }
  
  
  return [
    go
  ];
};

exports['@action'] = 'listSessions';
exports['@require'] = [
];
