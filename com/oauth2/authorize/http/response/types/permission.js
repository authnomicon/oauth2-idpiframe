exports = module.exports = function(issue) {
  var oauth2orize = require('oauth2orize-permission');
  
  return oauth2orize.grant.permission({}, function(client, user, ares, areq, locals, cb) {
    return cb(null, 'A-LOGIN-HINT')
  });
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/ResponseType';
exports['@type'] = 'permission';
exports['@require'] = [
];
