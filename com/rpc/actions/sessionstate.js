exports = module.exports = function() {
  
  
  function check(req, res, next) {
    var hints = {};
    hints[req.query.login_hint] = { extraQueryParams: {
      authuser: '0' // TODO: use session selector
    } };
    
    
    return res.json({ activeHints: hints });
  }
  
  
  return [
    check
  ];
  
};

exports['@action'] = 'sessionState';
