exports = module.exports = function(checkOrigin, issueToken) {
  var actions = require('../../../../lib/actions');
  
  
  var router = new actions.Router();
  router.use('checkOrigin', checkOrigin);
  router.use('issueToken', issueToken);
  
  return router;
};

exports['@require'] = [
  './checkorigin',
  './issuetoken'
];
