exports = module.exports = function(logger, C) {
  var oauth2orize = require('oauth2orize-permission');
  
  
  return Promise.resolve(null)
    .then(function() {
      var modes = {};
  
      return new Promise(function(resolve, reject) {
        var components = C.components('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode')
          , key;
  
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(modes);
          }
      
          key = component.a['@mode'];
          if (key == 'query') {
            // The default response mode of this response type is the fragment
            // encoding.  In accordance with security considerations, this
            // response type must not use query encoding, in order to avoid
            // leaking sensitive information such as access tokens.
            //
            // For more information, refer to:
            // https://openid.net/specs/oauth-v2-multiple-response-types-1_0.html#Security
            return iter(i + 1);
          }
      
          component.create()
            .then(function(mode) {
              logger.info("Loaded response mode '" + key +  "' for OAuth 2.0 implicit grant");
              modes[key] = mode;
              iter(i + 1);
            }, function(err) {
              var msg = 'Failed to load response mode for OAuth 2.0 authorization code grant:\n';
              msg += err.stack;
              logger.warning(msg);
              return iter(i + 1);
            })
        })(0);
      });
    })
    .then(function(modes) {
      return oauth2orize.grant.permission({
        modes: modes
      }, function(client, user, ares, areq, locals, cb) {
        return cb(null, 'A-LOGIN-HINT')
      });
    });
};

exports['@implements'] = 'http://i.authnomicon.org/oauth2/authorization/http/ResponseType';
exports['@type'] = 'permission';
exports['@require'] = [
  'http://i.bixbyjs.org/Logger',
  '!container'
];
