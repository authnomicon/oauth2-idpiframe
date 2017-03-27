exports = module.exports = function(issueCb) {
  var oauth2orize = require('oauth2orize-permission');
  
  // TODO: Make modes pluggable
  return oauth2orize.grant.permission({
  }, issueCb);
};

exports['@implements'] = 'http://schema.modulate.io/js/aaa/oauth2/Response';
exports['@type'] = 'permission';
exports['@require'] = [ './permission/issuecb' ];
