var oauth2orize = require('oauth2orize');

exports = module.exports = function(checkOrigin, issueToken, listSessions) {
  var actions = require('../../lib/actions');
  
  
  var router = new actions.Router();
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
