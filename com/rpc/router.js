// Module dependencies.
var oauth2orize = require('oauth2orize');
var iframerpc = require('../../lib/iframerpc');

exports = module.exports = function(checkOrigin, issueToken, listSessions) {
  var router = new iframerpc.Router();
  router.action('checkOrigin', checkOrigin);
  router.action('issueToken', issueToken);
  router.action('listSessions', listSessions);
  router.use(function(req, res, next) {
    return next(new oauth2orize.TokenError('Invalid action!', 'invalid_request'));
  });
  
  return router;
};

exports['@require'] = [
  './actions/checkorigin',
  './actions/issuetoken',
  './actions/listsessions'
];
