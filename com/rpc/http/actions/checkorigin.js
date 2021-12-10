exports = module.exports = function(clients) {
  
  function check(req, res, next) {
    var clientID = req.query.client_id;
    var origin = req.query.origin;
    
    if (!clientID || !origin) {
      return res.status(403).json({ error: 'invalid_request' });
    }
    
    clients.read(clientID, function(err, client) {
      if (client.webOrigins.indexOf(origin) == -1) {
        return res.status(403).json({ error: 'invalid_request' });
      }
    
      return res.json({ valid: true });
    });
  }
  
  
  return [
    check
  ];
};

exports['@action'] = 'checkOrigin';
exports['@require'] = [
  'http://i.authnomicon.org/oauth2/ClientDirectory'
];
