exports = module.exports = function(loginHint, logger, C) {
  var oauth2orize = require('oauth2orize-permission');
  
  
  return Promise.resolve(null)
    .then(function() {
      var responders = {};
  
      return new Promise(function(resolve, reject) {
        var components = C.components('module:oauth2orize.Responder')
          , mode;
  
        (function iter(i) {
          var component = components[i];
          if (!component) {
            return resolve(responders);
          }
      
          mode = component.a['@mode'];
          if (mode == 'query') {
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
            .then(function(responder) {
              logger.info("Loaded response mode '" + mode +  "' for OAuth 2.0 implicit grant");
              responders[mode] = responder;
              iter(i + 1);
            }, function(err) {
              var msg = 'Failed to load response mode for OAuth 2.0 authorization code grant:\n';
              msg += err.stack;
              logger.warning(msg);
              iter(i + 1);
            })
        })(0);
      });
    })
    .then(function(responders) {
      return oauth2orize.grant.permission({
        modes: responders
      }, function(client, user, ares, areq, locals, cb) {
        loginHint.generate(user, client, function(err, hint) {
          if (err) { return cb(err); }
          return cb(null, hint);
        });
      });
    });
};

exports['@implements'] = 'module:oauth2orize.RequestProcessor';
exports['@type'] = 'permission';
exports['@require'] = [
  'module:@authnomicon/oauth2-idpiframe.LoginHintService',
  'http://i.bixbyjs.org/Logger',
  '!container'
];
