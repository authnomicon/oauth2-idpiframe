exports = module.exports = function(loginHint) {
  return require('oauth2orize-iframerpcrm')(function(txn, cb) {
    loginHint.generate(txn.user.id, txn.client, function(err, hint) {
      if (err) { return cb(err); }
      
      var params = {};
      params.login_hint = hint;
      
      var selector = txn.res.authContext && txn.res.authContext.sessionSelector;
      if (selector) {
        params.session_state = {
          extraQueryParams: { ss: selector }
        };
      }
    
      return cb(null, params);
    });
  });
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/ResponseMode';
exports['@mode'] = '.iframerpc';
exports['@require'] = [
  '../../../../../id/loginhint'
];
