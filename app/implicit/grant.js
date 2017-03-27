exports = module.exports = function(issue) {
  var oauth2orize = require('oauth2orize-permission');
  
  return oauth2orize.grant.permission({}, issue);
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/grant';
exports['@type'] = 'permission';
exports['@require'] = [
  './issue'
];
