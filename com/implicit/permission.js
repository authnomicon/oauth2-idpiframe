exports = module.exports = function(issue) {
  var oauth2orize = require('oauth2orize-permission');
  
  return oauth2orize.grant.permission({}, issue);
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/oauth2/responseType';
exports['@type'] = 'permission';
exports['@require'] = [
  './issue'
];
