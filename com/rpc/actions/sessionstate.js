exports = module.exports = function() {
  
          /* Responses seen
  400
  {
    "error" : "invalid_request",
    "error_description" : "Invalid login_hint value."
  }
  
  // without a cookie
  200
  {"activeHints":{}}
  
  // with a login_hint that isn't logged in
  200
  {"activeHints":{}}
  
  400
{
  "error" : "invalid_request",
  "error_description" : "Missing required parameter: login_hint"
}
  
400
{
  "error" : "invalid_request",
  "error_description" : "Missing required parameter: origin"
} 
  */
  
  // TODO: rejects with 200 ad empty activeHints if origin is wrong.  how is this working?
  // TODO: get responses with multi-sessions
  
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
