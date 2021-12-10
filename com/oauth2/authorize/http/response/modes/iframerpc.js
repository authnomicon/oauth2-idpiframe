exports = module.exports = function() {
  return require('oauth2orize-iframerpcrm')(function(txn, cb) {
    console.log('EXTEND IT');
    
    var params = {};
    
    // TODO: generate login hint
    
    var selector = txn.res.authContext && txn.res.authContext.sessionSelector;
    if (selector) {
      params.session_state = {
        extraQueryParams: { ss: selector }
      };
    }
    
    return cb(null, params);
  });
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/ResponseMode';
exports['@mode'] = '.iframerpc';
