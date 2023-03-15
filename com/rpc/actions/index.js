exports = module.exports = function(checkOrigin, issueToken, listSessions) {
  var actions = require('../../../../lib/actions');
  
  
  var router = new actions.Router();
  router.use('checkOrigin', checkOrigin);
  router.use('issueToken', issueToken);
  router.use('listSessions', listSessions);
  
  return router;
};

exports['@require'] = [
  './checkorigin',
  './issuetoken',
  './listsessions'
];
