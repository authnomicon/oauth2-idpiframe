// Module dependencies.
var oauth2orize = require('oauth2orize');
var iframerpc = require('../../lib/iframerpc');

exports = module.exports = function(checkOrigin, issueToken, listSessions, sessionState) {
  var router = new iframerpc.Router();
  
  router.use(function validate(req, res, next) {
    var action = req.query.action;
    if (!action) {
      return next(new oauth2orize.TokenError('No action specified!', 'invalid_request'));
    }
    next();
  });
  
  router.action('checkOrigin', checkOrigin);
  router.action('issueToken', issueToken);
  router.action('listSessions', listSessions);
  router.action('sessionState', sessionState);
  
  router.use(function noAction(req, res, next) {
    return next(new oauth2orize.TokenError('Invalid action!', 'invalid_request'));
  });
  
  router.use(oauth2orize.errorHandler());
  
  return router;
};

exports['@require'] = [
  './actions/checkorigin',
  './actions/issuetoken',
  './actions/listsessions',
  './actions/sessionstate'
];
